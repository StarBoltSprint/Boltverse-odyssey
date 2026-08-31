import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";
import { relicHost, relicName, type SeedRelic } from "@/game/seeds";
import { pullRelics, readRelicCache } from "@/lib/relics-browser";

type Path = {
  id: "walker" | "howlwright";
  name: string;
  line: string;
  action: string;
  still: string;
  clip: string;
  song: string;
};

const PATHS: Path[] = [
  {
    id: "walker",
    name: "Walker Den",
    line: "Where your howl sleeps",
    action: "Rest",
    still: pub("citadel/den-walker.jpg") + "?v=1",
    clip: pub("citadel/den-walker.mp4") + "?v=1",
    song: SONG.denWalker,
  },
  {
    id: "howlwright",
    name: "Howlwright Den",
    line: "Where makers keep the fire",
    action: "Make",
    still: pub("citadel/den-maker.jpg") + "?v=1",
    clip: pub("citadel/den-maker.mp4") + "?v=1",
    song: SONG.denMaker,
  },
];

const KILN_STILL = pub("citadel/kiln-new.jpg") + "?v=1";
const KILN_CLIP = pub("citadel/kiln-new.mp4") + "?v=1";
const LEDGER_STILL = pub("citadel/ledger.jpg") + "?v=3";
const LEDGER_CLIP = pub("citadel/ledger.mp4") + "?v=3";

