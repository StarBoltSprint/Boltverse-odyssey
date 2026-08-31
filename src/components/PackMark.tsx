import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { authClient, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

const STILL = pub("citadel/pack.jpg") + "?v=1";
const CLIP = pub("citadel/pack.mp4") + "?v=1";
const X_HREF = "/auth/popup?providerId=grok-x";

export function PackGate({ onClose }: { onClose: () => void }) {
  const { user } = useCurrentUserState();
  const [live, setLive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const connected = !!user && !user.isDevFallback;
  const name = ((user?.displayName || user?.primaryEmail || "Walker") as string).trim() || "Walker";

  useEffect(() => {
    const arm = window.setTimeout(() => setArmed(true), 450);
    playSong(SONG.pack);
    const v = videoRef.current;
    if (!v) return () => window.clearTimeout(arm);
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("webkit-playsinline", "true");
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
  }, []);

  useEffect(() => {
    function onMsg(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { source?: string; token?: string | null };
      if (data?.source !== "grok-auth-popup" || !data.token) return;
      try {
        window.localStorage.setItem("grok-auth.bearer-token", data.token);
      } catch {
        /* ignore */
      }
      void authClient.getSession();
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  function doubleFull() {
    playSong(SONG.pack);
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  function stop(ev: PointerEvent | MouseEvent) {
    ev.stopPropagation();
  }

  function goHub(ev: PointerEvent | MouseEvent) {
    ev.stopPropagation();
    playSong(SONG.hub);
    onClose();
  }

  function leave(ev: PointerEvent | MouseEvent) {
    stop(ev);
    if (busy) return;
    setBusy(true);
    void signOut().catch(() => setBusy(false));
  }

  return (
    <section className="citadel pack-gate" data-wired="true" data-armed={armed ? "true" : undefined} aria-label="Join the Pack">
      <div className="citadel-stage">
        <img className="citadel-art" src={STILL} alt="" hidden={live} draggable={false} />
        <video
          ref={videoRef}
          className="citadel-art citadel-live"
          src={CLIP}
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

        <button
          type="button"
          className="pack-back"
          aria-label="Citadel"
          onPointerDown={goHub}
          onClick={goHub}
        >
          Citadel
        </button>

        <div className="pack-copy">
          <p>Boltverse</p>
          <h1>The Pack</h1>
          <span>{connected ? `${name} · marked` : "Howl in on X"}</span>
        </div>

        {connected ? (
          <button type="button" className="pack-x" disabled={busy} onPointerDown={leave}>
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
      </div>
    </section>
  );
}

export function PackSheet({ onClose }: { onClose: () => void }) {
  return <PackGate onClose={onClose} />;
}
