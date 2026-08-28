import type { SessionPayload } from "@/game/bot-session";
import { setBotSession } from "@/game/bot-session";

/** Stay / Travel chips in the existing HUD slit. Not a new screen. */
export function BotSlit({
  payload,
  onChange,
}: {
  payload: SessionPayload;
  onChange: (next: SessionPayload) => void;
}) {
  const session = payload.session;
  if (!session) return null;
  const guests = payload.landables.filter((l) => !l.owned);

  async function stay() {
    onChange(await setBotSession("stay", payload.den?.artifact_id));
  }

  async function travel(id?: string) {
    onChange(await setBotSession("travel", id));
  }

  return (
    <div className="bot-slit" aria-label="Grok Bot stay or travel">
      <button
        type="button"
        className="hud-slim-textbtn"
        data-on={session.mode === "stay" ? "true" : undefined}
        onClick={() => void stay()}
      >
        Stay
      </button>
      {guests.slice(0, 5).map((land) => (
        <button
          key={land.artifact_id}
          type="button"
          className="hud-slim-textbtn"
          data-on={session.mode === "travel" && session.current_artifact_id === land.artifact_id ? "true" : undefined}
          onClick={() => void travel(land.artifact_id)}
        >
          {land.name}
        </button>
      ))}
    </div>
  );
}
