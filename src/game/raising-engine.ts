import * as THREE from "three";
import { createInput, type InputHandle } from "./input";
import { createAudio, type AudioBus } from "./audio";
import { buildRaising } from "./raising-world";
import { cleanIslandName, DEFAULT_ISLAND } from "./land";

export type KeeperHint = {
  id: string;
  name: string;
  role: string;
  line: string;
} | null;

export type RaisingHud = {
  mode: "title" | "play" | "pause";
  toast: string | null;
  lookX: number;
  lookZ: number;
  charge: number;
  tended: boolean;
  joined: boolean;
  grown: number;
  named: number;
  howling: boolean;
  near: KeeperHint;
  prompt: string;
  aim: string;
  needle: number;
  act: string;
  botOn: boolean;
  botName: string;
  host: boolean;
  landId: string;
  island: string;
  skills: string[];
};

export type RaisingHandle = {
  dispose: () => void;
  land: () => void;
  setMode: (m: RaisingHud["mode"]) => void;
  setStick: (x: number, y: number) => void;
  setHowl: (v: boolean) => void;
  talk: () => void;
  botWork: (text?: string) => boolean;
  teach: (text: string) => void;
  setIsland: (name: string) => boolean;
  setBot: (on: boolean, name?: string) => void;
  netPose: () => NetPose;
  civicSnap: () => CivicSnap;
  setPeer: (id: string, pose: NetPose) => void;
  dropPeer: (id: string) => void;
  applyCivic: (s: CivicSnap, line?: string) => void;
  onCivic: (fn: (s: CivicSnap, line: string) => void) => () => void;
  input: InputHandle;
  audio: AudioBus;
};

export type NetPose = { x: number; z: number; yaw: number; howl: boolean };
export type CivicSnap = {
  charge: number;
  tended: boolean;
  joined: boolean;
  grown: number;
  named: number;
  island: string;
};

const SAVE = "lc-circuit-v1";
const ISO = Math.PI / 4;
const HUB: KeeperHint = {
  id: "hub",
  name: "Core Spire",
  role: "The Howling Crucible · not a throne",
  line: "Hold the Spire. Howl. Your Grok Bot grows the den.",
};

type Save = { grown: number; named: number; seen: string[]; skills: string[]; island: string };

function loadSave(): Save {
  try {
    const raw = localStorage.getItem(SAVE);
    if (!raw) return { grown: 0, named: 0, seen: [], skills: [], island: DEFAULT_ISLAND };
    const p = JSON.parse(raw) as Save;
    return {
      grown: Math.max(0, p.grown | 0),
      named: Math.max(0, p.named | 0),
      seen: Array.isArray(p.seen) ? p.seen : [],
      skills: Array.isArray(p.skills) ? p.skills.map((s) => String(s).slice(0, 80)).filter(Boolean).slice(0, 16) : [],
      island: cleanIslandName(String(p.island || "")) || DEFAULT_ISLAND,
    };
  } catch {
    return { grown: 0, named: 0, seen: [], skills: [], island: DEFAULT_ISLAND };
  }
}

function writeSave(s: Save) {
  try {
    localStorage.setItem(SAVE, JSON.stringify(s));
  } catch {
    /* samsung */
  }
}

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

