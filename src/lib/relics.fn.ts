import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { idFromHref, parseGrokSeed, type SeedRelic } from "@/game/seeds";

export const listRelics = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<SeedRelic>`select id, href from relics order by created_at desc limit 48`;
});

export const bindRelic = createServerFn({ method: "POST" })
  .validator((href: string) => href)
  .handler(async ({ data }) => {
    const seed = parseGrokSeed(data);
    if (!seed) throw new Error("The kiln only takes a grok.me seed.");
    const sql = await getSql();
    const id = idFromHref(seed.href);
    await sql`
      insert into relics (id, href) values (${id}, ${seed.href})
      on conflict (href) do nothing
    `;
    return { id, href: seed.href } satisfies SeedRelic;
  });
