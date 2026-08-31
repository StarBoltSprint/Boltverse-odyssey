import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { SeedRelic } from "@/game/seeds";

const FILE = join(process.cwd(), "data", "relics.json");

export async function readRelicFile(): Promise<SeedRelic[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const rows = JSON.parse(raw) as SeedRelic[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

export async function writeRelicFile(rows: SeedRelic[]): Promise<void> {
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(FILE, JSON.stringify(rows, null, 2));
}

export function mergeRelics(a: SeedRelic[], b: SeedRelic[]): SeedRelic[] {
  const map = new Map<string, SeedRelic>();
  for (const row of [...a, ...b]) {
    if (!row?.href || !row?.id) continue;
    const prev = map.get(row.href);
    if (!prev || (row.plays ?? 0) >= (prev.plays ?? 0)) map.set(row.href, row);
  }
  return [...map.values()].sort((x, y) => String(y.created_at ?? "").localeCompare(String(x.created_at ?? "")));
}
