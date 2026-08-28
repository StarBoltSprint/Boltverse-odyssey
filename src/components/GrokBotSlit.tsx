import { useEffect, useState } from "react";
import {
  connect,
  nearestLandable,
  readPresence,
  refreshPresence,
  travel,
  type BotPresence,
} from "@/game/bot-presence";

const TICK_MS = 2000;

function actionLine(row: BotPresence): string {
  if (row.mode === "traveling") return "traveling";
  if (row.mode === "visiting") return `visiting ${row.artifactTitle}`;
  if (row.mode === "stay") return `staying in ${row.artifactTitle || "Pack HQ"}`;
  return "idle";
}

/** GROK_BOT_SLIT — live pane on the Citadel door. Not a takeover. */
export function GrokBotSlit() {
  const [row, setRow] = useState<BotPresence>(() => readPresence());
  const [busy, setBusy] = useState(false);
  const landable = nearestLandable();
  const guest = row.connected && !row.owned && (row.mode === "visiting" || row.mode === "traveling");
  const canTravel = row.connected && (row.mode === "stay" || row.mode === "idle") && !!landable;

  useEffect(() => {
    let stop = false;
    const tick = () => {
      void refreshPresence()
        .then((next) => {
          if (!stop) setRow(next);
        })
        .catch(() => {
          if (!stop) setRow(readPresence());
        });
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
      setRow(await connect());
    } finally {
      setBusy(false);
    }
  }

  function onTravel() {
    if (!landable) return;
    setRow(travel(landable.id));
    window.setTimeout(() => setRow(readPresence()), 700);
  }

  return (
    <aside
      className="citadel-slit"
      data-grok-bot-slit
      data-mode={row.connected ? row.mode : "off"}
      data-guest={guest ? "true" : undefined}
      aria-label="Grok Bot"
    >
      {!row.connected ? (
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
            <strong>{row.botName || "Grok Bot"}</strong>
            <em>
              {actionLine(row)}
              {guest ? <span className="citadel-slit-guest"> · guest</span> : null}
            </em>
          </p>
          {canTravel ? (
            <button type="button" className="citadel-slit-travel" onClick={onTravel}>
              Walk the Circuit
            </button>
          ) : null}
        </>
      )}
    </aside>
  );
}
