import { m as pub } from "./routes-BoVHVS11.mjs";
import { n as createInput, t as createAudio } from "./audio-DDruFsM2.mjs";
import { A as PlaneGeometry, B as Timer, E as OctahedronGeometry, H as Vector2, I as SRGBColorSpace, L as Scene, N as Raycaster, O as PerspectiveCamera, P as RepeatWrapping, R as SphereGeometry, S as MeshStandardMaterial, T as Object3D, U as Vector3, b as MeshBasicMaterial, d as DirectionalLight, f as FogExp2, j as PointLight, l as CylinderGeometry, m as HemisphereLight, n as BoxGeometry, p as Group, t as WebGLRenderer, y as Mesh, z as TextureLoader } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fps-engine-Bedu9r00.js
var ARENA = 20;
var HP_MAX = 120;
var MAG = 14;
var RESERVE0 = 84;
var FIRE_CD = .16;
var RELOAD_T = 1.45;
var EYE = 1.48;
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function goldMat(hex, emissive = 4861972, e = .28) {
	return new MeshStandardMaterial({
		color: hex,
		metalness: .28,
		roughness: .48,
		emissive,
		emissiveIntensity: e
	});
}
function startFps(canvas, onHud) {
	const mobile = (navigator.maxTouchPoints || 0) > 0 || window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;
	const renderer = new WebGLRenderer({
		canvas,
		antialias: !mobile,
		powerPreference: "high-performance"
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2));
	renderer.setClearColor(460300, 1);
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.toneMapping = 4;
	renderer.toneMappingExposure = 1.28;
	renderer.autoClear = true;
	const scene = new Scene();
	scene.fog = new FogExp2(657424, .018);
	const yawObj = new Object3D();
	yawObj.position.set(0, EYE, 8);
	scene.add(yawObj);
	const camera = new PerspectiveCamera(mobile ? 78 : 82, 1, .08, 90);
	yawObj.add(camera);
	const gunScene = new Scene();
	const gunCam = new PerspectiveCamera(48, 1, .05, 8);
	const gunRoot = new Group();
	gunScene.add(gunRoot);
	gunScene.add(new HemisphereLight(16771272, 1708040, 1.2));
	const gunKey = new DirectionalLight(16769712, 1.4);
	gunKey.position.set(.4, 1.2, .6);
	gunScene.add(gunKey);
	const gunCyan = new PointLight(8317170, 1.6, 3, 2);
	gunCyan.position.set(.1, .05, -.5);
	gunScene.add(gunCyan);
	const hemi = new HemisphereLight(6981808, 2757644, .95);
	scene.add(hemi);
	const sun = new DirectionalLight(16769712, 1.35);
	sun.position.set(12, 18, 8);
	scene.add(sun);
	const rim = new DirectionalLight(5953774, .7);
	rim.position.set(-10, 6, -8);
	scene.add(rim);
	const ember = new PointLight(16742970, 16, 28, 1.8);
	ember.position.set(6, 3, 4);
	scene.add(ember);
	const loader = new TextureLoader();
	const groundTex = loader.load(pub("slash/floor.jpg") + "?v=fps1");
	groundTex.colorSpace = SRGBColorSpace;
	groundTex.wrapS = groundTex.wrapT = RepeatWrapping;
	groundTex.repeat.set(3.2, 3.2);
	const ground = new Mesh(new PlaneGeometry(ARENA * 2.4, ARENA * 2.4), new MeshStandardMaterial({
		map: groundTex,
		roughness: .88,
		metalness: .12,
		emissive: 16751168,
		emissiveMap: groundTex,
		emissiveIntensity: .22
	}));
	ground.rotation.x = -Math.PI / 2;
	scene.add(ground);
	const skyTex = loader.load(pub("slash/sky.jpg") + "?v=fps1");
	skyTex.colorSpace = SRGBColorSpace;
	const sky = new Mesh(new SphereGeometry(64, 20, 12), new MeshBasicMaterial({
		map: skyTex,
		side: 1,
		fog: false,
		depthWrite: false
	}));
	scene.add(sky);
	const wallMat = goldMat(2761244, 1708040, .08);
	const pillars = [];
	const wallH = 4.2;
	for (let i = 0; i < 4; i++) {
		const along = i % 2 === 0;
		const sign = i < 2 ? 1 : -1;
		const wall = new Mesh(new BoxGeometry(along ? ARENA * 2.1 : .7, wallH, along ? .7 : ARENA * 2.1), wallMat);
		wall.position.set(along ? 0 : sign * ARENA, wallH * .5, along ? sign * ARENA : 0);
		scene.add(wall);
	}
	for (const [x, z, r] of [
		[
			6,
			-5,
			1.05
		],
		[
			-7,
			4,
			1.1
		],
		[
			4,
			8,
			.95
		],
		[
			-5,
			-8,
			1
		],
		[
			10,
			2,
			1.2
		],
		[
			-11,
			-2,
			1.15
		],
		[
			0,
			-3,
			.85
		],
		[
			8,
			-11,
			1
		]
	]) {
		const p = new Group();
		const col = new Mesh(new CylinderGeometry(r * .72, r * .9, 3.4, 8), goldMat(3813928, 2758664, .16));
		col.position.y = 1.7;
		p.add(col);
		const cap = new Mesh(new CylinderGeometry(r * .95, r * .7, .28, 8), goldMat(13939818, 9068568, .32));
		cap.position.y = 3.5;
		p.add(cap);
		const cry = new Mesh(new OctahedronGeometry(.38, 0), new MeshStandardMaterial({
			color: 8317170,
			emissive: 2793664,
			emissiveIntensity: .7,
			roughness: .3
		}));
		cry.position.y = 4;
		p.add(cry);
		p.position.set(x, 0, z);
		scene.add(p);
		pillars.push({
			x,
			z,
			r: r + .15
		});
	}
	const crateMat = goldMat(4864036, 2758664, .1);
	for (const [x, z] of [
		[3, 3],
		[-4, 1],
		[2, -9],
		[-9, 8]
	]) {
		const c = new Mesh(new BoxGeometry(1.5, 1.1, 1.5), crateMat);
		c.position.set(x, .55, z);
		scene.add(c);
		pillars.push({
			x,
			z,
			r: 1.05
		});
	}
	function makeGun() {
		const g = new Group();
		const plate = goldMat(13939818, 9068568, .35);
		const dark = goldMat(1709072, 657414, .04);
		const fur = new MeshStandardMaterial({
			color: 15920356,
			roughness: .78,
			metalness: .04
		});
		const pad = new MeshStandardMaterial({
			color: 2761244,
			roughness: .7
		});
		const body = new Mesh(new BoxGeometry(.16, .16, .72), plate);
		body.position.set(0, 0, -.12);
		g.add(body);
		const barrel = new Mesh(new CylinderGeometry(.035, .045, .62, 8), plate);
		barrel.rotation.x = Math.PI / 2;
		barrel.position.set(0, .02, -.58);
		g.add(barrel);
		const core = new Mesh(new CylinderGeometry(.022, .022, .28, 8), new MeshBasicMaterial({ color: 8317170 }));
		core.rotation.x = Math.PI / 2;
		core.position.set(0, .02, -.72);
		g.add(core);
		const stock = new Mesh(new BoxGeometry(.12, .18, .22), dark);
		stock.position.set(0, -.06, .28);
		g.add(stock);
		const mag = new Mesh(new BoxGeometry(.08, .22, .12), plate);
		mag.position.set(0, -.18, -.06);
		g.add(mag);
		const sight = new Mesh(new BoxGeometry(.04, .08, .08), dark);
		sight.position.set(0, .12, -.22);
		g.add(sight);
		const glow = new Mesh(new OctahedronGeometry(.05, 0), new MeshBasicMaterial({ color: 8317170 }));
		glow.position.set(0, .16, -.22);
		g.add(glow);
		function paw(sx) {
			const p = new Group();
			const palm = new Mesh(new SphereGeometry(.075, 8, 6), fur);
			p.add(palm);
			for (let i = 0; i < 3; i++) {
				const toe = new Mesh(new SphereGeometry(.028, 6, 5), fur);
				toe.position.set((i - 1) * .04, -.02, -.07);
				p.add(toe);
				const pk = new Mesh(new SphereGeometry(.016, 5, 4), pad);
				pk.position.set((i - 1) * .04, -.04, -.08);
				p.add(pk);
			}
			p.position.set(sx * .11, -.12, .08);
			p.rotation.set(.35, sx * .2, sx * .15);
			g.add(p);
		}
		paw(-1);
		paw(1);
		g.position.set(.28, -.26, -.48);
		g.rotation.set(.1, .16, .05);
		g.scale.setScalar(1.28);
		return g;
	}
	const gun = makeGun();
	gunRoot.add(gun);
	const muzzleFlash = new PointLight(10417407, 0, 1.8, 2);
	muzzleFlash.position.set(.22, -.18, -1.15);
	gunScene.add(muzzleFlash);
	function makeEnemy(kind) {
		const g = new Group();
		const col = kind === "brute" ? 12868154 : kind === "husk" ? 6965896 : 3854536;
		const em = kind === "brute" ? 6955024 : kind === "husk" ? 3809376 : 1337448;
		const s = kind === "brute" ? 1.35 : kind === "husk" ? 1 : .72;
		const body = new Mesh(new OctahedronGeometry(.42 * s, 0), new MeshStandardMaterial({
			color: col,
			emissive: em,
			emissiveIntensity: .55,
			roughness: .42,
			metalness: .2
		}));
		body.position.y = .7 * s;
		g.add(body);
		const core = new Mesh(new SphereGeometry(.16 * s, 8, 6), new MeshBasicMaterial({ color: 16766112 }));
		core.position.y = .7 * s;
		g.add(core);
		for (const a of [
			.4,
			1.8,
			3.4,
			5
		]) {
			const leg = new Mesh(new CylinderGeometry(.05 * s, .08 * s, .7 * s, 5), goldMat(2761244, 1708040, .08));
			leg.position.set(Math.cos(a) * .28 * s, .28 * s, Math.sin(a) * .28 * s);
			leg.rotation.z = Math.cos(a) * .4;
			leg.rotation.x = Math.sin(a) * .4;
			g.add(leg);
		}
		return g;
	}
	const enemies = [];
	const sparks = [];
	const sparkGeo = new SphereGeometry(.06, 5, 4);
	const sparkMat = new MeshBasicMaterial({ color: 8317170 });
	for (let i = 0; i < 28; i++) {
		const mesh = new Mesh(sparkGeo, sparkMat);
		mesh.visible = false;
		scene.add(mesh);
		sparks.push({
			mesh,
			vx: 0,
			vy: 0,
			vz: 0,
			life: 0,
			on: false
		});
	}
	const tracerMat = new MeshBasicMaterial({
		color: 10417407,
		transparent: true,
		opacity: .85
	});
	const tracers = [];
	for (let i = 0; i < 8; i++) {
		const mesh = new Mesh(new CylinderGeometry(.012, .012, 1, 4), tracerMat);
		mesh.visible = false;
		scene.add(mesh);
		tracers.push({
			mesh,
			life: 0
		});
	}
	const input = createInput(canvas);
	const audio = createAudio();
	const ray = new Raycaster();
	const ndc = new Vector2(0, 0);
	const fwd = new Vector3();
	const right = new Vector3();
	const hitPoint = new Vector3();
	const timer = new Timer();
	let mode = "title";
	let hp = HP_MAX;
	let ammo = MAG;
	let reserve = RESERVE0;
	let reloading = 0;
	let fireCd = 0;
	let emptyCd = 0;
	let wave = 0;
	let kills = 0;
	let gold = 0;
	let toast = null;
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
	let qaKeys = null;
	function say(msg) {
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
			hurt: hurtFlash
		});
		hudDirty = false;
	}
	function burst(x, y, z, color, n = 8) {
		sparkMat.color.setHex(color);
		let used = 0;
		for (const s of sparks) {
			if (s.on) continue;
			s.on = true;
			s.life = .28 + Math.random() * .22;
			s.vx = (Math.random() - .5) * 6;
			s.vy = 2 + Math.random() * 4;
			s.vz = (Math.random() - .5) * 6;
			s.mesh.position.set(x, y, z);
			s.mesh.visible = true;
			s.mesh.material = new MeshBasicMaterial({ color });
			used++;
			if (used >= n) break;
		}
	}
	function tracerTo(tx, ty, tz) {
		const ox = px + Math.sin(yaw) * -.2;
		const oy = EYE + pitch * .1 - .05;
		const oz = pz + Math.cos(yaw) * -.2;
		const dx = tx - ox;
		const dy = ty - oy;
		const dz = tz - oz;
		const len = Math.hypot(dx, dy, dz) || 1;
		for (const t of tracers) {
			if (t.mesh.visible) continue;
			t.mesh.visible = true;
			t.life = .06;
			t.mesh.scale.set(1, len, 1);
			t.mesh.position.set(ox + dx * .5, oy + dy * .5, oz + dz * .5);
			t.mesh.lookAt(tx, ty, tz);
			t.mesh.rotateX(Math.PI / 2);
			break;
		}
	}
	function collide(nx, nz) {
		const pr = .42;
		nx = clamp(nx, -19.2, 19.2);
		nz = clamp(nz, -19.2, 19.2);
		for (const p of pillars) {
			const dx = nx - p.x;
			const dz = nz - p.z;
			const d = Math.hypot(dx, dz);
			const min = pr + p.r;
			if (d < min && d > 1e-4) {
				const k = min / d;
				nx = p.x + dx * k;
				nz = p.z + dz * k;
			}
		}
		return {
			x: nx,
			z: nz
		};
	}
	function stats(kind) {
		if (kind === "brute") return {
			hp: 90,
			speed: 3.4,
			r: .75,
			dmg: 26
		};
		if (kind === "husk") return {
			hp: 42,
			speed: 4.6,
			r: .52,
			dmg: 16
		};
		return {
			hp: 24,
			speed: 6.2,
			r: .4,
			dmg: 12
		};
	}
	function spawnOne(kind) {
		const st = stats(kind);
		const a = Math.random() * Math.PI * 2;
		const rad = 17;
		const x = Math.cos(a) * rad;
		const z = Math.sin(a) * rad;
		const mesh = makeEnemy(kind);
		mesh.position.set(x, 0, z);
		scene.add(mesh);
		enemies.push({
			kind,
			mesh,
			hp: st.hp,
			hpMax: st.hp,
			x,
			z,
			r: st.r,
			speed: st.speed,
			dmg: st.dmg,
			flash: 0,
			hitCd: .2 + Math.random() * .4,
			wind: 0,
			lunge: 0,
			alive: true
		});
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
	function killEnemy(e) {
		e.alive = false;
		e.mesh.visible = false;
		burst(e.x, .8, e.z, e.kind === "brute" ? 16738856 : 8317170, 12);
		kills += 1;
		gold += e.kind === "brute" ? 18 : e.kind === "husk" ? 8 : 4;
		hudDirty = true;
	}
	function resetRun() {
		for (const e of enemies) {
			scene.remove(e.mesh);
			e.mesh.traverse((o) => {
				o.geometry?.dispose();
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
				emptyCd = .22;
				if (reserve > 0) startReload();
			}
			return;
		}
		fireCd = FIRE_CD;
		ammo -= 1;
		recoil = 1;
		shake = Math.max(shake, .18);
		muzzleFlash.intensity = 4.5;
		audio.shot();
		pitch = clamp(pitch + .018, -1.45, 1.45);
		yaw += (Math.random() - .5) * .012;
		camera.updateMatrixWorld();
		ray.setFromCamera(ndc, camera);
		const live = enemies.filter((e) => e.alive).map((e) => e.mesh);
		const hits = live.length ? ray.intersectObjects(live, true) : [];
		let hitE = null;
		if (hits.length) {
			let obj = hits[0].object;
			while (obj && obj.parent && !enemies.some((e) => e.mesh === obj)) obj = obj.parent;
			hitE = enemies.find((e) => e.mesh === obj) ?? null;
			hitPoint.copy(hits[0].point);
		} else ray.ray.at(28, hitPoint);
		tracerTo(hitPoint.x, hitPoint.y, hitPoint.z);
		burst(hitPoint.x, hitPoint.y, hitPoint.z, hitE ? 16766112 : 8317170, hitE ? 8 : 3);
		if (hitE && hitE.alive) {
			const dmg = hitE.kind === "brute" ? 16 : 22;
			hitE.hp -= dmg;
			hitE.flash = .12;
			hitMark = 1;
			audio.hit();
			const k = .55;
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
			const r = canvas.requestPointerLock.call(canvas, { unadjustedMovement: true });
			if (r && typeof r.catch === "function") r.catch(() => {
				canvas.requestPointerLock();
			});
		} catch {
			canvas.requestPointerLock();
		}
	}
	function onMouseMove(e) {
		if (mode !== "play") return;
		if (document.pointerLockElement !== canvas) return;
		yaw -= e.movementX * .0022;
		pitch -= e.movementY * .0022;
		pitch = clamp(pitch, -1.45, 1.45);
	}
	function onMouseDown(e) {
		if (mode !== "play") return;
		if (e.button === 0) {
			mouseFire = true;
			fire();
		}
	}
	function onMouseUp(e) {
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
		} else mode = "play";
		hudDirty = true;
		lockLook();
		emitHud();
	}
	window.__controlsTest = {
		getYaw: () => yaw,
		getSpeed: () => Math.hypot(vx, vz),
		getPos: () => ({
			x: px,
			z: pz
		}),
		setKeys(codes) {
			qaKeys = new Set(codes);
		}
	};
	function step(dt) {
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
		const speed = sprint ? 9.2 : 6.1;
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
		if (am < .04) {
			vx *= Math.max(0, 1 - 10 * dt);
			vz *= Math.max(0, 1 - 10 * dt);
		}
		const moved = collide(px + vx * dt, pz + vz * dt);
		px = moved.x;
		pz = moved.z;
		const moving = Math.hypot(vx, vz);
		if (moving > .4) {
			bob += dt * (sprint ? 14 : 10);
			audio.foot(moving);
		}
		yawObj.position.set(px, EYE, pz);
		yawObj.rotation.y = yaw;
		camera.rotation.x = pitch;
		camera.position.set((Math.random() - .5) * shake * .08, Math.sin(bob) * .035 * Math.min(1, moving / 4) + (Math.random() - .5) * shake * .06, 0);
		gun.position.set(.28 + Math.sin(bob) * .012, -.26 - recoil * .06 + Math.cos(bob * 2) * .012, -.48 + recoil * .09);
		gun.rotation.set(.1 + recoil * .14, .16, .05);
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
			if (winding && e.wind === 0 && e.lunge <= 0) e.lunge = e.kind === "brute" ? .42 : .28;
			e.lunge = Math.max(0, e.lunge - dt);
			const dx = px - e.x;
			const dz = pz - e.z;
			const dist = Math.hypot(dx, dz) || 1;
			const ux = dx / dist;
			const uz = dz / dist;
			const reach = e.r + .85;
			if (e.lunge > 0) {
				const dash = e.speed * 3.4;
				e.x += ux * dash * dt;
				e.z += uz * dash * dt;
				const c = collide(e.x, e.z);
				e.x = c.x;
				e.z = c.z;
				if (dist < reach && e.hitCd <= 0) {
					hp -= e.dmg;
					e.hitCd = e.kind === "brute" ? 1.15 : .92;
					e.lunge = 0;
					hurtFlash = 1;
					shake = Math.max(shake, e.kind === "brute" ? .95 : .7);
					vx -= ux * 7.5;
					vz -= uz * 7.5;
					burst(px, 1.28, pz, 16738856, 10);
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
				e.x -= ux * e.speed * .25 * dt;
				e.z -= uz * e.speed * .25 * dt;
			} else if (e.hitCd <= 0 && dist < 5.4) e.wind = e.kind === "brute" ? .38 : .22;
			else if (dist > reach) {
				e.x += ux * e.speed * dt;
				e.z += uz * e.speed * dt;
				const c = collide(e.x, e.z);
				e.x = c.x;
				e.z = c.z;
			}
			const hop = e.lunge > 0 ? .28 : e.wind > 0 ? .04 : 0;
			e.mesh.position.set(e.x, hop + e.flash * .08, e.z);
			e.mesh.lookAt(px, .5, pz);
			e.mesh.scale.setScalar(e.lunge > 0 ? 1.12 : 1);
			const mat = e.mesh.children[0].material;
			mat.emissiveIntensity = e.lunge > 0 ? 1.6 : e.flash > 0 ? 1.4 : .55;
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
		step(Math.min(timer.getDelta(), .05));
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
			delete window.__controlsTest;
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
		audio
	};
}
//#endregion
export { startFps };
