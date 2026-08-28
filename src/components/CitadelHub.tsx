import { useEffect, useRef, useState, type ReactNode } from "react";
import { Castle, Music, Music2, Star, Users, Volume2 } from "lucide-react";
import { createCitadelTheme, type CitadelTheme } from "@/game/citadel-theme";

type Props = {
  onHall: () => void;
  onConstellation: () => void;
  onLand: () => void;
};

export function CitadelHub({ onHall, onConstellation, onLand }: Props) {
  const [howl, setHowl] = useState(false);
  const [packOpen, setPackOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [muted, setMuted] = useState(false);
  const themeRef = useRef<CitadelTheme | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const theme = createCitadelTheme();
    themeRef.current = theme;
    setMuted(theme.muted());
    return () => {
      theme.stop();
      theme.dispose();
      themeRef.current = null;
    };
  }, []);

  useEffect(() => {
    function wake(ev?: Event) {
      const t = themeRef.current;
      if (!t) return;
      t.unlock();
      const el = ev?.target as HTMLElement | null;
      if (el?.closest?.(".citadel-song")) return;
      if (!t.muted()) t.start();
    }
    window.addEventListener("pointerdown", wake, { capture: true });
    window.addEventListener("keydown", wake);
    const onVis = () => {
      if (document.visibilityState === "visible") wake();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pointerdown", wake, { capture: true });
      window.removeEventListener("keydown", wake);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!note) return;
    const t = window.setTimeout(() => setNote(null), 2400);
    return () => window.clearTimeout(t);
  }, [note]);

  useEffect(() => {
    if (!howl) return;
    const t = window.setTimeout(() => setHowl(false), 1100);
    return () => window.clearTimeout(t);
  }, [howl]);

  function sendHowl() {
    setHowl(true);
    themeRef.current?.howl();
    setNote("Howl sent. The citadel answers.");
  }

  function toggleSong() {
    const t = themeRef.current;
    if (!t) return;
    t.unlock();
    if (t.playing()) {
      t.setMuted(true);
      t.stop();
      setMuted(true);
      return;
    }
    t.setMuted(false);
    setMuted(false);
    t.start();
  }

  return (
    <section
      className="citadel"
      data-howl={howl ? "true" : undefined}
      data-song={muted ? undefined : "on"}
      aria-label="Thunderwolf Citadel"
    >
      <img className="citadel-art" src="/citadel/hub.jpg" alt="" hidden={live} />
      {!reduce && (
        <video
          className="citadel-art citadel-live"
          src="/citadel/hub.mp4"
          poster="/citadel/hub.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setLive(true)}
        />
      )}
      <div className="citadel-aurora" aria-hidden />
      <div className="citadel-bloom" aria-hidden />
      <div className="citadel-veil" aria-hidden />
      <div className="citadel-sparks" aria-hidden>
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      {howl && <div className="citadel-howl" aria-hidden />}

      <header className="citadel-banner">
        <p className="citadel-kicker">Boltverse</p>
        <h1 className="citadel-title">Thunderwolf Citadel</h1>
        <p className="citadel-sub">Pack HQ</p>
        <button
          type="button"
          className="citadel-song"
          aria-pressed={!muted}
          aria-label={muted ? "Play song" : "Mute song"}
          onClick={toggleSong}
        >
          {muted ? <Music2 strokeWidth={2.4} /> : <Music strokeWidth={2.4} />}
        </button>
      </header>

      <div className="citadel-rail citadel-rail-l">
        <Door icon={<Castle strokeWidth={2.4} />} label="Hall" onClick={onHall} />
        <Door icon={<Volume2 strokeWidth={2.4} />} label="Howl" onClick={sendHowl} />
      </div>
      <div className="citadel-rail citadel-rail-r">
        <Door icon={<Star strokeWidth={2.4} />} label="Stars" onClick={onConstellation} />
        <Door icon={<Users strokeWidth={2.4} />} label="Pack" onClick={() => setPackOpen(true)} />
      </div>

      <footer className="citadel-foot">
        <button type="button" className="citadel-land" onClick={onLand}>
          Land
        </button>
      </footer>

      {note && (
        <p className="citadel-note" role="status">
          {note}
        </p>
      )}

      {packOpen && (
        <div className="citadel-sheet" role="dialog" aria-label="The Pack">
          <div className="citadel-sheet-card">
            <p className="citadel-kicker">Boltverse</p>
            <h2 className="citadel-sheet-title">The Pack</h2>
            <p className="citadel-sheet-copy">
              Powered by xAI and YOU. The citadel is Pack HQ. Hall holds player worlds. Stars hold the sky. Land walks the Circuit.
            </p>
            <ul className="citadel-sheet-list">
              <li>
                <strong>Bolt</strong>
                <span>Working dog on the throne</span>
              </li>
              <li>
                <strong>Hall</strong>
                <span>Worlds the Pack raised</span>
              </li>
              <li>
                <strong>Circuit</strong>
                <span>Second realm. Core Spire</span>
              </li>
            </ul>
            <button type="button" className="citadel-sheet-close" onClick={() => setPackOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Door({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="citadel-door" onClick={onClick} aria-label={label}>
      <span className="citadel-door-ico">{icon}</span>
      <span className="citadel-door-lab">{label}</span>
    </button>
  );
}
