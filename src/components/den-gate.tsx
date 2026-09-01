import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { citadel } from "@/lib/cdn";
import { press } from "@/lib/press";
import { armAfterLift, freezeTaps, tapsFrozen } from "@/lib/tap-lock";

type PathId = "walker" | "howlwright";

type Path = {
  id: PathId;
  name: string;
  line: string;
  action: string;
  still: string;
  clip: string;
};

const PATHS: Path[] = [
  {
    id: "walker",
    name: "Walker Den",
    line: "Where your howl sleeps",
    action: "Rest",
    still: citadel("den-walker.jpg") + "?v=1",
    clip: citadel("den-walker.mp4") + "?v=1",
  },
  {
    id: "howlwright",
    name: "Howlwright Den",
    line: "Where makers keep the fire",
    action: "Make",
    still: citadel("den-maker.jpg") + "?v=1",
    clip: citadel("den-maker.mp4") + "?v=1",
  },
];

const KILN_STILL = citadel("kiln-new.jpg") + "?v=1";
const KILN_CLIP = citadel("kiln-new.mp4") + "?v=1";

type Props = {
  onBack: () => void;
  onRest: () => void;
  onBind: () => void;
};

function goFull() {
  const root = document.documentElement;
  if (document.fullscreenElement) {
    void document.exitFullscreen?.().catch(() => {});
    return;
  }
  void root.requestFullscreen?.().catch(() => {});
}

export function DenGate({ onBack, onRest, onBind }: Props) {
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);
  const [armed, setArmed] = useState(false);
  const [vault, setVault] = useState(false);
  const [kilnLive, setKilnLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const kilnRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const path = PATHS[i]!;

  useEffect(() => {
    setArmed(false);
    setLive(false);
    const release = armAfterLift(() => setArmed(true));
    const v = videoRef.current;
    if (!v) return release;
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
  }, [path.id]);

  useEffect(() => {
    const den = videoRef.current;
    if (vault) den?.pause();
    else void den?.play().catch(() => {});
  }, [vault]);

  useEffect(() => {
    setKilnLive(false);
    const v = kilnRef.current;
    if (!vault || !v) return;
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
  }, [vault]);

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!armed || tapsFrozen()) return;
      fn();
    };
  }

  function step(dir: -1 | 1) {
    setI((n) => (n + dir + PATHS.length) % PATHS.length);
  }

  function make() {
    if (!armed || tapsFrozen()) return;
    freezeTaps(700);
    if (path.id === "howlwright") {
      setVault(true);
      return;
    }
    onRest();
  }

  function bind() {
    if (!armed || tapsFrozen()) return;
    freezeTaps(700);
    onBind();
  }

  function doubleFull() {
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  return (
    <section className="walk" data-armed={armed ? "true" : undefined} aria-label="Choose a den">
      <div className="walk-stage">
        <img className="walk-art" src={path.still} alt="" draggable={false} hidden={live} />
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
            <button type="button" className="ghost ghost-back" aria-label="Citadel" {...press(onBack)}>
              <i className="crystal" aria-hidden />
              Citadel
            </button>
            <button type="button" className="arrow arrow-l" aria-label="Previous den" onPointerDown={tap(() => step(-1))}>
              <ChevronLeft strokeWidth={2.6} />
            </button>
            <button type="button" className="arrow arrow-r" aria-label="Next den" onPointerDown={tap(() => step(1))}>
              <ChevronRight strokeWidth={2.6} />
            </button>
            <footer className="chrome">
              <p className="chrome-mark">
                <strong>{path.name}</strong>
                <span>{path.line}</span>
              </p>
              <button type="button" className="act act-fill" disabled={!armed} onPointerDown={tap(make)}>
                {path.action}
              </button>
            </footer>
          </>
        ) : (
          <>
            <button
              type="button"
              className="ghost ghost-back"
              aria-label="Den"
              {...press(() => setVault(false))}
            >
              <i className="crystal" aria-hidden />
              Den
            </button>
            <header className="relic-head">
              <p>Howlwright</p>
              <h1>No fire yet</h1>
            </header>
            <button type="button" className="relic-frame" aria-label="Bind the kiln" onPointerDown={tap(bind)}>
              <img src={KILN_STILL} alt="" hidden={kilnLive} />
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
            </button>
            <footer className="chrome">
              <p className="chrome-mark">
                <strong>Howlwright Kiln</strong>
                <span>Where makers keep the fire</span>
              </p>
              <button type="button" className="act act-fill" disabled={!armed} onPointerDown={tap(bind)}>
                Bind
              </button>
            </footer>
          </>
        )}
      </div>
    </section>
  );
}
