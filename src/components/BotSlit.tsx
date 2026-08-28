import { useEffect, useState } from "react";
import {
  connectBot,
  fetchBotSession,
  setBotSession,
  type SessionPayload,
} from "@/game/bot-session";

const TICK_MS = 2000;
const EMPTY: SessionPayload = { session: null, den: null, landables: [] };

function guestLandable(payload: SessionPayload) {
  return payload.landables.find((l) => l.landable && !l.owned) ?? null;
}

function actionLine(payload: SessionPayload): string {
  const session = payload.session;
  if (!session) return "idle";
  if (session.activity) return session.activity;
  if (session.mode === "travel") {
    const land = payload.landables.find((l) => l.artifact_id === session.current_artifact_id);
    return land ? `visiting ${land.name}` : "traveling";
  }
  return payload.den ? `staying in ${payload.den.name}` : "staying in Pack HQ";
}

function travelLabel(name: string) {
  return name === "Core Heart" ? "Walk the Circuit" : name;
}

/** GROK_BOT_SLIT — live pane on the Citadel door. Real /api/bot session. Not a takeover. */
export function BotSlit() {
  const [payload, setPayload] = useState<SessionPayload>(EMPTY);
  const [busy, setBusy] = useState(false);
  const session = payload.session;
  const guest = Boolean(session && session.mode === "travel");
  const landable = guestLandable(payload);
  const canTravel = Boolean(session && session.mode === "stay" && landable);

  useEffect(() => {
    let stop = false;
    const tick = () => {
      void fetchBotSession()
        .then((next) => {
          if (!stop) setPayload(next);
        })
        .catch(() => {});
    };
    tick();
    const id = window.setInterval(tick, TICK_MS);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, []);

  async function onConnect() {
    setBusy(true);
    try {
      const next = await connectBot();
      if (next.oauth_url) {
        window.location.assign(next.oauth_url);
        return;
      }
      if (!next.error) setPayload(next);
    } finally {
      setBusy(false);
    }
  }

  async function onTravel() {
    if (!landable) return;
    const next = await setBotSession("travel", landable.artifact_id);
    if (!next.error) setPayload(next);
  }

  return (
    <aside
      className="citadel-slit"
      data-grok-bot-slit
      data-mode={session ? session.mode : "off"}
      data-guest={guest ? "true" : undefined}
      aria-label="Grok Bot"
    >
      {!session ? (
        <>
          <span className="citadel-slit-who">Grok Bot</span>
          <button type="button" className="citadel-slit-go" disabled={busy} onClick={() => void onConnect()}>
            {busy ? "…" : "Connect"}
          </button>
        </>
      ) : (
        <>
          <span className="citadel-slit-dot" aria-hidden />
          <p className="citadel-slit-live">
            <strong>{session.bot_name || "Grok Bot"}</strong>
            <em>
              {actionLine(payload)}
              {guest ? <span className="citadel-slit-guest"> · guest</span> : null}
            </em>
          </p>
          {canTravel && landable ? (
            <button type="button" className="citadel-slit-travel" onClick={() => void onTravel()}>
              {travelLabel(landable.name)}
            </button>
          ) : null}
        </>
      )}
    </aside>
  );
}
