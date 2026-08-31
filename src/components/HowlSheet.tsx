import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { pub } from "@/lib/pub";
import {
  FORGE_THEMES,
  MAX_REMIX,
  MAX_WISH,
  sanitizeRemix,
  type ForgeTheme,
  type RemixBuilding,
  type RemixWorld,
} from "@/game/forged";
import { loadForge, writeForge, type ForgeRelic } from "@/game/forge-save";

type Path = "bot" | "hand";
type Work = "artifact" | "remix" | "version";
type Draft = {
  theme?: ForgeTheme;
  name?: string;
  line?: string;
  lore?: string;
  buildings: RemixBuilding[];
  log: string[];
};
type HandDen = { name: string; kind: string };

const DENS_KINDS = ["kiln", "den", "canal", "spire", "plaza", "dock"] as const;
const EMPTY_DENS: HandDen[] = [
  { name: "", kind: "kiln" },
  { name: "", kind: "den" },
  { name: "", kind: "canal" },
];

type Props = {
  onClose: () => void;
  onLand: () => void;
};

function titleFromHowl(howl: string, fallback: string) {
  const words = howl
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
  const name = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  return name.slice(0, 28) || fallback;
}

function themeFromHowl(howl: string): ForgeTheme {
  const s = howl.toLowerCase();
  if (/ember|fire|gold|kiln/.test(s)) return "ember";
  if (/tide|sea|dock|canal|west/.test(s)) return "tide";
  if (/void|night|dark/.test(s)) return "void";
  if (/grove|tree|green|orchard/.test(s)) return "grove";
  if (/storm|wind|sky/.test(s)) return "storm";
  return "crystal";
}

function ForgeStage({ src }: { src: string }) {
  return (
    <div className="forge-hall-stage" aria-hidden>
      <img className="forge-hall-art" src={src} alt="" />
      <div className="forge-hall-veil" />
    </div>
  );
}

function HallHead({
  kicker,
  title,
  sub,
  onClose,
}: {
  kicker: string;
  title: string;
  sub?: string;
  onClose: () => void;
}) {
  return (
    <header className="forge-hall-head">
      <button type="button" className="forge-hall-close" aria-label="Close" onClick={onClose}>
        <X strokeWidth={2.2} />
      </button>
      <p className="forge-hall-kicker">{kicker}</p>
      <h2 className="forge-hall-title">{title}</h2>
      {sub ? <p className="forge-hall-sub">{sub}</p> : null}
    </header>
  );
}

function Choice({ src, title, line, onClick }: { src: string; title: string; line: string; onClick: () => void }) {
  return (
    <button type="button" className="forge-choice" onClick={onClick}>
      <img src={src} alt="" />
      <span className="forge-choice-veil" />
      <span className="forge-choice-copy">
        <strong>{title}</strong>
        <em>{line}</em>
      </span>
    </button>
  );
}

