import { useEffect, useRef, useState } from "react";
import { press } from "@/lib/press";

type Props = {
  name: string;
  line: string;
  still: string;
  clip: string;
  action: string;
  note?: string;
  href?: string;
  onAction?: () => void;
  onBack: () => void;
};

export function CivicRoom({ name, line, still, clip, action, note, href, onAction, onBack }: Props) {
  const [live, setLive] = useState(false);
  const [knocked, setKnocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setLive(false);
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
  }, [clip]);

  const label = knocked && action === "Knock" ? "Unknock" : action;

  return (
    <section className="stage" aria-label={name}>
      <img className="stage-art" src={still} alt="" hidden={live} />
      <video
        ref={videoRef}
        className="stage-art"
        src={clip}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onPlaying={() => setLive(true)}
      />
      <div className="stage-veil" />

      <button type="button" className="ghost ghost-back" aria-label="Walk" {...press(onBack)}>
        <i className="crystal" aria-hidden />
        Walk
      </button>

      <footer className="chrome">
        <p className="chrome-mark">
          <strong>{name}</strong>
          <span>{knocked && action === "Knock" ? "The door holds your knock." : note ?? line}</span>
        </p>
        {href ? (
          <a className="act" href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          <button
            type="button"
            className="act"
            {...press(() => {
              if (action === "Knock") setKnocked((k) => !k);
              onAction?.();
            })}
          >
            {label}
          </button>
        )}
      </footer>
    </section>
  );
}
