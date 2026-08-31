import { useEffect, useRef, useState, type PointerEvent } from "react";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

const STILL = pub("citadel/landrun-veil.jpg") + "?v=4";
const CLIP = pub("citadel/landrun-veil.mp4") + "?v=4";

const IN = 1.6;
const BEATS = [
  { at: 4.1, win: 1.2, dir: "l" as const },
  { at: 8.3, win: 1.2, dir: "r" as const },
  { at: 12.2, win: 1.25, dir: "c" as const },
];

type Phase = "hide" | "in" | "open" | "broke" | "crash";
type Dir = "l" | "r" | "c";

type Props = {
  onLand: () => void;
  onBack: () => void;
};

export function LandRun({ onLand, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const beatRef = useRef(0);
  const hitRef = useRef(false);
  const crashedRef = useRef(false);
  const raf = useRef(0);
  const [live, setLive] = useState(false);
  const [beat, setBeat] = useState(0);
  const [phase, setPhase] = useState<Phase>("hide");
  const [dir, setDir] = useState<Dir>("l");
  const [dodge, setDodge] = useState<"" | "l" | "r">("");
  const phaseRef = useRef(phase);
  const landRef = useRef(onLand);
  phaseRef.current = phase;
  landRef.current = onLand;

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    playSong(SONG.landrun);
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
    return () => v.removeEventListener("canplay", playFilm);
  }, []);

  useEffect(() => {
    const tick = () => {
      const v = videoRef.current;
      if (v && !crashedRef.current) step(v.currentTime, v.ended || v.currentTime >= 14.7);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  function step(t: number, ended: boolean) {
    const i = beatRef.current;
    const nowPhase = phaseRef.current;
    if (i >= BEATS.length) {
      if (ended) landRef.current();
      return;
    }
    const b = BEATS[i];
    if (t >= b.at + b.win && !hitRef.current) {
      crash();
      return;
    }
    if (t >= b.at) {
      if (nowPhase !== "open" && nowPhase !== "broke") {
        setDir(b.dir);
        setPhase("open");
      }
      return;
    }
    if (t >= b.at - IN) {
      if (nowPhase === "hide" || nowPhase === "broke") {
        hitRef.current = false;
        setDir(b.dir);
        setPhase("in");
      }
    }
  }

  function crash() {
    if (crashedRef.current) return;
    crashedRef.current = true;
    hitRef.current = false;
    setPhase("crash");
    setDodge("");
    videoRef.current?.pause();
    window.setTimeout(() => restart(), 1100);
  }

  function restart() {
    beatRef.current = 0;
    hitRef.current = false;
    crashedRef.current = false;
    setBeat(0);
    setDir("l");
    setDodge("");
    setPhase("hide");
    playSong(SONG.landrun);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  }

  function dodgeTap(ev: PointerEvent) {
    ev.stopPropagation();
    const now = performance.now();
    const v = videoRef.current;
    const b = BEATS[beatRef.current];
    const early = phase === "in" && v && b && v.currentTime >= b.at - 0.45;
    if (now - lastTap.current < 380 && phase !== "open" && !early) goFull();
    lastTap.current = now;
    playSong(SONG.landrun);
    if (crashedRef.current) return;
    if (phase !== "open" && !early) return;
    hitRef.current = true;
    const away = dir === "l" ? "r" : "l";
    setDodge(away);
    setPhase("broke");
    const next = beatRef.current + 1;
    beatRef.current = next;
    setBeat(next);
    window.setTimeout(() => setDodge(""), 520);
    window.setTimeout(() => {
      if (beatRef.current >= BEATS.length) return;
      setPhase("hide");
    }, 320);
  }

  return (
    <section className="citadel land-run" data-wired="true" data-phase={phase} aria-label="Shatter Veil descent">
      <div className="citadel-stage land-stage">
        <div className={`land-bolt-wrap${dodge ? ` is-${dodge}` : ""}`}>
          <img className="citadel-art" src={STILL} alt="" draggable={false} hidden={live} />
          <video
            ref={videoRef}
            className="citadel-art citadel-live"
            src={CLIP}
            autoPlay
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            onPlaying={() => setLive(true)}
            onEnded={() => {
              if (!crashedRef.current && beatRef.current >= BEATS.length) onLand();
            }}
          />
        </div>
        <div className="citadel-shield" onPointerDown={dodgeTap} />

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
            <p>CRASH</p>
            <em>howl again</em>
          </div>
        )}

        <p className="land-mark">
          {beat}/{BEATS.length}
        </p>
      </div>
    </section>
  );
}
