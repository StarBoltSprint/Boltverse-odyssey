import * as THREE from "three";
import { createInput, type InputHandle } from "./input";
import { createAudio, type AudioBus } from "./audio";
import { pub } from "@/lib/pub";

export type SlashSkillId =
  | "bite"
  | "thrash"
  | "maul"
  | "howl"
  | "dash"
  | "wake"
  | "crash"
  | "bolt"
  | "aura"
  | "storm";

export type SlashClassId = "fang" | "blitz" | "arc";

export type SlashFloater = {
  id: number;
  text: string;
  x: number;
  y: number;
  crit: boolean;
};

export type SlashHud = {
  mode: "title" | "play" | "pause" | "dead" | "win";
  hp: number;
  hpMax: number;
  fury: number;
  furyMax: number;
  resource: string;
  classId: SlashClassId;
  className: string;
  xp: number;
  xpNext: number;
  level: number;
  gold: number;
  wave: number;
  kills: number;
  combo: number;
  toast: string | null;
  skills: { id: SlashSkillId; name: string; ready: number; cost: number; hot: string }[];
  buff: number;
  floaters: SlashFloater[];
};

export type SlashHandle = {
  dispose: () => void;
  start: () => void;
  cast: (id: SlashSkillId) => void;
  setStick: (x: number, y: number) => void;
  setClass: (id: SlashClassId) => void;
  audio: AudioBus;
};

export const SLASH_CLASSES: {
  id: SlashClassId;
  name: string;
  line: string;
  resource: string;
  skills: { id: SlashSkillId; name: string; cost: number; hot: string }[];
}[] = [
  {
    id: "fang",
    name: "Fang",
    line: "Teeth first. Bite and hold the pack.",
    resource: "Fury",
    skills: [
      { id: "bite", name: "Bite", cost: 0, hot: "1" },
      { id: "thrash", name: "Thrash", cost: 22, hot: "2" },
      { id: "maul", name: "Maul", cost: 36, hot: "3" },
      { id: "howl", name: "Howl", cost: 0, hot: "4" },
    ],
  },
  {
    id: "blitz",
    name: "Blitz",
    line: "The leash is off. Speed is the wound.",
    resource: "Momentum",
    skills: [
      { id: "dash", name: "Dash", cost: 0, hot: "1" },
      { id: "wake", name: "Wake", cost: 20, hot: "2" },
      { id: "crash", name: "Crash", cost: 34, hot: "3" },
      { id: "howl", name: "Howl", cost: 0, hot: "4" },
    ],
  },
  {
    id: "arc",
    name: "Arc",
    line: "Silence loads it. Noise delivers the spark.",
    resource: "Spark",
    skills: [
      { id: "bolt", name: "Bolt", cost: 0, hot: "1" },
      { id: "aura", name: "Aura", cost: 22, hot: "2" },
      { id: "storm", name: "Storm", cost: 36, hot: "3" },
      { id: "howl", name: "Howl", cost: 0, hot: "4" },
    ],
  },
];

type Kind = "shard" | "hound" | "brute" | "heart";

type Enemy = {
  kind: Kind;
  mesh: THREE.Group;
  hp: number;
  hpMax: number;
  x: number;
  z: number;
  speed: number;
  r: number;
  dmg: number;
  xp: number;
  gold: number;
  flash: number;
  hitCd: number;
  alive: boolean;
  elite: boolean;
  tele: number;
  slow: number;
};

type Drop = { mesh: THREE.Mesh; x: number; z: number; kind: "hp" | "gold"; t: number };
type Spark = { mesh: THREE.Mesh; vx: number; vy: number; vz: number; life: number; on: boolean };
type Shot = { mesh: THREE.Mesh; x: number; z: number; vx: number; vz: number; life: number; on: boolean };
type FloaterW = { id: number; text: string; wx: number; wy: number; wz: number; t: number; crit: boolean };

const SAVE = "bv-slash-v1";
const CLASS_SAVE = "bv-slash-class";
const HP_MAX0 = 140;
const FURY_MAX = 100;
const ARENA = 22;
const CD: Record<SlashSkillId, number> = {
  bite: 0.38,
  thrash: 5.5,
  maul: 7.2,
  howl: 11,
  dash: 0.36,
  wake: 6.2,
  crash: 7.0,
  bolt: 0.32,
  aura: 8.4,
  storm: 7.4,
};

function classKit(id: SlashClassId) {
  return SLASH_CLASSES.find((c) => c.id === id) ?? SLASH_CLASSES[0];
}

function emptyCd(): Record<SlashSkillId, number> {
  return {
    bite: 0,
    thrash: 0,
    maul: 0,
    howl: 0,
    dash: 0,
    wake: 0,
    crash: 0,
    bolt: 0,
    aura: 0,
    storm: 0,
  };
}

function loadClass(): SlashClassId {
  try {
    const v = localStorage.getItem(CLASS_SAVE);
    if (v === "fang" || v === "blitz" || v === "arc") return v;
    if (v === "kiln") return "fang";
    if (v === "canal") return "blitz";
    if (v === "spark") return "arc";
  } catch {
    /* private */
  }
  return "fang";
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function goldMat(hex: number, emissive = 0x4a3014, e = 0.28) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    metalness: 0.22,
    roughness: 0.46,
    emissive,
    emissiveIntensity: e,
  });
}

function glowMat(hex: number) {
  return new THREE.MeshBasicMaterial({ color: hex });
}

