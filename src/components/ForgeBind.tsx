import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type PointerEvent } from "react";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";
import { parseGrokSeed, type SeedRelic } from "@/game/seeds";
import { rememberRelic } from "@/lib/relics-browser";

const STILL = pub("citadel/kiln-new.jpg") + "?v=1";
const CLIP = pub("citadel/kiln-new.mp4") + "?v=1";

type Props = {
  onBack: () => void;
  onBound: (relic: SeedRelic) => void;
};

export function ForgeBind({ onBack, onBound }: Props) {
  const [live, setLive] = useState(false);
  const [armed, setArmed] = useState(false);
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    const arm = window.setTimeout(() => setArmed(true), 420);
    playSong(SONG.kilnNew);
    const v = videoRef.current;
    if (!v) return () => window.clearTimeout(arm);
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const playFilm = () => {
      v.muted = true;
      void v.play().then(() => setLive(true)).catch(() => {});
    };
    playFilm();
    v.addEventListener("canplay", playFilm);
    return () => {
      window.clearTimeout(arm);
      v.removeEventListener("canplay", playFilm);
    };
  }, []);

  function stop(ev: PointerEvent | MouseEvent) {
    ev.stopPropagation();
  }

  function doubleFull() {
    playSong(SONG.kilnNew);
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  function bind(ev?: FormEvent | PointerEvent | MouseEvent) {
    ev?.preventDefault();
    ev?.stopPropagation();
    if (!armed || busy) return;
    playSong(SONG.kilnNew);
    const seed = parseGrokSeed(value);
    if (!seed) {
      setErr("The kiln only takes a grok.me seed.");
      return;
    }
    setErr("");
    setBusy(true);
    void fetch("/api/relics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ href: seed.href }),
    })
      .then(async (res) => {
        const body = (await res.json().catch(() => null)) as SeedRelic & { error?: string };
        if (!res.ok || !body?.id || !body?.href) {
          throw new Error(body?.error || "bind_failed");
        }
        rememberRelic({ id: body.id, href: body.href, plays: 0, created_at: new Date().toISOString() });
        onBound({ id: body.id, href: body.href });
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        setErr(msg && msg !== "bind_failed" ? msg : "The kiln could not hold that seed.");
        setBusy(false);
      });
  }

  return (
    <section className="walk kiln bind" data-wired="true" data-armed={armed ? "true" : undefined} aria-label="Bind a relic">
      <div className="walk-stage">
        <img className="walk-art" src={STILL} alt="" hidden={live} />
        <video
          ref={videoRef}
          className="walk-art walk-live"
          src={CLIP}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          onPlaying={() => setLive(true)}
        />
        <div className="citadel-shield" onPointerDown={doubleFull} />

        <button
          type="button"
          className="walk-back"
          onPointerDown={(ev) => {
            stop(ev);
            playSong(SONG.kilnNew);
            onBack();
          }}
        >
          <i className="walk-gem" aria-hidden="true" />
          Forge
        </button>

        <form className="bind-seed" onSubmit={bind} onPointerDown={stop}>
          <p className="walk-mark">
            <strong>Bind a Relic</strong>
            <span>Paste the grok.me sandbox</span>
          </p>
          <input
            type="url"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="https://your-app.grok.me"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (err) setErr("");
            }}
            aria-label="Grok sandbox link"
          />
          {err ? <em className="bind-err">{err}</em> : null}
          <button type="submit" className="walk-enter" disabled={busy} onPointerDown={bind}>
            <span>{busy ? "Binding…" : "Bind"}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
