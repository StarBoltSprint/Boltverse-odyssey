let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let music: GainNode | null = null;
let pad: OscillatorNode | null = null;
let padGain: GainNode | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      try {
        ctx = new Ctor({ latencyHint: "interactive" });
      } catch {
        ctx = new Ctor();
      }
      master = ctx.createGain();
      sfx = ctx.createGain();
      music = ctx.createGain();
      master.gain.value = 0.72;
      sfx.gain.value = 0.9;
      music.gain.value = 0.18;
      sfx.connect(master);
      music.connect(master);
      master.connect(ctx.destination);
    } catch {
      return null;
    }
  }
  return ctx;
}

export function unlockAudio() {
  try {
    const c = ac();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
  } catch {
    /* never block UI */
  }
}

export function setMuted(muted: boolean) {
  const c = ac();
  if (!c || !master) return;
  master.gain.setTargetAtTime(muted ? 0 : 0.72, c.currentTime, 0.04);
  if (scoreEl) scoreEl.muted = muted;
}

function tone(freq: number, dur: number, type: OscillatorType, gain = 0.16, dest?: GainNode) {
  const c = ac();
  if (!c || !sfx) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g);
  g.connect(dest ?? sfx);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

export function sfxHit(kind: "perfect" | "great" | "good" | "miss" | "relic" | "rewind") {
  const c = ac();
  if (!c) return;
  const jitter = 0.96 + Math.random() * 0.08;
  if (kind === "perfect") {
    tone(880 * jitter, 0.12, "sine", 0.14);
    tone(1320 * jitter, 0.18, "triangle", 0.07);
  } else if (kind === "great") {
    tone(660 * jitter, 0.11, "sine", 0.12);
  } else if (kind === "good") {
    tone(494 * jitter, 0.1, "triangle", 0.1);
  } else if (kind === "miss") {
    tone(110 * jitter, 0.18, "sawtooth", 0.08);
  } else if (kind === "relic") {
    tone(988 * jitter, 0.22, "sine", 0.12);
    tone(1480 * jitter, 0.28, "triangle", 0.06);
  } else {
    tone(196, 0.28, "sine", 0.1);
    tone(147, 0.34, "triangle", 0.06);
  }
}

export function startPad() {
  try {
    const c = ac();
    if (!c || !music) return;
    if (pad && padGain) {
      padGain.gain.setTargetAtTime(0.22, c.currentTime, 0.35);
      return;
    }
    pad = c.createOscillator();
    padGain = c.createGain();
    pad.type = "sine";
    pad.frequency.value = 110;
    padGain.gain.value = 0.0001;
    pad.connect(padGain);
    padGain.connect(music);
    pad.start();
    padGain.gain.setTargetAtTime(0.22, c.currentTime, 0.4);
    const fifth = c.createOscillator();
    const g2 = c.createGain();
    fifth.type = "sine";
    fifth.frequency.value = 165;
    g2.gain.value = 0.12;
    fifth.connect(g2);
    g2.connect(music);
    fifth.start();
  } catch {
    /* never block UI */
  }
}

export function stopPad() {
  const c = ac();
  if (!c || !padGain) return;
  padGain.gain.setTargetAtTime(0.0001, c.currentTime, 0.2);
}

let scoreEl: HTMLAudioElement | null = null;

export function startScore(src: string, at = 0) {
  try {
    unlockAudio();
    if (!scoreEl) {
      scoreEl = new Audio();
      scoreEl.preload = "auto";
      scoreEl.loop = false;
    }
    if (scoreEl.src.indexOf(src) < 0) scoreEl.src = src;
    scoreEl.volume = 0.72;
    if (at > 0.05) {
      try {
        scoreEl.currentTime = at;
      } catch {
        /* */
      }
    }
    void scoreEl.play().catch(() => {});
  } catch {
    /* never block UI */
  }
}

export function stopScore() {
  if (!scoreEl) return;
  try {
    scoreEl.pause();
    scoreEl.currentTime = 0;
  } catch {
    /* */
  }
}

export function syncScore(t: number) {
  if (!scoreEl) return;
  try {
    if (Math.abs(scoreEl.currentTime - t) > 0.4) scoreEl.currentTime = t;
    if (scoreEl.paused) void scoreEl.play().catch(() => {});
  } catch {
    /* */
  }
}
