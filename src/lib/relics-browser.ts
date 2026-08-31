import type { SeedRelic } from "@/game/seeds";

const CACHE = "lc-relics";

export function readRelicCache(): SeedRelic[] {
  try {
    const rows = JSON.parse(localStorage.getItem(CACHE) || "[]") as SeedRelic[];
    return Array.isArray(rows) ? rows.filter((r) => r?.id && r?.href) : [];
  } catch {
    return [];
  }
}

export function writeRelicCache(rows: SeedRelic[]) {
  try {
    localStorage.setItem(CACHE, JSON.stringify(rows.slice(0, 48)));
  } catch {
    /* private mode */
  }
}

export function rememberRelic(row: SeedRelic): SeedRelic[] {
  const next = [row, ...readRelicCache().filter((r) => r.href !== row.href && r.id !== row.id)].slice(0, 48);
  writeRelicCache(next);
  return next;
}

export async function pullRelics(): Promise<SeedRelic[]> {
  const cached = readRelicCache();
  try {
    const res = await fetch("/api/relics", { credentials: "same-origin", cache: "no-store" });
    const body = (await res.json()) as SeedRelic[];
    if (!res.ok || !Array.isArray(body)) return cached;
    const rows = body.filter((r) => r?.id && r?.href);
    writeRelicCache(rows);
    return rows;
  } catch {
    return cached;
  }
}
