import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ARTIFACTS, artifactById, type ArtifactId } from "@/game/artifacts";
import type { RaisingHandle, RaisingHud } from "@/game/raising-engine";
import { landRoom, myLandId, parseLandCode, readVisitFromUrl, writeLandUrl } from "@/game/land";
import type { SkyHandle, SkyHud } from "@/game/constellation-engine";
import type { SlashHandle, SlashHud as SlashHudState } from "@/game/slash-engine";
import type { FpsHandle, FpsHud as FpsHudState } from "@/game/fps-engine";
import { CitadelHub } from "./CitadelHub";
import { ArtifactHall } from "./ArtifactHall";
import { ZoneWalk } from "./ZoneWalk";
import { StarMap } from "./StarMap";
import { LandRun } from "./LandRun";
import { LaunchRun } from "./LaunchRun";
import { SightRun } from "./SightRun";
import { SightDive } from "./SightDive";
import { FpsGate } from "./FpsGate";
import { freezeTaps } from "@/lib/tap-lock";
import { ForgeKiln } from "./ForgeKiln";
import { ForgeGate } from "./ForgeGate";
import { DenGate } from "./DenGate";
import { ForgeBind } from "./ForgeBind";
import { RelicPortal } from "./RelicPortal";

const SlashHud = lazy(() => import("./SlashHud").then((m) => ({ default: m.SlashHud })));
const FpsHud = lazy(() => import("./FpsHud").then((m) => ({ default: m.FpsHud })));
const CircuitHud = lazy(() => import("./CircuitHud").then((m) => ({ default: m.CircuitHud })));
const CircuitNet = lazy(() => import("./CircuitNet").then((m) => ({ default: m.CircuitNet })));
const CircuitBot = lazy(() => import("./CircuitBot").then((m) => ({ default: m.CircuitBot })));
const CircuitTrial = lazy(() => import("./CircuitTrial").then((m) => ({ default: m.CircuitTrial })));

const EMPTY: RaisingHud = {
  mode: "title",
  toast: null,
  lookX: 0,
  lookZ: 0,
  charge: 0,
  tended: false,
  joined: false,
  grown: 0,
  named: 0,
  howling: false,
  near: null,
  prompt: "",
  aim: "",
  needle: 0,
  act: "",
  botOn: false,
  botName: "Grok Bot",
  host: true,
  landId: "",
  island: "Beginning",
  skills: [],
};
const SKY_EMPTY: SkyHud = { pick: null, toast: null, view: "constellation" };
const SLASH_EMPTY: SlashHudState = {
  mode: "title",
  hp: 140,
  hpMax: 140,
  fury: 40,
  furyMax: 100,
  resource: "Fury",
  classId: "fang",
  className: "Fang",
  xp: 0,
  xpNext: 80,
  level: 1,
  gold: 0,
  wave: 0,
  kills: 0,
  combo: 0,
  toast: null,
  skills: [],
  buff: 0,
  floaters: [],
};

const FPS_EMPTY: FpsHudState = {
  mode: "title",
  hp: 120,
  hpMax: 120,
  ammo: 14,
  mag: 14,
  reserve: 84,
  reloading: 0,
  wave: 0,
  kills: 0,
  gold: 0,
  toast: null,
  hit: 0,
  hurt: 0,
};

type Place = "citadel" | "walk" | "hall" | "starmap" | "launch" | "landrun" | "sightrun" | "sightdive" | "fpsgate" | "forgegate" | "kiln" | "bind" | "dengate" | "made" | "portal" | "sky" | "circuit" | "slash" | "fps";

