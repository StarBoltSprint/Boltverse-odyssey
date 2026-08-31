import { useEffect, useRef, useState, type PointerEvent } from "react";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

const STILL = pub("citadel/landrun-sight.jpg") + "?v=1";
const CLIP = pub("citadel/landrun-sight.mp4") + "?v=1";
const IN = 1.7;
const HOLD_NEED = 560;

const BEATS = [
  { at: 3.4, win: 1.35, kind: "tap" as const, dir: "l" as const },
  { at: 7.6, win: 1.35, kind: "tap" as const, dir: "r" as const },
  { at: 10.8, win: 2.8, kind: "hold" as const, dir: "c" as const },
];

type Phase = "hide" | "in" | "open" | "broke" | "crash";

type Props = {
  onLand: () => void;
  onBack: () => void;
};

export function SightRun({ onLand, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const beatRef = useRef(0);
  const hitRef = useRef(false);
  const holdRef = useRef(0);
  const crashedRef = useRef(false);
  const raf = useRef(0);
  const [live, setLive] = useState(false);
  const [beat, setBeat] = useState(0);
  const [phase, setPhase] = useState<Phase>("hide");
  const [dodge, setDodge] = useState<"" | "l" | "r">("");
  const [held, setHeld] = useState(false);
  const phaseRef = useRef(phase);
  const landRef = useRef(onLand);
  phaseRef.current = phase;
  landRef.current = onLand;
  const nowBeat = BEATS[beat] ?? BEATS[BEATS.length - 1];

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
    return () => {
      v.removeEventListener("canplay", playFilm);
      v.pause();
    };
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

  function pass() {
    hitRef.current = true;
    holdRef.current = 0;
    setHeld(false);
    setPhase("broke");
    const next = beatRef.current + 1;
    beatRef.current = next;
    setBeat(next);
    window.setTimeout(() => {
      if (beatRef.current >= BEATS.length) return;
      setPhase("hide");
    }, 280);
  }

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
      if (nowPhase !== "open" && nowPhase !== "broke") setPhase("open");
      if (b.kind === "hold" && holdRef.current && performance.now() - holdRef.current >= HOLD_NEED) pass();
      return;
    }
    if (t >= b.at - IN && (nowPhase === "hide" || nowPhase === "broke")) {
      hitRef.current = false;
      setPhase("in");
    }
    if (b.kind === "hold" && holdRef.current && performance.now() - holdRef.current >= HOLD_NEED) pass();
  }

  function crash() {
    if (crashedRef.current) return;
    crashedRef.current = true;
    hitRef.current = false;
    holdRef.current = 0;
    setHeld(false);
    setPhase("crash");
    setDodge("");
    videoRef.current?.pause();
    window.setTimeout(() => restart(), 1100);
  }

  function restart() {
    beatRef.current = 0;
    hitRef.current = false;
    holdRef.current = 0;
    crashedRef.current = false;
    setBeat(0);
    setDodge("");
    setHeld(false);
    setPhase("hide");
    playSong(SONG.landrun);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  }

  function down(ev: PointerEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    try {
      (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    } catch {
      /* ok */
    }
    const now = performance.now();
    const v = videoRef.current;
    const b = BEATS[beatRef.current];
    const inHold = b?.kind === "hold" && (phase === "in" || phase === "open");
    const early = phase === "in" && v && b && v.currentTime >= b.at - 0.6;
    if (now - lastTap.current < 380 && phase !== "open" && !early && !inHold) goFull();
    lastTap.current = now;
    playSong(SONG.landrun);
    if (crashedRef.current || !b) return;
    if (phase !== "open" && !early && !inHold) return;
    if (b.kind === "hold") {
      if (!holdRef.current) holdRef.current = now;
      setHeld(true);
      return;
    }
    const away = b.dir === "l" ? "r" : "l";
    setDodge(away);
    window.setTimeout(() => setDodge(""), 500);
    pass();
  }

  function up() {
    /* Samsung fires pointerup while the finger is still down. Lock keeps filling. */
  }

  const prompt = !nowBeat ? "" : nowBeat.kind === "hold" ? "HOLD" : "TAP";

  return (
    <section className="citadel land-run" data-wired="true" data-phase={phase} data-hold={held ? "true" : undefined} aria-label="Howl Sight descent">
      <div className="citadel-stage land-stage">
        <div className={`land-bolt-wrap${dodge ? ` is-${dodge}` : ""}`}>
          <img className="citadel-art" src={STILL} alt="" draggable={false} />
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
            hidden={!live}
            onPlaying={() => setLive(true)}
            onEnded={() => {
              if (!crashedRef.current && beatRef.current >= BEATS.length) onLand();
            }}
          />
        </div>
        <div
          className="citadel-shield"
          onPointerDown={down}
          onPointerUp={up}
          onPointerCancel={up}
        />
        {nowBeat?.kind === "hold" && (phase === "in" || phase === "open") ? <i className="land-lock" aria-hidden="true" /> : null}

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

        {(phase === "in" || phase === "open") && <span className="land-tap">{prompt}</span>}

        {phase === "crash" && (
          <div className="land-crash" aria-hidden="true">
            <p>{nowBeat?.kind === "hold" ? "BROKE" : "CRASH"}</p>
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