function makeHound(seed?: string) {
  const n = seed ? Math.abs(hashId(seed)) : 0;
  const g = new THREE.Group();
  const fur = new THREE.MeshToonMaterial({ color: seed && n % 3 === 1 ? 0xe8e2d4 : 0xf2efe6 });
  const plateHex = !seed ? 0xf0c24a : n % 2 ? 0x7ee8f2 : 0xf0c24a;
  const plate = new THREE.MeshToonMaterial({ color: plateHex, emissive: seed ? 0x2aa8c0 : 0xb07810, emissiveIntensity: 0.35 });
  const cyan = new THREE.MeshToonMaterial({ color: 0x7ee8f2, emissive: 0x2aa8c0, emissiveIntensity: 0.55 });
  const paw = new THREE.MeshToonMaterial({ color: 0x2a2218 });
  const scar = new THREE.MeshToonMaterial({ color: 0xc07060 });

  const hip = new THREE.Group();
  hip.position.y = 0.62;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.52, 4, 8), fur);
  body.position.y = 0.18;
  body.castShadow = true;
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.32), plate);
  chest.position.set(0, 0.26, 0.14);
  hip.add(body, chest);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), fur);
  head.position.set(0, 1.42, 0.08);
  head.scale.set(0.95, 0.9, 1.05);
  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.26, 6), fur);
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, 1.32, 0.3);
  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 5), fur);
  earL.position.set(-0.14, 1.7, 0);
  const earR = earL.clone();
  earR.position.x = 0.14;
  const brand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 4), cyan);
  brand.position.set(0, 1.52, 0.26);
  const scarLine = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.02), scar);
  scarLine.position.set(-0.14, 1.42, 0.22);
  scarLine.rotation.z = 0.35;
  const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.32, 3, 5), fur);
  tail.position.set(0, 0.72, -0.38);
  tail.rotation.x = 0.7;

  const armL = new THREE.Group();
  armL.position.set(-0.34, 1.05, 0);
  const armBone = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.32, 3, 5), fur);
  armBone.position.y = -0.18;
  const pawHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 4), paw);
  pawHand.scale.set(1.1, 0.55, 1.2);
  pawHand.position.set(0, -0.38, 0.04);
  armL.add(armBone, pawHand);
  const armR = armL.clone();
  armR.position.x = 0.34;

  const legL = new THREE.Group();
  legL.position.set(-0.14, 0.62, 0);
  const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.38, 3, 5), fur);
  thigh.position.y = -0.2;
  const pawFoot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 4), paw);
  pawFoot.scale.set(1.15, 0.42, 1.35);
  pawFoot.position.set(0, -0.42, 0.06);
  legL.add(thigh, pawFoot);
  const legR = legL.clone();
  legR.position.x = 0.14;

  g.add(hip, head, snout, earL, earR, brand, scarLine, tail, armL, armR, legL, legR);
  return { group: g, legL, legR, armL, armR, tail };
}