export function RaisingApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RaisingHandle | null>(null);
  const skyRef = useRef<SkyHandle | null>(null);
  const slashRef = useRef<SlashHandle | null>(null);
  const fpsRef = useRef<FpsHandle | null>(null);
  const [place, setPlaceRaw] = useState<Place>("citadel");
  const setPlace = (next: Place) => {
    freezeTaps(1800);
    setPlaceRaw(next);
  };
  const [launchKind, setLaunchKind] = useState<"veil" | "sight">("veil");
  const [forgePath, setForgePath] = useState<"bot" | "hand">("hand");
  const [hallFocus, setHallFocus] = useState<string | null>(null);
  const [portal, setPortal] = useState<{ href: string; name: string; id?: string } | null>(null);
  const [portalFrom, setPortalFrom] = useState<"hall" | "made">("hall");
  const [bindFrom, setBindFrom] = useState<"kiln" | "made">("kiln");
  const [openVault, setOpenVault] = useState(false);
  const [hud, setHud] = useState<RaisingHud>(EMPTY);
  const [skyHud, setSkyHud] = useState<SkyHud>(SKY_EMPTY);
  const [slashHud, setSlashHud] = useState<SlashHudState>(SLASH_EMPTY);
  const [fpsHud, setFpsHud] = useState<FpsHudState>(FPS_EMPTY);
  const [bootError, setBootError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [pack, setPack] = useState(1);
  const [live, setLive] = useState(false);
  const [botOpen, setBotOpen] = useState(false);
  const mineRef = useRef(myLandId());
  const [landId, setLandId] = useState(() => readVisitFromUrl() || mineRef.current);
  const host = landId === mineRef.current;
  const resumePlay = useRef(false);
  const diveIn = useRef(false);
  const onPack = useCallback((n: number, isLive: boolean, _failed: number) => {
    setPack(n);
    setLive(isLive);
  }, []);
  const onBotLanded = useCallback((on: boolean, name: string) => {
    engineRef.current?.setBot(on, name);
  }, []);
  const onBotWork = useCallback((text: string) => {
    engineRef.current?.botWork(text);
  }, []);
  const onBotTeach = useCallback((text: string) => {
    engineRef.current?.teach(text);
  }, []);
  const onRename = useCallback((name: string) => {
    return engineRef.current?.setIsland(name) ?? false;
  }, []);
  const goLand = useCallback(
    (raw: string) => {
      const mine = mineRef.current;
      const next = parseLandCode(raw) || mine;
      resumePlay.current = hud.mode === "play" || hud.mode === "pause";
      setLandId(next);
      writeLandUrl(next, mine);
      setBotOpen(false);
    },
    [hud.mode],
  );

  useEffect(() => {
    (window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED = true;
    try {
      sessionStorage.removeItem("lc-place");
      localStorage.removeItem("lc-place");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (place === "citadel" || place === "hall" || place === "walk" || place === "starmap" || place === "landrun" || place === "launch" || place === "sightrun" || place === "sightdive" || place === "fpsgate" || place === "kiln" || place === "forgegate" || place === "bind" || place === "dengate" || place === "made" || place === "portal") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bag = window as unknown as {
      __LC_ENGINE?: { dispose: () => void };
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
    engineRef.current = null;
    skyRef.current = null;
    slashRef.current = null;
    fpsRef.current = null;

    if (place === "sky") {
      import("@/game/constellation-engine")
        .then(({ startSky }) => {
          if (disposed || !canvasRef.current) return;
          try {
            const handle = startSky(canvasRef.current, setSkyHud, () => setPlace("circuit"));
            skyRef.current = handle;
            bag.__LC_ENGINE = handle;
            bag.__LC_BOOTED = true;
            bag.__RAISING = true;
            setBootError(null);
          } catch (err) {
            setBootError(err instanceof Error ? err.message : "The sky failed to wake.");
          }
        })
        .catch((err) => {
          if (!disposed) setBootError(err instanceof Error ? err.message : "The sky failed to wake.");
        });
    } else if (place === "slash") {
      import("@/game/slash-engine")
        .then(({ startSlash }) => {
          if (disposed || !canvasRef.current) return;
          try {
            const handle = startSlash(canvasRef.current, setSlashHud);
            slashRef.current = handle;
            bag.__LC_ENGINE = handle;
            bag.__LC_BOOTED = true;
            bag.__RAISING = true;
            setBootError(null);
            handle.audio.setMuted(muted);
            if (diveIn.current) {
              diveIn.current = false;
              handle.start();
            }
          } catch (err) {
            setBootError(err instanceof Error ? err.message : "The Veil failed to wake.");
          }
        })
        .catch((err) => {
          if (!disposed) setBootError(err instanceof Error ? err.message : "The Veil failed to wake.");
        });
    } else if (place === "fps") {
      import("@/game/fps-engine")
        .then(({ startFps }) => {
          if (disposed || !canvasRef.current) return;
          try {
            const handle = startFps(canvasRef.current, setFpsHud);
            fpsRef.current = handle;
            bag.__LC_ENGINE = handle;
            bag.__LC_BOOTED = true;
            bag.__RAISING = true;
            setBootError(null);
            handle.audio.setMuted(muted);
            handle.start();
          } catch (err) {
            setBootError(err instanceof Error ? err.message : "The Sight failed to wake.");
          }
        })
        .catch((err) => {
          if (!disposed) setBootError(err instanceof Error ? err.message : "The Sight failed to wake.");
        });
    } else {
      import("@/game/raising-engine")
        .then(({ startRaising }) => {
          if (disposed || !canvasRef.current) return;
          try {
            const handle = startRaising(canvasRef.current, setHud, {
              host: landId === mineRef.current,
              landId,
            });
            engineRef.current = handle;
            bag.__LC_ENGINE = handle;
            bag.__LC_BOOTED = true;
            bag.__RAISING = true;
            bag.__LC_LAND = () => handle.land();
            setBootError(null);
            handle.audio.setMuted(muted);
            if (resumePlay.current || diveIn.current) {
              resumePlay.current = false;
              diveIn.current = false;
              handle.land();
            }
          } catch (err) {
            engineRef.current = null;
            setBootError(err instanceof Error ? err.message : "The crucible failed to wake.");
          }
        })
        .catch((err) => {
          if (!disposed) setBootError(err instanceof Error ? err.message : "The crucible failed to wake.");
        });
    }

    return () => {
      disposed = true;
      try {
        bag.__LC_ENGINE?.dispose();
      } catch {
        /* unmount */
      }
      bag.__LC_ENGINE = undefined;
    };
  }, [place, landId]);

  const onCircuit = place === "circuit" && !bootError;
  const playing = onCircuit && hud.mode === "play";
  const paused = place === "circuit" && hud.mode === "pause";
  const onSky = place === "sky" && !bootError;
  const onSlash = place === "slash" && !bootError;
  const onFps = place === "fps" && !bootError;
  const slashPlay = onSlash && slashHud.mode === "play";
  const fpsPlay = onFps && fpsHud.mode === "play";
  const pick = skyHud.pick;

  function landFromHall(id: string) {
    const a = artifactById(id as ArtifactId);
    diveIn.current = true;
    if (a?.enter === "slash") {
      setSlashHud((s) => ({ ...s, mode: "play" }));
      setPlace("slash");
    } else if (a?.enter === "fps") {
      setFpsHud((s) => ({ ...s, mode: "play" }));
      setPlace("fps");
    } else {
      setHud((h) => ({ ...h, mode: "play" }));
      setPlace("circuit");
    }
  }

  function landPick() {
    if (!pick?.open) return;
    if (pick.enter === "slash") setPlace("slash");
    else if (pick.enter === "fps") setPlace("fpsgate");
    else setPlace("circuit");
  }

  return (
    <div className={`circuit-root raising-root${onSlash || onFps || onCircuit ? " is-slash" : ""}`}>
      {(place === "sky" || place === "circuit" || place === "slash" || place === "fps") && (
        <canvas
          ref={canvasRef}
          className="circuit-canvas z-0"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            background: "#070918",
            touchAction: "none",
            pointerEvents: onSky || playing || paused || slashPlay || fpsPlay ? "auto" : "none",
          }}
        />
      )}

      {place === "citadel" && !bootError && (
        <CitadelHub
          onHall={() => setPlace("walk")}
          onConstellation={() => setPlace("sky")}
          onLand={() => setPlace("walk")}
        />
      )}

      {place === "walk" && !bootError && (
        <ZoneWalk
          onBack={() => setPlace("citadel")}
          onEnter={(id) => {
            if (id === "hall") {
              setHallFocus(null);
              setPlace("hall");
            }
            else if (id === "den") setPlace("dengate");
            else if (id === "forge") setPlace("forgegate");
            else if (id === "stars") setPlace("starmap");
          }}
        />
      )}

      {place === "dengate" && !bootError && (
        <DenGate
          startVault={openVault}
          focusId={hallFocus}
          onBack={() => { setOpenVault(false); setPlace("walk"); }}
          onPick={(id) => {
            if (id === "walker") setPlace("circuit");
          }}
          onBind={() => {
            setOpenVault(true);
            setBindFrom("made");
            setPlace("bind");
          }}
        />
      )}

      {place === "forgegate" && !bootError && (
        <ForgeGate
          onBack={() => setPlace("walk")}
          onPick={(id) => {
            setForgePath(id);
            setPlace("kiln");
          }}
        />
      )}

      {place === "kiln" && !bootError && (
        <ForgeKiln
          onBack={() => setPlace("forgegate")}
          onPick={(id) => {
            if (id === "new" && forgePath === "hand") {
              setBindFrom("kiln");
              setPlace("bind");
            }
          }}
        />
      )}

      {place === "bind" && !bootError && (
        <ForgeBind
          onBack={() => setPlace(bindFrom === "made" ? "dengate" : bindFrom)}
          onBound={(relic) => {
            setHallFocus(relic.id);
            if (bindFrom === "made") {
              setOpenVault(true);
              setPlace("dengate");
            } else setPlace("hall");
          }}
        />
      )}

      {place === "starmap" && !bootError && (
        <StarMap
          onLand={(id) => {
            if (id === "shatter-veil") {
              setLaunchKind("veil");
              setPlace("launch");
            } else if (id === "howl-sight") {
              setLaunchKind("sight");
              setPlace("launch");
            } else landFromHall(id);
          }}
          onBack={() => setPlace("citadel")}
        />
      )}

      {place === "launch" && !bootError && (
        <LaunchRun
          kind={launchKind}
          onLand={() => setPlace(launchKind === "sight" ? "sightrun" : "landrun")}
          onBack={() => setPlace("starmap")}
        />
      )}

      {place === "landrun" && !bootError && (
        <LandRun
          onLand={() => setPlace("slash")}
          onBack={() => setPlace("starmap")}
        />
      )}

      {place === "sightrun" && !bootError && (
        <SightRun
          onLand={() => setPlace("sightdive")}
          onBack={() => setPlace("starmap")}
        />
      )}

      {place === "sightdive" && !bootError && (
        <SightDive
          onLand={() => setPlace("fpsgate")}
          onBack={() => setPlace("starmap")}
        />
      )}

      {place === "fpsgate" && !bootError && (
        <FpsGate
          onPlay={() => setPlace("fps")}
          onBack={() => setPlace("starmap")}
        />
      )}

      {place === "hall" && !bootError && (
        <ArtifactHall
          onLand={landFromHall}
          onEnterSeed={(href, name, id) => {
            setPortal({ href, name, id });
            setPortalFrom("hall");
            setPlace("portal");
          }}
          onConstellation={() => setPlace("sky")}
          onHome={() => setPlace("citadel")}
          focusId={hallFocus}
        />
      )}

      {place === "portal" && portal && !bootError && (
        <RelicPortal
          href={portal.href}
          name={portal.name}
          id={portal.id}
          backLabel={portalFrom === "made" ? "Den" : "Hall"}
          onBack={() => setPlace(portalFrom)}
        />
      )}

      <Suspense fallback={null}>
      {onSlash && (
        <SlashHud
          hud={slashHud}
          muted={muted}
          onStart={() => slashRef.current?.start()}
          onCast={(id) => slashRef.current?.cast(id)}
          onStick={(x, y) => slashRef.current?.setStick(x, y)}
          onCitadel={() => setPlace("hall")}
          onClass={(id) => slashRef.current?.setClass(id)}
          onMute={() => {
            const next = !muted;
            setMuted(next);
            slashRef.current?.audio.setMuted(next);
          }}
        />
      )}

      {onFps && (
        <FpsHud
          hud={fpsHud}
          muted={muted}
          onStart={() => fpsRef.current?.start()}
          onStick={(x, y) => fpsRef.current?.setStick(x, y)}
          onLook={(x, y) => fpsRef.current?.setLook(x, y)}
          onFire={(v) => fpsRef.current?.setFire(v)}
          onReload={() => fpsRef.current?.setReload()}
          onCitadel={() => setPlace("hall")}
          onMute={() => {
            const next = !muted;
            setMuted(next);
            fpsRef.current?.audio.setMuted(next);
          }}
        />
      )}

      {onCircuit && (
        <>
          <CircuitNet
            key={landRoom(landId)}
            engineRef={engineRef}
            playing={playing}
            host={host}
            room={landRoom(landId)}
            onPack={onPack}
          />
          <CircuitHud
            hud={hud}
            pack={pack}
            live={live}
            onStart={() => {
              if (hud.mode === "pause") engineRef.current?.setMode("play");
              else engineRef.current?.land();
            }}
            onCitadel={() => setPlace("hall")}
            onAskBot={() => setBotOpen(true)}
            botOpen={botOpen}
          />
          <CircuitTrial playing={playing} hidden={botOpen} />
          <CircuitBot
            playing={playing}
            open={botOpen}
            onOpen={setBotOpen}
            onLanded={onBotLanded}
            onWork={onBotWork}
            onTeach={onBotTeach}
            onHall={() => setPlace("hall")}
            host={host}
            landId={landId}
            island={hud.island}
            mine={mineRef.current}
            skills={hud.skills}
            onVisit={goLand}
            onRename={onRename}
          />
        </>
      )}
      </Suspense>

      {onSky && (
        <div className="pointer-events-none absolute inset-0 z-10 hud-safe flex flex-col">
          <header className="raising-head raising-head-hall">
            <p className="raising-kicker">Boltverse</p>
            <div className="raising-toggle hall-toggle pointer-events-auto" role="tablist" aria-label="Sky view">
              <button type="button" role="tab" aria-selected={false} onClick={() => setPlace("citadel")}>
                Citadel
              </button>
              <button type="button" role="tab" aria-selected="true" data-on="true">
                Stars
              </button>
            </div>
          </header>
          <div className="flex-1 relative min-h-0">
            {skyHud.toast && <p className="raising-toast">{skyHud.toast}</p>}
          </div>
          <div className="raising-sky-card pointer-events-auto">
            <div className="raising-relics" role="listbox" aria-label="Worlds">
              {ARTIFACTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  role="option"
                  aria-selected={pick?.id === a.id}
                  aria-label={a.name}
                  data-id={a.id}
                  data-on={pick?.id === a.id ? "true" : undefined}
                  data-open={a.open ? "true" : undefined}
                  className="raising-relic"
                  onClick={() => skyRef.current?.select(a.id)}
                >
                  <span className="raising-relic-dot" data-id={a.id} />
                </button>
              ))}
            </div>
            <p className="raising-sky-name">{pick?.name ?? "Constellation"}</p>
            <p className="raising-sky-line">{pick?.line ?? "Swipe the sky. Tap a star."}</p>
            {pick?.open ? (
              <button type="button" className="raising-play" onClick={landPick}>
                Land
              </button>
            ) : (
              <p className="raising-sky-wait">Sealed</p>
            )}
          </div>
        </div>
      )}

      {bootError && (
        <div className="raising-gate">
          <div className="raising-gate-copy">
            <p className="raising-gate-kicker">Boltverse</p>
            <h1 className="raising-gate-title">The hall failed</h1>
            <p className="raising-gate-sub">{bootError}</p>
          </div>
          <div className="raising-gate-actions">
            <button type="button" className="raising-play" onClick={() => location.reload()}>
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
