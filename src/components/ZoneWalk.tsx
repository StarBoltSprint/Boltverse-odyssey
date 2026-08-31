import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { signIn, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { connectBot, disconnectBot, fetchBotSession } from "@/game/bot-session";
import { DOOR_BOT } from "@/game/door-local";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";
import { armAfterLift, freezeTaps, tapsFrozen } from "@/lib/tap-lock";

type Zone = {
  id: string;
  name: string;
  line: string;
  still: string;
  clip?: string;
  song: string;
  open: boolean;
  action: string;
};

const ZONES: Zone[] = [
  {
    id: "hall",
    name: "Thunderwolf Hall",
    line: "Heart of the Citadel · the nave",
    still: pub("citadel/hall.jpg") + "?v=6",
    clip: pub("citadel/hall.mp4") + "?v=6",
    song: SONG.hall,
    open: true,
    action: "Enter",
  },
  {
    id: "den",
    name: "Your Den",
    line: "Where the walker rests · first howl",
    still: pub("citadel/den.jpg") + "?v=1",
    clip: pub("citadel/den.mp4") + "?v=1",
    song: SONG.den,
    open: true,
    action: "Enter",
  },
  {
    id: "forge",
    name: "Bolt Forge",
    line: "Kiln of the pack · crystal fire",
    still: pub("citadel/forge.jpg") + "?v=1",
    clip: pub("citadel/forge.mp4") + "?v=1",
    song: SONG.forge,
    open: true,
    action: "Forge",
  },
  {
    id: "howl",
    name: "The Pack",
    line: "Howl in on X",
    still: pub("citadel/pack.jpg") + "?v=1",
    clip: pub("citadel/pack.mp4") + "?v=1",
    song: SONG.pack,
    open: true,
    action: "Connect with X",
  },
  {
    id: "door",
    name: "Citadel Door",
    line: "Knock your Grok Bot into the fire",
    still: pub("citadel/howl.jpg") + "?v=1",
    clip: pub("citadel/howl.mp4") + "?v=1",
    song: SONG.howl,
    open: true,
    action: "Knock",
  },
  {
    id: "stars",
    name: "The Star Veil",
    line: "Constellation of the pack",
    still: pub("citadel/stars.jpg") + "?v=1",
    clip: pub("citadel/stars.mp4") + "?v=1",
    song: SONG.stars,
    open: true,
    action: "Gaze",
  },
];

const X_HREF = "/auth/popup?providerId=grok-x";

type Props = {
  onBack: () => void;
  onEnter: (id: string) => void;
};

export function ZoneWalk({ onBack, onEnter }: Props) {
  const { user, isPending } = useCurrentUserState();
  const connected = !!user && !user.isDevFallback;
  const walker = ((user?.displayName || user?.primaryEmail || "Walker") as string).trim() || "Walker";
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [doorOn, setDoorOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const zone = ZONES[i];
  const painted = zone.id === "hall";

  useEffect(() => {
    void fetchBotSession().then((p) => setDoorOn(!!p.session)).catch(() => {});
  }, []);

  useEffect(() => {
    setArmed(false);
    setLive(false);
    playSong(zone.song);
    const release = armAfterLift(() => setArmed(true));
    const v = videoRef.current;
    if (!v || !zone.clip) return release;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const playFilm = () => {
      v.muted = true;
      void v.play().then(() => setLive(true)).catch(() => {});
    };
    playFilm();
    v.addEventListener("canplay", playFilm);
    return () => {
      release();
      v.removeEventListener("canplay", playFilm);
    };
  }, [zone]);

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!armed || tapsFrozen()) return;
      playSong(zone.song);
      fn();
    };
  }

  function doubleFull() {
    playSong(zone.song);
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  function step(dir: -1 | 1) {
    setI((n) => (n + dir + ZONES.length) % ZONES.length);
  }

  function enter() {
    if (!zone.open || tapsFrozen()) return;
    freezeTaps(1800);
    if (zone.id === "howl") {
      if (busy || isPending) return;
      if (connected) {
        setBusy(true);
        void signOut().catch(() => setBusy(false));
        return;
      }
      void signIn("grok-x", { callbackURL: "/" });
      return;
    }
    if (zone.id === "door") {
      if (busy) return;
      setBusy(true);
      const run = doorOn
        ? disconnectBot().then(() => setDoorOn(false))
        : connectBot({ bot_id: DOOR_BOT.id, bot_name: DOOR_BOT.name }).then((next) => {
            if (next.oauth_url) {
              window.location.assign(next.oauth_url);
              return;
            }
            if (next.session) setDoorOn(true);
          });
      void run.catch(() => {}).finally(() => setBusy(false));
      return;
    }
    onEnter(zone.id);
  }

  return (
    <section
      className="walk"
      data-armed={armed ? "true" : undefined}
      data-wired={painted ? "true" : undefined}
      aria-label="Zone walk"
    >
      <div className="walk-stage">
        <img className="walk-art" src={zone.still} alt="" hidden={live} />
        {zone.clip && (
          <video
            ref={videoRef}
            key={zone.id}
            className="walk-art walk-live"
            src={zone.clip}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            onPlaying={() => setLive(true)}
          />
        )}
        <div className="citadel-shield" onPointerDown={doubleFull} />

        {painted ? (
          <>
            <button type="button" className="walk-hit walk-hit-citadel" aria-label="Citadel" onPointerDown={tap(() => { playSong(SONG.hub); onBack(); })} />
            <button type="button" className="walk-hit walk-hit-left" aria-label="Previous zone" onPointerDown={tap(() => step(-1))} />
            <button type="button" className="walk-hit walk-hit-right" aria-label="Next zone" onPointerDown={tap(() => step(1))} />
            <button type="button" className="walk-hit walk-hit-enter" aria-label="Enter" onPointerDown={tap(enter)} />
          </>
        ) : (
          <>
            <button type="button" className="walk-back" onPointerDown={tap(() => { playSong(SONG.hub); onBack(); })} aria-label="Citadel">
              <i className="walk-gem" aria-hidden="true" />
              Citadel
            </button>
            <button type="button" className="walk-arrow walk-arrow-l" onPointerDown={tap(() => step(-1))} aria-label="Previous zone">
              <ChevronLeft strokeWidth={2.8} />
            </button>
            <button type="button" className="walk-arrow walk-arrow-r" onPointerDown={tap(() => step(1))} aria-label="Next zone">
              <ChevronRight strokeWidth={2.8} />
            </button>
            {zone.id === "howl" ? (
              <>
                <div className="pack-copy">
                  <p>Boltverse</p>
                  <h1>The Pack</h1>
                  <span>{connected ? `${walker} · marked` : "Howl in on X"}</span>
                </div>
                {connected ? (
                  <button type="button" className="pack-x" disabled={busy} onPointerDown={tap(enter)}>
                    {busy ? "Leaving…" : "Sign out"}
                  </button>
                ) : (
                  <a
                    className="pack-x"
                    href={X_HREF}
                    target="_blank"
                    rel="opener"
                    onPointerDown={(ev) => {
                      ev.stopPropagation();
                      playSong(SONG.pack);
                    }}
                  >
                    Connect with X
                  </a>
                )}
              </>
            ) : (
              <footer className="walk-foot">
                <p className="walk-mark">
                  <strong>{zone.name}</strong>
                  <span>{zone.line}</span>
                </p>
                <button type="button" className="walk-enter" disabled={!zone.open || busy} onPointerDown={tap(enter)}>
                  <span>{zone.id === "door" ? (busy ? "…" : doorOn ? "Unknock" : "Knock") : zone.action}</span>
                </button>
              </footer>
            )}
          </>
        )}
      </div>
    </section>
  );
}
