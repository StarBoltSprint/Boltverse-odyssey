const STORE = "lc-citadel-song";
const BPM = 64;
const BEAT = 60 / BPM;

function loadMuted(): boolean {
  try {
    return localStorage.getItem(STORE) === "off";
  } catch {
    return false;
  }
}

function saveMuted(m: boolean) {
  try {
    localStorage.setItem(STORE, m ? "off" : "on");
  } catch {
    /* private mode */
  }
}

export type CitadelTheme = {
  unlock: () => void;
  start: () => void;
  stop: () => void;
  howl: () => void;
  setMuted: (m: boolean) => void;
  muted: () => boolean;
  playing: () => boolean;
  dispose: () => void;
};

type Bed = {
  oscs: OscillatorNode[];
  choir: OscillatorNode[];
  sub: OscillatorNode;
  lfo: OscillatorNode;
};

type Note = { at: number; freq: number; beats: number };

export function createCitadelTheme(): CitadelTheme {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let music: GainNode | null = null;
  let sfx: GainNode | null = null;
  let wet: GainNode | null = null;
  let delay: DelayNode | null = null;
  let muted = loadMuted();
  let running = false;
  let nextBeat = 0;
  let beat = 0;
  let timer = 0;
  let noise: AudioBuffer | null = null;
  let bed: Bed | null = null;

  function Ctor(): typeof AudioContext | null {
    const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    return w.AudioContext || w.webkitAudioContext || null;
  }

  function ac(): AudioContext | null {
    if (ctx && ctx.state === "closed") ctx = null;
    if (ctx) return ctx;
    try {
      const C = Ctor();
      if (!C) return null;
      ctx = new C({ latencyHint: "playback" });
      master = ctx.createGain();
      music = ctx.createGain();
      sfx = ctx.createGain();
      wet = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      music.gain.value = 0.0001;
      sfx.gain.value = 1;
      wet.gain.value = 0.34;
      const conv = ctx.createConvolver();
      conv.buffer = makeImpulse(ctx, 2.4);
      delay = ctx.createDelay(1.2);
      delay.delayTime.value = BEAT * 0.75;
      const fb = ctx.createGain();
      fb.gain.value = 0.28;
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(wet);
      music.connect(master);
      music.connect(conv);
      conv.connect(wet);
      wet.connect(master);
      sfx.connect(master);
      master.connect(ctx.destination);
      const data = new Float32Array(ctx.sampleRate);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise = ctx.createBuffer(1, data.length, ctx.sampleRate);
      noise.getChannelData(0).set(data);
      return ctx;
    } catch {
      ctx = null;
      return null;
    }
  }

  function makeImpulse(c: AudioContext, seconds: number) {
    const n = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < n; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.4);
      }
    }
    return buf;
  }

  function env(g: GainNode, t0: number, attack: number, dur: number, peak: number) {
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + attack);
    g.gain.setValueAtTime(Math.max(0.0002, peak * 0.7), t0 + dur * 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  }

  function osc(
    c: AudioContext,
    dest: AudioNode,
    type: OscillatorType,
    freq: number,
    t0: number,
    dur: number,
    peak: number,
    attack = 0.04,
    to?: number,
  ) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur * 0.9);
    env(g, t0, attack, dur, peak);
    o.connect(g);
    g.connect(dest);
    o.start(t0);
    o.stop(t0 + dur + 0.08);
  }

  function horn(c: AudioContext, freq: number, t0: number, beats: number) {
    if (!music || !delay) return;
    const dur = beats * BEAT + 0.35;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(Math.min(1400, freq * 2.2), t0);
    bp.Q.value = 0.9;
    const g = c.createGain();
    env(g, t0, 0.16, dur, 0.09);
    const saw = c.createOscillator();
    const tri = c.createOscillator();
    saw.type = "sawtooth";
    tri.type = "triangle";
    saw.frequency.setValueAtTime(freq, t0);
    tri.frequency.setValueAtTime(freq * 0.997, t0);
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = 4.6;
    lg.gain.value = 2.4;
    lfo.connect(lg);
    lg.connect(saw.frequency);
    saw.connect(bp);
    tri.connect(bp);
    bp.connect(g);
    g.connect(music);
    g.connect(delay);
    saw.start(t0);
    tri.start(t0);
    lfo.start(t0);
    saw.stop(t0 + dur + 0.1);
    tri.stop(t0 + dur + 0.1);
    lfo.stop(t0 + dur + 0.1);
  }

  function timp(c: AudioContext, t0: number, freq: number, peak: number) {
    if (!music) return;
    osc(c, music, "sine", freq, t0, 0.9, peak, 0.012, freq * 0.7);
    if (!noise) return;
    const src = c.createBufferSource();
    src.buffer = noise;
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 110;
    const g = c.createGain();
    env(g, t0, 0.006, 0.28, peak * 0.35);
    src.connect(lp);
    lp.connect(g);
    g.connect(music);
    src.start(t0);
    src.stop(t0 + 0.3);
  }

  // i  VI  III  VII — D minor hymn
  const CHORDS: number[][] = [
    [36.71, 73.42, 110, 146.83, 220, 293.66, 349.23],
    [29.14, 58.27, 87.31, 116.54, 174.61, 233.08, 349.23],
    [43.65, 87.31, 130.81, 174.61, 220, 261.63, 349.23],
    [32.7, 65.41, 98, 130.81, 196, 261.63, 329.63],
  ];

  const MELODY: Note[] = [
    { at: 8, freq: 293.66, beats: 4 },
    { at: 12, freq: 349.23, beats: 2 },
    { at: 14, freq: 392.0, beats: 2 },
    { at: 16, freq: 440.0, beats: 4 },
    { at: 20, freq: 392.0, beats: 2 },
    { at: 22, freq: 349.23, beats: 2 },
    { at: 24, freq: 233.08, beats: 4 },
    { at: 28, freq: 220.0, beats: 2 },
    { at: 30, freq: 293.66, beats: 2 },
    { at: 32, freq: 349.23, beats: 4 },
    { at: 36, freq: 440.0, beats: 2 },
    { at: 38, freq: 523.25, beats: 2 },
    { at: 40, freq: 587.33, beats: 4 },
    { at: 44, freq: 523.25, beats: 2 },
    { at: 46, freq: 440.0, beats: 2 },
    { at: 48, freq: 466.16, beats: 2 },
    { at: 50, freq: 440.0, beats: 2 },
    { at: 52, freq: 392.0, beats: 4 },
    { at: 56, freq: 349.23, beats: 2 },
    { at: 58, freq: 293.66, beats: 2 },
    { at: 60, freq: 293.66, beats: 4 },
  ];

  function startBed(c: AudioContext) {
    if (!music || bed) return;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;
    filter.Q.value = 0.6;
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.05;
    lg.gain.value = 140;
    lfo.connect(lg);
    lg.connect(filter.frequency);
    filter.connect(music);

    const oscs: OscillatorNode[] = [];
    for (let i = 0; i < 4; i++) {
      const o = c.createOscillator();
      o.type = i === 0 ? "sine" : "sawtooth";
      o.frequency.value = CHORDS[0][i];
      const g = c.createGain();
      g.gain.value = i === 0 ? 0.07 : 0.028;
      const p = c.createStereoPanner();
      p.pan.value = i < 2 ? -0.18 : 0.2;
      o.connect(g);
      g.connect(p);
      p.connect(filter);
      o.start();
      oscs.push(o);
    }

    const choir: OscillatorNode[] = [];
    for (let i = 0; i < 3; i++) {
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = CHORDS[0][4 + i] * (i === 1 ? 1.003 : 0.997);
      const g = c.createGain();
      g.gain.value = 0.022;
      o.connect(g);
      g.connect(music);
      o.start();
      choir.push(o);
    }

    const sub = c.createOscillator();
    sub.type = "sine";
    sub.frequency.value = CHORDS[0][0];
    const sg = c.createGain();
    sg.gain.value = 0.08;
    sub.connect(sg);
    sg.connect(music);
    sub.start();
    lfo.start();
    bed = { oscs, choir, sub, lfo };
  }

  function applyChord(t: number, idx: number) {
    if (!bed || !ctx) return;
    const chord = CHORDS[idx % CHORDS.length];
    const glide = t + 1.15;
    bed.oscs.forEach((o, i) => o.frequency.linearRampToValueAtTime(chord[i], glide));
    bed.choir.forEach((o, i) => o.frequency.linearRampToValueAtTime(chord[4 + i] * (i === 1 ? 1.003 : 0.997), glide));
    bed.sub.frequency.linearRampToValueAtTime(chord[0], glide);
  }

  function stopBed() {
    if (!bed) return;
    try {
      bed.oscs.forEach((o) => o.stop());
      bed.choir.forEach((o) => o.stop());
      bed.sub.stop();
      bed.lfo.stop();
    } catch {
      /* already stopped */
    }
    bed = null;
  }

  function tick() {
    if (!running || !ctx || muted) return;
    const now = ctx.currentTime;
    while (nextBeat < now + 1.2) {
      const b = beat % 64;
      if (b % 8 === 0) applyChord(nextBeat, Math.floor(b / 8) % 4);
      if (b % 16 === 0) timp(ctx, nextBeat, CHORDS[Math.floor(b / 8) % 4][0], 0.11);
      for (const n of MELODY) {
        if (n.at === b) horn(ctx, n.freq, nextBeat, n.beats);
      }
      nextBeat += BEAT;
      beat += 1;
    }
    timer = window.setTimeout(tick, 220);
  }

  function unlock() {
    const c = ac();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
  }

  return {
    unlock,
    start() {
      unlock();
      if (!ctx || muted || running) return;
      running = true;
      beat = 0;
      nextBeat = ctx.currentTime + 0.2;
      startBed(ctx);
      if (music) {
        music.gain.cancelScheduledValues(ctx.currentTime);
        music.gain.setValueAtTime(0.0001, ctx.currentTime);
        music.gain.exponentialRampToValueAtTime(0.72, ctx.currentTime + 2.4);
      }
      tick();
    },
    stop() {
      running = false;
      window.clearTimeout(timer);
      if (ctx && music) {
        const t = ctx.currentTime;
        music.gain.cancelScheduledValues(t);
        music.gain.setTargetAtTime(0.0001, t, 0.35);
      }
      window.setTimeout(stopBed, 700);
    },
    howl() {
      unlock();
      if (!ctx || !sfx || muted) return;
      const t0 = ctx.currentTime;
      osc(ctx, sfx, "triangle", 330, t0, 1.2, 0.13, 0.07, 92);
      osc(ctx, sfx, "sine", 196, t0 + 0.05, 1.0, 0.055, 0.09, 82);
      if (music && running) {
        music.gain.cancelScheduledValues(t0);
        music.gain.setValueAtTime(0.72, t0);
        music.gain.linearRampToValueAtTime(0.32, t0 + 0.1);
        music.gain.linearRampToValueAtTime(0.72, t0 + 1.6);
      }
    },
    setMuted(m: boolean) {
      muted = m;
      saveMuted(m);
      if (master && ctx) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.06);
      }
      if (m) {
        running = false;
        window.clearTimeout(timer);
      }
    },
    muted: () => muted,
    playing: () => running && !muted,
    dispose() {
      running = false;
      window.clearTimeout(timer);
      stopBed();
      try {
        master?.disconnect();
        ctx?.close();
      } catch {
        /* already closed */
      }
      ctx = null;
      master = null;
      music = null;
      sfx = null;
      wet = null;
      delay = null;
    },
  };
}