function blobShadow(r: number, opacity = 0.45) {
  const m = new THREE.Mesh(
    new THREE.CircleGeometry(r, 18),
    new THREE.MeshBasicMaterial({
      color: 0x050308,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.03;
  return m;
}

function makeHero() {
  const g = new THREE.Group();
  const plate = goldMat(0xffe7b4, 0x8a5a18, 0.52);
  const dark = goldMat(0x4a3828, 0x241810, 0.1);
  const cyan = glowMat(0x9ef4ff);
  const cyanSoft = new THREE.MeshStandardMaterial({
    color: 0xa8f4ff,
    emissive: 0x3ad0e8,
    emissiveIntensity: 1.2,
    metalness: 0.16,
    roughness: 0.28,
  });
  const fur = new THREE.MeshStandardMaterial({
    color: 0xf7f3ec,
    roughness: 0.84,
    metalness: 0.02,
    emissive: 0x3a342c,
    emissiveIntensity: 0.1,
  });
  const muzzle = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.65, metalness: 0.04 });
  const innerEar = new THREE.MeshStandardMaterial({ color: 0xc47a6a, roughness: 0.78, metalness: 0 });
  const scarMat = new THREE.MeshStandardMaterial({ color: 0x4a3028, roughness: 0.9, metalness: 0 });
  const fangMat = new THREE.MeshStandardMaterial({ color: 0xf7f2ea, roughness: 0.35, metalness: 0.08 });
  const cloth = goldMat(0x3a2418, 0x1a0c08, 0.08);

  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.44), plate);
  pelvis.position.y = 0.92;
  g.add(pelvis);
  const fauld = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.18, 0.5), goldMat(0xe8c878, 0x6a4a14, 0.3));
  fauld.position.y = 1.08;
  g.add(fauld);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.82, 0.52), plate);
  torso.position.y = 1.46;
  torso.castShadow = true;
  g.add(torso);
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.12), goldMat(0xffe6a8, 0x8a6018, 0.4));
  ridge.position.set(0, 1.48, 0.28);
  g.add(ridge);
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), cyan);
  crystal.position.set(0, 1.5, 0.34);
  g.add(crystal);
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.12, 0.48), goldMat(0xf0c24a, 0x6a4a10, 0.32));
  belt.position.y = 1.04;
  g.add(belt);

  const gorget = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.18, 10), plate);
  gorget.position.y = 1.9;
  g.add(gorget);

  const head = new THREE.Group();
  head.position.set(0, 2.16, 0.06);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 12), fur);
  skull.scale.set(0.95, 1.08, 1.14);
  head.add(skull);
  const brow = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.14), fur);
  brow.position.set(0, 0.12, 0.24);
  head.add(brow);
  const brand = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), cyan);
  brand.position.set(0, 0.18, 0.28);
  head.add(brand);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.42), fur);
  snout.position.set(0, -0.04, 0.34);
  head.add(snout);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), muzzle);
  nose.position.set(0, -0.02, 0.54);
  head.add(nose);
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.28), fur);
  jaw.position.set(0, -0.18, 0.28);
  jaw.rotation.x = 0.18;
  head.add(jaw);
  const mkFang = (sx: number) => {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 5), fangMat);
    f.position.set(sx * 0.055, -0.2, 0.4);
    f.rotation.x = Math.PI;
    head.add(f);
  };
  mkFang(-1);
  mkFang(1);
  const scar = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.18, 0.045), scarMat);
  scar.position.set(-0.12, 0.07, 0.28);
  scar.rotation.z = 0.45;
  head.add(scar);
  const mkEar = (sx: number) => {
    const ear = new THREE.Group();
    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.5, 4), fur);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.32, 4), innerEar);
    inner.position.set(0, 0.02, 0.025);
    ear.add(outer);
    ear.add(inner);
    ear.position.set(sx * 0.2, 0.4, -0.04);
    ear.rotation.z = sx * -0.3;
    ear.rotation.x = -0.2;
    head.add(ear);
  };
  mkEar(-1);
  mkEar(1);
  const mkEye = (sx: number) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 6), muzzle);
    eye.position.set(sx * 0.11, 0.05, 0.28);
    head.add(eye);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 4), cyan);
    glint.position.set(sx * 0.11, 0.055, 0.32);
    head.add(glint);
  };
  mkEye(-1);
  mkEye(1);
  g.add(head);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.82, 6), fur);
  tail.position.set(0, 1.02, -0.48);
  tail.rotation.x = 0.95;
  g.add(tail);

  const mkPauldron = (sx: number) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.26, 0.46), plate);
    p.position.set(sx, 1.78, 0);
    p.rotation.z = sx > 0 ? -0.38 : 0.38;
    g.add(p);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.48), cyanSoft);
    trim.position.set(sx * 1.12, 1.86, 0);
    trim.rotation.z = sx > 0 ? -0.38 : 0.38;
    g.add(trim);
  };
  mkPauldron(-0.52);
  mkPauldron(0.52);

  const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 1.28), cloth);
  cape.position.set(0, 1.32, -0.36);
  cape.rotation.y = Math.PI;
  g.add(cape);

  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.22, 0.8, 0);
  const ll = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.74, 0.26), dark);
  ll.position.y = -0.36;
  leftLeg.add(ll);
  const lb = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.4), plate);
  lb.position.set(0, -0.72, 0.06);
  leftLeg.add(lb);
  g.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.22, 0.8, 0);
  const rl = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.74, 0.26), dark);
  rl.position.y = -0.36;
  rightLeg.add(rl);
  const rb = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.4), plate);
  rb.position.set(0, -0.72, 0.06);
  rightLeg.add(rb);
  g.add(rightLeg);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.56, 1.62, 0);
  const ra = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.74, 0.22), plate);
  ra.position.y = -0.28;
  rightArm.add(ra);
  const vambrace = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.26), goldMat(0xf0c24a, 0x6a4a10, 0.3));
  vambrace.position.y = -0.52;
  rightArm.add(vambrace);
  const sword = new THREE.Group();
  sword.position.set(0, -0.78, 0.14);
  const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.34, 8), goldMat(0xf0c24a, 0x6a4a10, 0.3));
  hilt.rotation.x = Math.PI / 2;
  sword.add(hilt);
  const pommel = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), cyan);
  pommel.position.z = -0.22;
  sword.add(pommel);
  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.12, 0.14), plate);
  sword.add(guard);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 2.5), cyan);
  blade.position.z = 1.28;
  sword.add(blade);
  const fuller = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.09, 2.2), goldMat(0xf0c24a, 0x6a4a10, 0.45));
  fuller.position.z = 1.22;
  sword.add(fuller);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.36, 5), cyan);
  tip.rotation.x = Math.PI / 2;
  tip.position.z = 2.64;
  sword.add(tip);
  sword.visible = false;
  rightArm.add(sword);

  const bell = new THREE.Group();
  bell.position.set(0, -0.78, 0.1);
  const bellBowl = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.7), goldMat(0xf0c24a, 0x6a4a10, 0.4));
  bellBowl.rotation.x = Math.PI;
  bell.add(bellBowl);
  const bellRim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.045, 8, 16), cyan);
  bellRim.rotation.x = Math.PI / 2;
  bellRim.position.y = -0.22;
  bell.add(bellRim);
  const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), cyan);
  clapper.position.y = -0.28;
  bell.add(clapper);
  const bellGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.28, 8), goldMat(0xf0c24a, 0x6a4a10, 0.3));
  bellGrip.position.y = 0.22;
  bell.add(bellGrip);
  bell.visible = false;
  rightArm.add(bell);

  const stave = new THREE.Group();
  stave.position.set(0, -0.7, 0.12);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.15, 8), goldMat(0xc8b080, 0x4a3014, 0.22));
  shaft.rotation.x = Math.PI / 2;
  shaft.position.z = 0.72;
  stave.add(shaft);
  const staveGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.28, 8), goldMat(0xf0c24a, 0x6a4a10, 0.35));
  staveGrip.rotation.x = Math.PI / 2;
  stave.add(staveGrip);
  const staveTip = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), cyan);
  staveTip.position.z = 1.82;
  stave.add(staveTip);
  const staveCollar = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 6, 12), cyan);
  staveCollar.position.z = 1.58;
  stave.add(staveCollar);
  stave.visible = false;
  rightArm.add(stave);

  const clawR = new THREE.Group();
  clawR.position.set(0, -0.74, 0.18);
  for (let i = 0; i < 3; i++) {
    const nail = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.46, 5), cyan);
    nail.rotation.x = Math.PI / 2;
    nail.position.set((i - 1) * 0.1, -0.02, 0.26);
    clawR.add(nail);
  }
  const padR = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), plate);
  clawR.add(padR);
  rightArm.add(clawR);
  g.add(rightArm);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.56, 1.62, 0);
  const la = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.22), plate);
  la.position.y = -0.28;
  leftArm.add(la);
  const shield = new THREE.Group();
  shield.position.set(-0.2, -0.32, 0.1);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.54, 0.1, 8), plate);
  disc.rotation.z = Math.PI / 2;
  shield.add(disc);
  const boss = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), cyan);
  boss.position.x = -0.08;
  shield.add(boss);
  const shieldRim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 6, 12), goldMat(0xf0c24a, 0x6a4a10, 0.35));
  shieldRim.rotation.z = Math.PI / 2;
  shield.add(shieldRim);
  shield.visible = false;
  leftArm.add(shield);
  const clawL = new THREE.Group();
  clawL.position.set(0, -0.7, 0.16);
  for (let i = 0; i < 3; i++) {
    const nail = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.4, 5), cyan);
    nail.rotation.x = Math.PI / 2;
    nail.position.set((i - 1) * 0.09, -0.02, 0.22);
    clawL.add(nail);
  }
  const padL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), plate);
  clawL.add(padL);
  leftArm.add(clawL);
  g.add(leftArm);

  g.userData.rightArm = rightArm;
  g.userData.leftArm = leftArm;
  g.userData.leftLeg = leftLeg;
  g.userData.rightLeg = rightLeg;
  g.userData.sword = sword;
  g.userData.shield = shield;
  g.userData.bell = bell;
  g.userData.stave = stave;
  g.userData.clawR = clawR;
  g.userData.clawL = clawL;
  g.userData.cape = cape;
  g.userData.crystal = crystal;
  g.userData.head = head;
  g.userData.tail = tail;
  g.add(blobShadow(0.86, 0.55));
  g.scale.setScalar(1.32);
  return g;
}

function addHpBar(g: THREE.Group, y: number) {
  const bar = new THREE.Group();
  bar.position.y = y;
  const bg = new THREE.Mesh(
    new THREE.PlaneGeometry(0.95, 0.1),
    new THREE.MeshBasicMaterial({ color: 0x140c0a, depthTest: false, transparent: true, opacity: 0.85 }),
  );
  const fg = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.06),
    new THREE.MeshBasicMaterial({ color: 0xc44a3a, depthTest: false }),
  );
  fg.position.z = 0.01;
  bar.add(bg);
  bar.add(fg);
  g.add(bar);
  g.userData.hpBar = bar;
  g.userData.hpFill = fg;
}

function makeEnemy(kind: Kind, elite: boolean) {
  const g = new THREE.Group();
  const bodyC =
    kind === "shard" ? 0x3a6a88 : kind === "hound" ? 0x6a3a28 : kind === "brute" ? 0x4a2a58 : 0x1a3048;
  const glowC = kind === "heart" ? 0xff6a3a : elite ? 0xf0c24a : 0x7ee8f2;
  const mat = new THREE.MeshStandardMaterial({
    color: bodyC,
    metalness: 0.35,
    roughness: 0.5,
    emissive: glowC,
    emissiveIntensity: elite || kind === "heart" ? 0.45 : 0.18,
  });
  const glow = glowMat(glowC);
  const scale = kind === "shard" ? 0.78 : kind === "hound" ? 1.05 : kind === "brute" ? 1.55 : 2.2;

  if (kind === "shard") {
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), mat);
    core.position.y = 0.55;
    core.castShadow = true;
    g.add(core);
    for (let i = 0; i < 4; i++) {
      const spike = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), glow);
      const a = (i / 4) * Math.PI * 2;
      spike.position.set(Math.cos(a) * 0.38, 0.62, Math.sin(a) * 0.38);
      spike.scale.set(0.55, 1.4, 0.55);
      g.add(spike);
    }
  } else if (kind === "hound") {
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.7, 4, 8), mat);
    body.rotation.z = Math.PI / 2;
    body.position.set(0, 0.42, 0.1);
    body.castShadow = true;
    g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), mat);
    head.position.set(0, 0.55, 0.55);
    g.add(head);
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 5), mat);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, 0.48, 0.82);
    g.add(snout);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.5, 4), glow);
    tail.rotation.x = -Math.PI / 2;
    tail.position.set(0, 0.4, -0.55);
    g.add(tail);
  } else if (kind === "brute") {
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 0.7, 4, 8), mat);
    torso.position.y = 1.0;
    torso.castShadow = true;
    g.add(torso);
    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 6), mat);
    helm.position.y = 1.62;
    g.add(helm);
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.45, 5), glow);
    hornL.position.set(-0.22, 1.95, 0);
    hornL.rotation.z = 0.4;
    g.add(hornL);
    const hornR = hornL.clone();
    hornR.position.x = 0.22;
    hornR.rotation.z = -0.4;
    g.add(hornR);
    const maul = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.9), glow);
    maul.position.set(0.7, 0.85, 0.2);
    g.add(maul);
  } else {
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), glow);
    core.position.y = 1.2;
    core.castShadow = true;
    g.add(core);
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 0), mat);
    shell.position.y = 1.2;
    g.add(shell);
    const orbit = new THREE.Group();
    orbit.position.y = 1.2;
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), glow);
      const a = (i / 4) * Math.PI * 2;
      s.position.set(Math.cos(a) * 1.35, Math.sin(a * 2) * 0.3, Math.sin(a) * 1.35);
      orbit.add(s);
    }
    g.add(orbit);
    g.userData.orbit = orbit;
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), glow);
    eye.position.set(0, 1.7, 0.4);
    g.add(eye);
  }

  const eyeY = kind === "heart" ? 2.55 : kind === "brute" ? 2.15 : kind === "hound" ? 1.05 : 1.15;
  addHpBar(g, eyeY);
  g.add(blobShadow(kind === "heart" ? 1.1 : kind === "brute" ? 0.7 : 0.48, 0.4));
  g.scale.setScalar(scale);
  return g;
}

