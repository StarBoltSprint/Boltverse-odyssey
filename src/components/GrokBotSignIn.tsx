import { useEffect, useState } from "react";
import { connectBot, fetchBotSession, type SessionPayload } from "@/game/bot-session";

/** One Connect tap. No API key, no wizard, no settings page. */
export function GrokBotSignIn({
  onClose,
  onSession,
}: {
  onClose: () => void;
  onSession?: (next: SessionPayload) => void;
}) {
  const [payload, setPayload] = useState<SessionPayload>({ session: null, den: null, landables: [] });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let stop = false;
    void fetchBotSession().then((next) => {
      if (stop) return;
      setPayload(next);
      if (next.session) onSession?.(next);
    });
    return () => {
      stop = true;
    };
  }, []);

  async function connect() {
    setBusy(true);
    setErr("");
    try {
      const next = await connectBot();
      if (next.error) {
        setErr(next.error);
        return;
      }
      if (next.oauth_url) {
        window.location.assign(next.oauth_url);
        return;
      }
      setPayload(next);
      onSession?.(next);
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Connect failed.");
    } finally {
      setBusy(false);
    }
  }

  const session = payload.session;

  return (
    <div className="pause-veil" role="dialog" aria-label="Connect Grok Bot">
      <div className="pause-sheet">
        <div className="panel w-[min(94%,26rem)] px-6 py-6 text-left">
          <h2 className="hud-title text-2xl">{session ? "Grok Bot" : "Connect Grok Bot"}</h2>
          <p className="mt-1 text-sm text-muted">
            Community Boltverse — not an official xAI or Grok product. One tap. No API key.
          </p>
          {err ? <p className="mt-3 text-sm text-danger">{err}</p> : null}
          {session ? (
            <p className="mt-4 text-sm text-accent">
              {session.bot_name} · {session.activity}
            </p>
          ) : null}
          <div className="mt-5 flex flex-col gap-2">
            {!session ? (
              <button
                type="button"
                className="grok-bot-btn"
                style={{ marginTop: 0, width: "100%" }}
                disabled={busy}
                onClick={() => void connect()}
              >
                {busy ? "Connecting…" : "Connect Grok Bot"}
              </button>
            ) : null}
            <button type="button" className="hud-chip h-11 rounded-lg bg-fg text-bg font-medium" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
