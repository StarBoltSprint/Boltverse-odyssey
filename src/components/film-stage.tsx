import { useEffect, useRef, useState, type PointerEvent as PE } from "react";
import {
  FILM_BY_ID,
  gradeOf,
  prepareBeats,
  shardsOf,
  spotOf,
  type Beat,
  type Film,
  type FilmId,
  type Grade,
  type Lane,
  type Spot,
} from "@/game/films";
import { CANYON_APPROACH, projectHazard } from "@/game/canyon";
import { sfxHit, unlockAudio, startScore, stopScore, syncScore } from "@/game/film-audio";
import { press } from "@/lib/press";
import { HazardLayer } from "@/components/hazard-layer";

export type RunResult = {
  score: number;
  combo: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  relics: number;
  grade: Grade;
  shards: number;
  crashed: boolean;
  path?: "main" | "river" | "thicket";
  dusk?: boolean;
  hunter?: number;
};

type Pop = { id: number; text: string; x: number; y: number; tone: "ok" | "mid" | "bad" };
type Phase = "arm" | "run" | "crash" | "done";

const APPROACH = 1.55;
const HOLD_NEED_DEFAULT = 520;

type Props = {
  id: FilmId;
  original: boolean;
  echoSrc?: string | null;
  custom?: Film;
  onExit: () => void;
  onDone: (result: RunResult) => void;
  onCook?: (seed: { frame: string; path: "main" | "river" | "thicket"; dusk: boolean; hunter: number; crashed: boolean; grade: Grade }) => void;
};

type G = {
  beats: Beat[];
  i: number;
  resolved: boolean;
  hits: number;
  hold: number;
  holding: boolean;
  combo: number;
  maxCombo: number;
  score: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  relics: number;
  streakMiss: number;
  rewind: number;
  trauma: number;
  hitstop: number;
  rate: number;
  crashed: boolean;
  done: boolean;
  fakeT: number;
  seed: number;
  charted: boolean;
  resonance: number;
};

function fresh(beats: Beat[], seed?: number, rewind = 3): G {
  const s = seed ?? ((Math.random() * 0x7fffffff) | 0);
  return {
    beats,
    i: 0,
    resolved: false,
    hits: 0,
    hold: 0,
    holding: false,
    combo: 0,
    maxCombo: 0,
    score: 0,
    perfect: 0,
    great: 0,
    good: 0,
    miss: 0,
    relics: 0,
    streakMiss: 0,
    rewind,
    trauma: 0,
    hitstop: 0,
    rate: 1,
    crashed: false,
    done: false,
    fakeT: 0,
    seed: s,
    charted: false,
    resonance: 0.08,
  };
}

function isHitKey(code: string) {
  return (
    code === "Space" ||
    code === "KeyK" ||
    code === "Enter" ||
    code === "KeyW" ||
    code === "KeyS" ||
    code === "ArrowUp" ||
    code === "ArrowDown" ||
    code === "Digit2"
  );
}

function swipeLaneOfKey(code: string): Lane | null {
  if (code === "KeyA" || code === "ArrowLeft" || code === "Digit1") return "l";
  if (code === "KeyD" || code === "ArrowRight" || code === "Digit3") return "r";
  return null;
}

function liveSpot(beat: Beat, t: number): Spot {
  if (!beat.canyon) return spotOf(beat);
  const p = Math.max(0, Math.min(1, 1 - (beat.at - t) / CANYON_APPROACH));
  const pr = projectHazard(beat.canyon, p);
  return { x: pr.x, y: pr.y };
}

function nearSpot(nx: number, ny: number, spot: Spot, box: DOMRect) {
  const dx = (nx - spot.x) * box.width;
  const dy = (ny - spot.y) * box.height;
  return dx * dx + dy * dy <= 110 * 110;
}

