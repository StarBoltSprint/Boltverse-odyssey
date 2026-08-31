import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ARTIFACTS } from "@/game/artifacts";
import { relicHost, relicName, type SeedRelic } from "@/game/seeds";
import { pullRelics, readRelicCache } from "@/lib/relics-browser";
import { armAfterLift, tapsFrozen } from "@/lib/tap-lock";
import { pub } from "@/lib/pub";
import { goFull } from "@/lib/fullscreen";
import { playSong, SONG } from "@/lib/song";

const HALL_STILL = pub("citadel/relic.jpg") + "?v=1";

type RelicCard = {
  id: string;
  name: string;
  line: string;
  cover: string;
  film?: string;
  open: boolean;
  bound?: boolean;
  href?: string;
  plays?: number;
  createdAt?: string;
  lastLand?: string | null;
};

type Props = {
  onLand: (id: string) => void;
  onEnterSeed: (href: string, name: string, id: string) => void;
  onConstellation: () => void;
  onHome: () => void;
  onBind?: () => void;
  focusId?: string | null;
  madeOnly?: boolean;
};

const KILN_STILL = pub("citadel/kiln-new.jpg") + "?v=1";
const KILN_CLIP = pub("citadel/kiln-new.mp4") + "?v=1";

function builtCatalog(): RelicCard[] {
  return ARTIFACTS.map((a) => ({
    id: a.id,
    name: a.name,
    line: a.line,
    cover: a.cover,
    film: a.film,
    open: a.open,
  }));
}

function seedCards(rows: SeedRelic[]): RelicCard[] {
  return rows.map((r) => ({
    id: r.id,
    name: relicName(r.href),
    line: relicHost(r.href),
    cover: KILN_STILL,
    film: KILN_CLIP,
    open: true,
    bound: true,
    href: r.href,
    plays: r.plays ?? 0,
    createdAt: r.created_at,
    lastLand: r.last_land ?? null,
  }));
}

export function ArtifactHall({ onLand, onEnterSeed, onHome, onBind, focusId, madeOnly }: Props) {
  const [seeds, setSeeds] = useState<SeedRelic[]>(readRelicCache);
  const relics = madeOnly
    ? seedCards(seeds).length
      ? seedCards(seeds)
      : [{
          id: "empty",
          name: "No fire yet",
          line: "Bind a grok.me seed",
          cover: KILN_STILL,
          open: true,
        }]
    : [...builtCatalog(), ...seedCards(seeds)];
  const [i, setI] = useState(() => {
    if (!focusId) return 0;
    const built = madeOnly ? 0 : builtCatalog().length;
    const n = seeds.findIndex((r) => r.id === focusId);
    return n >= 0 ? built + n : 0;
  });
  const [worldLive, setWorldLive] = useState(false);
  const [armed, setArmed] = useState(false);
  const worldRef = useRef<HTMLVideoElement | null>(null);
  const lastTap = useRef(0);
  const lock = useRef(performance.now() + 1800);
  const song = SONG.relic;
  const pick = relics[i] ?? relics[0];

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    setArmed(false);
    lock.current = Number.POSITIVE_INFINITY;
    playSong(song);
    const release = armAfterLift(() => {
      setArmed(true);
      lock.current = performance.now() + 400;
    });
    void pullRelics().then(setSeeds);
    return release;
  }, []);

  useEffect(() => {
    if (!focusId) return;
    const built = madeOnly ? 0 : builtCatalog().length;
    const n = seeds.findIndex((r) => r.id === focusId);
    if (n >= 0) setI(built + n);
  }, [focusId, seeds, madeOnly]);

  useEffect(() => {
    setWorldLive(false);
    const v = worldRef.current;
    if (!v || !pick?.film) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const playFilm = () => {
      v.muted = true;
      void v.play().then(() => setWorldLive(true)).catch(() => {});
    };
    playFilm();
    v.addEventListener("canplay", playFilm);
    return () => v.removeEventListener("canplay", playFilm);
  }, [pick?.id, pick?.film]);

  function stop(ev: PointerEvent | MouseEvent) {
    ev.stopPropagation();
  }

  function tap(fn: () => void) {
    return (ev: PointerEvent | MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      const now = performance.now();
      if (!armed || tapsFrozen() || now < lock.current) return;
      lock.current = now + 520;
      playSong(song);
      fn();
    };
  }

  function doubleFull() {
    if (madeOnly) return;
    playSong(song);
    const now = performance.now();
    if (now - lastTap.current < 380) goFull();
    lastTap.current = now;
  }

  function step(dir: -1 | 1) {
    if (!relics.length) return;
    setI((n) => (n + dir + relics.length) % relics.length);
  }

  function primary() {
    if (!armed) return;
    if (pick?.href) {
      window.location.assign(pick.href);
      return;
    }
    if (pick?.open) onLand(pick.id);
  }

  function tapFrame() {
    if (!armed) return;
    if (pick?.href) window.location.assign(pick.href);
  }

  const action = pick?.href || pick?.open ? "Land" : "Sealed";
  const seedHref = pick?.href;

  return (
    <section className="citadel relic-gate" data-wired="true" data-armed={armed ? "true" : undefined} aria-label="Hall of Artifacts">
      <div className="citadel-stage">
        <img className="citadel-art" src={HALL_STILL} alt="" draggable={false} />
        <div className="citadel-shield" onPointerDown={doubleFull} />

        <button type="button" className="pack-back" onPointerDown={tap(() => { playSong(SONG.hub); onHome(); })}>
          Citadel
        </button>

        <header className="relic-head">
          <p>{pick.bound ? "Bound seed" : "Reliquary"}</p>
          <h1>{pick?.name ?? "Reliquary"}</h1>
        </header>

        <button type="button" className="relic-frame" aria-label={pick?.name ?? "vault"} onPointerDown={tap(primary)}>
          <img src={(pick ?? { cover: KILN_STILL }).cover} alt="" hidden={worldLive} />
          {pick?.film ? (
            <video
              ref={worldRef}
              key={pick.id}
              src={pick.film}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              controls={false}
              disablePictureInPicture
              onPlaying={() => setWorldLive(true)}
            />
          ) : null}
        </button>

        <button type="button" className="walk-arrow walk-arrow-l" aria-label="Previous world" onPointerDown={tap(() => step(-1))}>
          <ChevronLeft strokeWidth={2.6} />
        </button>
        <button type="button" className="walk-arrow walk-arrow-r" aria-label="Next world" onPointerDown={tap(() => step(1))}>
          <ChevronRight strokeWidth={2.6} />
        </button>

        {seedHref ? (
          <a
            className="pack-x"
            href={seedHref}
            rel="noopener noreferrer"
            onPointerDown={(ev) => {
              ev.stopPropagation();
              const now = performance.now();
              if (!armed || tapsFrozen() || now < lock.current) {
                ev.preventDefault();
                return;
              }
              lock.current = now + 520;
              playSong(song);
            }}
          >
            Land
          </a>
        ) : (
          <button type="button" className="pack-x" onPointerDown={tap(primary)} disabled={action === "Sealed"}>
            {action}
          </button>
        )}
      </div>
    </section>
  );
}
