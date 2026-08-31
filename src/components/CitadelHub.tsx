import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG, warmSong } from "@/lib/song";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PackSheet } from "./PackMark";

type Props = {
  onHall?: () => void;
  onConstellation?: () => void;
  onLand: () => void;
};

export function CitadelHub({ onLand }: Props) {
  const { user } = useCurrentUserState();
  const marked = !!user && !user.isDevFallback;
  const tag = ((user?.displayName || "Pack") as string).trim().split(/\s+/)[0] || "Pack";
  const [packOpen, setPackOpen] = useState(false);
  const [live, setLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const still = pub("citadel/hub.jpg") + "?v=26";
  const clip = pub("citadel/hub.mp4") + "?v=27";

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    warmSong(SONG.hub);
    playSong(SONG.hub);
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("webkit-playsinline", "true");
    v.controls = false;
    const playFilm = () => {
      v.muted = true;
      void v.play().then(() => setLive(true)).catch(() => {});
    };
    playFilm();
    v.addEventListener("canplay", playFilm);
    return () => v.removeEventListener("canplay", playFilm);
  }, [clip]);

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      playSong(SONG.hub);
      fn();
    };
  }

  function doubleFull() {
    playSong(SONG.hub);
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  return (
    <section className="citadel" data-wired="true" aria-label="Thunderwolf Citadel">
      <div className="citadel-stage">
        <img className="citadel-art" src={still} alt="" draggable={false} hidden={live} />
        <video
          ref={videoRef}
          className="citadel-art citadel-live"
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
        <div className="citadel-shield" onPointerDown={doubleFull} />
        <div
          role="button"
          tabIndex={0}
          className="citadel-hit citadel-hit-join"
          aria-label={marked ? "Pack marked" : "Join connect"}
          onPointerDown={tap(() => setPackOpen(true))}
        />
        {marked && (
          <>
            <div className="citadel-join-hide" aria-hidden="true" />
            <div className="citadel-pack-chip" aria-hidden="true">
              <span>
                <i>P</i>
                <b>
                  <em>{tag}</em>
                  <small>Marked</small>
                </b>
              </span>
            </div>
          </>
        )}
        <div
          role="button"
          tabIndex={0}
          className="citadel-hit citadel-hit-land"
          aria-label="Land"
          onPointerDown={tap(() => {
            playSong(SONG.hall);
            onLand();
          })}
        />
      </div>
      {packOpen && <PackSheet onClose={() => setPackOpen(false)} />}
    </section>
  );
}
