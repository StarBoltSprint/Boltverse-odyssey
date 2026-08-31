import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

type Kiln = {
  id: "new" | "remix" | "version";
  name: string;
  line: string;
  action: string;
  still: string;
  clip: string;
  song: string;
};

const KILNS: Kiln[] = [
  {
    id: "new",
    name: "New Artifact",
    line: "Born in the kiln",
    action: "New Artifact",
    still: pub("citadel/kiln-new.jpg") + "?v=1",
    clip: pub("citadel/kiln-new.mp4") + "?v=1",
    song: SONG.kilnNew,
  },
  {
    id: "remix",
    name: "Remix",
    line: "Two fires, one relic",
    action: "Remix",
    still: pub("citadel/kiln-remix.jpg") + "?v=1",
    clip: pub("citadel/kiln-remix.mp4") + "?v=1",
    song: SONG.kilnRemix,
  },
  {
    id: "version",
    name: "New Version",
    line: "The next howl of the relic",
    action: "New Version",
    still: pub("citadel/kiln-version.jpg") + "?v=1",
    clip: pub("citadel/kiln-version.mp4") + "?v=1",
    song: SONG.kilnVersion,
  },
];

type Props = {
  onBack: () => void;
  onPick: (id: Kiln["id"]) => void;
};

export function ForgeKiln({ onBack, onPick }: Props) {
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const kiln = KILNS[i];

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    setLive(false);
    playSong(kiln.song);
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
  }, [kiln]);

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.stopPropagation();
      playSong(kiln.song);
      fn();
    };
  }

  function doubleFull() {
    playSong(kiln.song);
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  return (
    <section className="walk kiln" data-wired="true" data-armed="true" aria-label="Bolt Forge kiln">
      <div className="walk-stage">
        <img className="walk-art" src={kiln.still} alt="" hidden={live} />
        <video
          ref={videoRef}
          key={kiln.id}
          className="walk-art walk-live"
          src={kiln.clip}
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
        <button type="button" className="walk-arrow walk-arrow-l" onPointerDown={tap(() => setI((n) => (n + KILNS.length - 1) % KILNS.length))} aria-label="Previous">
          <ChevronLeft strokeWidth={2.8} />
        </button>
        <button type="button" className="walk-arrow walk-arrow-r" onPointerDown={tap(() => setI((n) => (n + 1) % KILNS.length))} aria-label="Next">
          <ChevronRight strokeWidth={2.8} />
        </button>
        <footer className="walk-foot">
          <p className="walk-mark">
            <strong>{kiln.name}</strong>
            <span>{kiln.line}</span>
          </p>
          <button type="button" className="walk-enter" onPointerDown={tap(() => onPick(kiln.id))}>
            <span>{kiln.action}</span>
          </button>
        </footer>
      </div>
    </section>
  );
}