export function FilmStage({ id, original, echoSrc, custom, onExit, onDone }: Props) {
  const film = custom ?? FILM_BY_ID[id];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const gRef = useRef<G>(fresh(film.beats, undefined, film.hazards ? 4 : 3));
  const offsetRef = useRef(0);
  const plateRef = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);
  const popN = useRef(0);
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null);
  const reduced = useRef(false);
  const doneSent = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const [live, setLive] = useState(false);
  const [phase, setPhase] = useState<Phase>(film.pad === "arrows" || film.id === "sprint" ? "run" : "arm");
  const [hud, setHud] = useState({
    score: 0,
    combo: 0,
    i: 0,
    rewind: film.hazards ? 4 : 3,
    hold: 0,
    mash: 0,
    need: 1,
    t: 0,
    dur: film.chart,
    total: film.beats.length,
    resonance: 0.08,
  });
  const [pops, setPops] = useState<Pop[]>([]);
  const [shake, setShake] = useState({ x: 0, y: 0, rot: 0 });
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [flash, setFlash] = useState(0);
  const [nowBeat, setNowBeat] = useState<Beat | null>(film.beats[0] ?? null);
  const [portrait, setPortrait] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.innerHeight > window.innerWidth || window.matchMedia("(pointer: coarse)").matches),
  );
  const [src, setSrc] = useState(() =>
    echoSrc
      ? echoSrc
      : original
        ? film.origin
        : typeof window !== "undefined" && window.innerHeight >= window.innerWidth * 0.95
          ? film.portrait
          : film.local,
  );
  const [poster, setPoster] = useState(() =>
    typeof window !== "undefined" && window.innerHeight >= window.innerWidth * 0.95 ? film.portraitStill : film.still,
  );
  const [usingStill, setUsingStill] = useState(false);
  const usingStillRef = useRef(false);
  usingStillRef.current = usingStill;
  const phaseRef = useRef<Phase>("arm");
  phaseRef.current = phase;
  const lastHudAt = useRef(0);
  const lastHudI = useRef(-1);
  const lastShakeOn = useRef(false);
  const lastRate = useRef(1);
  const coarse = useRef(false);

  useEffect(() => {
    return () => stopScore();
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    coarse.current = window.matchMedia("(pointer: coarse)").matches;
    const apply = () => {
      const tall = window.innerHeight > window.innerWidth || window.matchMedia("(pointer: coarse)").matches;
      setPortrait(tall);
    };
    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  useEffect(() => {
    unlockAudio();
    const v = videoRef.current;
    const seed = (Math.random() * 0x7fffffff) | 0;
    gRef.current = fresh(prepareBeats(film, film.chart, seed, original), seed, film.lives === 1 ? 0 : film.hazards ? 4 : 3);
    gRef.current.charted = Boolean(film.playlist?.length);
    doneSent.current = false;
    offsetRef.current = 0;
    plateRef.current = 0;
    const list = film.playlist;
    const nextSrc = list?.[0] ?? (original ? film.origin : portrait ? film.portrait : film.local);
    setSrc(nextSrc);
    setPoster(portrait ? film.portraitStill : film.still);
    setLive(false);
    setUsingStill(false);
    setPhase(film.pad === "arrows" || film.id === "sprint" ? "run" : "arm");
    if (!v) return;
    v.muted = true;
    v.loop = false;
    v.playsInline = true;
    v.playbackRate = 1;
    v.pause();
    const ready = () => setLive(true);
    if (v.readyState >= 2) ready();
    v.addEventListener("canplay", ready);
    v.addEventListener("loadedmetadata", () => {
      if (v.duration > 1 && !film.playlist) {
        const g = gRef.current;
        g.beats = prepareBeats(film, v.duration, g.seed, original);
        g.charted = true;
        g.i = 0;
      }
    });
    return () => {
      v.removeEventListener("canplay", ready);
      v.pause();
    };
  }, [film, original]);

  useEffect(() => {
    if (original) return;
    if (film.playlist?.length) return;
    setSrc(portrait ? film.portrait : film.local);
    setPoster(portrait ? film.portraitStill : film.still);
  }, [portrait, film, original]);

  useEffect(() => {
    if (phase !== "run") return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.defaultMuted = true;
    const kick = () => {
      void v.play().then(() => {
        setLive(true);
        setUsingStill(false);
      }).catch(() => {
        /* keep trying — do not freeze on the still */
      });
    };
    if (v.readyState >= 2) kick();
    v.addEventListener("canplay", kick);
    v.addEventListener("playing", () => {
      setLive(true);
      setUsingStill(false);
    });
    kick();
    if (film.score) startScore(film.score, 0);
    return () => v.removeEventListener("canplay", kick);
  }, [phase, src]);

  useEffect(() => {
    const tick = (now: number) => {
      const dt = Math.min((now - (last.current || now)) / 1000, 0.1);
      last.current = now;
      const g = gRef.current;
      const v = videoRef.current;
      if (g.hitstop > 0) {
        g.hitstop -= dt;
        if (v && !v.paused && !reduced.current) v.pause();
      } else if (v && v.paused && phaseRef.current === "run") {
        void v.play().then(() => { if (!live) setLive(true); }).catch(() => {});
      }

      let t = 0;
      if (usingStill) {
        g.fakeT += dt;
        t = g.fakeT;
      } else if (v) {
        t = offsetRef.current + v.currentTime;
        if (v.duration && !g.charted && v.duration > 1 && !film.playlist) {
          g.beats = prepareBeats(film, v.duration, g.seed, original);
          g.charted = true;
        }
      }
      if (film.score && phaseRef.current === "run") syncScore(t);

      g.trauma = Math.max(0, g.trauma - dt * 2.4);
      if (phaseRef.current === "run") {
        if (g.combo > 0) g.resonance = Math.min(1, g.resonance + dt * (0.018 + Math.min(10, g.combo) * 0.006));
        else g.resonance = Math.max(0.05, g.resonance - dt * 0.035);
      }
      const sh = g.trauma * g.trauma;
      if (!reduced.current && sh > 0.002) {
        setShake({
          x: (Math.sin(now * 0.053) * 10 + Math.cos(now * 0.031) * 6) * sh,
          y: (Math.cos(now * 0.047) * 8) * sh,
          rot: Math.sin(now * 0.02) * 1.4 * sh,
        });
        lastShakeOn.current = true;
      } else if (lastShakeOn.current) {
        setShake({ x: 0, y: 0, rot: 0 });
        lastShakeOn.current = false;
      }
      const targetRate = g.crashed
        ? 0
        : Math.max(0.94, Math.min(1.16, 1 + g.resonance * 0.14 - g.streakMiss * 0.05));
      g.rate += (targetRate - g.rate) * (1 - Math.exp(-8 * dt));
      if (v && !reduced.current && !coarse.current && g.hitstop <= 0 && !g.crashed) {
        const r = Math.round(g.rate * 20) / 20;
        if (r !== lastRate.current) {
          lastRate.current = r;
          v.playbackRate = r;
        }
      }

      const beat = g.beats[g.i] ?? null;
      if (beat && phaseRef.current === "run" && !g.resolved) {
        if (g.holding && beat.kind === "hold" && Math.abs(t - beat.at) < beat.win) g.hold += dt * 1000;
        const late = t > beat.at + beat.win * 0.55;
        if (beat.kind === "hold" && g.hold >= beat.holdMs && Math.abs(t - beat.at) < beat.win) {
          judge(g, beat, Math.abs(t - beat.at));
        } else if (late) {
          miss(g, beat);
        }
      }

      if (
        phaseRef.current === "run" &&
        (t >= (v?.duration || film.chart) - 0.05 || (usingStill && t >= film.chart))
      ) {
        finish(g);
      }

      const nextHud = {
        score: g.score,
        combo: g.combo,
        i: g.i,
        rewind: g.rewind,
        hold: beat?.kind === "hold" ? Math.min(1, g.hold / (beat.holdMs || HOLD_NEED_DEFAULT)) : 0,
        mash: beat?.kind === "mash" ? g.hits : 0,
        need: beat?.need ?? 1,
        t,
        dur: v?.duration || film.chart,
        total: g.beats.length,
        resonance: g.resonance,
      };
      const due = now - lastHudAt.current > (coarse.current ? 80 : 48);
      if (phaseRef.current === "run" && (due || g.i !== lastHudI.current)) {
        lastHudAt.current = now;
        lastHudI.current = g.i;
        setHud(nextHud);
        setNowBeat(beat);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // phase/live/usingStill intentionally rebind the loop
  }, [phase, live, usingStill, film]);

  function pop(text: string, tone: Pop["tone"], x = 50, y = 42) {
    const item: Pop = { id: ++popN.current, text, x, y, tone };
    setPops((p) => [...p.slice(-7), item]);
    window.setTimeout(() => setPops((p) => p.filter((n) => n.id !== item.id)), 720);
  }

  function finish(g: G) {
    if (g.done) return;
    g.done = true;
    const total = g.perfect + g.great + g.good + g.miss;
    const grade = gradeOf(g.perfect, g.great, g.good, g.miss, total);
    const shards = shardsOf(g.perfect, g.great, g.good, g.relics, grade);
    setPhase("done");
    videoRef.current?.pause();
    stopScore();
    if (!doneSent.current) {
      doneSent.current = true;
      onDoneRef.current({
        score: g.score,
        combo: g.maxCombo,
        perfect: g.perfect,
        great: g.great,
        good: g.good,
        miss: g.miss,
        relics: g.relics,
        grade,
        shards,
        crashed: g.crashed,
      });
    }
  }

  function miss(g: G, beat: Beat) {
    if (g.resolved) return;
    g.resolved = true;
    g.miss += 1;
    g.combo = 0;
    g.streakMiss += 1;
    g.trauma = Math.min(1, g.trauma + 0.45);
    g.resonance = Math.max(0.04, g.resonance * 0.32);
    sfxHit("miss");
    pop("MISS", "bad", liveSpot(beat, usingStill ? g.fakeT : (videoRef.current?.currentTime ?? 0)).x * 100, liveSpot(beat, usingStill ? g.fakeT : (videoRef.current?.currentTime ?? 0)).y * 100);
    setFlash(1);
    window.setTimeout(() => setFlash(0), 120);
    if (g.streakMiss >= (film.lives ?? 3)) {
      g.crashed = true;
      setPhase("crash");
      videoRef.current?.pause();
      stopScore();
      return;
    }
    advance(g);
  }

  function judge(g: G, beat: Beat, err: number) {
    if (g.resolved) return;
    const perfectCut = beat.kind === "hold" ? 0.28 : 0.12;
    const greatCut = beat.kind === "hold" ? 0.5 : 0.28;
    let word: "perfect" | "great" | "good" = "good";
    let pts = 120;
    if (err <= perfectCut) {
      word = "perfect";
      pts = 320;
      g.perfect += 1;
      g.hitstop = reduced.current ? 0 : 0.055;
      g.trauma = Math.min(1, g.trauma + 0.22);
    } else if (err <= greatCut) {
      word = "great";
      pts = 210;
      g.great += 1;
      g.trauma = Math.min(1, g.trauma + 0.12);
    } else {
      g.good += 1;
    }
    g.resolved = true;
    g.combo += 1;
    g.maxCombo = Math.max(g.maxCombo, g.combo);
    g.streakMiss = 0;
    g.resonance = Math.min(1, g.resonance + (word === "perfect" ? 0.07 : word === "great" ? 0.045 : 0.025));
    const mult = 1 + Math.min(8, g.combo) * 0.12;
    g.score += Math.round(pts * mult);
    if (beat.kind === "relic") g.relics += 1;
    sfxHit(beat.kind === "relic" ? "relic" : word);
    pop(word.toUpperCase(), word === "good" ? "mid" : "ok", liveSpot(beat, usingStill ? g.fakeT : (videoRef.current?.currentTime ?? 0)).x * 100, liveSpot(beat, usingStill ? g.fakeT : (videoRef.current?.currentTime ?? 0)).y * 100);
    advance(g);
  }

  function advance(g: G) {
    g.i += 1;
    g.resolved = false;
    g.hits = 0;
    g.hold = 0;
    g.holding = false;
    if (g.i >= g.beats.length) {
      window.setTimeout(() => finish(g), 380);
    }
  }

  function tryHit(nx?: number, ny?: number, swipe?: Lane) {
    const g = gRef.current;
    if (phaseRef.current !== "run" || g.crashed) return;
    const v = videoRef.current;
    const t = usingStill ? g.fakeT : (v?.currentTime ?? 0);
    const beat = g.beats[g.i];
    if (!beat || g.resolved) return;
    if (Math.abs(t - beat.at) > beat.win) {
      if (t < beat.at && beat.at - t < APPROACH) {
        pop("SOON", "mid", spotOf(beat).x * 100, spotOf(beat).y * 100);
      }
      return;
    }
    const spot = liveSpot(beat, t);
    const box = wrapRef.current?.getBoundingClientRect();
    if (nx != null && ny != null && box && !nearSpot(nx, ny, spot, box)) return;

    if (beat.kind === "swipe") {
      if (!swipe) return;
      if (swipe !== beat.lane) {
        miss(g, beat);
        return;
      }
      judge(g, beat, Math.abs(t - beat.at));
      return;
    }
    if (beat.kind === "mash") {
      g.hits += 1;
      sfxHit("good");
      if (g.hits >= beat.need) judge(g, beat, Math.abs(t - beat.at));
      return;
    }
    if (beat.kind === "hold") return;
    if (beat.kind === "left" || beat.kind === "right") return;
    judge(g, beat, Math.abs(t - beat.at));
  }

  function hitArrow(lane: Lane) {
    const g = gRef.current;
    if (phaseRef.current !== "run" || g.crashed) return;
    const v = videoRef.current;
    const t = usingStill ? g.fakeT : (v?.currentTime ?? 0);
    const beat = g.beats[g.i];
    if (!beat || g.resolved) return;
    if (beat.kind !== "left" && beat.kind !== "right") return;
    if (Math.abs(t - beat.at) > beat.win) {
      if (t < beat.at && beat.at - t < APPROACH) pop("SOON", "mid", 50, 72);
      return;
    }
    const want: Lane = beat.kind === "left" ? "l" : "r";
    if (lane !== want) {
      miss(g, beat);
      return;
    }
    judge(g, beat, Math.abs(t - beat.at));
  }

  function rewind() {
    const g = gRef.current;
    if (g.rewind <= 0 || g.done) return;
    const target = g.beats[g.i];
    g.rewind -= 1;
    g.crashed = false;
    g.resolved = false;
    g.hits = 0;
    g.hold = 0;
    g.holding = false;
    g.streakMiss = 0;
    g.trauma = 0.2;
    sfxHit("rewind");
    const v = videoRef.current;
    const t = Math.max(0, (target?.at ?? 0) - 0.85);
    if (usingStillRef.current) g.fakeT = t;
    else if (v) v.currentTime = t;
    setPhase("run");
    void v?.play().catch(() => {});
    pop("REWIND", "mid", 50, 40);
  }

  function onKey(e: KeyboardEvent) {
    if (e.code === "Escape") {
      onExit();
      return;
    }
    if (e.code === "KeyR") {
      e.preventDefault();
      rewind();
      return;
    }
    if (e.repeat) return;
    const g = gRef.current;
    const beat = g.beats[g.i];
    const swipe = swipeLaneOfKey(e.code);
    if (beat?.kind === "left" || beat?.kind === "right") {
      if (!swipe) return;
      e.preventDefault();
      hitArrow(swipe);
      return;
    }
    if (beat?.kind === "swipe") {
      if (!swipe) return;
      e.preventDefault();
      tryHit(undefined, undefined, swipe);
      return;
    }
    if (swipe || isHitKey(e.code)) {
      e.preventDefault();
      if (beat?.kind === "hold") g.holding = true;
      tryHit();
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (isHitKey(e.code) || swipeLaneOfKey(e.code)) gRef.current.holding = false;
  }

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  function pointerDown(e: PE<HTMLDivElement>) {
    swipe.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  }

  function pointerUp(e: PE<HTMLDivElement>) {
    const g = gRef.current;
    g.holding = false;
    const start = swipe.current;
    swipe.current = null;
    const beat = g.beats[g.i];
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box || !beat || !start) return;
    if (beat.kind === "left" || beat.kind === "right") {
      const dx = e.clientX - start.x;
      const dir: Lane =
        Math.abs(dx) >= 36 ? (dx < 0 ? "l" : "r") : (e.clientX - box.left) / box.width < 0.5 ? "l" : "r";
      hitArrow(dir);
      return;
    }
    if (beat.kind !== "swipe") return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) < 42) return;
    const nx = (start.x - box.left) / box.width;
    const ny = (start.y - box.top) / box.height;
    const dir: Lane = dx < 0 ? "l" : "r";
    tryHit(nx, ny, dir);
  }

  function onMarkDown(e: PE<HTMLButtonElement>, beat: Beat) {
    e.stopPropagation();
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* some mobile browsers refuse capture */
    }
    swipe.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    const g = gRef.current;
    if (beat.kind === "hold") g.holding = true;
    if (beat.kind === "swipe") return;
    tryHit();
  }

  const heat = Math.min(1, hud.combo / 10);
  const lookAmt = portrait ? 4 : 8;

  return (
    <div
      ref={wrapRef}
      className="relative h-dvh w-full overflow-hidden bg-bg text-fg select-none"
      style={{ touchAction: film.pad === "arrows" ? "none" : "manipulation" }}
      onPointerDown={pointerDown}
      onPointerUp={pointerUp}
      onPointerCancel={() => {
        gRef.current.holding = false;
        swipe.current = null;
      }}
      onPointerMove={(e) => {
        if (coarse.current) return;
        const box = wrapRef.current?.getBoundingClientRect();
        if (!box) return;
        const nx = ((e.clientX - box.left) / box.width - 0.5) * 2;
        const ny = ((e.clientY - box.top) / box.height - 0.5) * 2;
        setLook({ x: nx, y: ny });
      }}
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: reduced.current
            ? undefined
            : `translate3d(${shake.x + look.x * lookAmt}px, ${shake.y + look.y * lookAmt}px, 0)`,
        }}
      >
        <video
          ref={videoRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover bg-bg"
          src={src}
          poster={poster}
          playsInline
          muted
          autoPlay={phase === "run"}
          preload="auto"
          onPlaying={() => {
            setLive(true);
            setUsingStill(false);
          }}
          onEnded={() => {
            const list = film.playlist;
            const v = videoRef.current;
            if (!list || !v) return;
            const i = plateRef.current;
            if (i + 1 >= list.length) return;
            offsetRef.current += v.duration || 10;
            plateRef.current = i + 1;
            setSrc(list[i + 1]);
          }}
          onError={() => {
            if (src === film.origin && film.origin !== film.portrait) setSrc(portrait ? film.portrait : film.local);
            else if (src === film.portrait && film.portrait !== film.local) setSrc(film.local);
          }}
        />
        {usingStill && !live && (
          <img src={poster} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover bg-bg" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(7,8,12,0.34)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `rgba(158, 201, 212, ${heat * 0.05})` }}
      />
      {phase === "crash" && <div className="pointer-events-none absolute inset-0 bg-bg/40" />}
      <div
        className="pointer-events-none absolute inset-0 bg-fg mix-blend-overlay"
        style={{ opacity: flash * 0.14 }}
      />

      {pops.map((p) => (
        <div
          key={p.id}
          className={`pointer-events-none absolute z-20 font-display text-2xl tracking-wide ${
            p.tone === "ok" ? "text-ice" : p.tone === "bad" ? "text-danger" : "text-accent"
          }`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, animation: "pop-float 700ms ease-out forwards" }}
        >
          {p.text}
        </div>
      ))}

      {phase === "run" && film.hazards && !original && (
        <HazardLayer
          beats={gRef.current.beats}
          getClock={() => {
            const g = gRef.current;
            const beat = g.beats[g.i];
            const v = videoRef.current;
            const t = usingStill ? g.fakeT : v?.currentTime ?? 0;
            return {
              t,
              i: g.i,
              hold: beat?.kind === "hold" ? Math.min(1, g.hold / (beat.holdMs || HOLD_NEED_DEFAULT)) : 0,
              mash: beat?.kind === "mash" ? g.hits : 0,
              need: beat?.need ?? 1,
            };
          }}
          reduced={reduced.current}
          onMarkDown={onMarkDown}
          onMarkUp={(e) => {
            e.stopPropagation();
            pointerUp(e as unknown as PE<HTMLDivElement>);
          }}
        />
      )}
      {phase === "run" && film.pad === "arrows" && (
        <CutWash beat={gRef.current.beats[hud.i]} t={hud.t} />
      )}
      {phase === "run" && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-40 pb-[max(0.55rem,env(safe-area-inset-bottom))]">
          <Resonance value={hud.resonance} />
        </div>
      )}
      {phase === "run" && !(film.hazards && !original) && film.pad !== "arrows" && (
        <Marks
          beats={gRef.current.beats}
          index={hud.i}
          t={hud.t}
          hud={hud}
          onMarkDown={onMarkDown}
          onMarkUp={(e) => {
            e.stopPropagation();
            pointerUp(e as unknown as PE<HTMLDivElement>);
          }}
        />
      )}

      <header className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-start justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="min-w-0">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              className="min-h-12 shrink-0 rounded-xl border border-line bg-surface/80 px-3 text-sm text-muted"
              {...press(onExit)}
            >
              Leave
            </button>
            {film.lives !== 1 && (
            <button
              type="button"
              className="min-h-12 shrink-0 rounded-xl border border-line bg-surface/80 px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted disabled:opacity-40"
              disabled={hud.rewind <= 0}
              {...press(rewind)}
            >
              Rewind {hud.rewind}
            </button>
            )}
          </div>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{film.keeper}</p>
          <h1 className="font-display text-2xl leading-tight">{film.name}</h1>
        </div>
        <div className="text-right font-mono tabular-nums">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Score</p>
          <p className="text-xl text-accent">{hud.score}</p>
          <p className="text-sm text-ice">{hud.combo > 1 ? `${hud.combo}x` : "—"}</p>
          {film.hazards && (
            <p className="text-[11px] text-muted">
              {Math.min(hud.i + 1, hud.total)}/{hud.total}
            </p>
          )}
        </div>
      </header>

      {film.hazards && phase === "run" && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-[3px] bg-line/40">
          <div className="h-full bg-ice/80" style={{ width: `${hud.dur > 0 ? Math.min(100, (hud.t / hud.dur) * 100) : 0}%` }} />
        </div>
      )}

      {phase === "arm" && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-bg/55 px-6 text-center"
          style={{ pointerEvents: "auto", touchAction: "manipulation" }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (phaseRef.current !== "arm") return;
            try {
              unlockAudio();
            } catch {
              /* */
            }
            const v = videoRef.current;
            const g = gRef.current;
            g.fakeT = 0;
            g.i = 0;
            g.resolved = false;
            if (!g.charted) {
              g.beats = prepareBeats(film, v?.duration || film.chart, g.seed, original);
              g.charted = true;
            }
            if (v) {
              try {
                v.currentTime = 0;
              } catch {
                /* */
              }
              void v.play().then(() => setLive(true)).catch(() => setUsingStill(true));
            } else {
              setUsingStill(true);
            }
            setPhase("run");
          }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">Living film</p>
          <h2 className="font-display text-4xl">{film.verb}</h2>
          <p className="max-w-sm text-muted">
            {echoSrc
              ? "This cut grew from your howl. Three hits. Same tap-or-die."
              : film.id === "sprint"
              ? "StarBoltSprint is in the cut. Vault the log, dodge the branch, slide the root — or the run breaks."
              : film.hazards
                ? "Ice grows out of the canyon. Strike the shard, or the cut breaks."
                : `${film.line}. Marks bloom on the picture — hit them or the cut breaks.`}
          </p>
          <span className="relative z-50 min-h-14 rounded-xl bg-accent px-8 py-3 text-base font-medium text-bg">
            Enter the reel
          </span>
        </div>
      )}

      {phase === "crash" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-bg/70 px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-danger">Film fracture</p>
          <h2 className="font-display text-4xl">{film.lives === 1 ? "One miss" : "The cut broke"}</h2>
          <p className="max-w-sm text-muted">
            {film.lives === 1 ? "The line is dead. Start the minute again." : "Three misses. Rewind the frame or leave the den."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {film.lives !== 1 && (
            <button
              type="button"
              disabled={hud.rewind <= 0}
              className="min-h-12 rounded-xl bg-accent px-5 text-sm font-medium text-bg disabled:opacity-40"
              {...press(rewind)}
            >
              Rewind
            </button>
            )}
            {film.lives === 1 && (
            <button
              type="button"
              className="min-h-12 rounded-xl bg-accent px-5 text-sm font-medium text-bg"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const seed = (Math.random() * 0x7fffffff) | 0;
                const v = videoRef.current;
                gRef.current = fresh(prepareBeats(film, v?.duration || film.chart, seed, original), seed, 0);
                gRef.current.charted = true;
                doneSent.current = false;
                setUsingStill(false);
                setLive(true);
                setPhase("run");
                if (v) {
                  try { v.currentTime = 0; } catch { /* */ }
                  void v.play().catch(() => {});
                }
                if (film.score) startScore(film.score, 0);
              }}
            >
              Run it again
            </button>
            )}
            <button type="button" className="min-h-12 rounded-xl border border-line px-5 text-sm" {...press(onExit)}>
              Leave
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Resonance({ value }: { value: number }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="pointer-events-none px-6">
      <div className="h-[5px] overflow-hidden rounded-full bg-line/40">
        <div
          className="h-full rounded-full"
          style={{
            width: `${v * 100}%`,
            background: "linear-gradient(90deg, #3d6a78 0%, #9ec9d4 58%, #f2fbff 100%)",
            boxShadow: v > 0.18 ? `0 0 ${8 + v * 20}px rgba(158,201,212,${0.2 + v * 0.5})` : "none",
            transition: "width 180ms linear",
          }}
        />
      </div>
    </div>
  );
}

