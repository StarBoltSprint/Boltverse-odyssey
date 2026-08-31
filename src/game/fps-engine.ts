import * as THREE from "three";
import { createInput, type InputHandle } from "./input";
import { createAudio, type AudioBus } from "./audio";
import { pub } from "@/lib/pub";

export type FpsHud = {
  mode: "title" | "play" | "pause" | "dead" | "win";
  hp: number;
  hpMax: number;
  ammo: number;
  mag: number;
  reserve: number;
  reloading: number;
  wave: number;
  kills: number;
  gold: number;
  toast: string | null;
  hit: number;
  hurt: number;
};

export type FpsHandle = {
  dispose: () => void;
  start: () => void;
  setStick: (x: number, y: number) => void;
  setLook: (x: number, y: number) => void;
  setFire: (v: boolean) => void;
  setReload: () => void;
  audio: AudioBus;
};

const ARENA = 20;
const HP_MAX = 120;
const MAG = 14;
const RESERVE0 = 84;
const FIRE_CD = 0.16;
const RELOAD_T = 1.45;
const EYE = 1.48;

type Kind = "shard" | "husk" | "brute";
type Enemy = {
  kind: Kind;
  mesh: THREE.Group;
  hp: number;
  hpMax: number;
  x: number;
  z: number;
  r: number;
  speed: number;
  dmg: number;
  flash: number;
  hitCd: number;
  wind: number;
  lunge: number;
  alive: boolean;
};
type Pillar = { x: number; z: number; r: number };
type Spark = { mesh: THREE.Mesh; vx: number; vy: number; vz: number; life: number; on: boolean };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function goldMat(hex: number, emissive = 0x4a3014, e = 0.28) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    metalness: 0.28,
    roughness: 0.48,
    emissive,
    emissiveIntensity: e,
  });
}

