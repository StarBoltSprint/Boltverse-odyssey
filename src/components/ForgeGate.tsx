import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

type Path = {
  id: "bot" | "hand";
  name: string;
  line: string;
  action: string;
  still: string;
  clip: string;
  song: string;
};

const PATHS: Path[] = [
  {
    id: "bot",
    name: "Forge with Grok Bot",
    line: "Howl, and the kiln answers",
    action: "Grok Bot",
    still: pub("citadel/forge-bot.jpg") + "?v=1",
    clip: pub("citadel/forge-bot.mp4") + "?v=1",
    song: SONG.forgeBot,
  },
  {
    id: "hand",
    name: "Forge manually",
    line: "Paw and hammer, no voice but yours",
    action: "Manually",
    still: pub("citadel/forge-hand.jpg") + "?v=1",
    clip: pub("citadel/forge-hand.mp4") + "?v=1",
    song: SONG.forgeHand,
  },
];

type Props = {
  onBack: () => void;
  onPick: (id: Path["id"]) => void;
};

export function ForgeGate({ onBack, onPick }: Props) {
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const path = PATHS[i];

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    setLive(false);
    playSong(path.song);
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const playFilm = () => {
      v.muted = true;
      void v.play().then(() => setLive(true)).catch(() => {});
    };
    playFilm();
    v.addEventListener("canplay", playFilm);
    return () => v.removeEventListener("canplay", playFilm);
  }, [path]);

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.stopPropagation();
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

  return (
    <section className="walk kiln" data-wired="true" data-armed="true" aria-label="Choose the forge">
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

        <button type="button" className="walk-back" onPointerDown={tap(() => { playSong(SONG.forge); onBack(); })}>
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
          <button type="button" className="walk-enter" onPointerDown={tap(() => onPick(path.id))}>
            <span>{path.action}</span>
          </button>
        </footer>
      </div>
    </section>
  );
}
