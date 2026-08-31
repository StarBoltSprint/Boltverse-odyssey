import { useEffect, useRef, useState, type PointerEvent } from "react";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

const SKIN = {
  veil: {
    still: pub("citadel/launch-veil.jpg") + "?v=2",
    clip: pub("citadel/launch-veil.mp4") + "?v=2",
    next: pub("citadel/landrun-veil.mp4") + "?v=4",
    song: SONG.launch,
    at: 8.7,
    win: 1.55,
  },
  sight: {
    still: pub("citadel/launch-sight.jpg") + "?v=1",
    clip: pub("citadel/launch-sight.mp4") + "?v=1",
    next: pub("citadel/landrun-sight.mp4") + "?v=1",
    song: SONG.launch,
    at: 8.2,
    win: 1.7,
  },
} as const;

const IN = 1.7;

type Phase = "hide" | "in" | "open" | "broke" | "crash";

type Props = {
  kind?: keyof typeof SKIN;
  onLand: () => void;
  onBack: () => void;
};

export function LaunchRun({ kind = "veil", onLand, onBack }: Props) {
  const film = SKIN[kind];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const hitRef = useRef(false);
  const crashedRef = useRef(false);
  const raf = useRef(0);
  const [live, setLive] = useState(false);
  const [phase, setPhase] = useState<Phase>("hide");
  const [leap, setLeap] = useState(false);
  const phaseRef = useRef(phase);
  const landRef = useRef(onLand);
  phaseRef.current = phase;
  landRef.current = onLand;

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    playSong(film.song);
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = false;
    v.playsInline = true;
    const playFilm = () => {
      v.muted = true;
      void v.play().then(() => setLive(true)).catch(() => {});
    };
    playFilm();
    v.addEventListener("canplay", playFilm);
    return () => {
      v.removeEventListener("canplay", playFilm);
      v.pause();
    };
  }, [film.clip]);

  useEffect(() => {
    const tick = () => {
      const v = videoRef.current;
      if (v && !crashedRef.current) step(v.currentTime, v.ended || v.currentTime >= 14.7);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [film.at]);

  function step(t: number, ended: boolean) {
    const nowPhase = phaseRef.current;
    if (hitRef.current) {
      if (ended) landRef.current();
      return;
    }
    if (t >= film.at + film.win) {
      crash();
      return;
    }
    if (t >= film.at) {
      if (nowPhase !== "open") setPhase("open");
      return;
    }
    if (t >= film.at - IN && (nowPhase === "hide" || nowPhase === "broke")) setPhase("in");
  }

  function crash() {
    if (crashedRef.current) return;
    crashedRef.current = true;
    hitRef.current = false;
    setLeap(false);
    setPhase("crash");
    videoRef.current?.pause();
    window.setTimeout(() => restart(), 1100);
  }

  function restart() {
    hitRef.current = false;
    crashedRef.current = false;
    setLeap(false);
    setPhase("hide");
    playSong(film.song);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  }

  function tap(ev: PointerEvent) {
    ev.stopPropagation();
    const now = performance.now();
    const v = videoRef.current;
    const early = phase === "in" && v && v.currentTime >= film.at - 0.4;
    if (now - lastTap.current < 380 && phase !== "open" && !early) goFull();
    lastTap.current = now;
    playSong(film.song);
    if (crashedRef.current) return;
    if (phase !== "open" && !early) return;
    hitRef.current = true;
    setLeap(true);
    setPhase("broke");
    window.setTimeout(() => setLeap(false), 560);
  }

  return (
    <section className="citadel land-run" data-wired="true" data-phase={phase} aria-label="Leave the Citadel">
      <div className="citadel-stage land-stage">
        <div className={`land-bolt-wrap${leap ? " is-leap" : ""}`}>
          <img className="citadel-art" src={film.still} alt="" draggable={false} />
          <video
            ref={videoRef}
            className="citadel-art citadel-live"
            src={film.clip}
            autoPlay
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            hidden={!live}
            onPlaying={() => setLive(true)}
            onEnded={() => {
              if (!crashedRef.current && hitRef.current) onLand();
            }}
          />
        </div>
        <div className="citadel-shield" onPointerDown={tap} />

        <button
          type="button"
          className="walk-back"
          onPointerDown={(ev) => {
            ev.stopPropagation();
            playSong(SONG.starmap);
            onBack();
          }}
        >
          <i className="walk-gem" aria-hidden="true" />
          Citadel
        </button>

        {(phase === "in" || phase === "open") && <span className="land-tap">TAP</span>}

        {phase === "crash" && (
          <div className="land-crash" aria-hidden="true">
            <p>FELL</p>
            <em>howl again</em>
          </div>
        )}
      </div>
    </section>
  );
}
