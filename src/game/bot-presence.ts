/** GROK_BOT_SLIT — swap-ready bot presence. Backend can replace this stub. */
import { ARTIFACTS } from "./artifacts";
import { fetchLandBots, readPair, startPair } from "./bot-pair";

export type BotMode = "idle" | "stay" | "traveling" | "visiting";

export type BotPresence = {
  connected: boolean;
  botName: string;
  mode: BotMode;
  artifactId: string | null;
  artifactTitle: string;
  owned: boolean;
};

export type Landable = { id: string; title: string };

const STORE = "lc-grok-bot-presence";
const HOME_TITLE = "Pack HQ";
const POLL_TRAVEL_MS = 640;

const EMPTY: BotPresence = {
  connected: false,
  botName: "",
  mode: "idle",
  artifactId: null,
  artifactTitle: "",
  owned: false,
};

let travelTimer = 0;

export function listLandables(): Landable[] {
  return ARTIFACTS.filter((a) => a.open).map((a) => ({ id: a.id, title: a.name }));
}

export function nearestLandable(): Landable | null {
  return listLandables()[0] ?? null;
}

export function readPresence(): BotPresence {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return { ...EMPTY };
    const row = JSON.parse(raw) as Partial<BotPresence>;
    return {
      connected: Boolean(row.connected),
      botName: String(row.botName || ""),
      mode: parseMode(row.mode),
      artifactId: row.artifactId ? String(row.artifactId) : null,
      artifactTitle: String(row.artifactTitle || ""),
      owned: Boolean(row.owned),
    };
  } catch {
    return { ...EMPTY };
  }
}

export function writePresence(next: BotPresence): BotPresence {
  try {
    localStorage.setItem(STORE, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  return next;
}

/** Home. Automatic — the slit never exposes a Stay control. */
export function stay(): BotPresence {
  const cur = readPresence();
  if (!cur.connected) return cur;
  return writePresence({
    ...cur,
    mode: "stay",
    artifactId: null,
    artifactTitle: HOME_TITLE,
    owned: true,
  });
}

export function travel(artifactId: string): BotPresence {
  const cur = readPresence();
  if (!cur.connected) return cur;
  const land = listLandables().find((l) => l.id === artifactId) ?? nearestLandable();
  if (!land) return cur;
  window.clearTimeout(travelTimer);
  const going = writePresence({
    ...cur,
    mode: "traveling",
    artifactId: land.id,
    artifactTitle: land.title,
    owned: false,
  });
  travelTimer = window.setTimeout(() => {
    const live = readPresence();
    if (!live.connected || live.mode !== "traveling") return;
    writePresence({
      ...live,
      mode: "visiting",
      artifactId: land.id,
      artifactTitle: land.title,
      owned: false,
    });
  }, POLL_TRAVEL_MS);
  return going;
}

/** Pair via existing Grok Bot flow. No API key. Stay is automatic once seated. */
export async function connect(): Promise<BotPresence> {
  let pair = readPair();
  if (!pair?.code) {
    try {
      pair = await startPair();
    } catch {
      /* stub still seats so the slit feels live */
    }
  }
  const name = pair?.botName?.trim() || "Grok Bot";
  return writePresence({
    connected: true,
    botName: name,
    mode: "stay",
    artifactId: null,
    artifactTitle: HOME_TITLE,
    owned: true,
  });
}

export async function refreshPresence(): Promise<BotPresence> {
  const cur = readPresence();
  if (!cur.connected) return cur;
  let name = cur.botName;
  const pair = readPair();
  if (pair?.botName?.trim()) name = pair.botName.trim();
  else {
    try {
      const roster = await fetchLandBots();
      if (roster[0]?.name) name = roster[0].name;
    } catch {
      /* roster optional */
    }
  }
  if (name === cur.botName) return cur;
  return writePresence({ ...cur, botName: name });
}

function parseMode(mode: unknown): BotMode {
  if (mode === "stay" || mode === "traveling" || mode === "visiting" || mode === "idle") return mode;
  return "idle";
}
