import { buildCanyonChart } from "./canyon";
import { ENGINE, ODYSSEY, citadelFilm } from "@/lib/cdn";

export type Lane = "l" | "c" | "r";
export type BeatKind = "tap" | "hold" | "mash" | "swipe" | "relic" | "pick" | "left" | "right";
export type FilmId = "asteroid" | "lane" | "sprint" | "den" | "kiln" | "dive" | "hall";
export type Spot = { x: number; y: number };
export type CanyonMeta = { side: number; lift: number; roll: number };

export type Beat = {
  id: string;
  at: number;
  win: number;
  kind: BeatKind;
  lane: Lane;
  need: number;
  holdMs: number;
  label: string;
  relic?: Spot;
  spot?: Spot;
  canyon?: CanyonMeta;
  optional?: boolean;
};

export type Film = {
  id: FilmId;
  name: string;
  keeper: string;
  line: string;
  verb: string;
  still: string;
  portraitStill: string;
  local: string;
  portrait: string;
  origin: string;
  chart: number;
  beats: Beat[];
  hazards?: boolean;
  pad?: "arrows";
  lives?: number;
  score?: string;
  playlist?: string[];
};

export function b(
  id: string,
  at: number,
  kind: BeatKind,
  lane: Lane,
  label: string,
  extra: Partial<Beat> = {},
): Beat {
  const win =
    kind === "mash"
      ? 1.45
      : kind === "hold" || kind === "pick"
        ? 1.55
        : kind === "relic"
          ? 1.5
          : kind === "swipe"
            ? 0.95
            : kind === "left" || kind === "right"
              ? 0.72
              : 0.78;
  return {
    id,
    at,
    win,
    kind,
    lane,
    need: kind === "mash" ? 4 : 1,
    holdMs: kind === "hold" || kind === "pick" ? 560 : 0,
    label,
    ...extra,
  };
}

/** Forest Lane picture is sprint until a dedicated lane plate exists. */
const LANE_PICTURE = `${ENGINE}/sprint.mp4`;
const LANE_STILL = `${ENGINE}/sprint.jpg`;
const LANE_PORTRAIT = `${ENGINE}/sprint-p.mp4`;
const LANE_PORTRAIT_STILL = `${ENGINE}/sprint-p.jpg`;

const ASTEROID = citadelFilm("asteroid.mp4");
const ASTEROID_STILL = citadelFilm("asteroid.jpg");

