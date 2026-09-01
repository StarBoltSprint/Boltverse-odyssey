import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { citadel } from "@/lib/cdn";
import { press } from "@/lib/press";
import { armAfterLift, freezeTaps, tapsFrozen } from "@/lib/tap-lock";

export type ZoneId = "hall" | "den" | "forge" | "howl" | "door" | "stars";

type Zone = {
  id: ZoneId;
  name: string;
  line: string;
  still: string;
  clip: string;
  action: string;
};

const ZONES: Zone[] = [
  {
    id: "hall",
    name: "Thunderwolf Hall",
    line: "Heart of the Citadel · the nave",
    still: citadel("hall.jpg") + "?v=6",
    clip: citadel("hall.mp4") + "?v=6",
    action: "Enter",
  },
  {
    id: "den",
    name: "Your Den",
    line: "Where the walker rests · first howl",
    still: citadel("den.jpg") + "?v=1",
    clip: citadel("den.mp4") + "?v=1",
    action: "Enter",
  },
  {
    id: "forge",
    name: "Bolt Forge",
    line: "Kiln of the pack · crystal fire",
    still: citadel("forge.jpg") + "?v=1",
    clip: citadel("forge.mp4") + "?v=1",
    action: "Forge",
  },
  {
    id: "howl",
    name: "The Pack",
    line: "Howl in on X",
    still: citadel("pack.jpg") + "?v=1",
    clip: citadel("pack.mp4") + "?v=1",
    action: "Howl on X",
  },
  {
    id: "door",
    name: "Citadel Door",
    line: "Knock the fire awake",
    still: citadel("howl.jpg") + "?v=1",
    clip: citadel("howl.mp4") + "?v=1",
    action: "Knock",
  },
  {
    id: "stars",
    name: "The Star Veil",
    line: "Constellation of the pack",
    still: citadel("stars.jpg") + "?v=1",
    clip: citadel("stars.mp4") + "?v=1",
    action: "Gaze",
  },
];

type Props = {
  start?: number;
  onIndex?: (i: number) => void;
  onBack: () => void;
  onEnter: (id: ZoneId) => void;
};

function goFull() {
  const root = document.documentElement;
  if (document.fullscreenElement) {
    void document.exitFullscreen?.().catch(() => {});
    return;
  }
  void root.requestFullscreen?.().catch(() => {});
}

export function ZoneWalk({ start = 0, onIndex, onBack, onEnter }: Props) {
  const [i, setI] = useState(start);
  const [live, setLive] = useState(false);
  const [armed, setArmed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const armedRef = useRef(false);
  const zone = ZONES[i]!;
  const painted = zone.id === "hall";

  useEffect(() => {
    armedRef.current = false;
    setArmed(false);
    setLive(false);
    const release = armAfterLift(() => {
      armedRef.current = true;
      setArmed(true);
    });
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
  }, [zone.id]);

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!armedRef.current || tapsFrozen()) return;
      fn();
    };
  }

  function hit(fn: () => void) {
    let down = false;
    let last = 0;
    const run = () => {
      if (!armedRef.current || tapsFrozen()) return;
      const now = performance.now();
      if (now - last < 400) return;
      last = now;
      fn();
    };
    return {
      onPointerDown: (ev: PointerEvent | MouseEvent) => {
        ev.stopPropagation();
        down = true;
        run();
      },
      onClick: () => {
        if (!down) return;
        run();
      },
      onTouchEnd: (e: { preventDefault?: () => void }) => {
        e.preventDefault?.();
        if (!down) return;
        run();
      },
    };
  }

  function step(dir: -1 | 1) {
    freezeTaps(480);
    setI((n) => {
      const next = (n + dir + ZONES.length) % ZONES.length;
      onIndex?.(next);
      return next;
    });
  }

  function enter() {
    if (!armedRef.current || tapsFrozen()) return;
    freezeTaps(600);
    onIndex?.(i);
    onEnter(zone.id);
  }

  function doubleFull() {
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  return (
    <section
      className="walk"
      data-armed={armed ? "true" : undefined}
      data-wired={painted ? "true" : undefined}
      aria-label="Zone walk"
    >
      <div className="walk-stage">
        <img className="walk-art" src={zone.still} alt="" draggable={false} hidden={live} />
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
        <div className="citadel-shield" onPointerDown={doubleFull} />

        {painted ? (
          <>
            <button type="button" className="walk-hit walk-hit-citadel" aria-label="Citadel" {...hit(onBack)} />
            <button type="button" className="walk-hit walk-hit-left" aria-label="Previous zone" {...hit(() => step(-1))} />
            <button type="button" className="walk-hit walk-hit-right" aria-label="Next zone" {...hit(() => step(1))} />
            <button type="button" className="walk-hit walk-hit-enter" aria-label="Enter" {...hit(enter)} />
          </>
        ) : (
          <>
            <button type="button" className="ghost ghost-back" aria-label="Citadel" {...press(onBack)}>
              <i className="crystal" aria-hidden />
              Citadel
            </button>

            <button type="button" className="arrow arrow-l" aria-label="Previous zone" onPointerDown={tap(() => step(-1))}>
              <ChevronLeft strokeWidth={2.6} />
            </button>
            <button type="button" className="arrow arrow-r" aria-label="Next zone" onPointerDown={tap(() => step(1))}>
              <ChevronRight strokeWidth={2.6} />
            </button>

            {zone.id === "howl" ? (
              <div className="pack-copy">
                <p>Boltverse</p>
                <h1>The Pack</h1>
                <span>Howl in on X</span>
              </div>
            ) : null}

            <footer className="chrome">
              {zone.id === "howl" ? (
                <p className="chrome-mark" />
              ) : (
                <p className="chrome-mark">
                  <strong>{zone.name}</strong>
                  <span>{zone.line}</span>
                </p>
              )}
              <button type="button" className="act" disabled={!armed} onPointerDown={tap(enter)}>
                {zone.action}
              </button>
            </footer>
          </>
        )}
      </div>
    </section>
  );
}
