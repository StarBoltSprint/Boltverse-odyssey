import { useEffect, useRef, useState, type PointerEvent } from "react";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

const STILL = pub("citadel/landrun-sight-dive.jpg") + "?v=1";
const CLIP = pub("citadel/landrun-sight-dive.mp4") + "?v=1";
const IN = 1.15;
const HOLD_NEED = 520;

const BEATS = [
  { at: 1.6, win: 1.05, kind: "tap" as const, dir: "l" as const, need: 1, label: "TAP" },
  { at: 3.0, win: 1.05, kind: "tap" as const, dir: "r" as const, need: 1, label: "TAP" },
  { at: 4.4, win: 1.05, kind: "tap" as const, dir: "l" as const, need: 1, label: "TAP" },
  { at: 5.8, win: 1.55, kind: "mash" as const, dir: "c" as const, need: 4, label: "MASH" },
  { at: 7.7, win: 1.05, kind: "tap" as const, dir: "r" as const, need: 1, label: "TAP" },
  { at: 9.1, win: 2.3, kind: "hold" as const, dir: "c" as const, need: 1, label: "HOLD" },
  { at: 11.9, win: 1.5, kind: "tap" as const, dir: "c" as const, need: 1, label: "FIRE" },
];

type Phase = "hide" | "in" | "open" | "broke" | "crash";

type Props = {
  onLand: () => void;
  onBack: () => void;
};

export function SightDive({ onLand, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const beatRef = useRef(0);
  const hitsRef = useRef(0);
  const holdRef = useRef(0);
  const crashedRef = useRef(false);
  const raf = useRef(0);
  const [live, setLive] = useState(false);
  const [beat, setBeat] = useState(0);
  const [hits, setHits] = useState(0);
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
    holdRef.current = 0;
    hitsRef.current = 0;
    setHeld(false);
    setHits(0);
    setPhase("broke");
    const next = beatRef.current + 1;
    beatRef.current = next;
    setBeat(next);
    window.setTimeout(() => {
      if (beatRef.current >= BEATS.length) return;
      setPhase("hide");
    }, 180);
  }

  function step(t: number, ended: boolean) {
    const i = beatRef.current;
    const nowPhase = phaseRef.current;
    if (i >= BEATS.length) {
      if (ended) landRef.current();
      return;
    }
    const b = BEATS[i];
    if (t >= b.at + b.win && hitsRef.current < b.need && !holdDone(b)) {
      crash();
      return;
    }
    if (b.kind === "hold" && holdRef.current && performance.now() - holdRef.current >= HOLD_NEED) {
      pass();
      return;
    }
    if (t >= b.at) {
      if (nowPhase !== "open" && nowPhase !== "broke") setPhase("open");
      return;
    }
    if (t >= b.at - IN && (nowPhase === "hide" || nowPhase === "broke")) {
      hitsRef.current = 0;
      setHits(0);
      setPhase("in");
    }
  }

  function holdDone(b: (typeof BEATS)[number]) {
    return b.kind === "hold" && holdRef.current > 0 && performance.now() - holdRef.current >= HOLD_NEED;
  }

  function crash() {
    if (crashedRef.current) return;
    crashedRef.current = true;
    holdRef.current = 0;
    hitsRef.current = 0;
    setHeld(false);
    setHits(0);
    setPhase("crash");
    setDodge("");
    videoRef.current?.pause();
    window.setTimeout(() => restart(), 1100);
  }

  function restart() {
    beatRef.current = 0;
    hitsRef.current = 0;
    holdRef.current = 0;
    crashedRef.current = false;
    setBeat(0);
    setHits(0);
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
    const mash = b?.kind === "mash" && (phase === "in" || phase === "open");
    const early = phase === "in" && v && b && v.currentTime >= b.at - 0.5;
    if (!mash && now - lastTap.current < 280 && phase !== "open" && !early && !inHold) goFull();
    lastTap.current = now;
    playSong(SONG.landrun);
    if (crashedRef.current || !b) return;
    if (phase !== "open" && !early && !inHold && !mash) return;
    if (b.kind === "hold") {
      if (!holdRef.current) holdRef.current = now;
      setHeld(true);
      return;
    }
    if (b.kind === "mash") {
      hitsRef.current += 1;
      setHits(hitsRef.current);
      if (hitsRef.current >= b.need) pass();
      return;
    }
    const away = b.dir === "l" ? "r" : b.dir === "r" ? "l" : "";
    if (away) {
      setDodge(away);
      window.setTimeout(() => setDodge(""), 380);
    }
    pass();
  }

  const prompt = nowBeat.kind === "mash" ? `${nowBeat.label} ${hits}/${nowBeat.need}` : nowBeat.label;

  return (
    <section className="citadel land-run" data-wired="true" data-phase={phase} data-hold={held ? "true" : undefined} aria-label="Howl Sight dive">
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
        <div className="citadel-shield" onPointerDown={down} />
        {nowBeat.kind === "hold" && (phase === "in" || phase === "open") ? <i className="land-lock" aria-hidden="true" /> : null}

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
