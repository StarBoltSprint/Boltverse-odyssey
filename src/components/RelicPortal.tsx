import { useEffect, useState, type MouseEvent, type PointerEvent } from "react";
import { pub } from "@/lib/pub";
import { playSong, SONG } from "@/lib/song";
import { freezeTaps, tapsFrozen } from "@/lib/tap-lock";
import { relicHost } from "@/game/seeds";

const STILL = pub("citadel/kiln-new.jpg") + "?v=1";

type Props = {
  href: string;
  name: string;
  id?: string;
  backLabel?: string;
  onBack: () => void;
};

export function RelicPortal({ href, name, id, backLabel = "Hall", onBack }: Props) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    freezeTaps(600);
    playSong(SONG.relic);
    const arm = window.setTimeout(() => setArmed(true), 450);
    if (id) {
      void fetch("/api/relics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id, play: true }),
      }).catch(() => {});
    }
    window.location.assign(href);
    return () => window.clearTimeout(arm);
  }, [href, id]);

  function back(ev: PointerEvent | MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!armed || tapsFrozen()) return;
    freezeTaps(900);
    playSong(SONG.relic);
    onBack();
  }

  return (
    <section className="citadel relic-portal relic-gate" data-wired="true" data-armed={armed ? "true" : undefined} aria-label={name}>
      <div className="citadel-stage">
        <img className="citadel-art" src={STILL} alt="" draggable={false} />
        <header className="relic-head">
          <p>Bound seed</p>
          <h1>{name}</h1>
        </header>
        <div className="relic-frame" aria-hidden="true">
          <img src={STILL} alt="" />
        </div>
        <p className="relic-seed-line">{relicHost(href)} · Grok holds this fire. Land howls it open.</p>
        <button type="button" className="pack-back" onPointerDown={back}>
          {backLabel}
        </button>
        <a className="pack-x" href={href} rel="noopener noreferrer">
          Land
        </a>
      </div>
    </section>
  );
}
