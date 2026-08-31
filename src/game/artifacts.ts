import { pub } from "@/lib/pub";

export type ArtifactId = "core-heart" | "shatter-veil" | "howl-sight";

export type SkyView = "relic" | "constellation";

export type ArtifactEnter = "circuit" | "slash" | "fps" | null;

export type Artifact = {
  id: ArtifactId;
  name: string;
  line: string;
  open: boolean;
  enter: ArtifactEnter;
  x: number;
  y: number;
  z: number;
  color: number;
  scale: number;
  cover: string;
  film?: string;
  maker: string;
  face: string;
  badge: string;
  ribbon: string;
  res: number;
  podium: boolean;
  hero?: boolean;
};

/** Player-worlds. The Howling Crucible is the first trial. Shatter Veil is the warrior slash. */
export const ARTIFACTS: Artifact[] = [
  {
    id: "core-heart",
    name: "The Howling Crucible",
    line: "Howl. Knock the Door. Crystal from leftover Charge.",
    open: true,
    enter: "circuit",
    x: 11.4,
    y: 1.4,
    z: 7.6,
    color: 0x4ec8e8,
    scale: 1.35,
    cover: pub("luminous-circuit/cover.jpg"),
    film: pub("citadel/world-crucible.mp4") + "?v=1",
    maker: "First Howl",
    face: pub("luminous-circuit/citizens/gold-crown.png"),
    badge: "Open",
    ribbon: "Crucible",
    res: 100,
    podium: true,
  },
  {
    id: "shatter-veil",
    name: "Shatter Veil",
    line: "War-hound of the kiln. Crystal never chrome.",
    open: true,
    enter: "slash",
    x: 6.2,
    y: 3.4,
    z: -8.8,
    color: 0xe07840,
    scale: 1.42,
    cover: pub("slash/cover-war.jpg"),
    film: pub("citadel/world-veil.mp4") + "?v=1",
    maker: "StarBoltSprint",
    face: pub("slash/portrait-war.jpg"),
    badge: "Open",
    ribbon: "Slash",
    res: 86,
    podium: true,
    hero: true,
  },
  {
    id: "howl-sight",
    name: "Howl Sight",
    line: "First person. StarBoltSprint takes the kiln.",
    open: true,
    enter: "fps",
    x: -4.6,
    y: 4.2,
    z: -12.4,
    color: 0x7ee8f2,
    scale: 1.38,
    cover: pub("slash/cover-fps.jpg"),
    film: pub("citadel/world-sight.mp4") + "?v=1",
    maker: "StarBoltSprint",
    face: pub("slash/portrait-war.jpg"),
    badge: "Open",
    ribbon: "Sight",
    res: 91,
    podium: true,
  },
];

export const PODIUM_ORDER: ArtifactId[] = ["core-heart", "shatter-veil", "howl-sight"];

export const ARTIFACT_THREADS: [ArtifactId, ArtifactId][] = [
  ["core-heart", "shatter-veil"],
  ["core-heart", "howl-sight"],
  ["shatter-veil", "howl-sight"],
];

export function artifactById(id: ArtifactId | null): Artifact | null {
  if (!id) return null;
  return ARTIFACTS.find((a) => a.id === id) ?? null;
}
