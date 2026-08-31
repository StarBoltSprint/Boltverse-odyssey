import { Axe, Castle, ChevronsRight, CloudLightning, Footprints, Gauge, PawPrint, RotateCw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { pub } from "@/lib/pub";
import { SLASH_CLASSES, type SlashClassId, type SlashHud as Hud, type SlashSkillId } from "@/game/slash-engine";

const ICONS: Record<SlashSkillId, typeof PawPrint> = {
  bite: PawPrint,
  thrash: RotateCw,
  maul: Axe,
  howl: Volume2,
  dash: ChevronsRight,
  wake: Footprints,
  crash: Gauge,
  bolt: Zap,
  aura: Sparkles,
  storm: CloudLightning,
};

const GATE: Record<SlashClassId, { still: string; film: string }> = {
  fang: { still: "slash/gate.jpg", film: "slash/gate.mp4" },
  blitz: { still: "slash/gate-blitz.jpg", film: "slash/gate-blitz.mp4" },
  arc: { still: "slash/gate-arc.jpg", film: "slash/gate-arc.mp4" },
};
const GATE_V = "widein2";
const HUNT_V = "2";

type Props = {
  hud: Hud;
  muted: boolean;
  onStart: () => void;
  onCast: (id: SlashSkillId) => void;
  onStick: (x: number, y: number) => void;
  onCitadel: () => void;
  onMute: () => void;
  onClass: (id: SlashClassId) => void;
};

export function SlashHud({ hud, muted, onStart, onCast, onStick, onCitadel, onMute, onClass }: Props) {
  const stickRef = useRef<HTMLDivElement | null>(null);
  const filmRef = useRef<HTMLVideoElement | null>(null);
  const huntRef = useRef<HTMLVideoElement | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [hunt, setHunt] = useState(true);
  const [skipOn, setSkipOn] = useState(false);

  useEffect(() => {
    const v = filmRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const kick = () => {
      void v.play().catch(() => {});
    };
    kick();
    v.addEventListener("canplay", kick);
    v.addEventListener("loadeddata", kick);
    return () => {
      v.removeEventListener("canplay", kick);
      v.removeEventListener("loadeddata", kick);
    };
  }, [hud.classId, hud.mode]);

  useEffect(() => {
    if (!hunt || hud.mode !== "title") return;
    const t = window.setTimeout(() => setSkipOn(true), 5000);
    return () => window.clearTimeout(t);
  }, [hunt, hud.mode]);

  useEffect(() => {
    const v = huntRef.current;
    if (!v || !hunt) return;
    v.muted = true;
    v.defaultMuted = true;
    const kick = () => {
      void v.play().catch(() => {});
    };
    kick();
    v.addEventListener("canplay", kick);
    v.addEventListener("error", endHunt);
    return () => {
      v.removeEventListener("canplay", kick);
      v.removeEventListener("error", endHunt);
    };
  }, [hunt]);

  function endHunt() {
    setHunt(false);
    setSkipOn(false);
  }

  function stick(ev: ReactPointerEvent) {
    const el = stickRef.current;
    if (!el) return;
    el.setPointerCapture(ev.pointerId);
    const r = el.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    const y = -(((ev.clientY - r.top) / r.height) * 2 - 1);
    const m = Math.hypot(x, y);
    const s = m > 1 ? 1 / m : 1;
    const nx = x * s;
    const ny = y * s;
    onStick(nx, ny);
    setKnob({ x: nx, y: ny });
  }

  if (hud.mode === "title" && hunt) {
    return (
      <div className="slash-hunt">
        <video
          ref={huntRef}
          className="slash-hunt-film"
          src={pub("slash/hunt.mp4") + "?v=" + HUNT_V}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          onEnded={endHunt}
          onError={endHunt}
          onLoadedData={(e) => {
            e.currentTarget.muted = true;
            void e.currentTarget.play().catch(() => {});
          }}
        />
        <div className="slash-hunt-vignette" />
        {skipOn ? (
          <>
            <button type="button" className="slash-hunt-hit" aria-label="Skip intro" onClick={endHunt} />
            <button type="button" className="slash-hunt-skip" onClick={endHunt}>
              Skip
            </button>
          </>
        ) : null}
      </div>
    );
  }

  if (hud.mode === "title" || hud.mode === "dead" || hud.mode === "win") {
    const win = hud.mode === "win";
    const dead = hud.mode === "dead";
    const kit = GATE[hud.classId] ?? GATE.fang;
    const still = pub(kit.still) + "?v=" + GATE_V;
    const film = pub(kit.film) + "?v=" + GATE_V;
    return (
      <div className="slash-gate" data-class={hud.classId}>
        <div className="slash-gate-stage" aria-hidden>
          <img key={hud.classId + "-still"} className="slash-gate-art" src={still} alt="" />
          <video
            ref={filmRef}
            key={hud.classId}
            className="slash-gate-art slash-gate-live"
            src={film}
            poster={still}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
            onLoadedData={(e) => {
              e.currentTarget.muted = true;
              void e.currentTarget.play().catch(() => {});
            }}
          />
          <div className="slash-gate-vignette" />
          <div className="slash-gate-bloom" />
          <div className="slash-gate-frame" />
          <div className="slash-gate-sparks">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <p className="slash-gate-mark">{dead ? "The Veil holds" : win ? "The Heart shatters" : "Shatter Veil"}</p>
        <div className="slash-gate-plate">
          <h1 className="slash-title">{dead ? "StarBoltSprint falls" : win ? "StarBoltSprint stands" : "StarBoltSprint"}</h1>
          <p className="slash-class">{hud.className}</p>
          <p className="slash-sub">
            {dead || win
              ? `Wave ${hud.wave} · ${hud.kills} slain · ${hud.gold} gold`
              : SLASH_CLASSES.find((c) => c.id === hud.classId)?.line ?? "Walk the Veil. Break the Heart."}
          </p>
          {hud.mode === "title" ? (
            <div className="slash-classes" role="radiogroup" aria-label="Class">
              {SLASH_CLASSES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={hud.classId === c.id}
                  data-on={hud.classId === c.id ? "true" : undefined}
                  data-kit={c.id}
                  className="slash-class-pick"
                  onClick={() => onClass(c.id)}
                >
                  <strong>{c.name}</strong>
                  <span>{c.resource}</span>
                </button>
              ))}
            </div>
          ) : null}
          <button type="button" className="slash-enter" onClick={onStart}>
            {hud.mode === "title" ? "Enter the Veil" : "Rise again"}
          </button>
          <button type="button" className="slash-back" onClick={onCitadel}>
            {hud.mode === "title" ? "Citadel" : "Hall"}
          </button>
        </div>
      </div>
    );
  }

  if (hud.mode === "pause") {
    return (
      <div className="slash-gate slash-gate-pause">
        <div className="slash-gate-veil" />
        <div className="slash-gate-copy">
          <p className="slash-kicker">Shatter Veil</p>
          <h1 className="slash-title">Paused</h1>
          <p className="slash-sub">
            {hud.className} · Wave {hud.wave} · Lv {hud.level}
          </p>
          <button type="button" className="slash-enter" onClick={onStart}>
            Resume
          </button>
          <button type="button" className="slash-back" onClick={onCitadel}>
            Hall
          </button>
        </div>
      </div>
    );
  }

  const hpPct = Math.max(0, hud.hp / hud.hpMax);
  const furyPct = Math.max(0, hud.fury / hud.furyMax);
  const xpPct = hud.xpNext ? hud.xp / hud.xpNext : 0;

  return (
    <div className="slash-hud">
      {hud.floaters.map((f) => (
        <span
          key={f.id}
          className="slash-floater"
          data-crit={f.crit ? "true" : undefined}
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </span>
      ))}

      <header className="slash-top">
        <button type="button" className="slash-citadel" onClick={onCitadel}>
          <Castle strokeWidth={2.2} />
          <span>Citadel</span>
        </button>
        <div className="slash-id">
          <div className="slash-id-face">
            <img src={pub("slash/portrait-war.jpg")} alt="" />
            <b>{hud.level}</b>
          </div>
          <div className="slash-id-copy">
            <strong>StarBoltSprint</strong>
            <em>
              {hud.className} · Lv {hud.level}
            </em>
          </div>
          <div className="slash-id-hp" aria-hidden>
            <i style={{ width: `${hpPct * 100}%` }} />
          </div>
        </div>
        <div className="slash-wave">
          <em>Wave</em>
          <strong>{hud.wave}</strong>
          <span>{hud.gold}G</span>
        </div>
        <button type="button" className="slash-mute" aria-label={muted ? "Unmute" : "Mute"} onClick={onMute}>
          {muted ? <VolumeX strokeWidth={2.2} /> : <Volume2 strokeWidth={2.2} />}
        </button>
      </header>

      {hud.toast ? (
        <p className="slash-toast" role="status">
          {hud.toast}
        </p>
      ) : null}
      {hud.combo > 1 ? <p className="slash-combo">{hud.combo} hit</p> : null}
      {hud.buff > 0 ? <p className="slash-buff">Howl {Math.ceil(hud.buff)}s</p> : null}

      <div
        ref={stickRef}
        className="slash-stick"
        onPointerDown={stick}
        onPointerMove={(e) => {
          if (e.buttons) stick(e);
        }}
        onPointerUp={() => {
          onStick(0, 0);
          setKnob({ x: 0, y: 0 });
        }}
        onPointerCancel={() => {
          onStick(0, 0);
          setKnob({ x: 0, y: 0 });
        }}
        aria-label="Move"
      >
        <i style={{ ["--kx" as string]: `${knob.x * 22}px`, ["--ky" as string]: `${-knob.y * 22}px` }} />
      </div>

      <div className="slash-dock">
        <div className="slash-xp" aria-hidden>
          <i style={{ width: `${xpPct * 100}%` }} />
        </div>
        <footer className="slash-bar">
          <div className="slash-orb" data-kind="hp" aria-label="Health">
            <i style={{ height: `${hpPct * 100}%` }} />
            <b>{Math.ceil(hud.hp)}</b>
          </div>
          <ul className="slash-skills">
            {hud.skills.map((s) => {
              const Icon = ICONS[s.id] ?? PawPrint;
              const ready = s.ready >= 1 && hud.fury >= s.cost;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className="slash-skill"
                    disabled={!ready && s.cost > 0 && s.ready >= 1}
                    data-ready={ready ? "true" : undefined}
                    aria-label={`${s.name} ${s.hot}`}
                    onClick={() => onCast(s.id)}
                  >
                    <Icon strokeWidth={2.2} />
                    <em>{s.hot}</em>
                    <small>{s.name}</small>
                    {s.ready < 1 ? <span className="slash-cd" style={{ height: `${(1 - s.ready) * 100}%` }} /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="slash-orb" data-kind="fury" data-class={hud.classId} aria-label={hud.resource}>
            <i style={{ height: `${furyPct * 100}%` }} />
            <b>{Math.ceil(hud.fury)}</b>
          </div>
        </footer>
      </div>
    </div>
  );
}
