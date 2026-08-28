import { getBearerToken } from "@/lib/auth/client";
import type { Landable, SessionPayload } from "@/lib/bot/types";

export type { Landable, SessionPayload };

async function botFetch(init: RequestInit & { op?: string } = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getBearerToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  return fetch("/api/bot", { ...init, headers, credentials: "include" });
}

async function readPayload(res: Response): Promise<SessionPayload & { error?: string }> {
  try {
    return (await res.json()) as SessionPayload & { error?: string };
  } catch {
    return { session: null, den: null, landables: [], error: "Could not read Grok Bot session." };
  }
}

/** One-tap connect. Never send an API key. */
export async function connectBot(): Promise<SessionPayload & { error?: string }> {
  const res = await botFetch({
    method: "POST",
    body: JSON.stringify({ op: "connect" }),
  });
  const body = await readPayload(res);
  if (!res.ok) return { ...body, error: body.error || "Connect failed." };
  return body;
}

export async function fetchBotSession(): Promise<SessionPayload> {
  const res = await botFetch({ method: "GET" });
  if (!res.ok) return { session: null, den: null, landables: [] };
  return readPayload(res);
}

/** One call flips stay|travel and may land on a landable. */
export async function setBotSession(
  mode: "stay" | "travel",
  artifactId?: string,
): Promise<SessionPayload & { error?: string }> {
  const res = await botFetch({
    method: "POST",
    body: JSON.stringify({ op: "session", mode, ...(artifactId ? { artifact_id: artifactId } : {}) }),
  });
  const body = await readPayload(res);
  if (!res.ok) return { ...body, error: body.error || "Could not move the bot." };
  return body;
}

export async function disconnectBot(): Promise<{ ok: boolean; error?: string }> {
  const res = await botFetch({
    method: "POST",
    body: JSON.stringify({ op: "disconnect" }),
  });
  if (!res.ok) {
    const body = await readPayload(res);
    return { ok: false, error: body.error || "Disconnect failed." };
  }
  return { ok: true };
}