function makePillar() {
  const g = new THREE.Group();
  const stone = goldMat(0x2c2622, 0x120e0c, 0.06);
  const cyan = glowMat(0x7ee8f2);
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.42, 1.35), stone);
  plinth.position.y = 0.21;
  g.add(plinth);
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.72, 2.35, 0.72), stone);
  shaft.position.y = 1.5;
  shaft.rotation.y = 0.18;
  g.add(shaft);
  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.28, 0.95), goldMat(0x8a6a32, 0x3a2810, 0.2));
  cap.position.y = 2.72;
  g.add(cap);
  const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.48, 0), cyan);
  shard.position.y = 3.35;
  shard.rotation.y = 0.4;
  shard.scale.set(0.7, 1.55, 0.7);
  g.add(shard);
  const chip = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), cyan);
  chip.position.set(0.38, 3.05, 0.12);
  chip.rotation.z = 0.6;
  g.add(chip);
  g.add(blobShadow(0.95, 0.35));
  return g;
}

export function startSlash(canvas: HTMLCanvasElement, onHud: (h: SlashHud) => void): SlashHandle {
  const mobile =
    (navigator.maxTouchPoints || 0) > 0 ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth < 900;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 2));
  renderer.setClearColor(0x07060c, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !mobile;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.38;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0810, 0.016);
  const camera = new THREE.PerspectiveCamera(mobile ? 34 : 32, 1, 0.35, 140);
  const CAM_XZ = mobile ? 6.0 : 6.6;
  const CAM_Y = mobile ? 7.2 : 7.8;
  const ZOOM_MIN = 0.7;
  const ZOOM_MAX = 2.5;

  const hemi = new THREE.HemisphereLight(0x6a88b0, 0x2a140c, 0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe2b0, 1.6);
  sun.position.set(14, 22, 8);
  sun.castShadow = !mobile;
  if (!mobile) {
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 4;
    sun.shadow.camera.far = 70;
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 24;
    sun.shadow.camera.bottom = -24;
  }
  scene.add(sun);
  scene.add(sun.target);
  const rimLight = new THREE.DirectionalLight(0x5ad8ee, 0.9);
  rimLight.position.set(-12, 8, -10);
  scene.add(rimLight);
  const cyanL = new THREE.PointLight(0x4ec8e8, 22, 42, 1.8);
  cyanL.position.set(-6, 4, -4);
  scene.add(cyanL);
  const ember = new THREE.PointLight(0xff7a3a, 18, 34, 1.8);
  ember.position.set(8, 3, 6);
  scene.add(ember);
  const heroLight = new THREE.PointLight(0xffd4a0, 14, 10, 2);
  scene.add(heroLight);
  const bladeLight = new THREE.PointLight(0x7ee8f2, 9, 7, 2);
  scene.add(bladeLight);

  const loader = new THREE.TextureLoader();
  const groundTex = loader.load(pub("slash/floor.jpg") + "?v=kiln3");
  groundTex.colorSpace = THREE.SRGBColorSpace;
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(2.15, 2.15);
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(ARENA + 4, 48),
    new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.86,
      metalness: 0.14,
      emissive: 0xff9a40,
      emissiveMap: groundTex,
      emissiveIntensity: 0.32,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const skyTex = loader.load(pub("slash/sky.jpg") + "?v=kiln3");
  skyTex.colorSpace = THREE.SRGBColorSpace;
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(70, 24, 16),
    new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false }),
  );
  scene.add(sky);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(ARENA + 0.4, 0.38, 8, 48),
    goldMat(0x8a6a32, 0x3a2810, 0.22),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.22;
  scene.add(rim);

  const pillars: { x: number; z: number; r: number }[] = [];
  const pillarSpots = [
    [8, -6],
    [-9, 5],
    [5, -12],
    [-7, -9],
    [13, -8],
    [-13, 8],
    [-4, 13],
    [11, -3],
  ];
  for (const [x, z] of pillarSpots) {
    const p = makePillar();
    p.position.set(x, 0, z);
    scene.add(p);
    pillars.push({ x, z, r: 1.15 });
  }

  const pits: THREE.Mesh[] = [];
  const pitStone = goldMat(0x1a120e, 0x3a1808, 0.22);
  for (const [x, z] of [
    [6, -6],
    [-7, 7],
    [10, 8],
    [-11, -5],
  ]) {
    const lip = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.16, 6, 20), pitStone);
    lip.rotation.x = Math.PI / 2;
    lip.position.set(x, 0.08, z);
    scene.add(lip);
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(1.08, 18),
      new THREE.MeshBasicMaterial({ color: 0xff6a28, transparent: true, opacity: 0.7 }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(x, 0.03, z);
    scene.add(glow);
    pits.push(glow);
    const hot = new THREE.Mesh(
      new THREE.CircleGeometry(0.42, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd4a0, transparent: true, opacity: 0.85 }),
    );
    hot.rotation.x = -Math.PI / 2;
    hot.position.set(x, 0.05, z);
    scene.add(hot);
  }

  const ruinMat = goldMat(0x2a221c, 0x1a1008, 0.1);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.1;
    const h = 1.35 + (i % 4) * 0.55;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(3.1, h, 0.52), ruinMat);
    wall.position.set(Math.cos(a) * (ARENA + 0.95), h * 0.5, Math.sin(a) * (ARENA + 0.95));
    wall.rotation.y = -a;
    scene.add(wall);
  }

  const brandRing = new THREE.Mesh(
    new THREE.RingGeometry(3.05, 3.32, 48),
    new THREE.MeshBasicMaterial({ color: 0xc49a4a, transparent: true, opacity: 0.22, side: THREE.DoubleSide }),
  );
  brandRing.rotation.x = -Math.PI / 2;
  brandRing.position.y = 0.04;
  scene.add(brandRing);
  const brandInner = new THREE.Mesh(
    new THREE.RingGeometry(1.48, 1.66, 40),
    new THREE.MeshBasicMaterial({ color: 0x5ad8ee, transparent: true, opacity: 0.18, side: THREE.DoubleSide }),
  );
  brandInner.rotation.x = -Math.PI / 2;
  brandInner.position.y = 0.045;
  scene.add(brandInner);

  const moteGeo = new THREE.SphereGeometry(0.045, 5, 4);
  const moteMat = new THREE.MeshBasicMaterial({ color: 0xff8a48, transparent: true, opacity: 0.78 });
  const motes: { mesh: THREE.Mesh; ox: number; oz: number; ph: number }[] = [];
  const moteN = mobile ? 14 : 22;
  for (let i = 0; i < moteN; i++) {
    const m = new THREE.Mesh(moteGeo, moteMat);
    const a = (i / moteN) * Math.PI * 2;
    const r = 3.6 + (i % 7) * 2.15;
    const ox = Math.cos(a) * r;
    const oz = Math.sin(a) * r;
    m.position.set(ox, 0.8, oz);
    scene.add(m);
    motes.push({ mesh: m, ox, oz, ph: i * 0.7 });
  }

  const heroRing = new THREE.Mesh(
    new THREE.RingGeometry(0.68, 0.84, 28),
    new THREE.MeshBasicMaterial({ color: 0xf0c24a, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
  );
  heroRing.rotation.x = -Math.PI / 2;
  heroRing.position.y = 0.05;
  scene.add(heroRing);

  const floatCrystalMat = new THREE.MeshStandardMaterial({
    color: 0x7ee8f2,
    emissive: 0x2a9bb0,
    emissiveIntensity: 0.7,
    metalness: 0.4,
    roughness: 0.25,
  });
  const crystals: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.28 + (i % 3) * 0.08, 0), floatCrystalMat);
    const a = (i / 6) * Math.PI * 2;
    c.position.set(Math.cos(a) * 16, 2.2 + (i % 2) * 0.8, Math.sin(a) * 16);
    scene.add(c);
    crystals.push(c);
  }

  const hero = makeHero();
  scene.add(hero);
  const rightArm = hero.userData.rightArm as THREE.Group;
  const leftArm = hero.userData.leftArm as THREE.Group;
  const leftLeg = hero.userData.leftLeg as THREE.Group;
  const rightLeg = hero.userData.rightLeg as THREE.Group;
  const cape = hero.userData.cape as THREE.Mesh;
  const heroCrystal = hero.userData.crystal as THREE.Mesh;
  const heroHead = hero.userData.head as THREE.Group;
  const heroTail = hero.userData.tail as THREE.Mesh;
  const gearSword = hero.userData.sword as THREE.Group;
  const gearShield = hero.userData.shield as THREE.Group;
  const gearBell = hero.userData.bell as THREE.Group;
  const gearStave = hero.userData.stave as THREE.Group;
  const gearClawR = hero.userData.clawR as THREE.Group;
  const gearClawL = hero.userData.clawL as THREE.Group;

  function applyGear() {
    const fang = classId === "fang";
    const arc = classId === "arc";
    gearSword.visible = false;
    gearShield.visible = false;
    gearBell.visible = false;
    gearStave.visible = arc;
    gearClawR.visible = fang;
    gearClawL.visible = fang;
    const col = arc ? 0x7ee8f2 : classId === "blitz" ? 0xffe08a : 0xf0c24a;
    (heroRing.material as THREE.MeshBasicMaterial).color.setHex(col);
  }

  const destMark = new THREE.Mesh(
    new THREE.RingGeometry(0.28, 0.42, 20),
    new THREE.MeshBasicMaterial({ color: 0x7ee8f2, transparent: true, opacity: 0, side: THREE.DoubleSide }),
  );
  destMark.rotation.x = -Math.PI / 2;
  destMark.position.y = 0.08;
  scene.add(destMark);

  const whirlDisc = new THREE.Mesh(
    new THREE.TorusGeometry(1.7, 0.08, 6, 28),
    new THREE.MeshBasicMaterial({ color: 0x7ee8f2, transparent: true, opacity: 0 }),
  );
  whirlDisc.rotation.x = Math.PI / 2;
  whirlDisc.position.y = 0.9;
  scene.add(whirlDisc);

  const input = createInput(canvas);
  const audio = createAudio();
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  const camRight = new THREE.Vector3();
  const camFwd = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const proj = new THREE.Vector3();
  const camDesired = new THREE.Vector3();
  let camSnap = true;
  let zoom = 1;
  let pinchHint = false;
  const pins = new Map<number, { x: number; y: number }>();
  let pinchD = 0;
  let pinching = false;

  let mode: SlashHud["mode"] = "title";
  let classId: SlashClassId = loadClass();
  applyGear();
  let hp = HP_MAX0;
  let hpMax = HP_MAX0;
  let fury = 40;
  let xp = 0;
  let xpNext = 80;
  let level = 1;
  let gold = 0;
  let wave = 0;
  let kills = 0;
  let combo = 0;
  let comboT = 0;
  let toast: string | null = null;
  let toastAt = 0;
  let buffT = 0;
  let whirlT = 0;
  let slamT = 0;
  let howlT = 0;
  let strikeT = 0;
  let wakeT = 0;
  let auraT = 0;
  let iFrames = 0;
  let stopT = 0;
  let trauma = 0;
  let px = 0;
  let pz = 0;
  let facing = 0;
  let dest: { x: number; z: number } | null = null;
  let stickX = 0;
  let stickY = 0;
  let cd = emptyCd();
  let novaKind: "maul" | "crash" | "storm" = "maul";
  let wavePause = 0;
  let last = performance.now();
  let running = true;
  let lastHud = 0;
  let lastSpd = 0;
  let holdAtk = false;
  let walkPhase = 0;
  let heartPulse = 0;
  let heartTele = 0;
  let heartSummoned = false;
  let spawnQ: { kind: Kind; elite: boolean }[] = [];
  let spawnWait = 0;
  let floaterId = 1;
  const prevKeys = new Set<string>();
  const enemies: Enemy[] = [];
  const drops: Drop[] = [];
  const floaters: FloaterW[] = [];
  const sparkGeo = new THREE.SphereGeometry(0.07, 5, 4);
  const sparkMatGold = new THREE.MeshBasicMaterial({ color: 0xf7d56a });
  const sparkMatCyan = new THREE.MeshBasicMaterial({ color: 0x7ee8f2 });
  const sparkMatEmber = new THREE.MeshBasicMaterial({ color: 0xff6a3a });
  const sparks: Spark[] = [];
  for (let i = 0; i < 72; i++) {
    const m = new THREE.Mesh(sparkGeo, sparkMatGold);
    m.visible = false;
    scene.add(m);
    sparks.push({ mesh: m, vx: 0, vy: 0, vz: 0, life: 0, on: false });
  }
  const hpMat = new THREE.MeshBasicMaterial({ color: 0x4ec878 });
  const goldDropMat = new THREE.MeshBasicMaterial({ color: 0xf0c24a });
  const shock = new THREE.Mesh(
    new THREE.RingGeometry(0.4, 0.7, 24),
    new THREE.MeshBasicMaterial({ color: 0x7ee8f2, transparent: true, opacity: 0, side: THREE.DoubleSide }),
  );
  shock.rotation.x = -Math.PI / 2;
  shock.position.y = 0.12;
  scene.add(shock);
  const howlRing = shock.clone();
  (howlRing.material as THREE.MeshBasicMaterial).color.setHex(0xf0c24a);
  scene.add(howlRing);
  const auraRing = shock.clone();
  (auraRing.material as THREE.MeshBasicMaterial).color.setHex(0x7ee8f2);
  auraRing.scale.setScalar(2.4);
  scene.add(auraRing);
  const threadBeam = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.12, 7.2),
    new THREE.MeshBasicMaterial({ color: 0x7ee8f2, transparent: true, opacity: 0 }),
  );
  threadBeam.position.y = 1.15;
  scene.add(threadBeam);
  const shotGeo = new THREE.OctahedronGeometry(0.16, 0);
  const shotMat = new THREE.MeshBasicMaterial({ color: 0x9ef4ff });
  const shots: Shot[] = [];
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Mesh(shotGeo, shotMat);
    m.visible = false;
    scene.add(m);
    shots.push({ mesh: m, x: 0, z: 0, vx: 0, vz: 0, life: 0, on: false });
  }

  function loadBest() {
    try {
      const raw = localStorage.getItem(SAVE);
      if (!raw) return 0;
      return Number(JSON.parse(raw).best || 0);
    } catch {
      return 0;
    }
  }
  function saveBest() {
    try {
      localStorage.setItem(SAVE, JSON.stringify({ best: Math.max(loadBest(), wave), kills }));
    } catch {
      /* private */
    }
  }

  function size() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  size();

  function blocked(x: number, z: number, r: number) {
    if (Math.hypot(x, z) > ARENA - r) return true;
    for (const p of pillars) if (Math.hypot(x - p.x, z - p.z) < r + p.r) return true;
    return false;
  }

  function sparkBurst(x: number, y: number, z: number, n: number, color: number) {
    const mat = color === 0xff6a3a ? sparkMatEmber : color === 0x7ee8f2 ? sparkMatCyan : sparkMatGold;
    let left = mobile ? Math.min(n, 8) : n;
    for (const s of sparks) {
      if (left <= 0) break;
      if (s.on) continue;
      s.on = true;
      s.mesh.material = mat;
      s.mesh.visible = true;
      s.mesh.position.set(x, y, z);
      s.vx = (Math.random() - 0.5) * 6;
      s.vy = 2 + Math.random() * 5;
      s.vz = (Math.random() - 0.5) * 6;
      s.life = 0.32 + Math.random() * 0.32;
      left -= 1;
    }
  }

  function say(line: string) {
    toast = line;
    toastAt = 2.2;
  }

  function pushDrop(x: number, z: number, kind: "hp" | "gold") {
    const m = new THREE.Mesh(new THREE.SphereGeometry(kind === "hp" ? 0.22 : 0.16, 8, 6), kind === "hp" ? hpMat : goldDropMat);
    m.position.set(x, 0.4, z);
    scene.add(m);
    drops.push({ mesh: m, x, z, kind, t: 14 });
  }

  function addFloater(x: number, y: number, z: number, n: number, crit: boolean) {
    floaters.push({
      id: floaterId++,
      text: crit ? `${n}!` : String(n),
      wx: x,
      wy: y,
      wz: z,
      t: 0.85,
      crit,
    });
    if (floaters.length > 18) floaters.shift();
  }

  function spawnEnemy(kind: Kind, elite = false) {
    const ang = Math.random() * Math.PI * 2;
    const dist = ARENA - 3;
    let x = Math.cos(ang) * dist;
    let z = Math.sin(ang) * dist;
    if (Math.hypot(x - px, z - pz) < 6) {
      x = -x;
      z = -z;
    }
    const stats =
      kind === "shard"
        ? { hp: 28 + wave * 4, speed: 4.4, r: 0.55, dmg: 8, xp: 12, gold: 4 }
        : kind === "hound"
          ? { hp: 55 + wave * 6, speed: 5.4, r: 0.7, dmg: 12, xp: 22, gold: 8 }
          : kind === "brute"
            ? { hp: 170 + wave * 18, speed: 3.05, r: 1.1, dmg: 20, xp: 60, gold: 24 }
            : { hp: 560 + wave * 24, speed: 2.55, r: 1.55, dmg: 24, xp: 220, gold: 90 };
    const mesh = makeEnemy(kind, elite);
    mesh.position.set(x, 0, z);
    scene.add(mesh);
    enemies.push({
      kind,
      mesh,
      hp: elite ? stats.hp * 1.6 : stats.hp,
      hpMax: elite ? stats.hp * 1.6 : stats.hp,
      x,
      z,
      speed: stats.speed,
      r: stats.r * (elite ? 1.15 : 1),
      dmg: stats.dmg,
      xp: elite ? stats.xp * 2 : stats.xp,
      gold: elite ? stats.gold * 2 : stats.gold,
      flash: 0,
      hitCd: 0,
      alive: true,
      elite,
      tele: 0,
      slow: 0,
    });
  }

  function beginWave() {
    wave += 1;
    spawnQ = [];
    spawnWait = 0.15;
    heartPulse = 0;
    heartTele = 0;
    heartSummoned = false;
    if (wave === 5) {
      spawnEnemy("heart");
      say("The Heart of the Veil rises.");
      audio.kiln();
      return;
    }
    const shards = 4 + wave * 2;
    const hounds = Math.max(0, wave - 1);
    for (let i = 0; i < shards; i++) spawnQ.push({ kind: "shard", elite: wave >= 4 && i === 0 });
    for (let i = 0; i < hounds; i++) spawnQ.push({ kind: "hound", elite: false });
    if (wave >= 3) spawnQ.push({ kind: "brute", elite: true });
    say(`Wave ${wave}`);
  }

  function gainXp(n: number) {
    xp += n;
    while (xp >= xpNext) {
      xp -= xpNext;
      level += 1;
      xpNext = Math.floor(xpNext * 1.35);
      hpMax += 18;
      hp = hpMax;
      say(`Level ${level}`);
      audio.howl();
    }
  }

  function hurtPlayer(n: number) {
    if (iFrames > 0 || mode !== "play") return;
    const mit = buffT > 0 ? 0.55 : 1;
    hp = Math.max(0, hp - n * mit);
    iFrames = 0.55;
    trauma = Math.min(1, trauma + 0.45);
    audio.talk();
    if (hp <= 0) {
      mode = "dead";
      saveBest();
      say("StarBoltSprint falls.");
    }
  }

  function hurtEnemy(e: Enemy, dmg: number, kx: number, kz: number, quiet = false) {
    if (!e.alive) return;
    const mul = buffT > 0 ? 1.35 : 1;
    const crit = Math.random() < (buffT > 0 ? 0.22 : 0.12);
    const dealt = Math.round(dmg * mul * (0.9 + level * 0.08) * (crit ? 1.85 : 1));
    e.hp -= dealt;
    e.flash = 0.12;
    e.x += kx;
    e.z += kz;
    if (!quiet) {
      trauma = Math.min(1, trauma + (crit ? 0.32 : 0.18));
      stopT = Math.max(stopT, crit ? 0.07 : 0.045);
      sparkBurst(e.x, 1.1, e.z, crit ? 10 : 6, e.elite ? 0xf0c24a : crit ? 0xff6a3a : 0x7ee8f2);
      addFloater(e.x, 1.7, e.z, dealt, crit);
    }
    combo += 1;
    comboT = 2.4;
    if (e.hp <= 0) {
      e.alive = false;
      scene.remove(e.mesh);
      kills += 1;
      gainXp(e.xp);
      gold += e.gold;
      if (Math.random() < 0.5) pushDrop(e.x, e.z, Math.random() < 0.42 ? "hp" : "gold");
      sparkBurst(e.x, 1.2, e.z, 16, 0xf7d56a);
      audio.grow();
      if (e.kind === "heart") {
        mode = "win";
        saveBest();
        say("The Veil shatters.");
        audio.howl();
      }
    }
  }

  function foesIn(x: number, z: number, r: number, facingLock?: number, cone = 0) {
    return enemies.filter((e) => {
      if (!e.alive) return false;
      const d = Math.hypot(e.x - x, e.z - z);
      if (d > r + e.r) return false;
      if (cone && facingLock != null) {
        const a = Math.atan2(e.x - x, e.z - z);
        let dlt = a - facingLock;
        while (dlt > Math.PI) dlt -= Math.PI * 2;
        while (dlt < -Math.PI) dlt += Math.PI * 2;
        if (Math.abs(dlt) > cone) return false;
      }
      return true;
    });
  }

  function nearest() {
    let best: Enemy | null = null;
    let bd = 99;
    for (const e of enemies) {
      if (!e.alive) continue;
      const d = Math.hypot(e.x - px, e.z - pz);
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  }

  function faceToward(x: number, z: number) {
    if (Math.hypot(x - px, z - pz) > 0.05) facing = Math.atan2(x - px, z - pz);
  }

  function aimFromPointer() {
    ray.setFromCamera(pointer, camera);
    if (!ray.ray.intersectPlane(groundPlane, hit)) return null;
    return hit;
  }

  function kit() {
    return classKit(classId);
  }

  function primary() {
    return kit().skills[0].id;
  }

  function skillCost(id: SlashSkillId) {
    return kit().skills.find((s) => s.id === id)?.cost ?? 0;
  }

  function pay(id: SlashSkillId) {
    const cost = skillCost(id);
    if (cd[id] > 0 || fury < cost) return false;
    fury -= cost;
    cd[id] = CD[id];
    return true;
  }

  function fireBolt() {
    const n = nearest();
    let fx = Math.sin(facing);
    let fz = Math.cos(facing);
    if (n && Math.hypot(n.x - px, n.z - pz) < 14) {
      faceToward(n.x, n.z);
      const d = Math.hypot(n.x - px, n.z - pz) || 1;
      fx = (n.x - px) / d;
      fz = (n.z - pz) / d;
    }
    for (const s of shots) {
      if (s.on) continue;
      s.on = true;
      s.mesh.visible = true;
      s.x = px + fx * 0.9;
      s.z = pz + fz * 0.9;
      s.vx = fx * 22;
      s.vz = fz * 22;
      s.life = 0.95;
      s.mesh.position.set(s.x, 1.18, s.z);
      break;
    }
  }

  function dashStrike() {
    const n = nearest();
    if (n) faceToward(n.x, n.z);
    const fx = Math.sin(facing);
    const fz = Math.cos(facing);
    const mom = lastSpd + fury * 0.045;
    const dist = 2.6 + clamp(mom * 0.2, 0, 3.4);
    const dmg = 12 + mom * 4.4;
    const steps = 7;
    for (let i = 1; i <= steps; i++) {
      const nx = px + fx * (dist / steps);
      const nz = pz + fz * (dist / steps);
      if (!blocked(nx, nz, 0.48)) {
        px = nx;
        pz = nz;
      }
    }
    sparkBurst(px, 0.55, pz, 10, 0xffe08a);
    destMark.position.set(px + fx * 0.4, 0.08, pz + fz * 0.4);
    for (const e of foesIn(px - fx * dist * 0.45, pz - fz * dist * 0.45, dist * 0.55 + 1.2, facing, 1.05)) {
      hurtEnemy(e, dmg, fx * 1.05, fz * 1.05);
    }
    iFrames = Math.max(iFrames, 0.14);
    strikeT = 0.2;
    fury = Math.min(FURY_MAX, fury + 10 + lastSpd * 1.5);
  }

  function cast(id: SlashSkillId) {
    if (mode !== "play") return;
    audio.unlock();
    if (id === "bite") {
      if (!pay("bite")) return;
      const n = nearest();
      if (n) faceToward(n.x, n.z);
      strikeT = 0.28;
      fury = Math.min(FURY_MAX, fury + 16);
      const fx = Math.sin(facing);
      const fz = Math.cos(facing);
      let fed = 0;
      for (const e of foesIn(px + fx * 1.15, pz + fz * 1.15, 1.7, facing, 0.95)) {
        hurtEnemy(e, 28, fx * 0.7, fz * 0.7);
        fed += 6;
      }
      if (fed) hp = Math.min(hpMax, hp + Math.min(18, fed));
      audio.eye();
      return;
    }
    if (id === "dash") {
      if (!pay("dash")) return;
      dashStrike();
      audio.eye();
      return;
    }
    if (id === "bolt") {
      if (!pay("bolt")) return;
      strikeT = 0.22;
      fury = Math.min(FURY_MAX, fury + 10);
      fireBolt();
      audio.eye();
      return;
    }
    if (id === "thrash") {
      if (!pay("thrash")) return;
      whirlT = 1.55;
      audio.canal();
      return;
    }
    if (id === "wake") {
      if (!pay("wake")) return;
      wakeT = 4.6;
      (whirlDisc.material as THREE.MeshBasicMaterial).color.setHex(0xffe08a);
      audio.canal();
      say("Keep running.");
      return;
    }
    if (id === "aura") {
      if (!pay("aura")) return;
      auraT = 6.8;
      audio.canal();
      say("The spark holds.");
      return;
    }
    if (id === "maul") {
      if (!pay("maul")) return;
      novaKind = "maul";
      slamT = 0.5;
      audio.kiln();
      return;
    }
    if (id === "crash") {
      if (!pay("crash")) return;
      novaKind = "crash";
      slamT = 0.28;
      audio.kiln();
      return;
    }
    if (id === "storm") {
      if (!pay("storm")) return;
      novaKind = "storm";
      slamT = 0.58;
      audio.kiln();
      return;
    }
    if (id === "howl") {
      if (!pay("howl")) return;
      howlT = 0.55;
      buffT = 6.5;
      howlRing.position.set(px, 0.12, pz);
      howlRing.scale.setScalar(1);
      (howlRing.material as THREE.MeshBasicMaterial).color.setHex(0xf0c24a);
      (howlRing.material as THREE.MeshBasicMaterial).opacity = 0.9;
      for (const e of foesIn(px, pz, 4.4)) {
        const dx = e.x - px;
        const dz = e.z - pz;
        const m = Math.hypot(dx, dz) || 1;
        hurtEnemy(e, 20, (dx / m) * 1.5, (dz / m) * 1.5);
      }
      audio.howl();
      say("Howl of the pack.");
    }
  }

  function setClass(id: SlashClassId) {
    classId = id;
    try {
      localStorage.setItem(CLASS_SAVE, id);
    } catch {
      /* private */
    }
    applyGear();
    emitHud();
  }

  function pressed(code: string) {
    return input.keys.has(code) && !prevKeys.has(code);
  }

  function setPointer(ev: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pinchSpan() {
    const a = [...pins.values()];
    if (a.length < 2) return 0;
    return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
  }

  function onPointer(ev: PointerEvent) {
    if (mode !== "play") return;
    if ((ev.target as HTMLElement | null)?.closest?.(".slash-hud, .slash-gate")) return;
    pins.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pins.size >= 2) {
      pinching = true;
      pinchD = pinchSpan();
      holdAtk = false;
      dest = null;
      return;
    }
    setPointer(ev);
    holdAtk = true;
    const p = aimFromPointer();
    if (!p) return;
    const n = nearest();
    if (n && Math.hypot(n.x - p.x, n.z - p.z) < 1.5) {
      faceToward(n.x, n.z);
      dest = null;
      cast(primary());
      return;
    }
    dest = { x: p.x, z: p.z };
  }
  function onPointerMove(ev: PointerEvent) {
    if (pins.has(ev.pointerId)) pins.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pinching && pins.size >= 2) {
      const d = pinchSpan();
      if (pinchD > 12 && d > 12) zoom = clamp(zoom * (d / pinchD), ZOOM_MIN, ZOOM_MAX);
      pinchD = d;
      return;
    }
    if (!holdAtk || mode !== "play") return;
    setPointer(ev);
  }
  function onPointerUp(ev: PointerEvent) {
    pins.delete(ev.pointerId);
    if (pins.size < 2) pinching = false;
    if (pins.size === 0) holdAtk = false;
  }
  function onWheel(ev: WheelEvent) {
    if (mode !== "play") return;
    const t = ev.target as HTMLElement | null;
    if (t?.closest?.("button, .slash-stick, .slash-gate")) return;
    ev.preventDefault();
    zoom = clamp(zoom * Math.exp(ev.deltaY * 0.0015), ZOOM_MIN, ZOOM_MAX);
  }
  canvas.addEventListener("pointerdown", onPointer);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("wheel", onWheel, { passive: false });

  function emitHud() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const projected: SlashFloater[] = [];
    for (const f of floaters) {
      proj.set(f.wx, f.wy, f.wz).project(camera);
      projected.push({
        id: f.id,
        text: f.text,
        x: (proj.x * 0.5 + 0.5) * w,
        y: (-proj.y * 0.5 + 0.5) * h,
        crit: f.crit,
      });
    }
    onHud({
      mode,
      hp,
      hpMax,
      fury,
      furyMax: FURY_MAX,
      xp,
      xpNext,
      level,
      gold,
      wave,
      kills,
      combo,
      toast,
      buff: buffT,
      floaters: projected,
      resource: kit().resource,
      classId,
      className: kit().name,
      skills: kit().skills.map((s) => ({
        ...s,
        ready: clamp(1 - cd[s.id] / CD[s.id], 0, 1),
      })),
    });
  }

  function clearFoes() {
    for (const e of enemies) scene.remove(e.mesh);
    enemies.length = 0;
    for (const d of drops) scene.remove(d.mesh);
    drops.length = 0;
    spawnQ = [];
  }

  function start() {
    audio.unlock();
    if (mode === "pause") {
      mode = "play";
      emitHud();
      return;
    }
    mode = "play";
    hpMax = HP_MAX0;
    hp = hpMax;
    fury = 40;
    xp = 0;
    xpNext = 80;
    level = 1;
    gold = 0;
    wave = 0;
    kills = 0;
    combo = 0;
    comboT = 0;
    px = 0;
    pz = 0;
    facing = 0;
    camSnap = true;
    dest = null;
    cd = emptyCd();
    novaKind = "maul";
    buffT = whirlT = slamT = howlT = strikeT = wakeT = auraT = 0;
    iFrames = 0;
    trauma = 0;
    holdAtk = false;
    clearFoes();
    beginWave();
    audio.land();
    if (!pinchHint) {
      pinchHint = true;
      say(mobile ? "Pinch to look farther." : "Scroll to look farther.");
    }
    emitHud();
  }

  function tick(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    input.beginFrame();

    sky.rotation.y += dt * 0.012;
    for (let i = 0; i < crystals.length; i++) {
      const c = crystals[i];
      c.position.y = 2.1 + Math.sin(now * 0.0014 + i) * 0.45;
      c.rotation.y += dt * 0.6;
    }
    for (const pit of pits) {
      (pit.material as THREE.MeshBasicMaterial).opacity = 0.52 + Math.sin(now * 0.004) * 0.18;
    }
    for (const m of motes) {
      m.mesh.position.y = 0.5 + Math.abs(Math.sin(now * 0.0009 + m.ph)) * 2.5;
      m.mesh.position.x = m.ox + Math.sin(now * 0.0004 + m.ph) * 0.55;
      m.mesh.position.z = m.oz + Math.cos(now * 0.00035 + m.ph) * 0.55;
    }

    if (mode === "title") {
      const t = reduce ? 0.4 : now * 0.00018;
      camera.position.set(Math.sin(t) * 8.6, 6.4, Math.cos(t) * 8.6);
      camera.lookAt(0, 1.55, 0);
      hero.rotation.y += dt * (reduce ? 0.12 : 0.32);
      heroCrystal.rotation.y += dt * 1.6;
      heroHead.rotation.y = Math.sin(now * 0.002) * 0.08;
      heroTail.rotation.z = Math.sin(now * 0.01) * 0.22;
      cape.rotation.x = 0.12 + Math.sin(now * 0.002) * 0.08;
      heroLight.position.set(0, 2.4, 0);
      bladeLight.position.set(Math.sin(hero.rotation.y) * 1.2, 1.6, Math.cos(hero.rotation.y) * 1.2);
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
      return;
    }

    if (mode === "pause") {
      if (pressed("Escape") || pressed("KeyP")) {
        mode = "play";
        emitHud();
      }
      prevKeys.clear();
      for (const k of input.keys) prevKeys.add(k);
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
      return;
    }

    const live = mode === "play" && stopT <= 0;
    if (stopT > 0) stopT -= dt;

    if (live) {
      if (pressed("Escape") || pressed("KeyP")) {
        mode = "pause";
        emitHud();
      }
      if (pressed("Digit1") || pressed("Space")) cast(kit().skills[0].id);
      if (pressed("Digit2") || pressed("KeyQ")) cast(kit().skills[1].id);
      if (pressed("Digit3") || pressed("KeyE")) cast(kit().skills[2].id);
      if (pressed("Digit4") || pressed("KeyR") || pressed("KeyH")) cast(kit().skills[3].id);
      if (input.keys.has("Minus") || input.keys.has("NumpadSubtract")) {
        zoom = clamp(zoom + dt * 0.9, ZOOM_MIN, ZOOM_MAX);
      }
      if (input.keys.has("Equal") || input.keys.has("NumpadAdd")) {
        zoom = clamp(zoom - dt * 0.9, ZOOM_MIN, ZOOM_MAX);
      }

      const a = input.actions;
      let mx = a.moveX + stickX;
      let my = a.moveY + stickY;
      const mag = Math.hypot(mx, my);
      if (mag > 1) {
        mx /= mag;
        my /= mag;
      }

      camRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
      camRight.y = 0;
      if (camRight.lengthSq() > 0.0001) camRight.normalize();
      camFwd.set(0, 0, -1).applyQuaternion(camera.quaternion);
      camFwd.y = 0;
      if (camFwd.lengthSq() > 0.0001) camFwd.normalize();

      if (holdAtk) {
        const p = aimFromPointer();
        const n = nearest();
        const reach = classId === "arc" ? 10.5 : classId === "blitz" ? 6.4 : 2.4;
        if (n && Math.hypot(n.x - px, n.z - pz) < reach) {
          dest = null;
          faceToward(n.x, n.z);
          if (cd[primary()] <= 0) cast(primary());
        } else if (p) {
          dest = { x: p.x, z: p.z };
        }
      }

      let vx = 0;
      let vz = 0;
      if (mag > 0.08) {
        dest = null;
        vx = camRight.x * mx + camFwd.x * my;
        vz = camRight.z * mx + camFwd.z * my;
      } else if (dest) {
        const dx = dest.x - px;
        const dz = dest.z - pz;
        const d = Math.hypot(dx, dz);
        if (d < 0.35) dest = null;
        else {
          vx = dx / d;
          vz = dz / d;
        }
      }

      let spd = classId === "blitz" ? 8.9 : 7.15;
      if (wakeT > 0) spd = 11.15;
      if (whirlT > 0) spd = 9.2;
      spd *= a.sprint ? 1.16 : 1;
      lastSpd = 0;
      if (vx || vz) {
        const n = Math.hypot(vx, vz) || 1;
        vx /= n;
        vz /= n;
        let nx = px + vx * spd * dt;
        let nz = pz + vz * spd * dt;
        if (!blocked(nx, pz, 0.62)) px = nx;
        if (!blocked(px, nz, 0.62)) pz = nz;
        if (whirlT <= 0) facing = Math.atan2(vx, vz);
        lastSpd = spd;
        walkPhase += dt * spd * 2.4;
      } else {
        walkPhase *= Math.max(0, 1 - dt * 8);
      }

      destMark.visible = !!dest;
      if (dest) {
        destMark.position.set(dest.x, 0.08, dest.z);
        (destMark.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(now * 0.01) * 0.25;
        destMark.scale.setScalar(1 + Math.sin(now * 0.008) * 0.12);
      }

      for (const k of Object.keys(CD) as SlashSkillId[]) {
        cd[k] = Math.max(0, cd[k] - dt);
      }
      buffT = Math.max(0, buffT - dt);
      iFrames = Math.max(0, iFrames - dt);
      if (classId === "blitz") {
        if (lastSpd > 1.2) fury = Math.min(FURY_MAX, fury + dt * 18);
        else fury = Math.max(0, fury - dt * 10);
      } else if (classId === "arc") {
        fury = Math.min(FURY_MAX, fury + dt * 1.9);
      } else {
        fury = Math.min(FURY_MAX, fury + dt * 2.4);
      }
      if (toastAt > 0) {
        toastAt -= dt;
        if (toastAt <= 0) toast = null;
      }
      comboT = Math.max(0, comboT - dt);
      if (comboT <= 0) combo = 0;

      if (spawnQ.length) {
        spawnWait -= dt;
        if (spawnWait <= 0) {
          const next = spawnQ.shift();
          if (next) spawnEnemy(next.kind, next.elite);
          spawnWait = 0.32;
        }
      }

      if (whirlT > 0) {
        whirlT -= dt;
        hero.rotation.y += dt * 18;
        whirlDisc.position.set(px, 0.9, pz);
        whirlDisc.rotation.z += dt * 14;
        (whirlDisc.material as THREE.MeshBasicMaterial).opacity = 0.7;
        if (Math.floor(now / 90) !== Math.floor((now - dt * 1000) / 90)) {
          for (const e of foesIn(px, pz, 2.2)) {
            const dx = e.x - px;
            const dz = e.z - pz;
            const m = Math.hypot(dx, dz) || 1;
            hurtEnemy(e, 10, (dx / m) * 0.28, (dz / m) * 0.28);
          }
        }
      } else (whirlDisc.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (whirlDisc.material as THREE.MeshBasicMaterial).opacity - dt * 3);

      if (wakeT > 0 && whirlT <= 0) {
        wakeT -= dt;
        whirlDisc.position.set(px, 0.38, pz);
        whirlDisc.scale.setScalar(0.72);
        whirlDisc.rotation.z += dt * 8;
        (whirlDisc.material as THREE.MeshBasicMaterial).color.setHex(0xffe08a);
        (whirlDisc.material as THREE.MeshBasicMaterial).opacity = 0.62;
        if (lastSpd > 1 && Math.floor(now / 80) !== Math.floor((now - dt * 1000) / 80)) {
          for (const e of foesIn(px, pz, 1.9)) {
            const dx = e.x - px;
            const dz = e.z - pz;
            const m = Math.hypot(dx, dz) || 1;
            hurtEnemy(e, 7 + lastSpd * 0.85, (dx / m) * 0.2, (dz / m) * 0.2, true);
          }
        }
      } else if (whirlT <= 0) {
        whirlDisc.scale.setScalar(1);
      }

      if (auraT > 0) {
        auraT -= dt;
        auraRing.position.set(px, 0.1, pz);
        auraRing.scale.setScalar(2.35);
        (auraRing.material as THREE.MeshBasicMaterial).opacity = 0.42 + Math.sin(now * 0.012) * 0.12;
        if (Math.floor(now / 220) !== Math.floor((now - dt * 1000) / 220)) {
          for (const e of foesIn(px, pz, 2.75)) {
            hurtEnemy(e, 9, 0, 0, true);
          }
        }
      } else {
        (auraRing.material as THREE.MeshBasicMaterial).opacity = Math.max(
          0,
          (auraRing.material as THREE.MeshBasicMaterial).opacity - dt * 2.2,
        );
      }

      if (slamT > 0) {
        slamT -= dt;
        if (slamT <= 0) {
          shock.position.set(px, 0.12, pz);
          shock.scale.setScalar(1);
          const crash = novaKind === "crash";
          const storm = novaKind === "storm";
          (shock.material as THREE.MeshBasicMaterial).color.setHex(storm ? 0x7ee8f2 : crash ? 0xffe08a : 0xf0c24a);
          (shock.material as THREE.MeshBasicMaterial).opacity = 0.9;
          const r = crash ? 5.1 : storm ? 5.7 : 4.5;
          const dmg = crash ? 16 + fury * 0.58 : storm ? 50 : 54;
          for (const e of foesIn(px, pz, r)) {
            const dx = e.x - px;
            const dz = e.z - pz;
            const m = Math.hypot(dx, dz) || 1;
            hurtEnemy(e, dmg, (dx / m) * (crash ? 2.1 : 1.9), (dz / m) * (crash ? 2.1 : 1.9));
          }
          if (crash) fury = Math.max(0, fury * 0.18);
          sparkBurst(px, 0.4, pz, 24, storm ? 0x7ee8f2 : 0xf0c24a);
          trauma = Math.min(1, trauma + 0.72);
          stopT = 0.09;
        }
      }
      if (howlT > 0) howlT -= dt;
      if (strikeT > 0) {
        strikeT -= dt;
        rightArm.rotation.x = -Math.sin((1 - strikeT / 0.28) * Math.PI) * 1.45;
        leftArm.rotation.x = Math.sin((1 - strikeT / 0.28) * Math.PI) * 0.35;
      } else {
        rightArm.rotation.x = -0.28;
        leftArm.rotation.x = 0.08 + Math.sin(walkPhase) * 0.35 * (lastSpd > 0.2 ? 1 : 0);
      }

      const step = Math.sin(walkPhase) * 0.55 * (lastSpd > 0.2 ? 1 : 0);
      leftLeg.rotation.x = step;
      rightLeg.rotation.x = -step;
      cape.rotation.x = 0.16 + Math.sin(now * 0.003) * 0.06 + (lastSpd > 0.2 ? 0.12 : 0);
      heroCrystal.rotation.y += dt * 2.2;
      heroHead.rotation.y = Math.sin(now * 0.0022) * 0.1;
      heroTail.rotation.z = Math.sin(now * 0.01) * 0.28;

      for (const e of enemies) {
        if (!e.alive) continue;
        e.hitCd = Math.max(0, e.hitCd - dt);
        e.flash = Math.max(0, e.flash - dt);
        e.slow = Math.max(0, e.slow - dt);
        const dx = px - e.x;
        const dz = pz - e.z;
        const d = Math.hypot(dx, dz) || 1;
        let sx = 0;
        let sz = 0;
        for (const o of enemies) {
          if (o === e || !o.alive) continue;
          const ox = e.x - o.x;
          const oz = e.z - o.z;
          const od = Math.hypot(ox, oz);
          if (od > 0.05 && od < 1.7) {
            sx += ox / od;
            sz += oz / od;
          }
        }
        const seek = e.kind === "heart" ? 0.68 : 1;
        let vx2 = (dx / d) * seek + sx * 0.55;
        let vz2 = (dz / d) * seek + sz * 0.55;
        const nm = Math.hypot(vx2, vz2) || 1;
        const stepE = e.speed * (e.slow > 0 ? 0.42 : 1) * dt;
        let nx = e.x + (vx2 / nm) * stepE;
        let nz = e.z + (vz2 / nm) * stepE;
        if (!blocked(nx, e.z, e.r * 0.7)) e.x = nx;
        if (!blocked(e.x, nz, e.r * 0.7)) e.z = nz;
        const bob = e.kind === "shard" ? Math.sin(now * 0.006 + e.x) * 0.12 : e.flash > 0 ? 0.08 : 0;
        e.mesh.position.set(e.x, bob, e.z);
        e.mesh.lookAt(px, 0.8, pz);
        const orbit = e.mesh.userData.orbit as THREE.Group | undefined;
        if (orbit) orbit.rotation.y += dt * 1.4;
        const fill = e.mesh.userData.hpFill as THREE.Mesh | undefined;
        const bar = e.mesh.userData.hpBar as THREE.Group | undefined;
        if (fill) fill.scale.x = Math.max(0.04, e.hp / e.hpMax);
        if (bar) bar.quaternion.copy(camera.quaternion);
        e.mesh.traverse((c) => {
          const mesh = c as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat?.emissive && mat !== floatCrystalMat) {
            mat.emissiveIntensity = e.flash > 0 ? 1.45 : e.elite || e.kind === "heart" ? 0.5 : 0.2;
          }
        });
        if (d < e.r + 0.72 && e.hitCd <= 0) {
          hurtPlayer(e.dmg);
          e.hitCd = 0.85;
        }
      }

      const heart = enemies.find((e) => e.kind === "heart" && e.alive);
      if (heart && mode === "play") {
        heartPulse += dt;
        if (heartPulse > 4.1 && heartTele <= 0) {
          heartTele = 0.55;
          heartPulse = 0;
        }
        if (heartTele > 0) {
          heartTele -= dt;
          heart.mesh.scale.setScalar(2.15 + (0.55 - heartTele) * 0.35);
          if (heartTele <= 0) {
            heart.mesh.scale.setScalar(2.15);
            shock.position.set(heart.x, 0.12, heart.z);
            shock.scale.setScalar(1);
            (shock.material as THREE.MeshBasicMaterial).color.setHex(0xff6a3a);
            (shock.material as THREE.MeshBasicMaterial).opacity = 0.85;
            if (Math.hypot(heart.x - px, heart.z - pz) < 6.2) hurtPlayer(16);
            sparkBurst(heart.x, 1.4, heart.z, 18, 0xff6a3a);
            trauma = Math.min(1, trauma + 0.5);
            if (!heartSummoned && heart.hp < heart.hpMax * 0.5) {
              heartSummoned = true;
              spawnEnemy("shard", true);
              spawnEnemy("hound");
              say("The Heart calls shards.");
            }
          }
        }
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.t -= dt;
        const dist = Math.hypot(d.x - px, d.z - pz);
        if (dist < 3.6) {
          const pull = clamp((3.6 - dist) * 3.2 * dt, 0, 0.4);
          const inv = dist || 1;
          d.x += ((px - d.x) / inv) * pull * 8;
          d.z += ((pz - d.z) / inv) * pull * 8;
        }
        d.mesh.position.set(d.x, 0.35 + Math.sin(now * 0.006 + i) * 0.1, d.z);
        d.mesh.rotation.y += dt * 2.2;
        if (Math.hypot(d.x - px, d.z - pz) < 1.05) {
          if (d.kind === "hp") hp = Math.min(hpMax, hp + 36);
          else gold += 12;
          fury = Math.min(FURY_MAX, fury + 8);
          scene.remove(d.mesh);
          drops.splice(i, 1);
          audio.foot(1);
        } else if (d.t <= 0) {
          scene.remove(d.mesh);
          drops.splice(i, 1);
        }
      }

      for (let i = floaters.length - 1; i >= 0; i--) {
        floaters[i].t -= dt;
        floaters[i].wy += dt * 1.15;
        if (floaters[i].t <= 0) floaters.splice(i, 1);
      }

      if (enemies.every((e) => !e.alive) && spawnQ.length === 0 && mode === "play") {
        wavePause += dt;
        if (wavePause > 1.35) {
          wavePause = 0;
          if (wave >= 5) {
            mode = "win";
            saveBest();
          } else beginWave();
        }
      } else wavePause = 0;
    }

    trauma = Math.max(0, trauma - dt * 1.45);
    const shake = reduce ? 0 : trauma * trauma;
    hero.position.set(px, slamT > 0.25 ? 1.45 * (slamT - 0.25) : 0, pz);
    if (whirlT <= 0) hero.rotation.y = facing;
    hero.visible = iFrames <= 0 || Math.floor(now / 70) % 2 === 0;

    shock.scale.multiplyScalar(1 + dt * 6);
    const sm = shock.material as THREE.MeshBasicMaterial;
    sm.opacity = Math.max(0, sm.opacity - dt * 1.55);
    if (sm.opacity <= 0) sm.color.setHex(0x7ee8f2);
    howlRing.scale.multiplyScalar(1 + dt * 5.5);
    (howlRing.material as THREE.MeshBasicMaterial).opacity = Math.max(
      0,
      (howlRing.material as THREE.MeshBasicMaterial).opacity - dt * 1.4,
    );
    (threadBeam.material as THREE.MeshBasicMaterial).opacity = Math.max(
      0,
      (threadBeam.material as THREE.MeshBasicMaterial).opacity - dt * 2.4,
    );
    for (const s of shots) {
      if (!s.on) continue;
      s.life -= dt;
      s.x += s.vx * dt;
      s.z += s.vz * dt;
      s.mesh.position.set(s.x, 1.18, s.z);
      s.mesh.rotation.y += dt * 14;
      let hitE = false;
      for (const e of enemies) {
        if (!e.alive) continue;
        if (Math.hypot(e.x - s.x, e.z - s.z) < e.r + 0.28) {
          const m = Math.hypot(s.vx, s.vz) || 1;
          hurtEnemy(e, 18, (s.vx / m) * 0.45, (s.vz / m) * 0.45);
          hitE = true;
          break;
        }
      }
      if (s.life <= 0 || hitE || Math.hypot(s.x, s.z) > ARENA) {
        s.on = false;
        s.mesh.visible = false;
      }
    }

    for (const s of sparks) {
      if (!s.on) continue;
      s.life -= dt;
      s.vy -= 14 * dt;
      s.mesh.position.x += s.vx * dt;
      s.mesh.position.y += s.vy * dt;
      s.mesh.position.z += s.vz * dt;
      if (s.life <= 0) {
        s.on = false;
        s.mesh.visible = false;
      }
    }

    camDesired.set(px + CAM_XZ * zoom, CAM_Y * zoom, pz + CAM_XZ * zoom);
    if (camSnap) {
      camera.position.copy(camDesired);
      camSnap = false;
    } else {
      camera.position.lerp(camDesired, 1 - Math.exp(-8 * dt));
    }
    tmp.set(px, 1.72, pz);
    camera.lookAt(tmp);
    if (shake > 0.01) {
      camera.position.x += (Math.random() - 0.5) * shake * 1.15;
      camera.position.y += (Math.random() - 0.5) * shake * 0.65;
    }
    heroLight.position.set(px, 2.55, pz);
    heroLight.intensity = buffT > 0 ? 22 : 16;
    bladeLight.position.set(px + Math.sin(facing) * 1.25, 1.65, pz + Math.cos(facing) * 1.25);
    bladeLight.intensity = whirlT > 0 ? 18 : strikeT > 0 ? 14 : 8;
    sun.position.set(px + 12, 20, pz + 7);
    sun.target.position.set(px, 0, pz);
    heroRing.position.set(px, 0.05, pz);
    (heroRing.material as THREE.MeshBasicMaterial).opacity = 0.42 + Math.sin(now * 0.006) * 0.14;

    prevKeys.clear();
    for (const k of input.keys) prevKeys.add(k);

    if (now - lastHud > 70) {
      lastHud = now;
      emitHud();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", size);
  requestAnimationFrame(tick);
  emitHud();

  if (import.meta.env.DEV || new URLSearchParams(location.search).has("qa")) {
    (window as unknown as { __controlsTest?: unknown }).__controlsTest = {
      getYaw: () => facing,
      getSpeed: () => lastSpd,
      getZoom: () => zoom,
      setZoom: (z: number) => {
        zoom = clamp(z, ZOOM_MIN, ZOOM_MAX);
      },
      setKeys: (codes: string[]) => {
        input.keys.clear();
        for (const c of codes) input.keys.add(c);
      },
    };
  }

  return {
    dispose() {
      running = false;
      window.removeEventListener("resize", size);
      canvas.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("wheel", onWheel);
      input.dispose();
      audio.dispose();
      groundTex.dispose();
      skyTex.dispose();
      renderer.dispose();
    },
    start,
    cast,
    setClass,
    setStick(x, y) {
      stickX = x;
      stickY = y;
    },
    audio,
  };
}
