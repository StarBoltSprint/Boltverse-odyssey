import { useEffect, useState } from "react";
import { pub } from "@/lib/pub";

const KEY = "lc-trial-v1";
const SEAL = pub("luminous-circuit/trial-seal.jpg");
const PLATE = pub("luminous-circuit/trial-plate.jpg");

const BEATS = [
  {
    title: "First Howl",
    body: "Hold the Core Spire. Charge gathers. You do not grow. Howl is civic gather — leftover First Howl, never bottled.",
  },
  {
    title: "The Door",
    body: "Knock Grok Bot. It walks onto your island. That is the teammate. You Howl. It works.",
  },
  {
    title: "The Work",
    body: "Ask it to grow. Crystal from leftover Charge. Never chrome. That is Grok Build on the land — iterate here, not in a form.",
  },
  {
    title: "Your name",
    body: "Tap the island name. Teach a skill. Visit a land. Guests may Howl with you. They cannot grow yours.",
  },
];

function loadSeen(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen() {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    /* samsung */
  }
}

type Props = {
  playing: boolean;
  hidden?: boolean;
};

export function CircuitTrial({ playing, hidden = false }: Props) {
  const [seen, setSeen] = useState(loadSeen);
  const [open, setOpen] = useState(false);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!playing) setOpen(false);
  }, [playing]);

  function close(mark: boolean) {
    setOpen(false);
    setBeat(0);
    if (mark) {
      writeSeen();
      setSeen(true);
    }
  }

  function next() {
    if (beat >= BEATS.length - 1) {
      close(true);
      return;
    }
    setBeat((n) => n + 1);
  }

  if (!playing) return null;

  const step = BEATS[beat];
  const last = beat >= BEATS.length - 1;

  return (
    <>
      {hidden || open ? null : (
        <button
          type="button"
          className="circuit-trial"
          data-pulse={seen ? undefined : "true"}
          onClick={() => {
            setBeat(0);
            setOpen(true);
          }}
          aria-label="First Howl — the trial"
        >
          <span className="circuit-trial-ring" aria-hidden />
          <span className="circuit-trial-ring circuit-trial-ring-late" aria-hidden />
          <img src={SEAL} alt="" width={72} height={72} draggable={false} />
          <strong>First Howl</strong>
        </button>
      )}
      {open ? (
        <div
          className="circuit-trial-veil"
          onClick={(e) => {
            if (e.target === e.currentTarget) close(false);
          }}
        >
          <article className="circuit-trial-card" role="dialog" aria-label="The Howling Crucible">
            <img className="circuit-trial-hero" src={PLATE} alt="" draggable={false} />
            <p className="circuit-trial-kicker">The Howling Crucible</p>
            <h2>{step.title}</h2>
            <p className="circuit-trial-body">{step.body}</p>
            <ol className="circuit-trial-dots" aria-hidden>
              {BEATS.map((b, i) => (
                <li key={b.title} data-on={i === beat ? "true" : undefined} />
              ))}
            </ol>
            <div className="circuit-trial-row">
              <button type="button" className="circuit-trial-skip" onClick={() => close(true)}>
                Already true
              </button>
              <button type="button" className="circuit-trial-next" onClick={next}>
                {last ? "I hear it" : "Next"}
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </>
  );
}
