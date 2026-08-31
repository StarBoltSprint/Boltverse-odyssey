import { Castle, Crosshair, RotateCw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { pub } from "@/lib/pub";
import type { FpsHud as Hud } from "@/game/fps-engine";

const GATE_V = "sight2";
const HUNT_V = "3";

type Props = {
  hud: Hud;
  muted: boolean;
  onStart: () => void;
  onStick: (x: number, y: number) => void;
  onLook: (x: number, y: number) => void;
  onFire: (v: boolean) => void;
  onReload: () => void;
  onCitadel: () => void;
  onMute: () => void;
};

export function FpsHud({ hud, muted, onStart, onStick, onLook, onFire, onReload, onCitadel, onMute }: Props) {
  const stickRef = useRef<HTMLDivElement | null>(null);
  const lookRef = useRef<HTMLDivElement | null>(null);
  const filmRef = useRef<HTMLVideoElement | null>(null);
  const huntRef = useRef<HTMLVideoElement | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [hunt, setHunt] = useState(false);
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
    return () => v.removeEventListener("canplay", kick);
  }, [hud.mode, hunt]);

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
    if (hud.mode === "title") onStart();
  }

  function stick(ev: ReactPointerEvent, look: boolean) {
    const el = look ? lookRef.current : stickRef.current;
    if (!el) return;
    el.setPointerCapture(ev.pointerId);
    const r = el.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    const y = -(((ev.clientY - r.top) / r.height) * 2 - 1);
    const m = Math.hypot(x, y);
    const s = m > 1 ? 1 / m : 1;
    const nx = x * s;
    const ny = y * s;
    if (look) onLook(nx, ny);
    else {
      onStick(nx, ny);
      setKnob({ x: nx, y: ny });
    }
  }

  if (hud.mode === "title" && hunt) {
    return (
      <div className="slash-hunt">
        <video
          ref={huntRef}
          className="slash-hunt-film"
          src={pub("slash/hunt-fps.mp4") + "?v=" + HUNT_V}
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
    const still = pub("slash/gate-fps.jpg") + "?v=" + GATE_V;
    return (
      <div className="slash-gate fps-gate" data-class="fps">
        <div className="slash-gate-stage" aria-hidden>
          <img className="slash-gate-art" src={still} alt="" />
          <div className="slash-gate-vignette" />
          <div className="slash-gate-bloom" />
          <div className="slash-gate-frame" />
        </div>
        <p className="slash-gate-mark">{dead ? "The kiln holds" : win ? "Sight holds" : "Howl Sight"}</p>
        <div className="slash-gate-plate">
          <h1 className="slash-title">{dead ? "StarBoltSprint falls" : win ? "StarBoltSprint stands" : "StarBoltSprint"}</h1>
          <p className="slash-class">Howl Sight</p>
          <p className="slash-sub">
            {dead || win
              ? `Wave ${hud.wave} · ${hud.kills} slain · ${hud.gold} gold`
              : "First person. The kiln is the range. Crystal never chrome."}
          </p>
          <button type="button" className="slash-enter" onClick={() => {
            if (hud.mode === "title") setHunt(true);
            else onStart();
          }}>
            {hud.mode === "title" ? "Take the Sight" : "Rise again"}
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
          <p className="slash-kicker">Howl Sight</p>
          <h1 className="slash-title">Paused</h1>
          <p className="slash-sub">
            Wave {hud.wave} · {hud.kills} slain
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
  const magPct = hud.mag ? hud.ammo / hud.mag : 0;

  return (
    <div className="fps-hud">
      <header className="slash-top">
        <button type="button" className="slash-citadel" onClick={onCitadel}>
          <Castle strokeWidth={2.2} />
          <span>Citadel</span>
        </button>
        <div className="slash-wave">
          <em>Wave</em>
          <strong>{hud.wave}</strong>
          <span>{hud.gold}G</span>
        </div>
        <button type="button" className="slash-mute" aria-label={muted ? "Unmute" : "Mute"} onClick={onMute}>
          {muted ? <VolumeX strokeWidth={2.2} /> : <Volume2 strokeWidth={2.2} />}
        </button>
      </header>

      <div className="fps-cross" data-hit={hud.hit > 0.15 ? "true" : undefined} aria-hidden>
        <i />
        <i />
        <Crosshair strokeWidth={1.6} />
      </div>
      {hud.hurt > 0.05 ? <div className="fps-hurt" style={{ opacity: Math.min(0.55, hud.hurt) }} /> : null}
      {hud.toast ? (
        <p className="slash-toast" role="status">
          {hud.toast}
        </p>
      ) : null}

      <div
        ref={stickRef}
        className="slash-stick"
        onPointerDown={(e) => stick(e, false)}
        onPointerMove={(e) => {
          if (e.buttons) stick(e, false);
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

      <div
        ref={lookRef}
        className="fps-look"
        onPointerDown={(e) => stick(e, true)}
        onPointerMove={(e) => {
          if (e.buttons) stick(e, true);
        }}
        onPointerUp={() => onLook(0, 0)}
        onPointerCancel={() => onLook(0, 0)}
        aria-label="Look"
      />

      <div className="fps-dock">
        <div className="fps-hp" aria-label="Health">
          <i style={{ width: `${hpPct * 100}%` }} />
          <b>{Math.ceil(hud.hp)}</b>
        </div>
        <button
          type="button"
          className="fps-fire"
          aria-label="Fire"
          onPointerDown={() => onFire(true)}
          onPointerUp={() => onFire(false)}
          onPointerCancel={() => onFire(false)}
        >
          Fire
        </button>
        <button type="button" className="fps-reload" aria-label="Reload" onClick={onReload}>
          <RotateCw strokeWidth={2.2} />
          <span>
            {hud.ammo}/{hud.reserve}
          </span>
          <i style={{ width: `${magPct * 100}%` }} />
        </button>
      </div>
    </div>
  );
}