export const FILMS: Film[] = [
  {
    id: "asteroid",
    name: "Asteroid Sprint",
    keeper: "StarBoltSprint",
    line: "The void lights because you run.",
    verb: "Sprint",
    still: ASTEROID_STILL,
    portraitStill: ASTEROID_STILL,
    local: ASTEROID,
    portrait: ASTEROID,
    origin: ASTEROID,
    score: citadelFilm("asteroid-score.m4a"),
    chart: 56,
    pad: "arrows",
    lives: 1,
    beats: [
      b("a1", 7.0, "right", "r", "→"),
      b("a2", 12.3, "left", "l", "←"),
      b("a3", 16.3, "right", "r", "→"),
      b("a4", 21.6, "left", "l", "←"),
      b("a5", 25.6, "right", "r", "→"),
      b("a6", 30.9, "left", "l", "←"),
      b("a7", 34.9, "right", "r", "→"),
      b("a8", 40.2, "right", "r", "→"),
      b("a9", 44.2, "left", "l", "←"),
      b("a10", 49.5, "right", "r", "→"),
      b("a11", 53.5, "left", "l", "←"),
    ],
  },
  {
    id: "lane",
    name: "Forest Lane",
    keeper: "StarBoltSprint",
    line: "One miss. The line is dead.",
    verb: "Cut",
    still: LANE_STILL,
    portraitStill: LANE_PORTRAIT_STILL,
    local: LANE_PICTURE,
    portrait: LANE_PORTRAIT,
    origin: LANE_PICTURE,
    chart: 56,
    pad: "arrows",
    lives: 1,
    beats: [
      b("l1", 3.2, "right", "r", "→"),
      b("l2", 6.8, "left", "l", "←"),
      b("l3", 12.8, "right", "r", "→"),
      b("l4", 16.4, "left", "l", "←"),
      b("l5", 22.4, "right", "r", "→"),
      b("l6", 26.0, "left", "l", "←"),
      b("l7", 32.0, "right", "r", "→"),
      b("l8", 35.6, "left", "l", "←"),
      b("l9", 41.6, "right", "r", "→"),
      b("l10", 45.2, "left", "l", "←"),
      b("l11", 51.2, "right", "r", "→"),
      b("l12", 54.8, "left", "l", "←"),
    ],
  },
  {
    id: "sprint",
    name: "Forest Sprint",
    keeper: "StarBoltSprint",
    line: "The run is the story",
    verb: "Sprint",
    still: `${ENGINE}/sprint.jpg`,
    portraitStill: `${ENGINE}/sprint-p.jpg`,
    local: `${ENGINE}/sprint.mp4`,
    portrait: `${ENGINE}/sprint-p.mp4`,
    origin: `${ENGINE}/sprint.mp4`,
    chart: 54,
    beats: [
      b("s1", 2.45, "tap", "c", "TAP", { spot: { x: 0.5, y: 0.55 } }),
      b("s2", 4.5, "tap", "c", "VAULT", { spot: { x: 0.5, y: 0.58 } }),
      b("s3", 7.2, "swipe", "l", "DODGE", { spot: { x: 0.22, y: 0.38 } }),
      b("s4", 11.5, "tap", "c", "TAP", { spot: { x: 0.5, y: 0.52 } }),
      b("sFork", 13.15, "pick", "c", "PATH", { optional: true, holdMs: 320, spot: { x: 0.5, y: 0.55 } }),
      b("s5", 16.5, "hold", "c", "SLIDE", { spot: { x: 0.5, y: 0.58 } }),
      b("s6", 20.2, "tap", "c", "TAP", { spot: { x: 0.48, y: 0.55 } }),
      b("s7", 23.8, "swipe", "r", "DODGE", { spot: { x: 0.78, y: 0.32 } }),
      b("s8", 27.5, "tap", "c", "TAP", { spot: { x: 0.42, y: 0.52 } }),
      b("s9", 31.2, "relic", "c", "LIGHT", { relic: { x: 0.68, y: 0.46 }, spot: { x: 0.68, y: 0.46 }, optional: true }),
      b("s10", 35.0, "hold", "c", "HOLD", { spot: { x: 0.48, y: 0.55 } }),
      b("s11", 38.8, "mash", "c", "BREAK", { need: 4, spot: { x: 0.5, y: 0.52 } }),
      b("sHowl", 47.2, "hold", "c", "HOWL", { holdMs: 640, spot: { x: 0.5, y: 0.48 } }),
      b("s13", 52.4, "tap", "c", "FIRE", { spot: { x: 0.5, y: 0.52 } }),
    ],
  },
  {
    id: "den",
    name: "Walker Den",
    keeper: "Rhoa",
    line: "Where your howl sleeps",
    verb: "Rest",
    still: `${ODYSSEY}/den-walker.jpg`,
    portraitStill: `${ODYSSEY}/den-walker.jpg`,
    local: `${ODYSSEY}/den-walker.mp4`,
    portrait: `${ODYSSEY}/den-walker.mp4`,
    origin: `${ODYSSEY}/den-walker.mp4`,
    chart: 10,
    beats: [
      b("d1", 1.15, "tap", "l", "TAP"),
      b("d2", 2.25, "tap", "r", "TAP"),
      b("d3", 3.5, "hold", "c", "BREATHE"),
      b("d4", 5.05, "relic", "c", "HOWL", { relic: { x: 0.44, y: 0.5 } }),
      b("d5", 6.2, "tap", "c", "TAP"),
      b("d6", 7.35, "hold", "c", "REST"),
      b("d7", 8.55, "mash", "c", "WAKE", { need: 5 }),
      b("d8", 9.45, "relic", "c", "SHARD", { relic: { x: 0.62, y: 0.36 } }),
    ],
  },
  {
    id: "kiln",
    name: "Howlwright Kiln",
    keeper: "Orren",
    line: "Where makers keep the fire",
    verb: "Forge",
    still: `${ODYSSEY}/kiln-new.jpg`,
    portraitStill: `${ODYSSEY}/kiln-new.jpg`,
    local: `${ODYSSEY}/kiln-new.mp4`,
    portrait: `${ODYSSEY}/kiln-new.mp4`,
    origin: `${ODYSSEY}/kiln-new.mp4`,
    chart: 10,
    beats: [
      b("k1", 0.95, "tap", "l", "STRIKE"),
      b("k2", 1.85, "tap", "r", "STRIKE"),
      b("k3", 2.85, "mash", "c", "HEAT", { need: 5 }),
      b("k4", 4.2, "hold", "c", "QUENCH"),
      b("k5", 5.4, "tap", "l", "STRIKE"),
      b("k6", 6.25, "tap", "r", "STRIKE"),
      b("k7", 7.2, "relic", "c", "RELIC", { relic: { x: 0.5, y: 0.44 } }),
      b("k8", 8.25, "mash", "c", "FORGE", { need: 6 }),
      b("k9", 9.35, "hold", "c", "SEAL"),
    ],
  },
  {
    id: "dive",
    name: "Sight Dive",
    keeper: "Tal",
    line: "One minute through the living canyon",
    verb: "Plunge",
    still: `${ODYSSEY}/hub.jpg`,
    portraitStill: `${ODYSSEY}/hub.jpg`,
    local: `${ODYSSEY}/landrun-sight-dive.mp4`,
    portrait: `${ODYSSEY}/landrun-sight-dive.mp4`,
    origin: `${ODYSSEY}/landrun-sight-dive.mp4`,
    chart: 59,
    hazards: true,
    beats: [
      b("v1", 0.95, "swipe", "l", "DODGE"),
      b("v2", 2.05, "swipe", "r", "DODGE"),
      b("v3", 3.15, "tap", "c", "TAP"),
      b("v4", 4.25, "mash", "c", "MASH", { need: 4 }),
      b("v5", 5.5, "swipe", "l", "DODGE"),
      b("v6", 6.6, "hold", "c", "HOLD"),
      b("v7", 7.7, "swipe", "r", "DODGE"),
      b("v8", 8.7, "relic", "c", "SIGHT", { relic: { x: 0.48, y: 0.52 } }),
      b("v9", 9.45, "tap", "c", "FIRE"),
    ],
  },
  {
    id: "hall",
    name: "Star Hall",
    keeper: "Iri",
    line: "Harvest light from the nave",
    verb: "Keep",
    still: `${ODYSSEY}/hall.jpg`,
    portraitStill: `${ODYSSEY}/hall.jpg`,
    local: `${ODYSSEY}/hall.mp4`,
    portrait: `${ODYSSEY}/hall.mp4`,
    origin: `${ODYSSEY}/hall.mp4`,
    chart: 10,
    beats: [
      b("h1", 1.05, "relic", "c", "STAR", { relic: { x: 0.28, y: 0.42 } }),
      b("h2", 2.15, "relic", "c", "STAR", { relic: { x: 0.72, y: 0.36 } }),
      b("h3", 3.3, "tap", "c", "BIND"),
      b("h4", 4.4, "relic", "c", "STAR", { relic: { x: 0.5, y: 0.28 } }),
      b("h5", 5.5, "relic", "c", "STAR", { relic: { x: 0.22, y: 0.62 } }),
      b("h6", 6.55, "hold", "c", "KEEP"),
      b("h7", 7.6, "relic", "c", "STAR", { relic: { x: 0.78, y: 0.55 } }),
      b("h8", 8.55, "mash", "c", "HOWL", { need: 4 }),
      b("h9", 9.4, "relic", "c", "CORE", { relic: { x: 0.5, y: 0.48 } }),
    ],
  },
];

