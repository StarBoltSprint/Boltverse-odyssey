import { useEffect, useRef, useState } from "react";
import { pub } from "@/lib/pub";
import { dropFilm } from "@/lib/film";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

const STILL = pub("slash/gate-fps.jpg") + "?v=sight2";
const HUNT = pub("slash/hunt-fps.mp4") + "?v=3";

type Props = {
  onPlay: () => void;
  onBack: () => void;
};

export function FpsGate({ onPlay, onBack }: Props) {
  const huntRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const [hunt, setHunt] = useState(false);
  const [skipOn, setSkipOn] = useState(false);

  useEffect(() => {
    if (!hunt) return;
    const t = window.setTimeout(() => setSkipOn(true), 4000);
    const v = huntRef.current;
    if (v) {
      v.muted = true;
      void v.play().catch(() => {});
    }
    return () => {
      window.clearTimeout(t);
      dropFilm(v);
    };
  }, [hunt]);

  function take() {
    playSong(SONG.landrun);
    setHunt(true);
  }

  function done() {
    dropFilm(huntRef.current);
    onPlay();
  }

  function doubleFull() {
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  if (hunt) {
    return (
      <div className="slash-hunt">
        <video
          ref={huntRef}
          className="slash-hunt-film"
          src={HUNT}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          onEnded={done}
          onError={done}
        />
        <div className="slash-hunt-vignette" />
        {skipOn ? (
          <>
            <button type="button" className="slash-hunt-hit" aria-label="Skip intro" onClick={done} />
            <button type="button" className="slash-hunt-skip" onClick={done}>
              Skip
            </button>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="slash-gate fps-gate" data-class="fps" onPointerDown={doubleFull}>
      <div className="slash-gate-stage" aria-hidden>
        <img className="slash-gate-art" src={STILL} alt="" draggable={false} />
        <div className="slash-gate-vignette" />
        <div className="slash-gate-bloom" />
        <div className="slash-gate-frame" />
      </div>
      <p className="slash-gate-mark">Howl Sight</p>
      <div className="slash-gate-plate">
        <h1 className="slash-title">StarBoltSprint</h1>
        <p className="slash-class">Howl Sight</p>
        <p className="slash-sub">First person. The kiln is the range. Crystal never chrome.</p>
        <button
          type="button"
          className="slash-enter"
          onPointerDown={(ev) => {
            ev.stopPropagation();
            take();
          }}
        >
          Take the Sight
        </button>
        <button
          type="button"
          className="slash-back"
          onPointerDown={(ev) => {
            ev.stopPropagation();
            playSong(SONG.hub);
            onBack();
          }}
        >
          Citadel
        </button>
      </div>
    </div>
  );
}
