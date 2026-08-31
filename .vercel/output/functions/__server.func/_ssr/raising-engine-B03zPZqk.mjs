import { c as cleanIslandName, s as DEFAULT_ISLAND } from "./routes-BoVHVS11.mjs";
import { n as createInput, t as createAudio } from "./audio-DDruFsM2.mjs";
import { C as MeshToonMaterial, D as OrthographicCamera, E as OctahedronGeometry, H as Vector2, I as SRGBColorSpace, L as Scene, M as RGBAFormat, N as Raycaster, R as SphereGeometry, U as Vector3, V as TorusGeometry, a as CapsuleGeometry, b as MeshBasicMaterial, c as ConeGeometry, d as DirectionalLight, j as PointLight, k as Plane, l as CylinderGeometry, m as HemisphereLight, n as BoxGeometry, p as Group, r as BufferAttribute, s as Color, t as WebGLRenderer, u as DataTexture, v as MathUtils, w as NearestFilter, y as Mesh } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/raising-engine-B03zPZqk.js
function toonRamp() {
	const c = new Uint8Array([
		48,
		52,
		40,
		255,
		110,
		118,
		88,
		255,
		186,
		176,
		140,
		255,
		255,
		248,
		220,
		255
	]);
	const tex = new DataTexture(c, 4, 1, RGBAFormat);
	tex.minFilter = NearestFilter;
	tex.magFilter = NearestFilter;
	tex.needsUpdate = true;
	tex.colorSpace = SRGBColorSpace;
	return tex;
}
var RAMP = toonRamp();
function toon(color, emissive = 0, emissiveIntensity = 0) {
	return new MeshToonMaterial({
		color,
		gradientMap: RAMP,
		emissive,
		emissiveIntensity
	});
}
function tag(obj, id) {
	obj.traverse((o) => {
		o.userData.pick = id;
	});
	obj.userData.pick = id;
}
function noHit(obj) {
	obj.traverse((o) => {
		o.raycast = () => {};
	});
}
function buildRaising() {
	const group = new Group();
	group.name = "first-raising";
	const skyGeo = new SphereGeometry(420, 28, 16);
	const skyPos = skyGeo.getAttribute("position");
	const skyCol = new Float32Array(skyPos.count * 3);
	const c = new Color();
	for (let i = 0; i < skyPos.count; i++) {
		const y = skyPos.getY(i) / 420;
		if (y > .08) c.setHex(5940444).lerp(new Color(3832004), (y - .08) / .92);
		else c.setHex(13165812).lerp(new Color(5940444), (y + .2) / .28);
		skyCol[i * 3] = c.r;
		skyCol[i * 3 + 1] = c.g;
		skyCol[i * 3 + 2] = c.b;
	}
	skyGeo.setAttribute("color", new BufferAttribute(skyCol, 3));
	const sky = new Mesh(skyGeo, new MeshBasicMaterial({
		vertexColors: true,
		side: 1,
		fog: false,
		depthWrite: false
	}));
	sky.renderOrder = -2;
	group.add(sky);
	noHit(sky);
	const sun = new Mesh(new SphereGeometry(9, 14, 12), new MeshBasicMaterial({
		color: 16769674,
		fog: false,
		toneMapped: false
	}));
	sun.position.set(-240, 90, 40);
	group.add(sun);
	noHit(sun);
	const sunGlow = new Mesh(new SphereGeometry(22, 12, 10), new MeshBasicMaterial({
		color: 16765024,
		transparent: true,
		opacity: .22,
		depthWrite: false,
		fog: false,
		toneMapped: false
	}));
	sunGlow.position.copy(sun.position);
	group.add(sunGlow);
	noHit(sunGlow);
	const parent = new Mesh(new OctahedronGeometry(7.2, 0), new MeshBasicMaterial({
		color: 12121343,
		fog: false,
		toneMapped: false
	}));
	parent.position.set(-310, 72, 18);
	group.add(parent);
	noHit(parent);
	const parentHalo = new Mesh(new SphereGeometry(16, 12, 10), new MeshBasicMaterial({
		color: 5163240,
		transparent: true,
		opacity: .18,
		depthWrite: false,
		fog: false,
		toneMapped: false
	}));
	parentHalo.position.copy(parent.position);
	group.add(parentHalo);
	noHit(parentHalo);
	const matCliff = toon(9069112, 3811344, .06);
	const matGrass = toon(4893258, 1727e3, .08);
	const matGrassDark = toon(3441724, 1331224, .06);
	const matPad = toon(9077912, 3814472, .1);
	const matShaft = toon(5163240, 1738928, .28);
	const matGold = toon(15778378, 11565072, .35);
	const matShard = toon(8315122, 2793664, .22);
	const matTuft = toon(5951578, 1732632, .1);
	const matCloud = toon(16054268, 11059416, .12);
	const cliff = new Mesh(new CylinderGeometry(20.4, 21.2, 2.4, 8), matCliff);
	cliff.position.y = -.55;
	cliff.castShadow = true;
	cliff.receiveShadow = true;
	group.add(cliff);
	noHit(cliff);
	const grass = new Mesh(new CylinderGeometry(19.4, 19.6, .7, 8), matGrass);
	grass.position.y = .82;
	grass.receiveShadow = true;
	grass.castShadow = true;
	group.add(grass);
	noHit(grass);
	const grassInner = new Mesh(new CylinderGeometry(12.6, 12.8, .22, 8), matGrassDark);
	grassInner.position.y = 1.18;
	grassInner.receiveShadow = true;
	group.add(grassInner);
	noHit(grassInner);
	const pad = new Mesh(new CylinderGeometry(6.4, 7.1, 1.35, 8), matPad);
	pad.position.y = 1.72;
	pad.receiveShadow = true;
	pad.castShadow = true;
	group.add(pad);
	tag(pad, "hub");
	const lip = new Mesh(new TorusGeometry(6.55, .28, 6, 8), matGold);
	lip.rotation.x = Math.PI / 2;
	lip.position.y = 2.38;
	lip.castShadow = true;
	group.add(lip);
	tag(lip, "hub");
	const howlPad = new Mesh(new TorusGeometry(3.2, .08, 6, 24), new MeshBasicMaterial({
		color: 8317170,
		transparent: true,
		opacity: .55,
		depthWrite: false
	}));
	howlPad.rotation.x = Math.PI / 2;
	howlPad.position.y = 2.42;
	group.add(howlPad);
	tag(howlPad, "hub");
	const shaft = new Mesh(new CylinderGeometry(1.55, 2.55, 8.4, 6), matShaft);
	shaft.position.y = 6.55;
	shaft.castShadow = true;
	group.add(shaft);
	tag(shaft, "hub");
	const belt = new Mesh(new TorusGeometry(2.15, .22, 6, 8), matGold);
	belt.rotation.x = Math.PI / 2;
	belt.position.y = 5.15;
	belt.castShadow = true;
	group.add(belt);
	tag(belt, "hub");
	const socket = new Mesh(new CylinderGeometry(1.45, 1.7, .55, 6), matGold);
	socket.position.y = 10.7;
	socket.castShadow = true;
	group.add(socket);
	tag(socket, "hub");
	const heartMat = new MeshToonMaterial({
		color: 12121343,
		gradientMap: RAMP,
		emissive: 2805992,
		emissiveIntensity: .7
	});
	const heart = new Mesh(new OctahedronGeometry(1.35, 0), heartMat);
	heart.scale.set(.85, 1.15, .85);
	heart.position.y = 11.55;
	heart.castShadow = true;
	group.add(heart);
	tag(heart, "hub");
	const peak = new Mesh(new ConeGeometry(1.7, 2.5, 6), matGold);
	peak.position.y = 13.55;
	peak.castShadow = true;
	group.add(peak);
	tag(peak, "hub");
	for (let i = 0; i < 4; i++) {
		const a = i / 4 * Math.PI * 2 + .4;
		const shard = new Mesh(new OctahedronGeometry(.62, 0), i % 2 ? matShard : matGold);
		shard.position.set(Math.cos(a) * 4.8, 2.55, Math.sin(a) * 4.8);
		shard.rotation.set(.18, a, .12);
		shard.scale.set(.55, 1.05, .55);
		shard.castShadow = true;
		group.add(shard);
		tag(shard, "hub");
	}
	for (let i = 0; i < 14; i++) {
		const a = i / 14 * Math.PI * 2 + .2;
		const r = 13.2 + i % 3 * 1.7;
		const tuft = new Mesh(new ConeGeometry(.42, .85, 5), i % 2 ? matTuft : matGrassDark);
		tuft.position.set(Math.cos(a) * r, 1.55, Math.sin(a) * r);
		tuft.rotation.y = a;
		tuft.castShadow = true;
		group.add(tuft);
		noHit(tuft);
	}
	function cloud(x, y, z, s) {
		const g = new Group();
		const a = new Mesh(new SphereGeometry(2.2 * s, 8, 6), matCloud);
		const b = new Mesh(new SphereGeometry(1.6 * s, 8, 6), matCloud);
		const d = new Mesh(new SphereGeometry(1.4 * s, 8, 6), matCloud);
		b.position.set(2.1 * s, -.15 * s, .3 * s);
		d.position.set(-1.8 * s, -.2 * s, -.2 * s);
		g.add(a, b, d);
		g.position.set(x, y, z);
		group.add(g);
		noHit(g);
	}
	cloud(18, 16, -12, 1.15);
	cloud(-16, 14, 10, .9);
	const densifyRoot = new Group();
	group.add(densifyRoot);
	const densifyBits = [];
	for (let i = 0; i < 8; i++) {
		const a = i / 8 * Math.PI * 2 + .2;
		const bit = new Group();
		const crystal = new Mesh(new OctahedronGeometry(.42, 0), i % 2 ? matShard : matGold);
		crystal.position.y = .55;
		crystal.scale.set(.55, 1.15, .55);
		crystal.castShadow = true;
		bit.add(crystal);
		bit.position.set(Math.cos(a) * 5.4, 1.22, Math.sin(a) * 5.4);
		bit.scale.setScalar(.001);
		bit.visible = false;
		densifyRoot.add(bit);
		densifyBits.push(bit);
		tag(bit, "hub");
	}
	const keepers = [];
	const howlRing = new Mesh(new TorusGeometry(1, .12, 6, 24), new MeshBasicMaterial({
		color: 8317170,
		transparent: true,
		opacity: 0,
		depthWrite: false,
		blending: 2
	}));
	howlRing.rotation.x = Math.PI / 2;
	howlRing.position.y = 2.5;
	group.add(howlRing);
	noHit(howlRing);
	const beacon = new Mesh(new TorusGeometry(.72, .07, 6, 20), new MeshBasicMaterial({
		color: 8317170,
		transparent: true,
		opacity: .9,
		depthWrite: false
	}));
	beacon.rotation.x = Math.PI / 2;
	beacon.position.y = 1.28;
	group.add(beacon);
	noHit(beacon);
	const hemi = new HemisphereLight(12114175, 4880952, 1.55);
	group.add(hemi);
	const dir = new DirectionalLight(16773320, 1.85);
	dir.position.set(-36, 52, 22);
	dir.castShadow = true;
	dir.shadow.mapSize.set(1024, 1024);
	dir.shadow.camera.near = 4;
	dir.shadow.camera.far = 130;
	dir.shadow.camera.left = -32;
	dir.shadow.camera.right = 32;
	dir.shadow.camera.top = 32;
	dir.shadow.camera.bottom = -32;
	dir.shadow.bias = -4e-4;
	group.add(dir);
	const heartLight = new PointLight(7007487, 2.6, 36, 1.2);
	heartLight.position.set(0, 11.5, 0);
	group.add(heartLight);
	let ringT = 0;
	let ringOn = false;
	function tick(t, dt, howl, woken) {
		heart.rotation.y = t * .32;
		heart.scale.y = 1.15 + Math.sin(t * 1.7) * .08 + howl * .2 + woken * .1;
		heartMat.emissiveIntensity = .65 + Math.sin(t * 1.5) * .1 + howl * .7 + woken * .3;
		heartLight.intensity = 2.4 + howl * 2.8 + woken * 1.2;
		howlPad.scale.setScalar(1 + howl * .12);
		howlPad.material.opacity = .4 + howl * .5;
		parent.rotation.y = t * .08;
		if (howl > .92 && howl < 1.2 && !ringOn) {
			ringOn = true;
			ringT = 0;
		}
		if (howl < .04) ringOn = false;
		const ringMat = howlRing.material;
		if (ringOn || ringMat.opacity > .01) {
			ringT += dt;
			const k = Math.min(1, ringT / .9);
			howlRing.scale.setScalar(3.2 + k * 12);
			ringMat.opacity = (1 - k) * .6;
		}
		const pulse = .85 + Math.sin(t * 3.2) * .35;
		beacon.scale.setScalar(.85 + Math.sin(t * 4) * .18);
		beacon.material.opacity = .55 + pulse * .35;
	}
	function densify(grown) {
		densifyBits.forEach((bit, i) => {
			const on = i < grown;
			bit.visible = on;
			bit.scale.setScalar(on ? 1 : .001);
		});
	}
	function mark(id) {
		beacon.position.set(0, 1.28, 0);
		beacon.visible = true;
	}
	function dispose() {
		group.traverse((o) => {
			const m = o;
			if (m.isMesh) {
				m.geometry.dispose();
				const mat = m.material;
				if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
				else mat.dispose();
			}
		});
		group.clear();
	}
	mark("hub");
	return {
		group,
		heart,
		keepers,
		tick,
		densify,
		mark,
		dispose
	};
}
var SAVE = "lc-circuit-v1";
var ISO = Math.PI / 4;
var HUB = {
	id: "hub",
	name: "Core Spire",
	role: "The Howling Crucible · not a throne",
	line: "Hold the Spire. Howl. Your Grok Bot grows the den."
};
function loadSave() {
	try {
		const raw = localStorage.getItem(SAVE);
		if (!raw) return {
			grown: 0,
			named: 0,
			seen: [],
			skills: [],
			island: DEFAULT_ISLAND
		};
		const p = JSON.parse(raw);
		return {
			grown: Math.max(0, p.grown | 0),
			named: Math.max(0, p.named | 0),
			seen: Array.isArray(p.seen) ? p.seen : [],
			skills: Array.isArray(p.skills) ? p.skills.map((s) => String(s).slice(0, 80)).filter(Boolean).slice(0, 16) : [],
			island: cleanIslandName(String(p.island || "")) || "Beginning"
		};
	} catch {
		return {
			grown: 0,
			named: 0,
			seen: [],
			skills: [],
			island: DEFAULT_ISLAND
		};
	}
}
function writeSave(s) {
	try {
		localStorage.setItem(SAVE, JSON.stringify(s));
	} catch {}
}
function hashId(id) {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = h * 31 + id.charCodeAt(i) | 0;
	return h;
}
function makeHound(seed) {
	const n = seed ? Math.abs(hashId(seed)) : 0;
	const g = new Group();
	const fur = new MeshToonMaterial({ color: seed && n % 3 === 1 ? 15262420 : 15921126 });
	const plateHex = !seed ? 15778378 : n % 2 ? 8317170 : 15778378;
	const plate = new MeshToonMaterial({
		color: plateHex,
		emissive: seed ? 2795712 : 11565072,
		emissiveIntensity: .35
	});
	const cyan = new MeshToonMaterial({
		color: 8317170,
		emissive: 2795712,
		emissiveIntensity: .55
	});
	const paw = new MeshToonMaterial({ color: 2761240 });
	const scar = new MeshToonMaterial({ color: 12611680 });
	const hip = new Group();
	hip.position.y = .62;
	const body = new Mesh(new CapsuleGeometry(.26, .52, 4, 8), fur);
	body.position.y = .18;
	body.castShadow = true;
	const chest = new Mesh(new BoxGeometry(.42, .22, .32), plate);
	chest.position.set(0, .26, .14);
	hip.add(body, chest);
	const head = new Mesh(new SphereGeometry(.28, 8, 6), fur);
	head.position.set(0, 1.42, .08);
	head.scale.set(.95, .9, 1.05);
	const snout = new Mesh(new ConeGeometry(.11, .26, 6), fur);
	snout.rotation.x = Math.PI / 2;
	snout.position.set(0, 1.32, .3);
	const earL = new Mesh(new ConeGeometry(.09, .26, 5), fur);
	earL.position.set(-.14, 1.7, 0);
	const earR = earL.clone();
	earR.position.x = .14;
	const brand = new Mesh(new SphereGeometry(.045, 6, 4), cyan);
	brand.position.set(0, 1.52, .26);
	const scarLine = new Mesh(new BoxGeometry(.03, .16, .02), scar);
	scarLine.position.set(-.14, 1.42, .22);
	scarLine.rotation.z = .35;
	const tail = new Mesh(new CapsuleGeometry(.055, .32, 3, 5), fur);
	tail.position.set(0, .72, -.38);
	tail.rotation.x = .7;
	const armL = new Group();
	armL.position.set(-.34, 1.05, 0);
	const armBone = new Mesh(new CapsuleGeometry(.07, .32, 3, 5), fur);
	armBone.position.y = -.18;
	const pawHand = new Mesh(new SphereGeometry(.09, 6, 4), paw);
	pawHand.scale.set(1.1, .55, 1.2);
	pawHand.position.set(0, -.38, .04);
	armL.add(armBone, pawHand);
	const armR = armL.clone();
	armR.position.x = .34;
	const legL = new Group();
	legL.position.set(-.14, .62, 0);
	const thigh = new Mesh(new CapsuleGeometry(.09, .38, 3, 5), fur);
	thigh.position.y = -.2;
	const pawFoot = new Mesh(new SphereGeometry(.1, 6, 4), paw);
	pawFoot.scale.set(1.15, .42, 1.35);
	pawFoot.position.set(0, -.42, .06);
	legL.add(thigh, pawFoot);
	const legR = legL.clone();
	legR.position.x = .14;
	g.add(hip, head, snout, earL, earR, brand, scarLine, tail, armL, armR, legL, legR);
	return {
		group: g,
		legL,
		legR,
		armL,
		armR,
		tail
	};
}
function startRaising(canvas, onHud, opts = {}) {
	const isHost = opts.host !== false;
	const landId = String(opts.landId || "").slice(0, 8);
	const mobile = typeof window !== "undefined" && ((navigator.maxTouchPoints || 0) > 0 || window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900);
	const renderer = new WebGLRenderer({
		canvas,
		antialias: !mobile,
		alpha: false,
		powerPreference: "high-performance"
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
	renderer.setClearColor(5940444, 1);
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.shadowMap.enabled = !mobile;
	renderer.shadowMap.type = 1;
	renderer.toneMapping = 0;
	const scene = new Scene();
	const camera = new OrthographicCamera(-20, 20, 20, -20, -80, 220);
	const world = buildRaising();
	scene.add(world.group);
	const input = createInput(canvas);
	const audio = createAudio();
	const saved = isHost ? loadSave() : {
		grown: 0,
		named: 0,
		seen: [],
		skills: [],
		island: DEFAULT_ISLAND
	};
	world.densify(saved.grown);
	const houndPos = {
		x: 3.4,
		z: 5.8,
		yaw: -.55
	};
	const hound = makeHound();
	hound.group.position.set(houndPos.x, 1.08, houndPos.z);
	hound.group.rotation.y = houndPos.yaw;
	scene.add(hound.group);
	const botShard = new Mesh(new OctahedronGeometry(.16, 0), new MeshToonMaterial({
		color: 8317170,
		emissive: 2795712,
		emissiveIntensity: .9
	}));
	botShard.position.set(houndPos.x + .46, 1.68, houndPos.z + .1);
	botShard.visible = false;
	scene.add(botShard);
	const look = {
		x: 0,
		z: 2
	};
	let span = 38;
	let isoYaw = ISO;
	let mode = "title";
	let toast = null;
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
	let raiseQueue = [];
	let spentHowl = false;
	let lastBotCue = 0;
	let botFly = 0;
	let botOn = false;
	let botName = "Grok Bot";
	let skills = saved.skills.slice();
	let island = saved.island || "Beginning";
	let selected = "hub";
	let last = performance.now();
	let running = true;
	let lastHud = 0;
	let bob = 0;
	const remotes = /* @__PURE__ */ new Map();
	let civicFn = null;
	const ray = new Raycaster();
	const ndc = new Vector2();
	new Plane(new Vector3(0, 1, 0), -1.2);
	new Vector3();
	const camRight = new Vector3();
	const camUp = new Vector3();
	const pointers = /* @__PURE__ */ new Map();
	let pinch0 = 0;
	let span0 = span;
	let dragMoved = 0;
	let lastPx = 0;
	let lastPy = 0;
	let hubHold = false;
	function persist() {
		if (!isHost) return;
		writeSave({
			grown,
			named,
			seen: [...seen],
			skills,
			island
		});
	}
	function civicOf() {
		return {
			charge,
			tended,
			joined,
			grown,
			named,
			island
		};
	}
	function civicNote(line) {
		civicFn?.(civicOf(), line);
	}
	function say(line) {
		toast = line;
		toastAt = performance.now();
	}
	function aimOf() {
		return {
			name: "Core Spire",
			x: 0,
			z: 0,
			id: "hub"
		};
	}
	function hint() {
		if (selected !== "hub") return null;
		if (!isHost) return {
			id: "hub",
			name: "Core Spire",
			role: "Guest · not your crucible",
			line: island + " · Howl with them. Growth is their Grok Bot's work."
		};
		return HUB;
	}
	function nextCivic() {
		if (grown > named) return "Name";
		if (joined) return "Grow";
		if (tended) return "Join";
		if (charge >= .45) return "Tend";
		return "";
	}
	function actOf() {
		if (selected !== "hub") return "";
		if (!nextCivic()) return "Howl";
		return botOn ? "Ask" : "Bot";
	}
	function prompt() {
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
			skills
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
		camera.position.set(look.x + d * Math.sin(isoYaw), d * .78, look.z + d * Math.cos(isoYaw));
		camera.lookAt(look.x, 1.35, look.z);
		camera.updateMatrixWorld();
		camRight.setFromMatrixColumn(camera.matrixWorld, 0);
		camRight.y = 0;
		if (camRight.lengthSq() > 1e-4) camRight.normalize();
		camUp.setFromMatrixColumn(camera.matrixWorld, 2);
		camUp.y = 0;
		if (camUp.lengthSq() > 1e-4) camUp.normalize();
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
	function pickHubAt(cx, cy) {
		const w = canvas.clientWidth || 1;
		const h = canvas.clientHeight || 1;
		ndc.set(cx / w * 2 - 1, -(cy / h) * 2 + 1);
		ray.setFromCamera(ndc, camera);
		const hits = ray.intersectObjects(world.group.children, true);
		for (const rec of hits) {
			let o = rec.object;
			while (o) {
				if (o.userData.pick === "hub") return true;
				o = o.parent;
			}
		}
		return false;
	}
	function pickAt(cx, cy) {
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
	function onPointerDown(e) {
		if (mode !== "play") return;
		pointers.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		try {
			canvas.setPointerCapture(e.pointerId);
		} catch {}
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
	function onPointerMove(e) {
		if (mode !== "play") return;
		if (!pointers.has(e.pointerId)) return;
		pointers.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		if (pointers.size === 2) {
			const pts = [...pointers.values()];
			const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
			if (pinch0 > 8) {
				span = MathUtils.clamp(span0 * (pinch0 / d), 22, 58);
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
	function onPointerUp(e) {
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
	function onWheel(e) {
		if (mode !== "play") return;
		e.preventDefault();
		const k = e.deltaY > 0 ? 1.08 : .92;
		span = MathUtils.clamp(span * k, 22, 58);
		applyView();
	}
	canvas.addEventListener("pointerdown", onPointerDown);
	canvas.addEventListener("pointermove", onPointerMove);
	canvas.addEventListener("pointerup", onPointerUp);
	canvas.addEventListener("pointercancel", onPointerUp);
	canvas.addEventListener("wheel", onWheel, { passive: false });
	function applyCivicAct(act, asBot, quiet = false) {
		audio.talk();
		if (act === "Tend") {
			if (charge < .45) {
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
	function botWork(_text) {
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
	function startRaise(now) {
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
		raiseQueue = [
			"Tend",
			"Join",
			"Grow"
		];
		raiseAt = now + 160;
		say(`${botName} answers the Howl.`);
		civicNote(`${botName} answers the Howl.`);
	}
	function teach(text) {
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
	function setIsland(name) {
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
	function setBot(on, name) {
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
		} catch {}
		say(isHost ? island + ". You Howl. Your Grok Bot grows the land." : "Guest on " + island + ". Hold the Spire to Howl with them.");
		emit();
	}
	function dropPeer(id) {
		const r = remotes.get(id);
		if (!r) return;
		scene.remove(r.hound.group);
		remotes.delete(id);
	}
	function setPeer(id, pose) {
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
				howl: pose.howl
			};
			remotes.set(id, r);
			return;
		}
		r.tx = pose.x;
		r.tz = pose.z;
		r.tyaw = pose.yaw;
		r.howl = pose.howl;
	}
	function applyCivic(s, line) {
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
		if (charge + (tended ? 1 : 0) + (joined ? 2 : 0) + named !== before || line) emit();
	}
	function loop(now) {
		if (!running) return;
		const raw = Math.min(.05, Math.max(0, (now - last) / 1e3));
		last = now;
		input.beginFrame();
		if (input.justPressed.pause && mode === "play") mode = "pause";
		else if (input.justPressed.pause && mode === "pause") mode = "play";
		const dt = mode === "play" ? raw : raw * .15;
		if (mode === "title") {
			isoYaw += raw * .12;
			look.x = 0;
			look.z = 0;
			span = 42;
			applyView();
			placeCam();
			world.tick(now / 1e3, raw, 0, grown * .12);
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
			if (Math.abs(act.lookY) > .08) {
				span = MathUtils.clamp(span - act.lookY * 18 * dt, 22, 58);
				applyView();
			}
		}
		const hubHowl = selected === "hub" || hubHold;
		howling = mode === "play" && act.howl && hubHowl;
		if (!howling) spentHowl = false;
		if (howling && isHost) {
			charge = Math.min(1, charge + dt * .9);
			if (input.justPressed.howl) {
				audio.howl();
				charge = Math.min(1, charge + .22);
			}
			if (charge >= .78) startRaise(now);
		} else if (input.justPressed.howl && !hubHowl) say("Hold the Spire to Howl. Gather, not volume.");
		if (raising && now >= raiseAt) {
			const step = raiseQueue.shift();
			if (step) applyCivicAct(step, true, step !== "Grow");
			raiseAt = now + 300;
			if (!raiseQueue.length) raising = false;
		}
		if (input.justPressed.talk) doTalk();
		if (toast && now - toastAt > 4200) toast = null;
		bob += dt * 2.2;
		hound.group.position.set(houndPos.x, 1.08 + Math.sin(bob) * .03, houndPos.z);
		hound.group.rotation.y = houndPos.yaw;
		hound.legL.rotation.x = 0;
		hound.legR.rotation.x = 0;
		hound.armL.rotation.x = 0;
		hound.armR.rotation.x = 0;
		hound.tail.rotation.x = .7 + Math.sin(now / 400) * .1;
		botFly = MathUtils.clamp(botFly + (raising ? 1 : -1) * dt * 3.2, 0, 1);
		const fly = botFly * botFly * (3 - 2 * botFly);
		botShard.visible = botOn;
		botShard.position.set(MathUtils.lerp(houndPos.x + .46, .15, fly), MathUtils.lerp(1.68 + Math.sin(now / 380) * .07, 2.55, fly), MathUtils.lerp(houndPos.z + .1, .2, fly));
		botShard.rotation.y += dt * (raising ? 4.2 : 1.8);
		botShard.material.emissiveIntensity = raising ? 1.4 : .9;
		const follow = 1 - Math.exp(-dt * 8);
		for (const r of remotes.values()) {
			r.x += (r.tx - r.x) * follow;
			r.z += (r.tz - r.z) * follow;
			r.yaw += (r.tyaw - r.yaw) * follow;
			r.hound.group.position.set(r.x, 1.08 + (r.howl ? .08 : 0), r.z);
			r.hound.group.rotation.y = r.yaw;
			const walk = Math.hypot(r.tx - r.x, r.tz - r.z) > .08 ? Math.sin(now / 90) * .4 : 0;
			r.hound.legL.rotation.x = walk;
			r.hound.legR.rotation.x = -walk;
			r.hound.armL.rotation.x = -walk * .7;
			r.hound.armR.rotation.x = walk * .7;
		}
		placeCam();
		world.tick(now / 1e3, dt, howling ? 1 : charge * .35, grown * .12);
		renderer.render(scene, camera);
		if (now - lastHud > 80) {
			lastHud = now;
			emit();
		}
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
	window.__controlsTest = {
		getYaw: () => look.x,
		getSpeed: () => Math.hypot(look.x, look.z),
		getCam: () => ({
			x: camera.position.x,
			y: camera.position.y,
			z: camera.position.z,
			fov: 0,
			dist: span
		}),
		getCharge: () => charge,
		getNear: () => selected === "hub" ? "hub" : null,
		getAct: () => actOf(),
		getBot: () => botOn,
		getHost: () => isHost,
		getLand: () => landId,
		getGrown: () => grown,
		botWork: (text) => botWork(text),
		setBot: (on, name) => setBot(on, name),
		getPos: () => ({
			x: look.x,
			z: look.z
		}),
		setKeys: (codes) => {
			input.keys.clear();
			for (const c of codes) input.keys.add(c);
		},
		select: (id) => {
			selected = id === "hub" ? "hub" : selected;
			emit();
		},
		addPeer: (id, x, z) => {
			setPeer(id, {
				x,
				z,
				yaw: .4,
				howl: false
			});
		},
		dropPeer: (id) => dropPeer(id),
		getPeerCount: () => remotes.size
	};
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
		setStick() {},
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
			return {
				x: houndPos.x,
				z: houndPos.z,
				yaw: houndPos.yaw,
				howl: howling
			};
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
		audio
	};
}
//#endregion
export { startRaising };
