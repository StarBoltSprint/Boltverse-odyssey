import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import type { ArtifactId } from "@/game/artifacts";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

const STILL = pub("citadel/starmap.jpg") + "?v=5";
const CLIP = pub("citadel/starmap.mp4") + "?v=5";

type Props = {
  onLand: (id: ArtifactId) => void;
  onBack: () => void;
};

export function StarMap({ onLand, onBack }: Props) {
  const [live, setLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    playSong(SONG.starmap);
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
  }, []);

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.stopPropagation();
      playSong(SONG.starmap);
      fn();
    };
  }

  function doubleFull() {
    playSong(SONG.starmap);
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  return (
    <section className="citadel star-map" data-wired="true" aria-label="The Star Veil">
      <div className="citadel-stage">
        <img className="citadel-art" src={STILL} alt="" draggable={false} />
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
          hidden={!live}
          onPlaying={() => setLive(true)}
        />
        <div className="citadel-shield" onPointerDown={doubleFull} />

        <button type="button" className="walk-back" onPointerDown={tap(() => { playSong(SONG.hub); onBack(); })}>
          <i className="walk-gem" aria-hidden="true" />
          Citadel
        </button>

        <button type="button" className="star-hit star-hit-crucible" aria-label="The Howling Crucible" onPointerDown={tap(() => onLand("core-heart"))} />
        <button type="button" className="star-hit star-hit-veil" aria-label="Shatter Veil" onPointerDown={tap(() => onLand("shatter-veil"))} />
        <button type="button" className="star-hit star-hit-sight" aria-label="Howl Sight" onPointerDown={tap(() => onLand("howl-sight"))} />
      </div>
    </section>
  );
}
