import { MAX_REMIX, sanitizeList, type ForgeTheme, type RemixWorld } from "./forged";

const KEY = "bv-forge-v1";
const MAX_RELIC = 12;

export type ForgeRelic = {
  id: string;
  name: string;
  line: string;
  theme: ForgeTheme;
  maker: "bot" | "hand";
  at: number;
};

export type ForgeSave = {
  remixes: RemixWorld[];
  engineWishes: string[];
  artifacts: ForgeRelic[];
  versions: ForgeRelic[];
};

function empty(): ForgeSave {
  return { remixes: [], engineWishes: [], artifacts: [], versions: [] };
}

function clipRelic(raw: unknown): ForgeRelic | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const name = String(o.name ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 28);
  if (name.length < 2) return null;
  const id =
    String(o.id ?? "")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 40) || `relic-${Math.random().toString(36).slice(2, 8)}`;
  const theme = (["crystal", "ember", "tide", "void", "grove", "storm"] as ForgeTheme[]).includes(o.theme as ForgeTheme)
    ? (o.theme as ForgeTheme)
    : "crystal";
  return {
    id,
    name,
    line: String(o.line ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 90),
    theme,
    maker: o.maker === "bot" ? "bot" : "hand",
    at: Number(o.at) || Date.now(),
  };
}

function listRelics(raw: unknown): ForgeRelic[] {
  if (!Array.isArray(raw)) return [];
  const out: ForgeRelic[] = [];
  const seen = new Set<string>();
  for (const row of raw) {
    const r = clipRelic(row);
    if (!r || seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(r);
    if (out.length >= MAX_RELIC) break;
  }
  return out;
}

export function loadForge(): ForgeSave {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<ForgeSave>;
    return {
      remixes: sanitizeList(parsed.remixes),
      engineWishes: Array.isArray(parsed.engineWishes)
        ? parsed.engineWishes.map((w) => String(w).slice(0, 240)).filter(Boolean).slice(-12)
        : [],
      artifacts: listRelics(parsed.artifacts),
      versions: listRelics(parsed.versions),
    };
  } catch {
    return empty();
  }
}

export function writeForge(data: ForgeSave) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        remixes: data.remixes.slice(0, MAX_REMIX),
        engineWishes: data.engineWishes.slice(-12),
        artifacts: data.artifacts.slice(0, MAX_RELIC),
        versions: data.versions.slice(0, MAX_RELIC),
      }),
    );
  } catch {
    /* private mode */
  }
}

export { MAX_RELIC };