export const FILM_BY_ID = Object.fromEntries(FILMS.map((f) => [f.id, f])) as Record<FilmId, Film>;

/** Hung in Thunderwolf Hall. Civic dens/kiln/nave stay rooms, not relics. */
export const HUNG_FILMS = FILMS.filter(
  (f) => f.id !== "den" && f.id !== "kiln" && f.id !== "hall" && f.id !== "sprint",
);

export type Grade = "S" | "A" | "B" | "C" | "D" | "F";

export function gradeOf(perfect: number, great: number, good: number, miss: number, total: number): Grade {
  if (total <= 0) return "F";
  const acc = (perfect + great * 0.85 + good * 0.6) / total;
  if (miss === 0 && acc >= 0.94) return "S";
  if (acc >= 0.84) return "A";
  if (acc >= 0.7) return "B";
  if (acc >= 0.52) return "C";
  if (acc >= 0.32) return "D";
  return "F";
}

export function shardsOf(perfect: number, great: number, good: number, relics: number, grade: Grade) {
  const base = perfect * 3 + great * 2 + good + relics * 4;
  const bonus = grade === "S" ? 20 : grade === "A" ? 10 : grade === "B" ? 4 : 0;
  return base + bonus;
}

export function scaleBeats(film: Film, duration: number): Beat[] {
  const s = duration > 0.8 ? duration / film.chart : 1;
  return film.beats.map((beat) => ({
    ...beat,
    at: beat.at * s,
    win: Math.min(Math.max(beat.win * Math.min(s, 1.35), 0.55), 2.1),
    holdMs: beat.holdMs ? Math.round(beat.holdMs * Math.min(Math.max(s, 0.75), 1.4)) : 0,
  }));
}

export function prepareBeats(film: Film, duration: number, seed: number, original = false): Beat[] {
  if (film.hazards && !original) {
    return buildCanyonChart(duration > 12 ? duration : film.chart, seed);
  }
  return placeSpots(scaleBeats(film, duration), seed);
}

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function spotOf(beat: Beat): Spot {
  return beat.spot ?? beat.relic ?? { x: 0.5, y: 0.5 };
}

/** Scatter hit marks across the picture. Relics keep authored positions. */
export function placeSpots(beats: Beat[], seed: number): Beat[] {
  const rand = mulberry32(seed || 1);
  const used: Spot[] = [];
  return beats.map((beat) => {
    if (beat.spot || beat.relic) {
      const spot = beat.spot ?? beat.relic!;
      used.push(spot);
      return { ...beat, spot };
    }
    let x = 0.5;
    let y = 0.5;
    for (let n = 0; n < 16; n++) {
      if (beat.kind === "swipe") {
        x = beat.lane === "l" ? 0.18 + rand() * 0.3 : 0.52 + rand() * 0.3;
        y = used.length % 2 === 0 ? 0.3 + rand() * 0.22 : 0.54 + rand() * 0.2;
      } else {
        x = 0.16 + rand() * 0.68;
        y = 0.26 + rand() * 0.52;
      }
      if (!used.some((u) => (u.x - x) ** 2 + (u.y - y) ** 2 < 0.05)) break;
    }
    const spot = { x, y };
    used.push(spot);
    if (used.length > 4) used.shift();
    return { ...beat, spot };
  });
}
