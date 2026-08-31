import type { BotSessionView } from "@/lib/bot/types";

const CIRCUIT_IDS = new Set(["core-heart", "luminous-circuit", "circuit", "howling-crucible", "crucible"]);
const RE_GROW = /\b(grow|raise|crystal|den|iterate|build|tend|join|name|work|densif|howl)\b/i;

export function isBotOnCircuit(session: BotSessionView | null | undefined): boolean {
  if (!session) return false;
  if (session.oauth === "stub") return false;
  if (session.mode !== "travel") return false;
  const id = String(session.current_artifact_id || "");
  return CIRCUIT_IDS.has(id) || id.includes("circuit") || id.includes("core-heart") || id.includes("crucible");
}

export function wantsGrow(text: string): boolean {
  return RE_GROW.test(text.trim());
}
