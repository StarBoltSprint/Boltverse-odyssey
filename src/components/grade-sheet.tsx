import type { Film } from "@/game/films";
import type { RunResult } from "@/components/film-stage";
import { press } from "@/lib/press";

type Props = {
  film: Film;
  result: RunResult;
  onKeep: () => void;
  onNext: () => void;
  onAgain: () => void;
};

export function GradeSheet({ film, result, onKeep, onNext, onAgain }: Props) {
  return (
    <section className="stage" aria-label={`${film.name} grade`}>
      <img className="stage-art" src={film.still} alt="" style={{ animation: "ken 22s ease-in-out alternate infinite" }} />
      <div className="stage-veil" />
      <div className="grade-panel">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">{film.name}</p>
        <p className="grade-mark">{result.grade}</p>
        <p className="font-mono text-xl tabular-nums text-accent">
          {result.score} · {result.combo}x combo
        </p>
        <p className="max-w-md text-sm text-muted">
          {result.perfect} perfect · {result.great} great · {result.good} good · {result.miss} miss
          {result.relics ? ` · ${result.relics} relics` : ""} · +{result.shards} shards
          {result.crashed ? " · the cut fractured" : ""}
        </p>
        <div className="mt-2 flex w-full max-w-md flex-col gap-3">
          <button type="button" className="act act-fill min-h-14 w-full" {...press(onKeep)}>
            Keep
          </button>
          <button type="button" className="act min-h-14 w-full" {...press(onNext)}>
            Next
          </button>
          <button
            type="button"
            className="min-h-11 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
            {...press(onAgain)}
          >
            Run it again
          </button>
        </div>
      </div>
    </section>
  );
}
