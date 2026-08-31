import { useEffect, useRef, useState, type FormEvent } from "react";
import { Pencil, Send, X } from "lucide-react";
import { isBotOnCircuit, wantsGrow } from "@/game/bot-civic";
import { doorOnLand, parseLandCode, setDoorOnLand } from "@/game/land";
import { DOOR_TEMPLATE_URL } from "@/lib/bot/door-template";
import {
  fetchBotSession,
  sendBotChat,
  type SessionPayload,
} from "@/game/bot-session";

const EMPTY: SessionPayload = {
  session: null,
  den: null,
  landables: [],
  bots: [],
  chat: [],
  door_template_url: null,
};

type Props = {
  playing: boolean;
  open: boolean;
  onOpen: (v: boolean) => void;
  onLanded: (on: boolean, name: string) => void;
  onWork: (text: string) => void;
  onTeach: (text: string) => void;
  onHall?: () => void;
  host: boolean;
  landId: string;
  island: string;
  mine: string;
  skills: string[];
  onVisit: (code: string) => void;
  onRename: (name: string) => boolean;
};

export function CircuitBot({
  playing,
  open,
  onOpen,
  onLanded,
  onWork,
  onTeach,
  onHall,
  host,
  landId,
  island,
  mine,
  skills,
  onVisit,
  onRename,
}: Props) {
  const [payload, setPayload] = useState<SessionPayload>(EMPTY);
  const [draft, setDraft] = useState("");
  const [visit, setVisit] = useState("");
  const [rename, setRename] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [knocked, setKnocked] = useState(false);
  const [witness, setWitness] = useState(doorOnLand);
  const endRef = useRef<HTMLLIElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const session = payload.session;
  const liveBot = isBotOnCircuit(session);
  const onLand = liveBot || witness;
  const lines = payload.chat ?? [];

  useEffect(() => {
    let stop = false;
    const tick = () => {
      void fetchBotSession()
        .then((next) => {
          if (stop) return;
          setPayload(next);
        })
        .catch(() => {});
    };
    tick();
    const id = window.setInterval(tick, 1200);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!playing || !host) return;
    if (doorOnLand()) {
      if (!witness) setWitness(true);
      return;
    }
    setDoorOnLand(true);
    setWitness(true);
  }, [playing, host, witness]);

  useEffect(() => {
    onLanded(Boolean(playing && onLand), "Citadel Door");
  }, [playing, onLand, onLanded]);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "end" });
  }, [open, lines.length]);

  useEffect(() => {
    if (editing) nameRef.current?.focus();
  }, [editing]);

  async function onSend(ev: FormEvent) {
    ev.preventDefault();
    const text = (inputRef.current?.value || draft).trim();
    if (!text || busy) return;
    setBusy(true);
    setErr("");
    try {
      const next = await sendBotChat(text);
      if (next.error) {
        setErr(next.error);
        return;
      }
      setPayload(next);
      setDraft("");
      inputRef.current?.focus();
      if (host && onLand && (next.civic || wantsGrow(text))) {
        onWork(text);
      } else if (host && onLand) {
        onTeach(text);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not send.");
    } finally {
      setBusy(false);
    }
  }

  function goVisit(ev: FormEvent) {
    ev.preventDefault();
    const code = parseLandCode(visit);
    if (!code) {
      setErr("Need a land code.");
      return;
    }
    onVisit(code);
    setVisit("");
  }

  function saveName(ev: FormEvent) {
    ev.preventDefault();
    const next = (nameRef.current?.value || rename).trim();
    if (!onRename(next)) {
      setErr("Need a name. Two letters or more.");
      return;
    }
    setEditing(false);
    setErr("");
  }

  if (!playing) return null;

  const status = host
    ? onLand
      ? "Citadel Door is on this land. Hold the Spire."
      : "Knock Citadel Door. Then Howl."
    : "Guest — you cannot grow this crucible";

  return (
    <div
      className="circuit-bot"
      data-open={open ? "true" : undefined}
      data-on={onLand ? "true" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpen(false);
      }}
    >
      {open ? (
        <div className="circuit-bot-pane" role="dialog" aria-label={island}>
          <header className="circuit-bot-head">
            {editing && host ? (
              <form className="circuit-bot-rename" onSubmit={saveName}>
                <input
                  ref={nameRef}
                  type="text"
                  maxLength={24}
                  defaultValue={island}
                  aria-label="Island name"
                  onChange={(e) => setRename(e.target.value)}
                />
                <button type="submit">Save</button>
              </form>
            ) : (
              <p>
                <strong>{island || "Beginning"}</strong>
                <em>
                  {landId}
                  {host ? " · yours" : " · guest"}
                </em>
              </p>
            )}
            <div className="circuit-bot-tools">
              {host && !editing ? (
                <button
                  type="button"
                  className="circuit-bot-x"
                  aria-label="Rename island"
                  onClick={() => {
                    setRename(island);
                    setEditing(true);
                  }}
                >
                  <Pencil size={16} strokeWidth={2.2} />
                </button>
              ) : null}
              {onHall ? (
                <button type="button" className="circuit-bot-hall" onClick={onHall}>
                  Hall
                </button>
              ) : null}
              <button type="button" className="circuit-bot-x" aria-label="Close" onClick={() => onOpen(false)}>
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>
          </header>

          <p className="circuit-bot-status">{status}</p>
          {err ? (
            <p className="circuit-bot-err" role="alert">
              {err}
            </p>
          ) : null}

          {host && skills.length ? (
            <ul className="circuit-bot-skill-list">
              {skills.slice(0, 4).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : null}

          {!host ? (
            <div className="circuit-bot-connect">
              <p>Their island. Howl with them. Grow yours at home.</p>
              <button type="button" onClick={() => onVisit(mine)}>
                Your island
              </button>
            </div>
          ) : !onLand ? (
            <div className="circuit-bot-connect">
              <p>
                Knock Citadel Door onto {island}. Then hold the Spire. Howl. It grows the den. You do not leave the land.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDoorOnLand(true);
                  setWitness(true);
                  setKnocked(true);
                  setErr("");
                }}
              >
                Knock · Citadel Door
              </button>
              <a
                className="circuit-bot-paper"
                href={DOOR_TEMPLATE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Real Door on x.ai
              </a>
            </div>
          ) : (
            <>
              <p className="circuit-bot-status">Hold the Spire. Howl. Citadel Door grows the den. Teach a skill here if you want.</p>
              <ol className="circuit-bot-lines">
                {lines.slice(-8).map((line, i) => (
                  <li key={`${line.at}-${i}`} data-from={line.from}>
                    <b>{line.from === "player" ? "You" : "Door"}</b>
                    <span>{line.text}</span>
                  </li>
                ))}
                <li ref={endRef} aria-hidden />
              </ol>
              <form className="circuit-bot-form" onSubmit={(ev) => void onSend(ev)}>
                <input
                  ref={inputRef}
                  type="text"
                  name="line"
                  maxLength={240}
                  autoComplete="off"
                  enterKeyHint="send"
                  placeholder="Teach a skill"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" disabled={busy || !draft.trim()} aria-label="Send">
                  <Send size={16} strokeWidth={2.2} />
                </button>
              </form>
            </>
          )}

          <form className="circuit-bot-visit" onSubmit={goVisit}>
            <input
              type="text"
              name="land"
              maxLength={8}
              autoComplete="off"
              placeholder="Visit code"
              value={visit}
              onChange={(e) => setVisit(e.target.value)}
              aria-label="Visit a land"
            />
            <button type="submit" disabled={!parseLandCode(visit)}>
              Visit
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
