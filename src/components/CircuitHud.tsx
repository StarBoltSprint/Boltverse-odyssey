import { useEffect, useRef, useState } from "react";
import { pub } from "@/lib/pub";
import type { RaisingHud as Hud } from "@/game/raising-engine";

const GATE_V = "1";
const HUNT_V = "1";

type Props = {
  hud: Hud;
  pack?: number;
  live?: boolean;
  onStart: () => void;
  onCitadel: () => void;
  onAskBot: () => void;
  botOpen?: boolean;
};

export function CircuitHud({ hud, pack = 1, live = false, onStart, onCitadel, onAskBot, botOpen = false }: Props) {
  const filmRef = useRef<HTMLVideoElement | null>(null);
  const huntRef = useRef<HTMLVideoElement | null>(null);
  const [hunt, setHunt] = useState(true);
  const [skipOn, setSkipOn] = useState(false);
  const bots = hud.botOn ? 1 : 0;

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
  }, [hunt, hud.mode]);

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

  if (hud.mode === "title" && hunt) {
    return (
      <div className="slash-hunt">
        <video
          ref={huntRef}
          className="slash-hunt-film"
          src={pub("luminous-circuit/hunt.mp4") + "?v=" + HUNT_V}
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
        <p className="slash-hunt-mark">The Howling Crucible</p>
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

  if (hud.mode === "title") {
    const still = pub("luminous-circuit/gate.jpg") + "?v=" + GATE_V;
    const film = pub("luminous-circuit/gate.mp4") + "?v=" + GATE_V;
    return (
      <div className="slash-gate" data-class="circuit">
        <div className="slash-gate-stage" aria-hidden>
          <img className="slash-gate-art" src={still} alt="" />
          <video
            ref={filmRef}
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
        </div>
        <p className="slash-gate-mark">The Howling Crucible</p>
        <div className="slash-gate-plate">
          <h1 className="slash-title">StarBoltSprint</h1>
          <p className="slash-class">{hud.host ? hud.island || "Your beginning" : `Guest · ${hud.island}`}</p>
          <p className="slash-sub">
            {hud.host
              ? "Howl. Knock the Door. Teach it. Crystal from leftover Charge."
              : `Visiting ${hud.island}. Howl with them. Your bot grows yours.`}
          </p>
          {pack > 1 ? <p className="circuit-live-note">{pack} already in the crucible</p> : <p className="circuit-live-note">Hold the Spire to Howl. The Door grows the rest.</p>}
          <button type="button" className="slash-enter" onClick={onStart}>
            Land True
          </button>
          <button type="button" className="slash-back" onClick={onCitadel}>
            Citadel
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
          <p className="slash-kicker">The Howling Crucible</p>
          <h1 className="slash-title">Paused</h1>
          <p className="slash-sub">The island holds. Pause is sacred.</p>
          {pack > 1 ? <p className="circuit-live-note">{pack} still in the crucible</p> : null}
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

  return (
    <div className="circuit-play" data-village="true" data-bot={botOpen ? "true" : undefined}>
      <div className="circuit-dock">
        <button type="button" className="circuit-isle" onClick={onAskBot} aria-label={hud.island}>
          <strong>{hud.island || "Beginning"}</strong>
          <span>{hud.host ? hud.landId : "guest"}</span>
        </button>
        <p className="circuit-pack" data-live={live ? "true" : undefined} aria-label={`${pack} live`}>
          <strong>{pack}</strong>
          <span>live</span>
        </p>
        <p className="circuit-bots" data-on={hud.botOn ? "true" : undefined} aria-label={`${bots} grok bot`}>
          <strong>{bots}</strong>
          <span>grok</span>
        </p>
        <button
          type="button"
          className="circuit-bot-chip"
          data-on={hud.botOn ? "true" : undefined}
          onClick={onAskBot}
        >
          <strong>{hud.botOn ? hud.botName : "Grok Bot"}</strong>
          <span>{hud.botOn ? "talk" : "connect"}</span>
        </button>
      </div>
      {hud.toast ? <p className="slash-toast">{hud.toast}</p> : null}
    </div>
  );
}