export function startRaising(
  canvas: HTMLCanvasElement,
  onHud: (h: RaisingHud) => void,
  opts: { host?: boolean; landId?: string } = {},
): RaisingHandle {
  const isHost = opts.host !== false;
  const landId = String(opts.landId || "").slice(0, 8);
  const mobile =
    typeof window !== "undefined" &&
    ((navigator.maxTouchPoints || 0) > 0 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 900);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.setClearColor(0x5aa4dc, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-20, 20, 20, -20, -80, 220);

  const world = buildRaising();
  scene.add(world.group);

  const input = createInput(canvas);
  const audio = createAudio();

  const saved = isHost ? loadSave() : { grown: 0, named: 0, seen: [] as string[], skills: [] as string[], island: DEFAULT_ISLAND };
  world.densify(saved.grown);

  const houndPos = { x: 3.4, z: 5.8, yaw: -0.55 };
  const hound = makeHound();
  hound.group.position.set(houndPos.x, 1.08, houndPos.z);
  hound.group.rotation.y = houndPos.yaw;
  scene.add(hound.group);

  const botShard = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.16, 0),
    new THREE.MeshToonMaterial({ color: 0x7ee8f2, emissive: 0x2aa8c0, emissiveIntensity: 0.9 }),
  );
  botShard.position.set(houndPos.x + 0.46, 1.68, houndPos.z + 0.1);
  botShard.visible = false;
  scene.add(botShard);

  const look = { x: 0, z: 2 };
  let span = 38;
  let isoYaw = ISO;
  let mode: RaisingHud["mode"] = "title";
  let toast: string | null = null;
  let toastAt = 0;
  let charge = 0;
  let tended = false;
  let joined = false;
  let grown = saved.grown;
  let named = saved.named;
  const seen = new Set(saved.seen);
  let howling = false;
  let raising = false;
  let raiseAt = 0;
  let raiseQueue: Array<"Tend" | "Join" | "Grow"> = [];
  let spentHowl = false;
  let lastBotCue = 0;
  let botFly = 0;
  let botOn = false;
  let botName = "Grok Bot";
  let skills = saved.skills.slice();
  let island = saved.island || DEFAULT_ISLAND;
  let selected: "hub" | null = "hub";
  let last = performance.now();
  let running = true;
  let lastHud = 0;
  let bob = 0;
  const remotes = new Map<
    string,
    {
      hound: ReturnType<typeof makeHound>;
      x: number;
      z: number;
      yaw: number;
      tx: number;
      tz: number;
      tyaw: number;
      howl: boolean;
    }
  >();
  let civicFn: ((s: CivicSnap, line: string) => void) | null = null;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.2);
  const hit = new THREE.Vector3();
  const camRight = new THREE.Vector3();
  const camUp = new THREE.Vector3();

  const pointers = new Map<number, { x: number; y: number }>();
  let pinch0 = 0;
  let span0 = span;
  let dragMoved = 0;
  let lastPx = 0;
  let lastPy = 0;
  let hubHold = false;

  function persist() {
    if (!isHost) return;
    writeSave({ grown, named, seen: [...seen], skills, island });
  }

  function civicOf(): CivicSnap {
    return { charge, tended, joined, grown, named, island };
  }

  function civicNote(line: string) {
    civicFn?.(civicOf(), line);
  }

  function say(line: string) {
    toast = line;
    toastAt = performance.now();
  }

  function aimOf(): { name: string; x: number; z: number; id: string } {
    return { name: "Core Spire", x: 0, z: 0, id: "hub" };
  }

  function hint(): KeeperHint {
    if (selected !== "hub") return null;
    if (!isHost) {
      return {
        id: "hub",
        name: "Core Spire",
        role: "Guest · not your crucible",
        line: island + " · Howl with them. Growth is their Grok Bot's work.",
      };
    }
    return HUB;
  }

  function nextCivic(): "Tend" | "Join" | "Grow" | "Name" | "" {
    if (grown > named) return "Name";
    if (joined) return "Grow";
    if (tended) return "Join";
    if (charge >= 0.45) return "Tend";
    return "";
  }

  function actOf(): string {
    if (selected !== "hub") return "";
    if (!nextCivic()) return "Howl";
    return botOn ? "Ask" : "Bot";
  }

  function prompt(): string {
    const a = actOf();
    if (a === "Howl") return "Hold the Spire. Howl. Your Grok Bot grows the den.";
    if (a === "Bot") return "Knock the Door. Then Howl — it grows the den.";
    if (a === "Ask") return `Hold the Spire. ${botName} grows the den.`;
    return "Tap the Spire.";
  }

  function emit() {
    const aim = aimOf();
    world.mark(selected === "hub" ? "hub" : null);
    const h = hint();
    onHud({
      mode,
      toast,
      lookX: look.x,
      lookZ: look.z,
      charge,
      tended,
      joined,
      grown,
      named,
      howling,
      near: h,
      prompt: prompt(),
      aim: aim.name,
      needle: 0,
      act: actOf(),
      botOn,
      botName,
      host: isHost,
      landId,
      island,
      skills,
    });
  }

  function clampLook() {
    const r = Math.hypot(look.x, look.z);
    if (r > 14) {
      look.x *= 14 / r;
      look.z *= 14 / r;
    }
  }

  function applyView() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const aspect = w / Math.max(1, h);
    camera.left = -span / 2;
    camera.right = span / 2;
    camera.top = span / aspect / 2;
    camera.bottom = -span / aspect / 2;
    camera.updateProjectionMatrix();
  }

  function placeCam() {
    const d = 48;
    camera.position.set(look.x + d * Math.sin(isoYaw), d * 0.78, look.z + d * Math.cos(isoYaw));
    camera.lookAt(look.x, 1.35, look.z);
    camera.updateMatrixWorld();
    camRight.setFromMatrixColumn(camera.matrixWorld, 0);
    camRight.y = 0;
    if (camRight.lengthSq() > 0.0001) camRight.normalize();
    camUp.setFromMatrixColumn(camera.matrixWorld, 2);
    camUp.y = 0;
    if (camUp.lengthSq() > 0.0001) camUp.normalize();
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (w < 2 || h < 2) return;
    renderer.setSize(w, h, false);
    applyView();
    placeCam();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  function groundAt(cx: number, cy: number) {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    ndc.set((cx / w) * 2 - 1, -(cy / h) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(ground, hit)) return hit;
    return null;
  }

  function pickHubAt(cx: number, cy: number): boolean {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    ndc.set((cx / w) * 2 - 1, -(cy / h) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(world.group.children, true);
    for (const rec of hits) {
      let o: THREE.Object3D | null = rec.object;
      while (o) {
        if (o.userData.pick === "hub") return true;
        o = o.parent;
      }
    }
    return false;
  }

  function pickAt(cx: number, cy: number) {
    if (pickHubAt(cx, cy)) {
      const fresh = selected !== "hub";
      selected = "hub";
      if (fresh) say("Hold the Spire. Howl. Your Grok Bot grows the den.");
      emit();
      return;
    }
    selected = null;
    emit();
  }

  function onPointerDown(e: PointerEvent) {
    if (mode !== "play") return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* samsung */
    }
    if (pointers.size === 1) {
      dragMoved = 0;
      lastPx = e.clientX;
      lastPy = e.clientY;
      const r = canvas.getBoundingClientRect();
      hubHold = pickHubAt(e.clientX - r.left, e.clientY - r.top);
      if (hubHold) {
        selected = "hub";
        input.setHowl(true);
      }
    } else if (pointers.size === 2) {
      hubHold = false;
      input.setHowl(false);
      const pts = [...pointers.values()];
      pinch0 = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      span0 = span;
    }
  }

  function onPointerMove(e: PointerEvent) {
    if (mode !== "play") return;
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const pts = [...pointers.values()];
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinch0 > 8) {
        span = THREE.MathUtils.clamp(span0 * (pinch0 / d), 22, 58);
        applyView();
      }
      return;
    }
    if (pointers.size === 1) {
      const dx = e.clientX - lastPx;
      const dy = e.clientY - lastPy;
      lastPx = e.clientX;
      lastPy = e.clientY;
      dragMoved += Math.hypot(dx, dy);
      if (hubHold && dragMoved < 16) return;
      if (hubHold) {
        hubHold = false;
        input.setHowl(false);
      }
      const h = canvas.clientHeight || 1;
      const s = span / h;
      look.x -= camRight.x * dx * s - camUp.x * dy * s;
      look.z -= camRight.z * dx * s - camUp.z * dy * s;
      clampLook();
    }
  }

  function onPointerUp(e: PointerEvent) {
    const was = pointers.size;
    const held = hubHold;
    pointers.delete(e.pointerId);
    if (held) {
      hubHold = false;
      input.setHowl(false);
    }
    if (was === 1 && dragMoved < 14 && mode === "play" && !held) {
      const r = canvas.getBoundingClientRect();
      pickAt(e.clientX - r.left, e.clientY - r.top);
    }
    if (pointers.size === 1) {
      const p = [...pointers.values()][0];
      lastPx = p.x;
      lastPy = p.y;
      dragMoved = 99;
    }
  }

  function onWheel(e: WheelEvent) {
    if (mode !== "play") return;
    e.preventDefault();
    const k = e.deltaY > 0 ? 1.08 : 0.92;
    span = THREE.MathUtils.clamp(span * k, 22, 58);
    applyView();
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  function applyCivicAct(act: "Tend" | "Join" | "Grow" | "Name", asBot: boolean, quiet = false) {
    audio.talk();
    if (act === "Tend") {
      if (charge < 0.45) {
        say(asBot ? "Howl first. I grow from leftover Charge." : "Howl first. Leftover Charge, never bottled.");
        return;
      }
      tended = true;
      audio.canal();
      if (!quiet) {
        say(asBot ? `${botName} tended leftover Howl.` : "Leftover First Howl, tended. Never bottled.");
        civicNote(`${botName} tended leftover Howl.`);
      }
    } else if (act === "Join") {
      if (!tended) {
        say(asBot ? "Tend leftover Howl before I join." : "Tend leftover Howl before a join.");
        return;
      }
      joined = true;
      if (!quiet) {
        say(asBot ? `${botName} joined. Paper. No coin.` : "Charge meets kiln. Paper join. No coin.");
        civicNote(`${botName} joined the raising.`);
      }
    } else if (act === "Grow") {
      if (!joined) {
        say(asBot ? "Join first. Then I grow crystal from Charge." : "Join first. Then crystal from Charge.");
        return;
      }
      grown += 1;
      named = Math.max(named, grown);
      tended = false;
      joined = false;
      charge = 0;
      world.densify(grown);
      audio.kiln();
      audio.grow();
      say(asBot ? `${botName} grew a den from leftover Charge.` : "Crystal grown from Charge. Never chrome.");
      civicNote(`${botName} densified the village.`);
    } else if (act === "Name") {
      if (grown <= named) {
        say(asBot ? "Grow first. Then I name it in leftover light." : "Grow first. Then a name in leftover light.");
        return;
      }
      named = grown;
      say(asBot ? `${botName} named it in leftover light.` : "A name in leftover light. When it fades it has already been true.");
      civicNote(`${botName} named a den.`);
    }
    persist();
    emit();
  }

  function botWork(_text?: string): boolean {
    if (!isHost) {
      say("Guest. This beginning is theirs. Your bot grows your land.");
      emit();
      return false;
    }
    if (!botOn) {
      say("Connect your Grok Bot. Growth is its work.");
      emit();
      return false;
    }
    const act = nextCivic();
    if (!act) {
      say(`${botName}: Howl first. I grow from leftover Charge.`);
      emit();
      return false;
    }
    applyCivicAct(act, true);
    return true;
  }

  function startRaise(now: number) {
    if (!isHost || raising || spentHowl) return;
    spentHowl = true;
    if (!botOn) {
      if (now - lastBotCue > 2600) {
        say("Knock the Door. Then Howl — it grows the den.");
        lastBotCue = now;
      }
      return;
    }
    raising = true;
    raiseQueue = ["Tend", "Join", "Grow"];
    raiseAt = now + 160;
    say(`${botName} answers the Howl.`);
    civicNote(`${botName} answers the Howl.`);
  }

  function teach(text: string) {
    const line = String(text || "").trim().slice(0, 80);
    if (!line) return;
    if (!isHost) {
      say("Teach your Grok Bot on your beginning.");
      emit();
      return;
    }
    if (!botOn) {
      say("Connect your Grok Bot first.");
      emit();
      return;
    }
    skills = [line, ...skills.filter((s) => s.toLowerCase() !== line.toLowerCase())].slice(0, 16);
    persist();
    say(`${botName} kept it. ${skills.length} skill${skills.length === 1 ? "" : "s"} on this land.`);
    civicNote(`${botName} learned on this beginning.`);
    emit();
  }

  function setIsland(name: string): boolean {
    if (!isHost) {
      say("Name your own beginning, not theirs.");
      emit();
      return false;
    }
    const next = cleanIslandName(name);
    if (!next) {
      say("Need a name. Two letters or more.");
      emit();
      return false;
    }
    island = next;
    persist();
    say(island + " stands.");
    civicNote(island + " named.");
    emit();
    return true;
  }

  function setBot(on: boolean, name?: string) {
    botOn = on;
    if (name) botName = name;
    botShard.visible = on;
    emit();
  }

  function doTalk() {
    if (selected !== "hub") {
      say("Tap the Spire. The first raising.");
      return;
    }
    const act = actOf();
    if (act === "Howl" || !act) return;
    if (!botOn) say("Connect your Grok Bot. The Spire gathers. It does not grow by tap.");
    else say(`Ask ${botName}. You Howl. It grows.`);
    emit();
  }

  function land() {
    if (mode === "play") return;
    mode = "play";
    look.x = 0;
    look.z = 2;
    span = 32;
    isoYaw = ISO;
    selected = "hub";
    applyView();
    try {
      audio.unlock();
      audio.land();
    } catch {
      /* gesture */
    }
    say(isHost ? island + ". You Howl. Your Grok Bot grows the land." : "Guest on " + island + ". Hold the Spire to Howl with them.");
    emit();
  }

  function dropPeer(id: string) {
    const r = remotes.get(id);
    if (!r) return;
    scene.remove(r.hound.group);
    remotes.delete(id);
  }

  function setPeer(id: string, pose: NetPose) {
    let r = remotes.get(id);
    if (!r) {
      if (remotes.size >= 8) return;
      const made = makeHound(id);
      made.group.position.set(pose.x, 1.08, pose.z);
      scene.add(made.group);
      r = {
        hound: made,
        x: pose.x,
        z: pose.z,
        yaw: pose.yaw,
        tx: pose.x,
        tz: pose.z,
        tyaw: pose.yaw,
        howl: pose.howl,
      };
      remotes.set(id, r);
      return;
    }
    r.tx = pose.x;
    r.tz = pose.z;
    r.tyaw = pose.yaw;
    r.howl = pose.howl;
  }

  function applyCivic(s: CivicSnap, line?: string) {
    if (isHost) return;
    if (s.island) island = cleanIslandName(s.island) || island;
    if (s.grown < grown) return;
    if (s.grown > grown) {
      grown = s.grown;
      named = Math.max(named, s.named);
      charge = s.charge;
      tended = s.tended;
      joined = s.joined;
      world.densify(grown);
      persist();
      if (line) say(line);
      else say("The village densifies.");
      emit();
      return;
    }
    const before = charge + (tended ? 1 : 0) + (joined ? 2 : 0) + named;
    charge = Math.max(charge, s.charge);
    if (s.tended) tended = true;
    if (s.joined) joined = true;
    if (s.named > named) named = s.named;
    persist();
    if (line) say(line);
    const after = charge + (tended ? 1 : 0) + (joined ? 2 : 0) + named;
    if (after !== before || line) emit();
  }

  function loop(now: number) {
    if (!running) return;
    const raw = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    input.beginFrame();
    if (input.justPressed.pause && mode === "play") mode = "pause";
    else if (input.justPressed.pause && mode === "pause") mode = "play";

    const dt = mode === "play" ? raw : raw * 0.15;

    if (mode === "title") {
      isoYaw += raw * 0.12;
      look.x = 0;
      look.z = 0;
      span = 42;
      applyView();
      placeCam();
      world.tick(now / 1000, raw, 0, grown * 0.12);
      renderer.render(scene, camera);
      if (now - lastHud > 120) {
        lastHud = now;
        emit();
      }
      requestAnimationFrame(loop);
      return;
    }

    const act = input.actions;
    const pan = 14 * dt * (act.sprint ? 1.4 : 1);
    if (mode === "play") {
      if (act.moveX || act.moveY) {
        look.x += camRight.x * act.moveX * pan + camUp.x * act.moveY * pan;
        look.z += camRight.z * act.moveX * pan + camUp.z * act.moveY * pan;
        clampLook();
      }
      if (Math.abs(act.lookY) > 0.08) {
        span = THREE.MathUtils.clamp(span - act.lookY * 18 * dt, 22, 58);
        applyView();
      }
    }

    const hubHowl = selected === "hub" || hubHold;
    howling = mode === "play" && act.howl && hubHowl;
    if (!howling) spentHowl = false;
    if (howling && isHost) {
      charge = Math.min(1, charge + dt * 0.9);
      if (input.justPressed.howl) {
        audio.howl();
        charge = Math.min(1, charge + 0.22);
      }
      if (charge >= 0.78) startRaise(now);
    } else if (input.justPressed.howl && !hubHowl) {
      say("Hold the Spire to Howl. Gather, not volume.");
    }
    if (raising && now >= raiseAt) {
      const step = raiseQueue.shift();
      if (step) applyCivicAct(step, true, step !== "Grow");
      raiseAt = now + 300;
      if (!raiseQueue.length) raising = false;
    }
    if (input.justPressed.talk) doTalk();

    if (toast && now - toastAt > 4200) toast = null;

    bob += dt * 2.2;
    hound.group.position.set(houndPos.x, 1.08 + Math.sin(bob) * 0.03, houndPos.z);
    hound.group.rotation.y = houndPos.yaw;
    hound.legL.rotation.x = 0;
    hound.legR.rotation.x = 0;
    hound.armL.rotation.x = 0;
    hound.armR.rotation.x = 0;
    hound.tail.rotation.x = 0.7 + Math.sin(now / 400) * 0.1;
    botFly = THREE.MathUtils.clamp(botFly + (raising ? 1 : -1) * dt * 3.2, 0, 1);
    const fly = botFly * botFly * (3 - 2 * botFly);
    botShard.visible = botOn;
    botShard.position.set(
      THREE.MathUtils.lerp(houndPos.x + 0.46, 0.15, fly),
      THREE.MathUtils.lerp(1.68 + Math.sin(now / 380) * 0.07, 2.55, fly),
      THREE.MathUtils.lerp(houndPos.z + 0.1, 0.2, fly),
    );
    botShard.rotation.y += dt * (raising ? 4.2 : 1.8);
    (botShard.material as THREE.MeshToonMaterial).emissiveIntensity = raising ? 1.4 : 0.9;

    const follow = 1 - Math.exp(-dt * 8);
    for (const r of remotes.values()) {
      r.x += (r.tx - r.x) * follow;
      r.z += (r.tz - r.z) * follow;
      r.yaw += (r.tyaw - r.yaw) * follow;
      r.hound.group.position.set(r.x, 1.08 + (r.howl ? 0.08 : 0), r.z);
      r.hound.group.rotation.y = r.yaw;
      const walk = Math.hypot(r.tx - r.x, r.tz - r.z) > 0.08 ? Math.sin(now / 90) * 0.4 : 0;
      r.hound.legL.rotation.x = walk;
      r.hound.legR.rotation.x = -walk;
      r.hound.armL.rotation.x = -walk * 0.7;
      r.hound.armR.rotation.x = walk * 0.7;
    }

    placeCam();
    world.tick(now / 1000, dt, howling ? 1 : charge * 0.35, grown * 0.12);
    renderer.render(scene, camera);
    if (now - lastHud > 80) {
      lastHud = now;
      emit();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  const probe = {
    getYaw: () => look.x,
    getSpeed: () => Math.hypot(look.x, look.z),
    getCam: () => ({ x: camera.position.x, y: camera.position.y, z: camera.position.z, fov: 0, dist: span }),
    getCharge: () => charge,
    getNear: () => (selected === "hub" ? "hub" : null),
    getAct: () => actOf(),
    getBot: () => botOn,
    getHost: () => isHost,
    getLand: () => landId,
    getGrown: () => grown,
    botWork: (text?: string) => botWork(text),
    setBot: (on: boolean, name?: string) => setBot(on, name),
    getPos: () => ({ x: look.x, z: look.z }),
    setKeys: (codes: string[]) => {
      input.keys.clear();
      for (const c of codes) input.keys.add(c);
    },
    select: (id: string) => {
      selected = id === "hub" ? "hub" : selected;
      emit();
    },
    addPeer: (id: string, x: number, z: number) => {
      setPeer(id, { x, z, yaw: 0.4, howl: false });
    },
    dropPeer: (id: string) => dropPeer(id),
    getPeerCount: () => remotes.size,
  };
  (window as unknown as { __controlsTest?: typeof probe }).__controlsTest = probe;

  emit();

  return {
    dispose() {
      running = false;
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      input.dispose();
      audio.dispose();
      world.dispose();
      renderer.dispose();
      for (const r of remotes.values()) scene.remove(r.hound.group);
      remotes.clear();
    },
    land,
    setMode(m) {
      mode = m;
      emit();
    },
    setStick() {
      /* village pan is on the canvas */
    },
    setHowl(v) {
      input.setHowl(v);
    },
    talk() {
      doTalk();
    },
    botWork,
    teach,
    setIsland,
    setBot,
    netPose() {
      return { x: houndPos.x, z: houndPos.z, yaw: houndPos.yaw, howl: howling };
    },
    civicSnap() {
      return civicOf();
    },
    setPeer,
    dropPeer,
    applyCivic,
    onCivic(fn) {
      civicFn = fn;
      return () => {
        if (civicFn === fn) civicFn = null;
      };
    },
    input,
    audio,
  };
}
