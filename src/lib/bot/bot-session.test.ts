import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rejectApiKeyPayload, writeGuard, presenceGuard, mintArtifactId, forgerSlug } from "./rules.ts";
import { createMemoryStore, SEED_VESSELS } from "./store.ts";
import { createBotService, hashToken } from "./service.ts";

function ids() {
  let n = 0;
  return {
    id: () => `id${++n}`,
    hash: () => `h${n + 1}`,
    token: () => `tok${++n}`,
  };
}

function service() {
  return createBotService(createMemoryStore(SEED_VESSELS), { ids: ids() });
}

describe("connect never accepts an API key", () => {
  it("rejects xai_api_key and api_key fields", async () => {
    const bot = service();
    const a = await bot.connect("dev-user", { xai_api_key: "sk-secret" });
    assert.equal(a.ok, false);
    if (!a.ok) assert.equal(a.status, 400);
    const b = await bot.connect("dev-user", { api_key: "sk-secret" });
    assert.equal(b.ok, false);
    assert.ok(rejectApiKeyPayload({ grok_api_key: "x" }));
    assert.equal(rejectApiKeyPayload({}), null);
    assert.equal(rejectApiKeyPayload({ display_name: "ok" }), null);
  });

  it("creates a stay session on the player's own den", async () => {
    const bot = service();
    const out = await bot.connect("dev-user", {});
    assert.equal(out.ok, true);
    if (!out.ok) return;
    assert.ok(out.session);
    assert.equal(out.session?.mode, "stay");
    assert.equal(out.session?.owner_id, "dev-user");
    assert.equal(out.session?.bot_name, "Grok Bot");
    assert.ok(out.session?.current_artifact_id?.startsWith("artifact_dev-user_"));
    assert.equal(out.den?.artifact_id, out.session?.current_artifact_id);
    assert.ok(out.token);
    assert.equal(out.token && hashToken(out.token).length, 64);
    assert.ok(out.landables.some((l) => l.artifact_id === "core-heart" && !l.owned));
  });
});

describe("stay / travel presence and writes", () => {
  it("stay cannot presence on a foreign landable", async () => {
    const bot = service();
    await bot.connect("dev-user", {});
    const stay = await bot.setSession("dev-user", { mode: "stay", artifact_id: "core-heart" });
    assert.equal(stay.ok, false);
    if (!stay.ok) assert.equal(stay.status, 403);
  });

  it("travel can presence on a landable but cannot patch or seal it", async () => {
    const bot = service();
    await bot.connect("dev-user", {});
    const travel = await bot.setSession("dev-user", { mode: "travel", artifact_id: "core-heart" });
    assert.equal(travel.ok, true);
    if (!travel.ok) return;
    assert.equal(travel.session?.mode, "travel");
    assert.equal(travel.session?.current_artifact_id, "core-heart");

    const iterate = await bot.forge("dev-user", { op: "iterate", artifact_id: "core-heart" });
    assert.equal(iterate.ok, false);
    if (!iterate.ok) assert.equal(iterate.status, 403);

    const seal = await bot.forge("dev-user", { op: "seal", artifact_id: "core-heart" });
    assert.equal(seal.ok, false);
    if (!seal.ok) assert.equal(seal.status, 403);
  });

  it("another player's artifact write is 403", async () => {
    const store = createMemoryStore(SEED_VESSELS);
    const bot = createBotService(store, { ids: ids() });
    await bot.connect("alice", {});
    await store.insertVessel({
      vessel_id: "artifact_bob_ffff",
      owner_id: "bob",
      landable: true,
      status: "sealed",
      display_name: "Bob den",
    });
    const patch = await bot.forge("alice", { op: "iterate", artifact_id: "artifact_bob_ffff" });
    assert.equal(patch.ok, false);
    if (!patch.ok) assert.equal(patch.status, 403);
  });

  it("stay can write the den they are inside", async () => {
    const bot = service();
    const connected = await bot.connect("dev-user", {});
    assert.ok(connected.ok && connected.session);
    if (!connected.ok || !connected.session) return;
    const den = connected.session.current_artifact_id!;
    const iterate = await bot.forge("dev-user", { op: "iterate", artifact_id: den });
    assert.equal(iterate.ok, true);
  });

  it("new claims must propose before seal", async () => {
    const bot = service();
    await bot.connect("dev-user", {});
    await bot.setSession("dev-user", { mode: "travel", artifact_id: "core-heart" });
    const id = mintArtifactId(forgerSlug("dev-user"), "claim1");
    const sealFirst = await bot.forge("dev-user", { op: "seal", artifact_id: id });
    assert.equal(sealFirst.ok, false);
    const proposed = await bot.forge("dev-user", { op: "propose", artifact_id: id, wish: "A quiet den" });
    assert.equal(proposed.ok, true);
    if (!proposed.ok) return;
    assert.equal(proposed.status, "proposed");
    assert.equal(proposed.owner_id, "dev-user");
    const sealed = await bot.forge("dev-user", { op: "seal", artifact_id: id });
    assert.equal(sealed.ok, true);
    if (!sealed.ok) return;
    assert.equal(sealed.status, "sealed");
  });
});

describe("revoke invalidates the session", () => {
  it("GET session is empty after disconnect", async () => {
    const bot = service();
    await bot.connect("dev-user", {});
    const cut = await bot.disconnect("dev-user");
    assert.equal(cut.ok, true);
    const after = await bot.session("dev-user");
    assert.equal(after.ok, true);
    if (!after.ok) return;
    assert.equal(after.session, null);
    const write = await bot.forge("dev-user", { op: "iterate", artifact_id: "core-heart" });
    assert.equal(write.ok, false);
    if (!write.ok) assert.equal(write.status, 401);
  });
});

describe("ownership helpers", () => {
  it("seed vessels without owner_id are not writable", () => {
    const seed = SEED_VESSELS[0];
    const gate = writeGuard("travel", seed, "dev-user", "core-heart");
    assert.equal(gate.ok, false);
    const stay = presenceGuard("stay", seed, "dev-user");
    assert.equal(stay.ok, false);
    const travel = presenceGuard("travel", seed, "dev-user");
    assert.equal(travel.ok, true);
  });

  it("mints Decree #601 ids", () => {
    assert.equal(mintArtifactId("dev-user", "ab12"), "artifact_dev-user_ab12");
    assert.equal(forgerSlug("Dev User!"), "dev-user");
  });
});
