import * as THREE from "three";

export type RaisingWorld = {
  group: THREE.Group;
  heart: THREE.Mesh;
  tick: (t: number, dt: number, howl: number, woken: number) => void;
  dispose: () => void;
};

function toonRamp(): THREE.DataTexture {
  const c = new Uint8Array([
    48, 52, 40, 255,
    110, 118, 88, 255,
    186, 176, 140, 255,
    255, 248, 220, 255,
  ]);
  const tex = new THREE.DataTexture(c, 4, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const RAMP = toonRamp();

function toon(color: number, emissive = 0, emissiveIntensity = 0) {
  return new THREE.MeshToonMaterial({
    color,
    gradientMap: RAMP,
    emissive,
    emissiveIntensity,
  });
}

export function buildRaising(): RaisingWorld {
  const group = new THREE.Group();
  group.name = "first-raising";

  const skyGeo = new THREE.SphereGeometry(420, 28, 16);
  const skyPos = skyGeo.getAttribute("position");
  const skyCol = new Float32Array(skyPos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < skyPos.count; i++) {
    const y = skyPos.getY(i) / 420;
    if (y > 0.08) c.setHex(0x5aa4dc).lerp(new THREE.Color(0x3a78c4), (y - 0.08) / 0.92);
    else c.setHex(0xc8e4f4).lerp(new THREE.Color(0x5aa4dc), (y + 0.2) / 0.28);
    skyCol[i * 3] = c.r;
    skyCol[i * 3 + 1] = c.g;
    skyCol[i * 3 + 2] = c.b;
  }
  skyGeo.setAttribute("color", new THREE.BufferAttribute(skyCol, 3));
  const sky = new THREE.Mesh(
    skyGeo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }),
  );
  sky.renderOrder = -2;
  group.add(sky);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(9, 14, 12),
    new THREE.MeshBasicMaterial({ color: 0xffe28a, fog: false, toneMapped: false }),
  );
  sun.position.set(-240, 90, 40);
  group.add(sun);
  const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(22, 12, 10),
    new THREE.MeshBasicMaterial({
      color: 0xffd060,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    }),
  );
  sunGlow.position.copy(sun.position);
  group.add(sunGlow);

  const matCliff = toon(0x8a6238, 0x3a2810, 0.06);
  const matGrass = toon(0x4aaa4a, 0x1a5a18, 0.08);
  const matGrassDark = toon(0x34843c, 0x145018, 0.06);
  const matPath = toon(0xc4a06a, 0x6a4820, 0.08);
  const matPad = toon(0x8a8498, 0x3a3448, 0.1);
  const matShaft = toon(0x4ec8e8, 0x1a88b0, 0.28);
  const matGold = toon(0xf0c24a, 0xb07810, 0.35);
  const matShard = toon(0x7ee0f2, 0x2aa0c0, 0.22);
  const matTuft = toon(0x5ad05a, 0x1a7018, 0.1);
  const matCloud = toon(0xf4f7fc, 0xa8c0d8, 0.12);

  const cliff = new THREE.Mesh(new THREE.CylinderGeometry(20.4, 21.2, 2.4, 8), matCliff);
  cliff.position.y = -0.55;
  cliff.castShadow = true;
  cliff.receiveShadow = true;
  group.add(cliff);

  const grass = new THREE.Mesh(new THREE.CylinderGeometry(19.4, 19.6, 0.7, 8), matGrass);
  grass.position.y = 0.82;
  grass.receiveShadow = true;
  grass.castShadow = true;
  group.add(grass);

  const grassInner = new THREE.Mesh(new THREE.CylinderGeometry(12.6, 12.8, 0.22, 8), matGrassDark);
  grassInner.position.y = 1.18;
  grassInner.receiveShadow = true;
  group.add(grassInner);

  const path = new THREE.Mesh(new THREE.TorusGeometry(10.1, 1.05, 6, 8), matPath);
  path.rotation.x = Math.PI / 2;
  path.position.y = 1.22;
  path.receiveShadow = true;
  group.add(path);

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 7.1, 1.35, 8), matPad);
  pad.position.y = 1.72;
  pad.receiveShadow = true;
  pad.castShadow = true;
  group.add(pad);

  const lip = new THREE.Mesh(new THREE.TorusGeometry(6.55, 0.28, 6, 8), matGold);
  lip.rotation.x = Math.PI / 2;
  lip.position.y = 2.38;
  lip.castShadow = true;
  group.add(lip);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 2.55, 8.4, 6), matShaft);
  shaft.position.y = 6.55;
  shaft.castShadow = true;
  group.add(shaft);

  const belt = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.22, 6, 8), matGold);
  belt.rotation.x = Math.PI / 2;
  belt.position.y = 5.15;
  belt.castShadow = true;
  group.add(belt);

  const socket = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.7, 0.55, 6), matGold);
  socket.position.y = 10.7;
  socket.castShadow = true;
  group.add(socket);

  const heartMat = new THREE.MeshToonMaterial({
    color: 0xb8f4ff,
    gradientMap: RAMP,
    emissive: 0x2ad0e8,
    emissiveIntensity: 0.7,
  });
  const heart = new THREE.Mesh(new THREE.OctahedronGeometry(1.35, 0), heartMat);
  heart.scale.set(0.85, 1.15, 0.85);
  heart.position.y = 11.55;
  heart.castShadow = true;
  group.add(heart);

  const peak = new THREE.Mesh(new THREE.ConeGeometry(1.7, 2.5, 6), matGold);
  peak.position.y = 13.55;
  peak.castShadow = true;
  group.add(peak);

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), i % 2 ? matShard : matGold);
    shard.position.set(Math.cos(a) * 4.8, 2.55, Math.sin(a) * 4.8);
    shard.rotation.set(0.18, a, 0.12);
    shard.scale.set(0.55, 1.05, 0.55);
    shard.castShadow = true;
    group.add(shard);
  }

  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.2;
    const r = 13.2 + (i % 3) * 1.7;
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.85, 5), i % 2 ? matTuft : matGrassDark);
    tuft.position.set(Math.cos(a) * r, 1.55, Math.sin(a) * r);
    tuft.rotation.y = a;
    tuft.castShadow = true;
    group.add(tuft);
  }

  function cloud(x: number, y: number, z: number, s: number) {
    const g = new THREE.Group();
    const a = new THREE.Mesh(new THREE.SphereGeometry(2.2 * s, 8, 6), matCloud);
    const b = new THREE.Mesh(new THREE.SphereGeometry(1.6 * s, 8, 6), matCloud);
    const d = new THREE.Mesh(new THREE.SphereGeometry(1.4 * s, 8, 6), matCloud);
    b.position.set(2.1 * s, -0.15 * s, 0.3 * s);
    d.position.set(-1.8 * s, -0.2 * s, -0.2 * s);
    g.add(a, b, d);
    g.position.set(x, y, z);
    group.add(g);
  }
  cloud(18, 16, -12, 1.15);
  cloud(-16, 14, 10, 0.9);

  const howlRing = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.12, 6, 24),
    new THREE.MeshBasicMaterial({
      color: 0x7ee8f2,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  howlRing.rotation.x = Math.PI / 2;
  howlRing.position.y = 2.5;
  group.add(howlRing);

  const hemi = new THREE.HemisphereLight(0xb8d8ff, 0x4a7a38, 1.55);
  group.add(hemi);
  const dir = new THREE.DirectionalLight(0xfff0c8, 1.85);
  dir.position.set(-36, 52, 22);
  dir.castShadow = true;
  dir.shadow.mapSize.set(1024, 1024);
  dir.shadow.camera.near = 4;
  dir.shadow.camera.far = 130;
  dir.shadow.camera.left = -32;
  dir.shadow.camera.right = 32;
  dir.shadow.camera.top = 32;
  dir.shadow.camera.bottom = -32;
  dir.shadow.bias = -0.0004;
  group.add(dir);
  const heartLight = new THREE.PointLight(0x6aecff, 2.6, 36, 1.2);
  heartLight.position.set(0, 11.5, 0);
  group.add(heartLight);

  let ringT = 0;
  let ringOn = false;

  function tick(t: number, dt: number, howl: number, woken: number) {
    heart.rotation.y = t * 0.32;
    heart.scale.y = 1.15 + Math.sin(t * 1.7) * 0.08 + howl * 0.2 + woken * 0.1;
    heartMat.emissiveIntensity = 0.65 + Math.sin(t * 1.5) * 0.1 + howl * 0.7 + woken * 0.3;
    heartLight.intensity = 2.4 + howl * 2.8 + woken * 1.2;
    if (howl > 0.92 && howl < 1.2 && !ringOn) {
      ringOn = true;
      ringT = 0;
    }
    if (howl < 0.04) ringOn = false;
    const ringMat = howlRing.material as THREE.MeshBasicMaterial;
    if (ringOn || ringMat.opacity > 0.01) {
      ringT += dt;
      const k = Math.min(1, ringT / 0.9);
      howlRing.scale.setScalar(3.2 + k * 12);
      ringMat.opacity = (1 - k) * 0.6;
    }
  }

  function dispose() {
    group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat.dispose();
      }
    });
    group.clear();
  }

  return { group, heart, tick, dispose };
}