export function HowlSheet({ onClose, onLand }: Props) {
  const bag = loadForge();
  const [path, setPath] = useState<Path | null>(null);
  const [work, setWork] = useState<Work | null>(null);
  const [wish, setWish] = useState("");
  const [phase, setPhase] = useState<"ask" | "build" | "done">("ask");
  const [draft, setDraft] = useState<Draft>({ buildings: [], log: [] });
  const [world, setWorld] = useState<RemixWorld | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [handName, setHandName] = useState("");
  const [handLine, setHandLine] = useState("");
  const [handTheme, setHandTheme] = useState<ForgeTheme>("crystal");
  const [handDens, setHandDens] = useState<HandDen[]>(EMPTY_DENS);
  const [handSealed, setHandSealed] = useState(false);
  const [relic, setRelic] = useState<ForgeRelic | null>(null);
  const full = bag.remixes.length >= MAX_REMIX;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.forgeHall = "true";
    return () => {
      delete root.dataset.forgeHall;
    };
  }, []);

  const stage = work
    ? pub(work === "artifact" ? "forge/artifact.jpg" : work === "version" ? "forge/version.jpg" : "forge/remix-strike.jpg")
    : path
      ? pub(path === "bot" ? "forge/bot.jpg" : "forge/hand.jpg")
      : pub("forge/kiln.jpg");

  function resetInner() {
    setError(null);
    setPhase("ask");
    setHandSealed(false);
    setRelic(null);
    setWorld(null);
    setWish("");
    setHandName("");
    setHandLine("");
  }

  function backToPath() {
    setWork(null);
    resetInner();
  }

  function backToPick() {
    setPath(null);
    setWork(null);
    resetInner();
  }

  async function strikeRemix() {
    const howl = wish.trim();
    if (howl.length < 4 || full) return;
    setError(null);
    setPhase("build");
    setDraft({ buildings: [], log: ["$ grok build remix --circuit"] });
    try {
      const res = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wish: howl }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "The anvil went cold." }));
        setError(String((err as { error?: string }).error || "The anvil went cold."));
        setPhase("ask");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let live: Draft = { buildings: [], log: ["$ grok build remix --circuit"] };
      let sealed: RemixWorld | null = null;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const chunks = buf.split("\n\n");
        buf = chunks.pop() ?? "";
        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith("data:")) continue;
          try {
            const ev = JSON.parse(line.slice(5).trim()) as {
              t?: string;
              v?: unknown;
              world?: RemixWorld;
            };
            if (ev.t === "error") {
              setError(String(ev.v || "The remix would not hold."));
              setPhase("ask");
              return;
            }
            if (ev.t === "world" && ev.world) {
              sealed = ev.world;
              live = {
                theme: ev.world.theme,
                name: ev.world.name,
                line: ev.world.line,
                lore: ev.world.lore,
                buildings: ev.world.buildings,
                log: ev.world.log,
              };
              setDraft(live);
              continue;
            }
            if (ev.t === "theme" && typeof ev.v === "string") live = { ...live, theme: ev.v as ForgeTheme };
            if (ev.t === "name" && typeof ev.v === "string") live = { ...live, name: ev.v };
            if (ev.t === "line" && typeof ev.v === "string") live = { ...live, line: ev.v };
            if (ev.t === "lore" && typeof ev.v === "string") live = { ...live, lore: ev.v };
            if (ev.t === "log" && typeof ev.v === "string") live = { ...live, log: [...live.log, ev.v].slice(-10) };
            if (ev.t === "building" && ev.v && typeof ev.v === "object") {
              const b = ev.v as RemixBuilding;
              if (live.buildings.length < 6) {
                live = {
                  ...live,
                  buildings: [
                    ...live.buildings,
                    { name: String(b.name || "Den"), kind: String(b.kind || "den"), line: String(b.line || "") },
                  ],
                };
              }
            }
            setDraft({ ...live, buildings: [...live.buildings], log: [...live.log] });
          } catch {
            /* skip */
          }
        }
      }
      if (!sealed) {
        setError("The remix would not hold.");
        setPhase("ask");
        return;
      }
      const next = loadForge();
      writeForge({ ...next, remixes: [sealed, ...next.remixes].slice(0, MAX_REMIX) });
      setWorld(sealed);
      setPhase("done");
    } catch {
      setError("The star core went quiet.");
      setPhase("ask");
    }
  }

  function sealRemixHand() {
    if (full) return;
    const sealed = sanitizeRemix(
      {
        name: handName,
        line: handLine,
        lore: handLine,
        theme: handTheme,
        buildings: handDens.map((d) => ({
          name: d.name.trim() || "Den",
          kind: d.kind,
          line: "Raised by hand.",
        })),
        log: ["$ forge --manual", "sealed by hand"],
      },
      handLine,
    );
    if (!sealed) {
      setError("Name the city.");
      return;
    }
    const next = loadForge();
    writeForge({ ...next, remixes: [sealed, ...next.remixes].slice(0, MAX_REMIX) });
    setWorld(sealed);
    setHandSealed(true);
    setError(null);
  }

  function sealRelic(kind: "artifact" | "version", maker: Path, name: string, line: string, theme: ForgeTheme) {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError(kind === "version" ? "Name the version." : "Name the relic.");
      return;
    }
    const made: ForgeRelic = {
      id: `${kind === "version" ? "ver" : "art"}-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12)}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmed.slice(0, 28),
      line: line.trim().slice(0, 90),
      theme,
      maker,
      at: Date.now(),
    };
    const next = loadForge();
    if (kind === "artifact") writeForge({ ...next, artifacts: [made, ...next.artifacts] });
    else {
      writeForge({
        ...next,
        versions: [made, ...next.versions],
        engineWishes: [...next.engineWishes, `${made.name}: ${made.line}`.trim()].slice(-12),
      });
    }
    setRelic(made);
    setError(null);
  }

  let body: ReactNode;
  if (!path) {
    body = (
      <div className="forge-hall-pick">
        <HallHead kicker="The kiln" title="Forge" onClose={onClose} />
        <div className="forge-choices">
          <Choice
            src={pub("forge/bot.jpg")}
            title="Forge with Grok Bot"
            line="Howl it. The keeper strikes."
            onClick={() => setPath("bot")}
          />
          <Choice
            src={pub("forge/hand.jpg")}
            title="Forge manually"
            line="You are the smith."
            onClick={() => setPath("hand")}
          />
        </div>
      </div>
    );
  } else if (!work) {
    body = (
      <div className="forge-hall-pick">
        <HallHead
          kicker={path === "bot" ? "With the keeper" : "By hand"}
          title="Strike"
          sub="Pick what leaves the kiln."
          onClose={onClose}
        />
        <div className="forge-choices" data-count="3">
          <Choice
            src={pub("forge/artifact.jpg")}
            title="New artifact"
            line="A relic for the Hall."
            onClick={() => setWork("artifact")}
          />
          <Choice
            src={pub("forge/remix-strike.jpg")}
            title="Remix"
            line="Same engine. New dens."
            onClick={() => setWork("remix")}
          />
          <Choice
            src={pub("forge/version.jpg")}
            title="New version"
            line="A new cut of the pack."
            onClick={() => setWork("version")}
          />
        </div>
        <button type="button" className="forge-hall-back" onClick={backToPick}>
          Back
        </button>
      </div>
    );
  } else if (work === "remix" && path === "bot" && phase === "ask") {
    body = (
      <form
        className="forge-hall-inner"
        onSubmit={(e) => {
          e.preventDefault();
          void strikeRemix();
        }}
      >
        <HallHead
          kicker="Grok Bot · Remix"
          title="Howl a city"
          sub="Same engine. New dens. The keeper strikes from your howl."
          onClose={onClose}
        />
        <div className="forge-hall-space" aria-hidden />
        <div className="forge-hall-dock">
          <textarea
            className="citadel-wish"
            rows={3}
            maxLength={MAX_WISH}
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            placeholder="Year 0, but a second kiln and a west dock of cyan glass…"
          />
          {error && (
            <p className="forge-hall-err" role="alert">
              {error}
            </p>
          )}
          {full && <p className="forge-hall-sub">The Hall holds eight remixes.</p>}
          <button type="submit" className="forge-hall-strike" disabled={wish.trim().length < 4 || full}>
            Strike remix
          </button>
          <button type="button" className="forge-hall-back" onClick={backToPath}>
            Back
          </button>
        </div>
      </form>
    );
  } else if (work === "remix" && path === "bot") {
    body = (
      <div className="forge-hall-inner">
        <HallHead
          kicker={`${draft.theme || "remixing"} · circuit`}
          title={draft.name || "Raising dens…"}
          sub={draft.line}
          onClose={onClose}
        />
        <ul className="citadel-sheet-list forge-hall-list">
          {draft.buildings.map((b) => (
            <li key={b.name}>
              <strong>{b.name}</strong>
              <span>{b.kind}</span>
            </li>
          ))}
        </ul>
        <div className="citadel-sheet-log">
          {draft.log.slice(-4).map((ln, i) => (
            <p key={`${i}-${ln}`}>{ln}</p>
          ))}
        </div>
        <div className="forge-hall-dock">
          {phase === "done" && world ? (
            <button type="button" className="forge-hall-strike" onClick={onLand}>
              Land remix
            </button>
          ) : null}
          <button type="button" className="forge-hall-back" onClick={onClose}>
            Citadel
          </button>
        </div>
      </div>
    );
  } else if (work === "remix") {
    body = (
      <form
        className="forge-hall-inner"
        onSubmit={(e) => {
          e.preventDefault();
          sealRemixHand();
        }}
      >
        <HallHead
          kicker="By hand · Remix"
          title={handSealed ? world?.name || "Sealed" : "Name the dens"}
          sub={handSealed ? world?.line || "Raised by hand." : "You are the smith. No bot in the fire."}
          onClose={onClose}
        />
        <div className="forge-hall-dock">
          {handSealed && world ? (
            <>
              <ul className="citadel-sheet-list forge-hall-list">
                {world.buildings.map((b) => (
                  <li key={b.name}>
                    <strong>{b.name}</strong>
                    <span>{b.kind}</span>
                  </li>
                ))}
              </ul>
              <button type="button" className="forge-hall-strike" onClick={onLand}>
                Land remix
              </button>
            </>
          ) : (
            <>
              <label className="forge-field">
                <span>City</span>
                <input
                  type="text"
                  maxLength={28}
                  value={handName}
                  onChange={(e) => setHandName(e.target.value)}
                  placeholder="Two Kiln Harbor"
                  autoComplete="off"
                />
              </label>
              <label className="forge-field">
                <span>Line</span>
                <input
                  type="text"
                  maxLength={90}
                  value={handLine}
                  onChange={(e) => setHandLine(e.target.value)}
                  placeholder="A west dock of cyan glass…"
                  autoComplete="off"
                />
              </label>
              <fieldset className="forge-themes">
                <legend>Theme</legend>
                {FORGE_THEMES.map((t) => (
                  <label key={t} data-on={handTheme === t ? "true" : undefined}>
                    <input type="radio" name="theme" value={t} checked={handTheme === t} onChange={() => setHandTheme(t)} />
                    {t}
                  </label>
                ))}
              </fieldset>
              <ul className="forge-dens">
                {handDens.map((den, i) => (
                  <li key={i}>
                    <input
                      type="text"
                      maxLength={22}
                      value={den.name}
                      placeholder={`Den ${i + 1}`}
                      autoComplete="off"
                      onChange={(e) => {
                        const next = [...handDens];
                        next[i] = { ...den, name: e.target.value };
                        setHandDens(next);
                      }}
                    />
                    <select
                      value={den.kind}
                      onChange={(e) => {
                        const next = [...handDens];
                        next[i] = { ...den, kind: e.target.value };
                        setHandDens(next);
                      }}
                    >
                      {DENS_KINDS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
              {error && (
                <p className="forge-hall-err" role="alert">
                  {error}
                </p>
              )}
              {full && <p className="forge-hall-sub">The Hall holds eight remixes.</p>}
              <button type="submit" className="forge-hall-strike" disabled={handName.trim().length < 2 || full}>
                Seal by hand
              </button>
            </>
          )}
          <button type="button" className="forge-hall-back" onClick={backToPath}>
            Back
          </button>
        </div>
      </form>
    );
  } else {
    const kind = work;
    const noun = kind === "version" ? "version" : "relic";
    const sealed = relic;
    body = (
      <form
        className="forge-hall-inner"
        onSubmit={(e) => {
          e.preventDefault();
          if (path === "bot") {
            const howl = wish.trim();
            if (howl.length < 4) return;
            sealRelic(kind, "bot", titleFromHowl(howl, kind === "version" ? "New Cut" : "New Relic"), howl, themeFromHowl(howl));
          } else {
            sealRelic(kind, "hand", handName, handLine, handTheme);
          }
        }}
      >
        <HallHead
          kicker={`${path === "bot" ? "Grok Bot" : "By hand"} · ${kind === "version" ? "Version" : "Artifact"}`}
          title={sealed ? sealed.name : path === "bot" ? `Howl a ${noun}` : `Name the ${noun}`}
          sub={
            sealed
              ? sealed.line
              : kind === "version"
                ? "A new cut of the pack. Seal it for the kiln."
                : "A relic for the Hall. A world you can name."
          }
          onClose={onClose}
        />
        <div className="forge-hall-space" aria-hidden />
        <div className="forge-hall-dock">
          {sealed ? (
            <>
              <p className="forge-hall-sub">
                {sealed.theme} · {sealed.maker === "bot" ? "keeper" : "hand"}
              </p>
              <button type="button" className="forge-hall-strike" onClick={onClose}>
                Return to citadel
              </button>
            </>
          ) : path === "bot" ? (
            <>
              <textarea
                className="citadel-wish"
                rows={3}
                maxLength={MAX_WISH}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder={
                  kind === "version"
                    ? "Year 1: a taller spire and a west song…"
                    : "A cyan heart relic that opens a quiet west den…"
                }
              />
              {error && (
                <p className="forge-hall-err" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="forge-hall-strike" disabled={wish.trim().length < 4}>
                Strike {noun}
              </button>
            </>
          ) : (
            <>
              <label className="forge-field">
                <span>Name</span>
                <input
                  type="text"
                  maxLength={28}
                  value={handName}
                  onChange={(e) => setHandName(e.target.value)}
                  placeholder={kind === "version" ? "Year 1" : "Veil Heart"}
                  autoComplete="off"
                />
              </label>
              <label className="forge-field">
                <span>Line</span>
                <input
                  type="text"
                  maxLength={90}
                  value={handLine}
                  onChange={(e) => setHandLine(e.target.value)}
                  placeholder={kind === "version" ? "Taller spire, west song." : "Opens a quiet west den."}
                  autoComplete="off"
                />
              </label>
              <fieldset className="forge-themes">
                <legend>Theme</legend>
                {FORGE_THEMES.map((t) => (
                  <label key={t} data-on={handTheme === t ? "true" : undefined}>
                    <input type="radio" name="theme" value={t} checked={handTheme === t} onChange={() => setHandTheme(t)} />
                    {t}
                  </label>
                ))}
              </fieldset>
              {error && (
                <p className="forge-hall-err" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="forge-hall-strike" disabled={handName.trim().length < 2}>
                Seal {noun}
              </button>
            </>
          )}
          <button type="button" className="forge-hall-back" onClick={backToPath}>
            Back
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="forge-hall" role="dialog" aria-modal="true" aria-label="Forge">
      <ForgeStage src={stage} />
      {body}
    </div>
  );
}
