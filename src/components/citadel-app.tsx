import { useEffect, useMemo, useRef, useState } from "react";
import { FilmStage, type RunResult } from "@/components/film-stage";
import { ZoneWalk, type ZoneId } from "@/components/zone-walk";
import { ArtifactHall } from "@/components/artifact-hall";
import { CivicRoom } from "@/components/civic-room";
import { DenGate } from "@/components/den-gate";
import { GradeSheet } from "@/components/grade-sheet";
import { FILMS, FILM_BY_ID, HUNG_FILMS, type FilmId } from "@/game/films";
import { readSave, recordRun, type Save } from "@/game/film-save";
import { citadel } from "@/lib/cdn";
import { press } from "@/lib/press";
import { freezeTaps } from "@/lib/tap-lock";
import { unlockAudio } from "@/game/film-audio";

type Place = "hub" | "walk" | "hall" | "play" | "result" | ZoneId;

function goFull() {
  const root = document.documentElement;
  if (document.fullscreenElement) {
    void document.exitFullscreen?.().catch(() => {});
    return;
  }
  void root.requestFullscreen?.().catch(() => {});
}

export function CitadelApp() {
  const [place, setPlace] = useState<Place>("hub");
  const [save, setSave] = useState<Save>(() => (typeof window === "undefined" ? readSave() : readSave()));
  const [filmId, setFilmId] = useState<FilmId>("asteroid");
  const [result, setResult] = useState<RunResult | null>(null);
  const [hubLive, setHubLive] = useState(false);
  const [walkI, setWalkI] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const playHome = useRef<Place>("hall");

  const film = FILM_BY_ID[filmId];
  const grades = useMemo(() => {
    const g: Partial<Record<FilmId, RunResult["grade"]>> = {};
    for (const f of FILMS) {
      const rec = save.reels[f.id];
      if (rec?.grade) g[f.id] = rec.grade;
    }
    return g;
  }, [save]);

  useEffect(() => {
    if (place !== "hub") return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const playFilm = () => {
      v.muted = true;
      void v.play().then(() => setHubLive(true)).catch(() => {});
    };
    playFilm();
    v.addEventListener("canplay", playFilm);
    return () => v.removeEventListener("canplay", playFilm);
  }, [place]);

  function land() {
    try {
      unlockAudio();
    } catch {
      /* */
    }
    freezeTaps(600);
    setPlace("walk");
  }

  function join() {
    try {
      unlockAudio();
    } catch {
      /* */
    }
    freezeTaps(600);
    setPlace("howl");
  }

  function doubleFull() {
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  function enterZone(id: ZoneId) {
    if (id === "hall") {
      setPlace("hall");
      return;
    }
    setPlace(id);
  }

  function play(id: FilmId, home: Place = "hall") {
    try {
      unlockAudio();
    } catch {
      /* */
    }
    setFilmId(id);
    setResult(null);
    playHome.current = home;
    setPlace("play");
  }

  function onDone(res: RunResult) {
    setResult(res);
    setSave(recordRun(filmId, res.score, res.grade, res.shards, res.combo));
    setPlace("result");
  }

  function nextFilm() {
    const i = HUNG_FILMS.findIndex((f) => f.id === filmId);
    const next = HUNG_FILMS[(Math.max(i, 0) + 1) % HUNG_FILMS.length]!;
    play(next.id);
  }

  if (place === "play") {
    return (
      <FilmStage
        id={filmId}
        original={save.original}
        onExit={() => setPlace(playHome.current)}
        onDone={onDone}
      />
    );
  }

  if (place === "result" && result) {
    return (
      <GradeSheet
        film={film}
        result={result}
        onKeep={() => setPlace("hall")}
        onNext={nextFilm}
        onAgain={() => play(filmId)}
      />
    );
  }

  if (place === "walk") {
    return <ZoneWalk start={walkI} onIndex={setWalkI} onBack={() => setPlace("hub")} onEnter={enterZone} />;
  }

  if (place === "hall") {
    return (
      <ArtifactHall
        grades={grades}
        focusId={filmId}
        onEnter={play}
        onHome={() => setPlace("walk")}
      />
    );
  }

  if (place === "den") {
    return (
      <DenGate
        onBack={() => setPlace("walk")}
        onRest={() => play("den", "den")}
        onBind={() => play("kiln", "den")}
      />
    );
  }

  if (place === "forge") {
    return (
      <CivicRoom
        name="Bolt Forge"
        line="Kiln of the pack · crystal fire"
        still={citadel("forge.jpg") + "?v=1"}
        clip={citadel("forge.mp4") + "?v=1"}
        action="To the Hall"
        note="The kiln holds. Cuts hang in Thunderwolf Hall."
        onAction={() => setPlace("hall")}
        onBack={() => setPlace("walk")}
      />
    );
  }

  if (place === "howl") {
    return (
      <CivicRoom
        name="The Pack"
        line="Howl in on X"
        still={citadel("pack.jpg") + "?v=1"}
        clip={citadel("pack.mp4") + "?v=1"}
        action="Howl on X"
        href="https://x.com/StarBoltSprint"
        onBack={() => setPlace("walk")}
      />
    );
  }

  if (place === "door") {
    return (
      <CivicRoom
        name="Citadel Door"
        line="Knock the fire awake"
        still={citadel("howl.jpg") + "?v=1"}
        clip={citadel("howl.mp4") + "?v=1"}
        action="Knock"
        onBack={() => setPlace("walk")}
      />
    );
  }

  if (place === "stars") {
    return (
      <CivicRoom
        name="The Star Veil"
        line="Constellation of the pack"
        still={citadel("stars.jpg") + "?v=1"}
        clip={citadel("stars.mp4") + "?v=1"}
        action="To the Hall"
        note="The veil holds. Play lives in the Hall."
        onAction={() => setPlace("hall")}
        onBack={() => setPlace("walk")}
      />
    );
  }

  return (
    <section className="citadel" data-wired="true" aria-label="Thunderwolf Citadel">
      <h1 className="sr-only">Thunderwolf Citadel</h1>
      <div className="citadel-stage">
        <img
          className="citadel-art"
          src={citadel("hub.jpg") + "?v=26"}
          alt=""
          draggable={false}
          hidden={hubLive}
        />
        <video
          ref={videoRef}
          className="citadel-art citadel-live"
          src={citadel("hub.mp4") + "?v=27"}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          onPlaying={() => setHubLive(true)}
        />
        <div className="citadel-shield" onPointerDown={doubleFull} />
        <button type="button" className="citadel-hit citadel-hit-join" aria-label="Join connect" {...press(join)} />
        <button type="button" className="citadel-hit citadel-hit-land" aria-label="Land" {...press(land)} />
      </div>
    </section>
  );
}
