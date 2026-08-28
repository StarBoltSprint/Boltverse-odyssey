import { useEffect, useRef, useState } from "react";
import type { RaisingHandle, RaisingHud } from "@/game/raising-engine";

const EMPTY: RaisingHud = { mode: "title", toast: null };

export function RaisingApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RaisingHandle | null>(null);
  const [hud, setHud] = useState<RaisingHud>(EMPTY);
  const [bootError, setBootError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bag = window as unknown as {
      __LC_ENGINE?: RaisingHandle;
      __LC_BOOTED?: boolean;
      __LC_LAND?: () => void;
      __RAISING?: boolean;
    };
    let disposed = false;
    if (bag.__LC_ENGINE) {
      try {
        bag.__LC_ENGINE.dispose();
      } catch {
        /* leftover */
      }
      bag.__LC_ENGINE = undefined;
      bag.__LC_BOOTED = false;
      bag.__RAISING = false;
    }
    const adopt = (handle: RaisingHandle) => {
      engineRef.current = handle;
      bag.__LC_ENGINE = handle;
      bag.__LC_BOOTED = true;
      bag.__RAISING = true;
      bag.__LC_LAND = () => handle.land();
      setBootError(null);
      setReady(true);
    };
    const start = () => {
      if (disposed) return;
      import("@/game/raising-engine")
        .then(({ startRaising }) => {
          if (disposed || !canvasRef.current) return;
          try {
            adopt(startRaising(canvasRef.current, setHud));
          } catch (err) {
            engineRef.current = null;
            setBootError(err instanceof Error ? err.message : "The raising failed to wake.");
          }
        })
        .catch((err) => {
          if (!disposed) {
            setBootError(err instanceof Error ? err.message : "The raising failed to wake.");
          }
        });
    };
    const id = window.setTimeout(start, 20);
    return () => {
      disposed = true;
      window.clearTimeout(id);
    };
  }, []);

  function playNow() {
    const eng = engineRef.current;
    if (!eng) return;
    try {
      eng.land();
    } catch {
      /* samsung */
    }
  }

  const onTitle = hud.mode === "title" && !bootError;
  const playing = hud.mode === "play";
  const paused = hud.mode === "pause";

  return (
    <div className="circuit-root raising-root">
      <canvas
        ref={canvasRef}
        className="circuit-canvas z-0"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          background: "#5aa4dc",
          touchAction: "none",
          pointerEvents: playing || paused ? "auto" : "none",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-10 hud-safe flex flex-col">
        {playing && (
          <header className="raising-head">
            <p className="raising-kicker">Year 0</p>
            <p className="raising-title">Core Spire</p>
            <button
              type="button"
              className="raising-mute pointer-events-auto"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={() => {
                const next = !muted;
                setMuted(next);
                engineRef.current?.audio.setMuted(next);
              }}
            >
              {muted ? "Sound" : "Mute"}
            </button>
          </header>
        )}

        <div className="flex-1 relative min-h-0">
          {playing && hud.toast && <p className="raising-toast">{hud.toast}</p>}
        </div>
      </div>

      {onTitle && (
        <div className="raising-gate">
          <div className="raising-gate-copy">
            <p className="raising-gate-kicker">Year 0</p>
            <h1 className="raising-gate-title">
              The Luminous
              <br />
              Circuit
            </h1>
            <p className="raising-gate-sub">Core Spire</p>
          </div>
          <div className="raising-gate-actions">
            <button
              type="button"
              className="raising-play"
              disabled={!ready}
              onClick={playNow}
            >
              {ready ? "Play" : "Loading"}
            </button>
          </div>
        </div>
      )}

      {bootError && (
        <div className="raising-gate">
          <div className="raising-gate-copy">
            <p className="raising-gate-kicker">Year 0</p>
            <h1 className="raising-gate-title">The Luminous Circuit</h1>
            <p className="raising-gate-sub">{bootError}</p>
          </div>
          <div className="raising-gate-actions">
            <button type="button" className="raising-play" onClick={() => location.reload()}>
              Retry
            </button>
          </div>
        </div>
      )}

      {paused && (
        <div className="pause-veil">
          <div className="pause-sheet">
            <div className="panel w-[min(92%,22rem)] px-6 py-6">
              <h2 className="hud-title text-2xl">Paused</h2>
              <p className="mt-1 text-sm text-muted">The first raising waits.</p>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  className="hud-chip h-11 rounded-lg bg-fg text-bg font-medium"
                  onClick={() => engineRef.current?.setMode("play")}
                >
                  Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
