import { FILMS, type FilmId, type Grade } from "./films";

export type ReelSave = {
  score: number;
  grade: Grade | null;
  combo: number;
  shards: number;
};

export type Save = {
  shards: number;
  original: boolean;
  reels: Record<FilmId, ReelSave>;
};

const KEY = "howling-crucible-save-v1";

function emptyReels(): Record<FilmId, ReelSave> {
  const reels = {} as Record<FilmId, ReelSave>;
  for (const film of FILMS) {
    reels[film.id] = { score: 0, grade: null, combo: 0, shards: 0 };
  }
  return reels;
}

function blank(): Save {
  return { shards: 0, original: false, reels: emptyReels() };
}

export function readSave(): Save {
  if (typeof window === "undefined") return blank();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return blank();
    const parsed = JSON.parse(raw) as Save;
    const reels = emptyReels();
    for (const film of FILMS) {
      reels[film.id] = parsed.reels?.[film.id] ?? reels[film.id];
    }
    return {
      shards: Number(parsed.shards) || 0,
      original: Boolean(parsed.original),
      reels,
    };
  } catch {
    return blank();
  }
}

function write(save: Save): Save {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    /* private mode */
  }
  return save;
}

export function recordRun(id: FilmId, score: number, grade: Grade, shards: number, combo: number): Save {
  const save = readSave();
  const prev = save.reels[id];
  const better = !prev.grade || score >= prev.score;
  save.reels[id] = better
    ? { score, grade, combo, shards }
    : prev;
  save.shards += shards;
  return write(save);
}

export function setOriginal(original: boolean): Save {
  const save = readSave();
  save.original = original;
  return write(save);
}
