import { pub } from "@/lib/pub";

function smooth(t: number, a: number, b: number) {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

function load(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error(src));
    im.src = src;
  });
}

class Storm {
  due = 0.4 + Math.random() * 1.6;
  pulse = 0;
  constructor(private gap: () => number) {}
  tick(dt: number) {
    this.due -= dt;
    this.pulse *= Math.exp(-dt * 9);
    if (this.due <= 0) {
      this.pulse = 0.75 + Math.random() * 0.25;
      this.due = this.gap();
    }
  }
}

export function startCitadelProc(canvas: HTMLCanvasElement, stillUrl: string) {
  const surface = canvas.getContext("2d", { alpha: true });
  if (!surface) return () => {};
  const ctx = surface;

  let alive = true;
  let still: HTMLImageElement | null = null;
  let bolt: HTMLImageElement | null = null;
  let gold: HTMLImageElement | null = null;
  let cyan: HTMLImageElement | null = null;
  const W = 720;
  const H = 1280;
  canvas.width = W;
  canvas.height = H;

  const left = new Storm(() => 1.15 + Math.random() * 2.4);
  const right = new Storm(() => 0.95 + Math.random() * 2.2);
  let bandG = Math.random();
  let bandC = Math.random();
  let t0 = performance.now();
  let last = t0;

  void load(stillUrl).then((s) => {
    still = s;
  }).catch(() => {});
  void load(pub("citadel/bolt.png")).then((b) => {
    bolt = b;
  }).catch(() => {});
  void load(pub("citadel/fx-gold.png")).then((g) => {
    gold = g;
  }).catch(() => {});
  void load(pub("citadel/fx-cyan.png")).then((c) => {
    cyan = c;
  }).catch(() => {});

  const x0 = 0.258 * W;
  const y0 = 0.339 * H;
  const bw = 0.524 * W;
  const bh = 0.462 * H;
  const cols = 14;
  const rows = 16;
  const neckX = x0 + bw * 0.42;
  const neckY = y0 + bh * 0.28;

  function cell(u: number, v: number, t: number) {
    const breath = Math.sin(t * 1.63) * 0.015;
    const head = Math.sin(t * 1.07 + 0.6) * 0.026;
    const tail = Math.sin(t * 2.71 + 1.1) * 0.02;
    const paw = Math.sin(t * 2.05 + 0.3) * 0.007;
    let x = x0 + u * bw;
    let y = y0 + v * bh;
    const chest = smooth(v, 0.28, 0.48) * (1 - smooth(v, 0.72, 0.92));
    y += (v - 0.52) * bh * breath * chest * 2.1;
    const headW = 1 - smooth(v, 0.22, 0.42);
    if (headW > 0.02) {
      const dx = x - neckX;
      const dy = y - neckY;
      const a = head * headW;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      x = neckX + dx * ca - dy * sa;
      y = neckY + dx * sa + dy * ca;
    }
    const tailW = Math.max(0, smooth(u, 0.62, 0.8) * (1 - Math.abs(v - 0.52) * 2.5));
    x += tail * bw * tailW * 0.95;
    y += tail * bh * tailW * 0.12;
    const pawW = smooth(v, 0.78, 0.92);
    y += paw * bh * pawW;
    x += paw * bw * pawW * (u < 0.45 ? -0.35 : 0.3);
    return [x, y] as const;
  }

  function drawBolt(t: number) {
    if (!bolt) return;
    const ov = 1.08;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const u0 = i / cols;
        const v0 = j / rows;
        const u1 = (i + 1) / cols;
        const v1 = (j + 1) / rows;
        const sx = x0 + u0 * bw;
        const sy = y0 + v0 * bh;
        const sw = (u1 - u0) * bw;
        const sh = (v1 - v0) * bh;
        const [dx, dy] = cell((u0 + u1) / 2, (v0 + v1) / 2, t);
        ctx.drawImage(bolt, sx, sy, sw, sh, dx - sw / 2, dy - sh / 2, sw * ov, sh * ov);
      }
    }
  }

  function frame(now: number) {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    left.tick(dt);
    right.tick(dt);
    bandG = (bandG + dt * 0.23) % 1;
    bandC = (bandC + dt * 0.17) % 1;

    if (still) {
      ctx.drawImage(still, 0, 0, W, H);
      drawBolt(t);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      if (gold) {
        ctx.globalAlpha = 0.12 + left.pulse * 0.85;
        ctx.drawImage(gold, 0, 0, W, H);
        const gy = (0.5 + bandG * 0.28) * H;
        ctx.globalAlpha = 0.18 + 0.35 * (1 - Math.abs(((gy / H) - 0.64) * 2));
        ctx.drawImage(gold, 0, gy - 70, W, 140, 0, gy - 70, W, 140);
      }
      if (cyan) {
        ctx.globalAlpha = 0.12 + right.pulse * 0.85;
        ctx.drawImage(cyan, 0, 0, W, H);
        const cy = (0.5 + bandC * 0.28) * H;
        ctx.globalAlpha = 0.18 + 0.35 * (1 - Math.abs(((cy / H) - 0.64) * 2));
        ctx.drawImage(cyan, 0, cy - 70, W, 140, 0, cy - 70, W, 140);
      }
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return () => {
    alive = false;
  };
}