export function startFps(canvas: HTMLCanvasElement, onHud: (h: FpsHud) => void): FpsHandle {
  const mobile =
    (navigator.maxTouchPoints || 0) > 0 ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth < 900;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2));
  renderer.setClearColor(0x07060c, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;
  renderer.autoClear = true;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0810, 0.018);

  const yawObj = new THREE.Object3D();
  yawObj.position.set(0, EYE, 8);
  scene.add(yawObj);
  const camera = new THREE.PerspectiveCamera(mobile ? 78 : 82, 1, 0.08, 90);
  yawObj.add(camera);

  const gunScene = new THREE.Scene();
  const gunCam = new THREE.PerspectiveCamera(48, 1, 0.05, 8);
  const gunRoot = new THREE.Group();
  gunScene.add(gunRoot);
  gunScene.add(new THREE.HemisphereLight(0xffe8c8, 0x1a1008, 1.2));
  const gunKey = new THREE.DirectionalLight(0xffe2b0, 1.4);
  gunKey.position.set(0.4, 1.2, 0.6);
  gunScene.add(gunKey);
  const gunCyan = new THREE.PointLight(0x7ee8f2, 1.6, 3, 2);
  gunCyan.position.set(0.1, 0.05, -0.5);
  gunScene.add(gunCyan);

  const hemi = new THREE.HemisphereLight(0x6a88b0, 0x2a140c, 0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe2b0, 1.35);
  sun.position.set(12, 18, 8);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x5ad8ee, 0.7);
  rim.position.set(-10, 6, -8);
  scene.add(rim);
  const ember = new THREE.PointLight(0xff7a3a, 16, 28, 1.8);
  ember.position.set(6, 3, 4);
  scene.add(ember);

  const loader = new THREE.TextureLoader();
  const groundTex = loader.load(pub("slash/floor.jpg") + "?v=fps1");
  groundTex.colorSpace = THREE.SRGBColorSpace;
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(3.2, 3.2);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(ARENA * 2.4, ARENA * 2.4),
    new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.88,
      metalness: 0.12,
      emissive: 0xff9a40,
      emissiveMap: groundTex,
      emissiveIntensity: 0.22,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const skyTex = loader.load(pub("slash/sky.jpg") + "?v=fps1");
  skyTex.colorSpace = THREE.SRGBColorSpace;
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(64, 20, 12),
    new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false }),
  );
  scene.add(sky);

  const wallMat = goldMat(0x2a221c, 0x1a1008, 0.08);
  const pillars: Pillar[] = [];
  const wallH = 4.2;
  for (let i = 0; i < 4; i++) {
    const along = i % 2 === 0;
    const sign = i < 2 ? 1 : -1;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(along ? ARENA * 2.1 : 0.7, wallH, along ? 0.7 : ARENA * 2.1), wallMat);
    wall.position.set(along ? 0 : sign * ARENA, wallH * 0.5, along ? sign * ARENA : 0);
    scene.add(wall);
  }
  const spots: [number, number, number][] = [
    [6, -5, 1.05],
    [-7, 4, 1.1],
    [4, 8, 0.95],
    [-5, -8, 1.0],
    [10, 2, 1.2],
    [-11, -2, 1.15],
    [0, -3, 0.85],
    [8, -11, 1.0],
  ];
  for (const [x, z, r] of spots) {
    const p = new THREE.Group();
    const col = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.72, r * 0.9, 3.4, 8), goldMat(0x3a3228, 0x2a1808, 0.16));
    col.position.y = 1.7;
    p.add(col);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.95, r * 0.7, 0.28, 8), goldMat(0xd4b46a, 0x8a6018, 0.32));
    cap.position.y = 3.5;
    p.add(cap);
    const cry = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), new THREE.MeshStandardMaterial({ color: 0x7ee8f2, emissive: 0x2aa0c0, emissiveIntensity: 0.7, roughness: 0.3 }));
    cry.position.y = 4.0;
    p.add(cry);
    p.position.set(x, 0, z);
    scene.add(p);
    pillars.push({ x, z, r: r + 0.15 });
  }

  const crateMat = goldMat(0x4a3824, 0x2a1808, 0.1);
  for (const [x, z] of [
    [3, 3],
    [-4, 1],
    [2, -9],
    [-9, 8],
  ] as [number, number][]) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 1.5), crateMat);
    c.position.set(x, 0.55, z);
    scene.add(c);
    pillars.push({ x, z, r: 1.05 });
  }

  function makeGun() {
    const g = new THREE.Group();
    const plate = goldMat(0xd4b46a, 0x8a6018, 0.35);
    const dark = goldMat(0x1a1410, 0x0a0806, 0.04);
    const fur = new THREE.MeshStandardMaterial({ color: 0xf2ece4, roughness: 0.78, metalness: 0.04 });
    const pad = new THREE.MeshStandardMaterial({ color: 0x2a221c, roughness: 0.7 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.72), plate);
    body.position.set(0, 0, -0.12);
    g.add(body);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.62, 8), plate);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, -0.58);
    g.add(barrel);
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.28, 8),
      new THREE.MeshBasicMaterial({ color: 0x7ee8f2 }),
    );
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 0.02, -0.72);
    g.add(core);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.22), dark);
    stock.position.set(0, -0.06, 0.28);
    g.add(stock);
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.12), plate);
    mag.position.set(0, -0.18, -0.06);
    g.add(mag);
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.08), dark);
    sight.position.set(0, 0.12, -0.22);
    g.add(sight);
    const glow = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), new THREE.MeshBasicMaterial({ color: 0x7ee8f2 }));
    glow.position.set(0, 0.16, -0.22);
    g.add(glow);

    function paw(sx: number) {
      const p = new THREE.Group();
      const palm = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), fur);
      p.add(palm);
      for (let i = 0; i < 3; i++) {
        const toe = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 5), fur);
        toe.position.set((i - 1) * 0.04, -0.02, -0.07);
        p.add(toe);
        const pk = new THREE.Mesh(new THREE.SphereGeometry(0.016, 5, 4), pad);
        pk.position.set((i - 1) * 0.04, -0.04, -0.08);
        p.add(pk);
      }
      p.position.set(sx * 0.11, -0.12, 0.08);
      p.rotation.set(0.35, sx * 0.2, sx * 0.15);
      g.add(p);
    }
    paw(-1);
    paw(1);
    g.position.set(0.28, -0.26, -0.48);
    g.rotation.set(0.1, 0.16, 0.05);
    g.scale.setScalar(1.28);
    return g;
  }
  const gun = makeGun();
  gunRoot.add(gun);
  const muzzleFlash = new THREE.PointLight(0x9ef4ff, 0, 1.8, 2);
  muzzleFlash.position.set(0.22, -0.18, -1.15);
  gunScene.add(muzzleFlash);

  function makeEnemy(kind: Kind): THREE.Group {
    const g = new THREE.Group();
    const col = kind === "brute" ? 0xc45a3a : kind === "husk" ? 0x6a4a88 : 0x3ad0c8;
    const em = kind === "brute" ? 0x6a2010 : kind === "husk" ? 0x3a2060 : 0x146868;
    const s = kind === "brute" ? 1.35 : kind === "husk" ? 1 : 0.72;
    const body = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42 * s, 0),
      new THREE.MeshStandardMaterial({ color: col, emissive: em, emissiveIntensity: 0.55, roughness: 0.42, metalness: 0.2 }),
    );
    body.position.y = 0.7 * s;
    g.add(body);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.16 * s, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd4a0 }));
    core.position.y = 0.7 * s;
    g.add(core);
    for (const a of [0.4, 1.8, 3.4, 5.0]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * s, 0.08 * s, 0.7 * s, 5), goldMat(0x2a221c, 0x1a1008, 0.08));
      leg.position.set(Math.cos(a) * 0.28 * s, 0.28 * s, Math.sin(a) * 0.28 * s);
      leg.rotation.z = Math.cos(a) * 0.4;
      leg.rotation.x = Math.sin(a) * 0.4;
      g.add(leg);
    }
    return g;
  }

  const enemies: Enemy[] = [];
  const sparks: Spark[] = [];
  const sparkGeo = new THREE.SphereGeometry(0.06, 5, 4);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0x7ee8f2 });
  for (let i = 0; i < 28; i++) {
    const mesh = new THREE.Mesh(sparkGeo, sparkMat);
    mesh.visible = false;
    scene.add(mesh);
    sparks.push({ mesh, vx: 0, vy: 0, vz: 0, life: 0, on: false });
  }

  const tracerMat = new THREE.MeshBasicMaterial({ color: 0x9ef4ff, transparent: true, opacity: 0.85 });
  const tracers: { mesh: THREE.Mesh; life: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 4), tracerMat);
    mesh.visible = false;
    scene.add(mesh);
    tracers.push({ mesh, life: 0 });
  }

  const input: InputHandle = createInput(canvas);
  const audio = createAudio();
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(0, 0);
  const fwd = new THREE.Vector3();
  const right = new THREE.Vector3();
  const hitPoint = new THREE.Vector3();
  const timer = new THREE.Timer();

  let mode: FpsHud["mode"] = "title";
  let hp = HP_MAX;
  let ammo = MAG;
  let reserve = RESERVE0;
  let reloading = 0;
  let fireCd = 0;
  let emptyCd = 0;
  let wave = 0;
  let kills = 0;
  let gold = 0;
  let toast: string | null = null;
  let toastT = 0;
  let hitMark = 0;
  let hurtFlash = 0;
  let shake = 0;
  let yaw = 0;
  let pitch = 0;
  let px = 0;
  let pz = 8;
  let vx = 0;
  let vz = 0;
  let bob = 0;
  let fireHeld = false;
  let mouseFire = false;
  let hudDirty = true;
  let spawnLeft = 0;
  let wavePause = 0;
  let recoil = 0;
  let disposed = false;
  let qaKeys: Set<string> | null = null;

  function say(msg: string) {
    toast = msg;
    toastT = 2.2;
    hudDirty = true;
  }

  function emitHud() {
    onHud({
      mode,
      hp,
      hpMax: HP_MAX,
      ammo,
      mag: MAG,
      reserve,
      reloading,
      wave,
      kills,
      gold,
      toast,
      hit: hitMark,
      hurt: hurtFlash,
    });
    hudDirty = false;
  }

  function burst(x: number, y: number, z: number, color: number, n = 8) {
    sparkMat.color.setHex(color);
    let used = 0;
    for (const s of sparks) {
      if (s.on) continue;
      s.on = true;
      s.life = 0.28 + Math.random() * 0.22;
      s.vx = (Math.random() - 0.5) * 6;
      s.vy = 2 + Math.random() * 4;
      s.vz = (Math.random() - 0.5) * 6;
      s.mesh.position.set(x, y, z);
      s.mesh.visible = true;
      s.mesh.material = new THREE.MeshBasicMaterial({ color });
      used++;
      if (used >= n) break;
    }
  }

  function tracerTo(tx: number, ty: number, tz: number) {
    const ox = px + Math.sin(yaw) * -0.2;
    const oy = EYE + pitch * 0.1 - 0.05;
    const oz = pz + Math.cos(yaw) * -0.2;
    const dx = tx - ox;
    const dy = ty - oy;
    const dz = tz - oz;
    const len = Math.hypot(dx, dy, dz) || 1;
    for (const t of tracers) {
      if (t.mesh.visible) continue;
      t.mesh.visible = true;
      t.life = 0.06;
      t.mesh.scale.set(1, len, 1);
      t.mesh.position.set(ox + dx * 0.5, oy + dy * 0.5, oz + dz * 0.5);
      t.mesh.lookAt(tx, ty, tz);
      t.mesh.rotateX(Math.PI / 2);
      break;
    }
  }

  function collide(nx: number, nz: number) {
    const pr = 0.42;
    nx = clamp(nx, -ARENA + 0.8, ARENA - 0.8);
    nz = clamp(nz, -ARENA + 0.8, ARENA - 0.8);
    for (const p of pillars) {
      const dx = nx - p.x;
      const dz = nz - p.z;
      const d = Math.hypot(dx, dz);
      const min = pr + p.r;
      if (d < min && d > 0.0001) {
        const k = min / d;
        nx = p.x + dx * k;
        nz = p.z + dz * k;
      }
    }
    return { x: nx, z: nz };
  }

  function stats(kind: Kind) {
    if (kind === "brute") return { hp: 90, speed: 3.4, r: 0.75, dmg: 26 };
    if (kind === "husk") return { hp: 42, speed: 4.6, r: 0.52, dmg: 16 };
    return { hp: 24, speed: 6.2, r: 0.4, dmg: 12 };
  }

  function spawnOne(kind: Kind) {
    const st = stats(kind);
    const a = Math.random() * Math.PI * 2;
    const rad = ARENA - 3;
    const x = Math.cos(a) * rad;
    const z = Math.sin(a) * rad;
    const mesh = makeEnemy(kind);
    mesh.position.set(x, 0, z);
    scene.add(mesh);
    enemies.push({ kind, mesh, hp: st.hp, hpMax: st.hp, x, z, r: st.r, speed: st.speed, dmg: st.dmg, flash: 0, hitCd: 0.2 + Math.random() * 0.4, wind: 0, lunge: 0, alive: true });
  }

  function beginWave() {
    wave += 1;
    const shards = 3 + wave;
    const husks = Math.max(0, wave - 1);
    const brutes = wave >= 4 ? 1 : 0;
    spawnLeft = shards + husks + brutes;
    for (let i = 0; i < shards; i++) spawnOne("shard");
    for (let i = 0; i < husks; i++) spawnOne("husk");
    for (let i = 0; i < brutes; i++) spawnOne("brute");
    spawnLeft = 0;
    say(`Wave ${wave}`);
    hudDirty = true;
  }

  function killEnemy(e: Enemy) {
    e.alive = false;
    e.mesh.visible = false;
    burst(e.x, 0.8, e.z, e.kind === "brute" ? 0xff6a28 : 0x7ee8f2, 12);
    kills += 1;
    gold += e.kind === "brute" ? 18 : e.kind === "husk" ? 8 : 4;
    hudDirty = true;
  }

  function resetRun() {
    for (const e of enemies) {
      scene.remove(e.mesh);
      e.mesh.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
      });
    }
    enemies.length = 0;
    hp = HP_MAX;
    ammo = MAG;
    reserve = RESERVE0;
    reloading = 0;
    fireCd = 0;
    wave = 0;
    kills = 0;
    gold = 0;
    px = 0;
    pz = 8;
    vx = 0;
    vz = 0;
    yaw = 0;
    pitch = 0;
    yawObj.position.set(px, EYE, pz);
    yawObj.rotation.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
  }

  function fire() {
    if (mode !== "play") return;
    if (reloading > 0) return;
    if (fireCd > 0) return;
    if (ammo <= 0) {
      if (emptyCd <= 0) {
        audio.empty();
        emptyCd = 0.22;
        if (reserve > 0) startReload();
      }
      return;
    }
    fireCd = FIRE_CD;
    ammo -= 1;
    recoil = 1;
    shake = Math.max(shake, 0.18);
    muzzleFlash.intensity = 4.5;
    audio.shot();
    pitch = clamp(pitch + 0.018, -1.45, 1.45);
    yaw += (Math.random() - 0.5) * 0.012;

    camera.updateMatrixWorld();
    ray.setFromCamera(ndc, camera);
    const live = enemies.filter((e) => e.alive).map((e) => e.mesh);
    const hits = live.length ? ray.intersectObjects(live, true) : [];
    let hitE: Enemy | null = null;
    if (hits.length) {
      let obj: THREE.Object3D | null = hits[0].object;
      while (obj && obj.parent && !enemies.some((e) => e.mesh === obj)) obj = obj.parent;
      hitE = enemies.find((e) => e.mesh === obj) ?? null;
      hitPoint.copy(hits[0].point);
    } else {
      ray.ray.at(28, hitPoint);
    }
    tracerTo(hitPoint.x, hitPoint.y, hitPoint.z);
    burst(hitPoint.x, hitPoint.y, hitPoint.z, hitE ? 0xffd4a0 : 0x7ee8f2, hitE ? 8 : 3);

    if (hitE && hitE.alive) {
      const dmg = hitE.kind === "brute" ? 16 : 22;
      hitE.hp -= dmg;
      hitE.flash = 0.12;
      hitMark = 1;
      audio.hit();
      const k = 0.55;
      hitE.x += ray.ray.direction.x * k;
      hitE.z += ray.ray.direction.z * k;
      if (hitE.hp <= 0) killEnemy(hitE);
    }
    hudDirty = true;
  }

  function startReload() {
    if (reloading > 0 || ammo >= MAG || reserve <= 0) return;
    reloading = RELOAD_T;
    audio.reload();
    hudDirty = true;
  }

  function lockLook() {
    if (mobile) return;
    try {
      const p = canvas.requestPointerLock as (o?: { unadjustedMovement?: boolean }) => Promise<void> | void;
      const r = p.call(canvas, { unadjustedMovement: true });
      if (r && typeof (r as Promise<void>).catch === "function") {
        void (r as Promise<void>).catch(() => {
          canvas.requestPointerLock();
        });
      }
    } catch {
      canvas.requestPointerLock();
    }
  }

  function onMouseMove(e: MouseEvent) {
    if (mode !== "play") return;
    if (document.pointerLockElement !== canvas) return;
    yaw -= e.movementX * 0.0022;
    pitch -= e.movementY * 0.0022;
    pitch = clamp(pitch, -1.45, 1.45);
  }
  function onMouseDown(e: MouseEvent) {
    if (mode !== "play") return;
    if (e.button === 0) {
      mouseFire = true;
      fire();
    }
  }
  function onMouseUp(e: MouseEvent) {
    if (e.button === 0) mouseFire = false;
  }
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
    gunCam.aspect = w / Math.max(1, h);
    gunCam.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  function start() {
    audio.unlock();
    if (mode === "dead" || mode === "win" || mode === "title") {
      resetRun();
      mode = "play";
      beginWave();
    } else {
      mode = "play";
    }
    hudDirty = true;
    lockLook();
    emitHud();
  }

  (window as unknown as { __controlsTest?: unknown }).__controlsTest = {
    getYaw: () => yaw,
    getSpeed: () => Math.hypot(vx, vz),
    getPos: () => ({ x: px, z: pz }),
    setKeys(codes: string[]) {
      qaKeys = new Set(codes);
    },
  };

  function step(dt: number) {
    if (toastT > 0) {
      toastT -= dt;
      if (toastT <= 0) {
        toast = null;
        hudDirty = true;
      }
    }
    hitMark = Math.max(0, hitMark - dt * 4);
    hurtFlash = Math.max(0, hurtFlash - dt * 1.35);
    shake = Math.max(0, shake - dt * 3.2);
    fireCd = Math.max(0, fireCd - dt);
    emptyCd = Math.max(0, emptyCd - dt);
    recoil = Math.max(0, recoil - dt * 6);
    muzzleFlash.intensity = Math.max(0, muzzleFlash.intensity - dt * 28);

    input.beginFrame();
    const keys = qaKeys ?? input.keys;
    if (qaKeys) {
      let mx = 0;
      let my = 0;
      if (keys.has("KeyA")) mx -= 1;
      if (keys.has("KeyD")) mx += 1;
      if (keys.has("KeyW")) my += 1;
      if (keys.has("KeyS")) my -= 1;
      input.actions.moveX = mx;
      input.actions.moveY = my;
    }

    if (mode !== "play") return;

    if (input.justPressed.pause) {
      mode = "pause";
      document.exitPointerLock?.();
      hudDirty = true;
      return;
    }

    if (keys.has("KeyR")) startReload();

    yaw -= input.actions.lookX * 1.8 * dt;
    pitch += input.actions.lookY * 1.4 * dt;
    pitch = clamp(pitch, -1.45, 1.45);

    const sprint = input.actions.sprint;
    const speed = (sprint ? 9.2 : 6.1);
    const wishX = input.actions.moveX;
    const wishY = input.actions.moveY;
    fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    const ax = fwd.x * wishY + right.x * wishX;
    const az = fwd.z * wishY + right.z * wishX;
    const am = Math.hypot(ax, az);
    const nx = am > 1 ? ax / am : ax;
    const nz = am > 1 ? az / am : az;
    const accel = 28;
    vx += (nx * speed - vx) * Math.min(1, accel * dt);
    vz += (nz * speed - vz) * Math.min(1, accel * dt);
    if (am < 0.04) {
      vx *= Math.max(0, 1 - 10 * dt);
      vz *= Math.max(0, 1 - 10 * dt);
    }
    const moved = collide(px + vx * dt, pz + vz * dt);
    px = moved.x;
    pz = moved.z;

    const moving = Math.hypot(vx, vz);
    if (moving > 0.4) {
      bob += dt * (sprint ? 14 : 10);
      audio.foot(moving);
    }

    yawObj.position.set(px, EYE, pz);
    yawObj.rotation.y = yaw;
    camera.rotation.x = pitch;
    camera.position.set(
      (Math.random() - 0.5) * shake * 0.08,
      Math.sin(bob) * 0.035 * Math.min(1, moving / 4) + (Math.random() - 0.5) * shake * 0.06,
      0,
    );

    gun.position.set(0.28 + Math.sin(bob) * 0.012, -0.26 - recoil * 0.06 + Math.cos(bob * 2) * 0.012, -0.48 + recoil * 0.09);
    gun.rotation.set(0.1 + recoil * 0.14, 0.16, 0.05);

    if (reloading > 0) {
      reloading -= dt;
      if (reloading <= 0) {
        const need = MAG - ammo;
        const take = Math.min(need, reserve);
        ammo += take;
        reserve -= take;
        reloading = 0;
        hudDirty = true;
      }
    }

    if (fireHeld || mouseFire || input.actions.howl) fire();

    let aliveN = 0;
    for (const e of enemies) {
      if (!e.alive) continue;
      aliveN += 1;
      e.flash = Math.max(0, e.flash - dt);
      e.hitCd = Math.max(0, e.hitCd - dt);
      const winding = e.wind > 0;
      e.wind = Math.max(0, e.wind - dt);
      if (winding && e.wind === 0 && e.lunge <= 0) e.lunge = e.kind === "brute" ? 0.42 : 0.28;
      e.lunge = Math.max(0, e.lunge - dt);
      const dx = px - e.x;
      const dz = pz - e.z;
      const dist = Math.hypot(dx, dz) || 1;
      const ux = dx / dist;
      const uz = dz / dist;
      const reach = e.r + 0.85;

      if (e.lunge > 0) {
        const dash = e.speed * 3.4;
        e.x += ux * dash * dt;
        e.z += uz * dash * dt;
        const c = collide(e.x, e.z);
        e.x = c.x;
        e.z = c.z;
        if (dist < reach && e.hitCd <= 0) {
          hp -= e.dmg;
          e.hitCd = e.kind === "brute" ? 1.15 : 0.92;
          e.lunge = 0;
          hurtFlash = 1;
          shake = Math.max(shake, e.kind === "brute" ? 0.95 : 0.7);
          vx -= ux * 7.5;
          vz -= uz * 7.5;
          burst(px, EYE - 0.2, pz, 0xff6a28, 10);
          audio.hurt();
          hudDirty = true;
          if (hp <= 0) {
            hp = 0;
            mode = "dead";
            document.exitPointerLock?.();
            say("StarBoltSprint falls");
          }
        }
      } else if (e.wind > 0) {
        e.x -= ux * e.speed * 0.25 * dt;
        e.z -= uz * e.speed * 0.25 * dt;
      } else if (e.hitCd <= 0 && dist < 5.4) {
        e.wind = e.kind === "brute" ? 0.38 : 0.22;
      } else if (dist > reach) {
        e.x += ux * e.speed * dt;
        e.z += uz * e.speed * dt;
        const c = collide(e.x, e.z);
        e.x = c.x;
        e.z = c.z;
      }

      const hop = e.lunge > 0 ? 0.28 : e.wind > 0 ? 0.04 : 0;
      e.mesh.position.set(e.x, hop + e.flash * 0.08, e.z);
      e.mesh.lookAt(px, 0.5, pz);
      e.mesh.scale.setScalar(e.lunge > 0 ? 1.12 : 1);
      const mat = (e.mesh.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = e.lunge > 0 ? 1.6 : e.flash > 0 ? 1.4 : 0.55;
    }

    if (mode === "play" && aliveN === 0 && spawnLeft === 0) {
      if (wave >= 6) {
        mode = "win";
        document.exitPointerLock?.();
        say("The kiln holds");
        hudDirty = true;
      } else {
        wavePause += dt;
        if (wavePause > 1.4) {
          wavePause = 0;
          beginWave();
        }
      }
    }

    for (const s of sparks) {
      if (!s.on) continue;
      s.life -= dt;
      s.vy -= 12 * dt;
      s.mesh.position.x += s.vx * dt;
      s.mesh.position.y += s.vy * dt;
      s.mesh.position.z += s.vz * dt;
      if (s.life <= 0 || s.mesh.position.y < 0) {
        s.on = false;
        s.mesh.visible = false;
      }
    }
    for (const t of tracers) {
      if (!t.mesh.visible) continue;
      t.life -= dt;
      if (t.life <= 0) t.mesh.visible = false;
    }
  }

  function frame() {
    if (disposed) return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    step(dt);
    if (hudDirty || mode === "play") emitHud();
    renderer.autoClear = true;
    renderer.render(scene, camera);
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(gunScene, gunCam);
    renderer.autoClear = true;
  }
  renderer.setAnimationLoop(frame);
  emitHud();

  return {
    dispose() {
      disposed = true;
      renderer.setAnimationLoop(null);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", resize);
      document.exitPointerLock?.();
      input.dispose();
      audio.dispose();
      renderer.dispose();
      delete (window as unknown as { __controlsTest?: unknown }).__controlsTest;
    },
    start,
    setStick(x, y) {
      input.setMoveStick(x, y);
    },
    setLook(x, y) {
      input.setLookStick(x, y);
    },
    setFire(v) {
      fireHeld = v;
      if (v) fire();
    },
    setReload() {
      startReload();
    },
    audio,
  };
}
