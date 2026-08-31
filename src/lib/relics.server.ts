import { getSql } from "@/lib/db";
import { idFromHref, parseGrokSeed, type SeedRelic } from "@/game/seeds";
import { mergeRelics, readRelicFile, writeRelicFile } from "@/lib/relics.store";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function iso(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();
  const t = Date.parse(String(value));
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

function asRelic(row: Record<string, unknown>): SeedRelic {
  return {
    id: String(row.id),
    href: String(row.href),
    plays: Number(row.plays ?? 0),
    created_at: iso(row.created_at) ?? undefined,
    last_land: iso(row.last_land),
  };
}

export async function handleRelics(request: Request): Promise<Response> {
  try {
    const sql = await getSql();
    await sql.query(`
      create table if not exists relics (
        id text primary key,
        href text not null unique,
        plays integer not null default 0,
        last_land timestamptz,
        created_at timestamptz not null default now()
      )
    `);
    await sql.query(`alter table relics add column if not exists plays integer not null default 0`);
    await sql.query(`alter table relics add column if not exists last_land timestamptz`);

    const fileRows = (await readRelicFile()).map((r) => asRelic(r as unknown as Record<string, unknown>));
    if (request.method === "GET") {
      let dbRows: SeedRelic[] = [];
      try {
        dbRows = (await sql.query("select id, href, plays, created_at, last_land from relics order by created_at desc limit 48")).map(asRelic);
      } catch (err) {
        console.error("[relics] list", err);
      }
      const rows = mergeRelics(dbRows, fileRows).slice(0, 48);
      if (fileRows.length) {
        for (const r of rows) {
          try {
            await sql.query(
              "insert into relics (id, href, plays, last_land) values ($1, $2, $3, $4) on conflict (href) do nothing",
              [r.id, r.href, r.plays ?? 0, iso(r.last_land)],
            );
          } catch (err) {
            console.error("[relics] restore", err);
          }
        }
      }
      return json(rows);
    }
    if (request.method !== "POST") return json({ error: "POST only" }, 405);
    let body: { href?: string; id?: string; play?: boolean } = {};
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return json({ error: "Bad seed." }, 400);
    }
    if (body.play && body.id) {
      try {
        await sql.query(
          "update relics set plays = plays + 1, last_land = now() where id = $1",
          [body.id],
        );
      } catch (err) {
        console.error("[relics] play", err);
      }
      const found = (await sql.query("select id, href, plays, created_at, last_land from relics where id = $1 limit 1", [body.id]).catch(() => [])).map(asRelic)[0];
      const next = found ?? fileRows.find((r) => r.id === body.id);
      if (next) {
        if (!found) {
          next.plays = (next.plays ?? 0) + 1;
          next.last_land = new Date().toISOString();
        }
        await writeRelicFile(mergeRelics(fileRows, [asRelic(next as unknown as Record<string, unknown>)]));
      }
      return json(next ?? { error: "unknown" });
    }
    const seed = parseGrokSeed(String(body.href ?? ""));
    if (!seed) return json({ error: "The kiln only takes a grok.me seed." }, 400);
    const id = idFromHref(seed.href);
    await sql.query(
      "insert into relics (id, href) values ($1, $2) on conflict (href) do nothing",
      [id, seed.href],
    );
    const bound: SeedRelic = {
      id,
      href: seed.href,
      plays: 0,
      created_at: new Date().toISOString(),
      last_land: null,
    };
    await writeRelicFile(mergeRelics(fileRows, [bound]));
    return json(bound);
  } catch (err) {
    const message = err instanceof Error ? err.message : "kiln_failed";
    console.error("[relics]", err);
    try {
      const fileRows = await readRelicFile();
      if (request.method === "GET") return json(fileRows);
    } catch {
      /* ignore */
    }
    return json({ error: message }, 500);
  }
}
