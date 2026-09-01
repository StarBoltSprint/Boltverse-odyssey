import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HUNG_FILMS, type Film, type FilmId, type Grade } from "@/game/films";
import { press } from "@/lib/press";
import { armAfterLift, freezeTaps, tapsFrozen } from "@/lib/tap-lock";
import { citadel } from "@/lib/cdn";

type Props = {
  grades: Partial<Record<FilmId, Grade>>;
  focusId?: FilmId | null;
  onEnter: (id: FilmId) => void;
  onHome: () => void;
};

export function ArtifactHall({ grades, focusId, onEnter, onHome }: Props) {
  const [i, setI] = useState(() => {
    if (!focusId) return 0;
    const n = HUNG_FILMS.findIndex((f) => f.id === focusId);
    return n >= 0 ? n : 0;
  });
  const [live, setLive] = useState(false);
  const [armed, setArmed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const film: Film = HUNG_FILMS[i] ?? HUNG_FILMS[0]!;

  useEffect(() => {
    setArmed(false);
    const release = armAfterLift(() => setArmed(true));
    return release;
  }, []);

  useEffect(() => {
    if (!focusId) return;
    const n = HUNG_FILMS.findIndex((f) => f.id === focusId);
    if (n >= 0) setI(n);
  }, [focusId]);

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
  }, [film.id]);

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!armed || tapsFrozen()) return;
      fn();
    };
  }

  function step(dir: -1 | 1) {
    setI((n) => (n + dir + HUNG_FILMS.length) % HUNG_FILMS.length);
  }

  function enter() {
    if (!armed || tapsFrozen()) return;
    freezeTaps(700);
    onEnter(film.id);
  }

  const grade = grades[film.id];

  return (
    <section className="stage" aria-label="Thunderwolf Hall">
      <img className="stage-art" src={citadel("relic.jpg") + "?v=1"} alt="" />
      <div className="stage-veil" />

      <button type="button" className="ghost ghost-back" aria-label="Citadel" {...press(onHome)}>
        <i className="crystal" aria-hidden />
        Citadel
      </button>

      <header className="relic-head">
        <p>{film.id === "asteroid" ? "First hung room" : "Hung relic"}</p>
        <h1>{film.name}</h1>
      </header>

      <button type="button" className="relic-frame" aria-label={`Enter ${film.name}`} onPointerDown={tap(enter)}>
        <img src={film.still} alt="" hidden={live} />
        <video
          ref={videoRef}
          key={film.id}
          src={film.local}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
          disablePictureInPicture
          onPlaying={() => setLive(true)}
        />
      </button>

      <button type="button" className="arrow arrow-l" aria-label="Previous relic" onPointerDown={tap(() => step(-1))}>
        <ChevronLeft strokeWidth={2.6} />
      </button>
      <button type="button" className="arrow arrow-r" aria-label="Next relic" onPointerDown={tap(() => step(1))}>
        <ChevronRight strokeWidth={2.6} />
      </button>

      <footer className="chrome">
        <p className="chrome-mark">
          <strong>
            {film.name}
            {grade ? ` · ${grade}` : ""}
          </strong>
          <span>
            {film.line}
            {film.lives === 1 ? " · one life" : ""}
          </span>
        </p>
        <button type="button" className="act act-fill" disabled={!armed} onPointerDown={tap(enter)}>
          {film.verb}
        </button>
      </footer>
    </section>
  );
}