function when(raw?: string | null) {
  if (!raw) return "—";
  const t = Date.parse(raw);
  if (!Number.isFinite(t)) return "—";
  return new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type Props = {
  onBack: () => void;
  onPick: (id: Path["id"]) => void;
  onBind: () => void;
  startVault?: boolean;
  focusId?: string | null;
};

export function DenGate({ onBack, onPick, onBind, startVault, focusId }: Props) {
  const [i, setI] = useState(startVault ? 1 : 0);
  const [live, setLive] = useState(false);
  const [armed, setArmed] = useState(false);
  const [vault, setVault] = useState(!!startVault);
  const [ledger, setLedger] = useState(false);
  const [kilnLive, setKilnLive] = useState(false);
  const [clock, setClock] = useState("00:00:00");
  const [seeds, setSeeds] = useState<SeedRelic[]>(readRelicCache);
  const [pickI, setPickI] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const kilnRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const path = PATHS[i];
  const cards = seeds.map((r) => ({
    id: r.id,
    name: relicName(r.href),
    line: relicHost(r.href),
    href: r.href,
    plays: r.plays ?? 0,
    createdAt: r.created_at,
    lastLand: r.last_land ?? null,
  }));
  const pick = cards[pickI] ?? null;

  useEffect(() => {
    void pullRelics().then(setSeeds);
  }, []);

  useEffect(() => {
    if (startVault) {
      setI(1);
      setVault(true);
      if (focusId) {
        const n = cards.findIndex((c) => c.id === focusId);
        if (n >= 0) setPickI(n);
      }
    }
  }, [startVault, focusId, seeds]);

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    setArmed(false);
    setLive(false);
    playSong(path.song);
    const arm = window.setTimeout(() => setArmed(true), 450);
    const v = videoRef.current;
    if (!v) return () => window.clearTimeout(arm);
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
      window.clearTimeout(arm);
      v.removeEventListener("canplay", playFilm);
    };
  }, [path]);

  useEffect(() => {
    const den = videoRef.current;
    if (vault && pick) den?.pause();
    else void den?.play().catch(() => {});
    const kiln = kilnRef.current;
    if (ledger) kiln?.pause();
    else if (vault && pick) void kiln?.play().catch(() => {});
  }, [vault, pick, ledger]);

  useEffect(() => {
    setKilnLive(false);
    const v = kilnRef.current;
    if (!vault || !pick || !v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const playFilm = () => {
      v.muted = true;
      void v.play().then(() => setKilnLive(true)).catch(() => {});
    };
    playFilm();
    v.addEventListener("canplay", playFilm);
    return () => v.removeEventListener("canplay", playFilm);
  }, [vault, pick?.id]);

  useEffect(() => {
    if (!ledger) return;
    const tick = () => {
      const d = new Date();
      setClock(
        [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((n) => String(n).padStart(2, "0"))
          .join(":"),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [ledger]);

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!armed) return;
      playSong(path.song);
      fn();
    };
  }

  function doubleFull() {
    playSong(path.song);
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  function make() {
    if (path.id === "howlwright") {
      setVault(true);
      return;
    }
    onPick(path.id);
  }

  function stepVault(dir: -1 | 1) {
    if (!cards.length) return;
    setLedger(false);
    setPickI((n) => (n + dir + cards.length) % cards.length);
  }

  return (
    <section className="walk kiln" data-wired="true" data-armed={armed ? "true" : undefined} aria-label="Choose a den">
      <div className="walk-stage">
        <img className="walk-art" src={path.still} alt="" hidden={live} />
        <video
          ref={videoRef}
          key={path.id}
          className="walk-art walk-live"
          src={path.clip}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          onPlaying={() => setLive(true)}
        />
        <div className="citadel-shield" onPointerDown={doubleFull} />

        {!vault ? (
          <>
            <button type="button" className="walk-back" onPointerDown={tap(() => { playSong(SONG.den); onBack(); })}>
              <i className="walk-gem" aria-hidden="true" />
              Citadel
            </button>
            <button type="button" className="walk-arrow walk-arrow-l" onPointerDown={tap(() => setI((n) => (n + PATHS.length - 1) % PATHS.length))} aria-label="Previous">
              <ChevronLeft strokeWidth={2.8} />
            </button>
            <button type="button" className="walk-arrow walk-arrow-r" onPointerDown={tap(() => setI((n) => (n + 1) % PATHS.length))} aria-label="Next">
              <ChevronRight strokeWidth={2.8} />
            </button>
            <footer className="walk-foot">
              <p className="walk-mark">
                <strong>{path.name}</strong>
                <span>{path.line}</span>
              </p>
              <button type="button" className="walk-enter" onPointerDown={tap(make)}>
                <span>{path.action}</span>
              </button>
            </footer>
          </>
        ) : (
          <>
            <button type="button" className="pack-back" onPointerDown={tap(() => { setLedger(false); setVault(false); })}>
              Den
            </button>
            <header className="relic-head">
              <p>Howlwright</p>
              <h1>{pick?.name ?? "No fire yet"}</h1>
            </header>
            <button
              type="button"
              className="relic-frame"
              aria-label={pick?.name ?? "vault"}
              onPointerDown={tap(() => { if (pick) setLedger(true); })}
            >
              <img src={KILN_STILL} alt="" hidden={kilnLive} />
              {pick ? (
                <video
                  ref={kilnRef}
                  src={KILN_CLIP}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls={false}
                  disablePictureInPicture
                  onPlaying={() => setKilnLive(true)}
                />
              ) : null}
            </button>
            {cards.length > 1 ? (
              <>
                <button type="button" className="walk-arrow walk-arrow-l" aria-label="Previous" onPointerDown={tap(() => stepVault(-1))}>
                  <ChevronLeft strokeWidth={2.6} />
                </button>
                <button type="button" className="walk-arrow walk-arrow-r" aria-label="Next" onPointerDown={tap(() => stepVault(1))}>
                  <ChevronRight strokeWidth={2.6} />
                </button>
              </>
            ) : null}
            <button type="button" className="pack-x" onPointerDown={tap(() => (pick ? setLedger(true) : onBind()))}>
              {pick ? "Ledger" : "Bind"}
            </button>
            {ledger && pick ? (
              <aside className="relic-ledger" role="dialog" aria-label={`${pick.name} ledger`}>
                <img className="relic-ledger-art" src={LEDGER_STILL} alt="" />
                <video
                  className="relic-ledger-art"
                  src={LEDGER_CLIP}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls={false}
                  disablePictureInPicture
                />
                <div className="relic-screen">
                  <header>
                    <p>Howlwright OS // ledger</p>
                    <span>{clock}</span>
                    <em>live</em>
                  </header>
                  <h2>{pick.name}</h2>
                  <ol>
                    <li><i>Lands</i><b>{String(pick.plays ?? 0).padStart(2, "0")}</b></li>
                    <li><i>Bound</i><b>{when(pick.createdAt)}</b></li>
                    <li><i>Last land</i><b>{pick.lastLand ? when(pick.lastLand) : "never"}</b></li>
                    <li><i>Seed</i><b>{pick.line}</b></li>
                  </ol>
                  <div className="relic-wave" aria-hidden="true">
                    {Array.from({ length: 18 }, (_, n) => <i key={n} />)}
                  </div>
                  <footer>
                    <span>Kiln 1847°</span>
                    <span>Pack 98%</span>
                    <span>Seed lock</span>
                  </footer>
                </div>
                <button type="button" className="relic-ledger-x" onPointerDown={tap(() => setLedger(false))}>
                  Close
                </button>
              </aside>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