function CutWash({ beat, t }: { beat?: Beat; t: number }) {
  if (!beat || (beat.kind !== "left" && beat.kind !== "right")) return null;
  const dt = beat.at - t;
  if (dt > 1.45 || dt < -beat.win) return null;
  const live = Math.abs(t - beat.at) < beat.win;
  const k = live ? 1 : Math.max(0, 1 - dt / 1.45);
  const left = beat.kind === "left";
  const glow = live ? 0.55 : 0.22 + k * 0.28;
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        className="absolute inset-0"
        style={{
          background: left
            ? `linear-gradient(90deg, rgba(158,201,212,${glow}) 0%, rgba(90,170,210,${glow * 0.35}) 28%, transparent 58%)`
            : `linear-gradient(270deg, rgba(158,201,212,${glow}) 0%, rgba(90,170,210,${glow * 0.35}) 28%, transparent 58%)`,
        }}
      />
      <div
        className="absolute bottom-[18%] h-[22%]"
        style={{
          left: left ? "0%" : "42%",
          width: "58%",
          background: left
            ? `linear-gradient(90deg, rgba(232,180,80,${0.15 + k * 0.35}) 0%, rgba(158,201,212,${0.2 + k * 0.4}) 40%, transparent 100%)`
            : `linear-gradient(270deg, rgba(232,180,80,${0.15 + k * 0.35}) 0%, rgba(158,201,212,${0.2 + k * 0.4}) 40%, transparent 100%)`,
          filter: `blur(${6 + k * 8}px)`,
        }}
      />
      {live && (
        <div
          className="absolute top-[28%] h-[44%] w-[3px]"
          style={{
            left: left ? "18%" : "auto",
            right: left ? "auto" : "18%",
            background: "linear-gradient(180deg, transparent, #9ec9d4, #fff, #9ec9d4, transparent)",
            boxShadow: "0 0 18px 4px rgba(158,201,212,0.7)",
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
}

function Marks({
  beats,
  index,
  t,
  hud,
  onMarkDown,
  onMarkUp,
}: {
  beats: Beat[];
  index: number;
  t: number;
  hud: { hold: number; mash: number; need: number };
  onMarkDown: (e: PE<HTMLButtonElement>, beat: Beat) => void;
  onMarkUp: (e: PE<HTMLButtonElement>) => void;
}) {
  const visible = beats.filter((b, i) => {
    if (i < index) return false;
    const until = b.at - t;
    return until < APPROACH && until > -b.win * 0.35;
  });

  return (
    <>
      {visible.map((beat) => {
        const spot = spotOf(beat);
        const until = beat.at - t;
        const p = Math.max(0, Math.min(1, 1 - until / APPROACH));
        const current = beat.id === beats[index]?.id;
        if (!current) {
          const cur = beats[index];
          if (cur) {
            const c = spotOf(cur);
            if ((c.x - spot.x) ** 2 + (c.y - spot.y) ** 2 < 0.065) return null;
          }
        }
        const round = beat.kind === "relic" ? "rounded-full" : "rounded-2xl";
        const sub =
          beat.kind === "mash"
            ? ` ${hud.mash}/${hud.need}`
            : beat.kind === "hold"
              ? ` ${Math.round(hud.hold * 100)}%`
              : beat.kind === "swipe"
                ? beat.lane === "l"
                  ? " ←"
                  : " →"
                : "";
        return (
          <button
            key={beat.id}
            type="button"
            aria-label={beat.label}
            className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border ${round} ${
              current ? "border-ice bg-bg/85 text-ice" : "pointer-events-none border-line bg-bg/55 text-muted"
            }`}
            style={{
              left: `${spot.x * 100}%`,
              top: `${spot.y * 100}%`,
              width: current ? 96 : 80,
              height: current ? 96 : 80,
              opacity: 0.45 + p * 0.55,
              animation: reducedMotion() ? undefined : "mark-bloom 280ms ease-out",
            }}
            onPointerDown={(e) => onMarkDown(e, beat)}
            onPointerUp={onMarkUp}
            onPointerCancel={onMarkUp}
          >
            <span
              className={`pointer-events-none absolute rounded-full border border-ice/55 ${round}`}
              style={{
                inset: "-22%",
                transform: `scale(${Math.max(1, 2.15 - p * 1.15)})`,
                opacity: 0.2 + p * 0.65,
              }}
            />
            <span className="relative px-1 text-center font-display text-sm leading-tight">
              {beat.label}
              {current ? sub : ""}
            </span>
            {current && beat.kind === "hold" && (
              <span
                className="pointer-events-none absolute right-2 bottom-2 left-2 h-1 overflow-hidden rounded-full bg-line"
              >
                <span className="block h-full bg-hold" style={{ width: `${hud.hold * 100}%` }} />
              </span>
            )}
          </button>
        );
      })}
    </>
  );
}

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
