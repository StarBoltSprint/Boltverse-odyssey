import { n as ARTIFACTS, r as ARTIFACT_THREADS } from "./routes-BoVHVS11.mjs";
import { C as MeshToonMaterial, E as OctahedronGeometry, H as Vector2, I as SRGBColorSpace, L as Scene, M as RGBAFormat, N as Raycaster, O as PerspectiveCamera, R as SphereGeometry, U as Vector3, V as TorusGeometry, _ as LineBasicMaterial, b as MeshBasicMaterial, c as ConeGeometry, d as DirectionalLight, f as FogExp2, g as Line, i as BufferGeometry, j as PointLight, l as CylinderGeometry, m as HemisphereLight, n as BoxGeometry, p as Group, t as WebGLRenderer, u as DataTexture, v as MathUtils, w as NearestFilter, x as MeshPhysicalMaterial, y as Mesh } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/constellation-engine-C1BTSlkz.js
function toonRamp() {
	const c = new Uint8Array([
		40,
		36,
		28,
		255,
		110,
		96,
		60,
		255,
		200,
		180,
		120,
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
function relicCoreHeart() {
	const g = new Group();
	const pad = new Mesh(new CylinderGeometry(.72, .82, .28, 8), toon(9077912, 3814472, .1));
	pad.position.y = .14;
	g.add(pad);
	const shaft = new Mesh(new CylinderGeometry(.38, .58, 1.7, 6), toon(5163240, 1738928, .42));
	shaft.position.y = 1.08;
	g.add(shaft);
	const heart = new Mesh(new OctahedronGeometry(.32, 0), new MeshPhysicalMaterial({
		color: 8317170,
		roughness: .12,
		metalness: .08,
		transmission: .55,
		thickness: .6,
		emissive: 2793664,
		emissiveIntensity: .55
	}));
	heart.position.y = 1.15;
	g.add(heart);
	const hat = new Mesh(new ConeGeometry(.52, .62, 6), toon(15778378, 11565072, .4));
	hat.position.y = 2.12;
	g.add(hat);
	return g;
}
function relicShatterVeil() {
	const g = new Group();
	const pad = new Mesh(new CylinderGeometry(.7, .82, .24, 8), toon(3811872, 1708040, .08));
	pad.position.y = .12;
	g.add(pad);
	const body = new Mesh(new BoxGeometry(.55, 1.15, .38), toon(13939818, 9068568, .28));
	body.position.y = .85;
	g.add(body);
	const blade = new Mesh(new BoxGeometry(.12, 1.35, .08), toon(8317170, 2793664, .7));
	blade.position.set(.42, 1.35, 0);
	g.add(blade);
	const skull = new Mesh(new SphereGeometry(.22, 8, 6), toon(15920356, 13945016, .12));
	skull.position.set(0, 1.58, .06);
	g.add(skull);
	const snout = new Mesh(new BoxGeometry(.14, .1, .22), toon(15920356, 13945016, .1));
	snout.position.set(0, 1.5, .22);
	g.add(snout);
	for (const sx of [-1, 1]) {
		const ear = new Mesh(new ConeGeometry(.07, .22, 4), toon(15920356, 13945016, .1));
		ear.position.set(sx * .14, 1.78, -.02);
		ear.rotation.z = sx * -.2;
		g.add(ear);
	}
	const crystal = new Mesh(new OctahedronGeometry(.16, 0), toon(8317170, 2793664, .7));
	crystal.position.set(0, 1.05, .22);
	g.add(crystal);
	return g;
}
function relicHowlSight() {
	const g = new Group();
	const pad = new Mesh(new CylinderGeometry(.7, .82, .24, 8), toon(3811872, 1708040, .08));
	pad.position.y = .12;
	g.add(pad);
	const body = new Mesh(new BoxGeometry(.42, .22, 1.15), toon(13939818, 9068568, .32));
	body.position.set(0, 1.05, 0);
	g.add(body);
	const barrel = new Mesh(new CylinderGeometry(.06, .08, .9, 8), toon(13939818, 9068568, .28));
	barrel.rotation.x = Math.PI / 2;
	barrel.position.set(0, 1.08, -.85);
	g.add(barrel);
	const core = new Mesh(new OctahedronGeometry(.16, 0), toon(8317170, 2793664, .7));
	core.position.set(0, 1.22, -.2);
	g.add(core);
	const skull = new Mesh(new SphereGeometry(.2, 8, 6), toon(15920356, 13945016, .12));
	skull.position.set(0, 1.55, .42);
	g.add(skull);
	const snout = new Mesh(new BoxGeometry(.12, .09, .2), toon(15920356, 13945016, .1));
	snout.position.set(0, 1.48, .58);
	g.add(snout);
	for (const sx of [-1, 1]) {
		const ear = new Mesh(new ConeGeometry(.06, .2, 4), toon(15920356, 13945016, .1));
		ear.position.set(sx * .12, 1.74, .36);
		ear.rotation.z = sx * -.2;
		g.add(ear);
	}
	return g;
}
function buildRelic(id) {
	switch (id) {
		case "core-heart": return relicCoreHeart();
		case "shatter-veil": return relicShatterVeil();
		case "howl-sight": return relicHowlSight();
	}
}
function buildConstellation() {
	const group = new Group();
	group.name = "boltverse-sky";
	const skyGeo = new SphereGeometry(220, 24, 16);
	const sky = new Mesh(skyGeo, new MeshBasicMaterial({
		color: 461080,
		side: 1,
		fog: false,
		depthWrite: false
	}));
	sky.renderOrder = -2;
	group.add(sky);
	const starRoot = new Group();
	const starGeo = new SphereGeometry(.08, 6, 4);
	const starMat = new MeshBasicMaterial({
		color: 15265528,
		transparent: true,
		opacity: .08
	});
	for (let i = 0; i < 90; i++) {
		const s = new Mesh(starGeo, starMat);
		const u = Math.random() * Math.PI * 2;
		const v = Math.acos(2 * Math.random() - 1);
		const r = 28 + Math.random() * 70;
		s.position.set(r * Math.sin(v) * Math.cos(u), r * Math.cos(v) * .55, r * Math.sin(v) * Math.sin(u));
		s.scale.setScalar(.4 + Math.random() * 1.4);
		starRoot.add(s);
	}
	group.add(starRoot);
	const threadRoot = new Group();
	const byId = new Map(ARTIFACTS.map((a) => [a.id, a]));
	const threadMats = [];
	for (const [a, b] of ARTIFACT_THREADS) {
		const ra = byId.get(a);
		const rb = byId.get(b);
		const pts = [new Vector3(ra.x, ra.y, ra.z), new Vector3(rb.x, rb.y, rb.z)];
		const mat = new LineBasicMaterial({
			color: 13939818,
			transparent: true,
			opacity: 0
		});
		threadMats.push(mat);
		threadRoot.add(new Line(new BufferGeometry().setFromPoints(pts), mat));
	}
	group.add(threadRoot);
	const hall = new Group();
	hall.name = "hall";
	const matStone = toon(3817036, 1184796, .08);
	const matGold = toon(15778378, 11565072, .28);
	const matFloor = toon(1711658, 658452, .06);
	const floor = new Mesh(new CylinderGeometry(14.5, 15.2, .45, 12), matFloor);
	floor.position.y = -.1;
	hall.add(floor);
	const ring = new Mesh(new TorusGeometry(11.4, .18, 6, 16), matGold);
	ring.rotation.x = Math.PI / 2;
	ring.position.y = .16;
	hall.add(ring);
	const plinth = new Mesh(new CylinderGeometry(1.55, 1.85, 1.7, 8), matStone);
	plinth.position.y = .85;
	hall.add(plinth);
	const lip = new Mesh(new TorusGeometry(1.62, .1, 6, 12), matGold);
	lip.rotation.x = Math.PI / 2;
	lip.position.y = 1.72;
	hall.add(lip);
	const top = new Mesh(new CylinderGeometry(1.35, 1.42, .22, 8), matStone);
	top.position.y = 1.82;
	hall.add(top);
	for (let i = 0; i < 6; i++) {
		const a = i / 6 * Math.PI * 2 + .2;
		const col = new Mesh(new CylinderGeometry(.38, .46, 4.6, 6), matStone);
		col.position.set(Math.cos(a) * 11.2, 2.4, Math.sin(a) * 11.2);
		hall.add(col);
		const cap = new Mesh(new CylinderGeometry(.5, .38, .28, 6), matGold);
		cap.position.set(col.position.x, 4.82, col.position.z);
		hall.add(cap);
	}
	for (let i = 0; i < 4; i++) {
		const a = i / 4 * Math.PI * 2 + .4;
		const pad = new Mesh(new CylinderGeometry(.85, .95, .55, 8), matStone);
		pad.position.set(Math.cos(a) * 6.4, .32, Math.sin(a) * 6.4);
		hall.add(pad);
	}
	group.add(hall);
	const nodes = [];
	for (const a of ARTIFACTS) {
		const wrap = new Group();
		wrap.name = a.id;
		wrap.position.set(a.x, a.y, a.z);
		const relic = buildRelic(a.id);
		wrap.add(relic);
		const glow = a.open ? .22 : .1;
		const halo = new Mesh(new SphereGeometry(1.55, 12, 10), new MeshBasicMaterial({
			color: a.color,
			transparent: true,
			opacity: glow,
			depthWrite: false
		}));
		halo.position.y = .9;
		wrap.add(halo);
		const hit = new Mesh(new SphereGeometry(1.9, 8, 6), new MeshBasicMaterial({ visible: false }));
		hit.position.y = .85;
		hit.userData.artifactId = a.id;
		wrap.add(hit);
		wrap.add(new PointLight(a.color, a.open ? 2.8 : 1.05, 14, 1.4));
		group.add(wrap);
		nodes.push({
			id: a.id,
			group: wrap,
			relic,
			halo,
			star: new Vector3(a.x, a.y, a.z),
			hall: new Vector3(),
			hallScale: 1,
			starScale: a.scale
		});
	}
	group.add(new HemisphereLight(9086160, 1708064, 1.05));
	const sun = new DirectionalLight(16771248, 1.35);
	sun.position.set(-16, 22, 10);
	group.add(sun);
	let view = "constellation";
	let pick = "core-heart";
	const tmp = new Vector3();
	function seatHall() {
		const others = nodes.filter((n) => n.id !== pick);
		let i = 0;
		for (const n of nodes) if (n.id === pick) {
			n.hall.set(0, 1.92, 0);
			n.hallScale = 1.7;
		} else {
			const a = i / Math.max(1, others.length) * Math.PI * 2 + .4;
			n.hall.set(Math.cos(a) * 6.4, .58, Math.sin(a) * 6.4);
			n.hallScale = .62;
			i += 1;
		}
	}
	seatHall();
	hall.visible = false;
	for (const n of nodes) {
		n.group.position.copy(n.star);
		n.group.scale.setScalar(n.starScale);
	}
	function setView(v) {
		view = v;
	}
	function select(id) {
		pick = id;
		seatHall();
	}
	function tick(t, dt) {
		const k = 1 - Math.exp(-dt * 5.4);
		hall.visible = view === "relic";
		const threadOp = view === "constellation" ? .7 : 0;
		for (const mat of threadMats) mat.opacity = MathUtils.lerp(mat.opacity, threadOp, k);
		threadRoot.visible = view === "constellation" || threadMats[0].opacity > .05;
		starMat.opacity = MathUtils.lerp(starMat.opacity, view === "constellation" ? .9 : .08, k);
		starRoot.visible = starMat.opacity > .05;
		for (const n of nodes) {
			tmp.copy(view === "relic" ? n.hall : n.star);
			n.group.position.lerp(tmp, k);
			const want = view === "relic" ? n.hallScale : n.starScale;
			n.group.scale.setScalar(MathUtils.lerp(n.group.scale.x, want, k));
			n.relic.rotation.y += dt * (n.id === pick && view === "relic" ? .55 : .18);
			if (view === "constellation") n.group.position.y += Math.sin(t * .7 + n.star.x) * .012;
			const hm = n.halo.material;
			hm.opacity = MathUtils.lerp(hm.opacity, n.id === pick ? .3 : view === "relic" ? .04 : .12, k);
		}
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
	return {
		group,
		tick,
		setView,
		select,
		dispose
	};
}
function artifactById(id) {
	if (!id) return null;
	return ARTIFACTS.find((a) => a.id === id) ?? null;
}
function startSky(canvas, onHud, _onEnter) {
	const mobile = typeof window !== "undefined" && ((navigator.maxTouchPoints || 0) > 0 || window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900);
	const renderer = new WebGLRenderer({
		canvas,
		antialias: !mobile,
		alpha: false,
		powerPreference: "high-performance"
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
	renderer.setClearColor(461080, 1);
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.toneMapping = 0;
	const scene = new Scene();
	scene.fog = new FogExp2(461080, .012);
	const camera = new PerspectiveCamera(42, 1, .4, 400);
	const world = buildConstellation();
	scene.add(world.group);
	world.setView("constellation");
	world.select("core-heart");
	let view = "constellation";
	let yaw = .55;
	let dist = 34;
	let elev = .52;
	let lookY = 1.2;
	let fogD = .003;
	let pickId = "core-heart";
	let toast = "Swipe the sky. Tap a star.";
	let toastAt = performance.now();
	let last = performance.now();
	let running = true;
	let lastHud = 0;
	const pointers = /* @__PURE__ */ new Map();
	let dragLastX = 0;
	let dragLastY = 0;
	let dragging = false;
	let moved = 0;
	let pinch0 = 0;
	let dist0 = dist;
	const raycaster = new Raycaster();
	const ndc = new Vector2();
	function distMin() {
		return view === "relic" ? 8 : 16;
	}
	function distMax() {
		return view === "relic" ? 22 : 58;
	}
	function resize() {
		const w = canvas.clientWidth || window.innerWidth;
		const h = canvas.clientHeight || window.innerHeight;
		if (w < 2 || h < 2) return;
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}
	resize();
	const ro = new ResizeObserver(resize);
	ro.observe(canvas);
	function emit() {
		onHud({
			pick: artifactById(pickId),
			toast,
			view
		});
	}
	function placeCam() {
		const horiz = dist * Math.cos(elev);
		camera.position.set(Math.sin(yaw) * horiz, dist * Math.sin(elev) + .4, Math.cos(yaw) * horiz);
		camera.lookAt(0, lookY, 0);
	}
	function hitArtifact(cx, cy) {
		const r = canvas.getBoundingClientRect();
		if (r.width < 2) return null;
		ndc.x = (cx - r.left) / r.width * 2 - 1;
		ndc.y = -((cy - r.top) / r.height) * 2 + 1;
		raycaster.setFromCamera(ndc, camera);
		const hits = raycaster.intersectObject(world.group, true);
		for (const h of hits) {
			let o = h.object;
			while (o) {
				const id = o.userData.artifactId;
				if (id) return id;
				o = o.parent;
			}
		}
		return null;
	}
	function pinchSep() {
		const pts = Array.from(pointers.values());
		if (pts.length < 2) return 0;
		return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
	}
	function onPointerDown(e) {
		e.preventDefault();
		pointers.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		try {
			canvas.setPointerCapture(e.pointerId);
		} catch {}
		if (pointers.size === 1) {
			dragLastX = e.clientX;
			dragLastY = e.clientY;
			dragging = true;
			moved = 0;
		} else {
			dragging = false;
			pinch0 = pinchSep();
			dist0 = dist;
		}
	}
	function onPointerMove(e) {
		if (!pointers.has(e.pointerId)) return;
		pointers.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		if (pointers.size >= 2) {
			const s = pinchSep();
			if (pinch0 > 10 && s > 10) dist = MathUtils.clamp(dist0 * (pinch0 / s), distMin(), distMax());
			return;
		}
		if (dragging) {
			const dx = e.clientX - dragLastX;
			const dy = e.clientY - dragLastY;
			moved += Math.abs(dx) + Math.abs(dy);
			yaw -= dx * .005;
			if (view === "constellation") dist = MathUtils.clamp(dist + dy * .04, distMin(), distMax());
			else elev = MathUtils.clamp(elev + dy * .0022, .12, .72);
			dragLastX = e.clientX;
			dragLastY = e.clientY;
		}
	}
	function onPointerUp(e) {
		const wasTap = dragging && moved < 14 && pointers.size <= 1;
		const x = e.clientX;
		const y = e.clientY;
		pointers.delete(e.pointerId);
		try {
			canvas.releasePointerCapture(e.pointerId);
		} catch {}
		if (pointers.size === 0) dragging = false;
		else if (pointers.size === 1) {
			const p = Array.from(pointers.values())[0];
			dragLastX = p.x;
			dragLastY = p.y;
			dragging = true;
		}
		if (!wasTap) return;
		const id = hitArtifact(x, y);
		if (!id) return;
		pickId = id;
		world.select(id);
		const art = artifactById(id);
		toast = art?.open ? `${art.name} — open.` : art ? `${art.name} — sealed.` : null;
		toastAt = performance.now();
		emit();
	}
	function onWheel(e) {
		e.preventDefault();
		dist = MathUtils.clamp(dist * (1 + e.deltaY * .0016), distMin(), distMax());
	}
	canvas.addEventListener("pointerdown", onPointerDown);
	canvas.addEventListener("pointermove", onPointerMove);
	canvas.addEventListener("pointerup", onPointerUp);
	canvas.addEventListener("pointercancel", onPointerUp);
	canvas.addEventListener("wheel", onWheel, { passive: false });
	function applyView(v) {
		view = v;
		world.setView(v);
		dist = MathUtils.clamp(dist, distMin(), distMax());
		toast = v === "relic" ? "Turn the relic. Pick another below." : "Swipe the sky. Tap a star.";
		toastAt = performance.now();
		emit();
	}
	function loop(now) {
		if (!running) return;
		const dt = Math.min(.05, Math.max(0, (now - last) / 1e3));
		last = now;
		const ease = 1 - Math.exp(-dt * 4.2);
		const wantDist = view === "relic" ? 20 : 34;
		const wantElev = view === "relic" ? .42 : .52;
		const wantLook = view === "relic" ? 1.9 : 1.2;
		const wantFog = view === "relic" ? .018 : .003;
		if (!dragging && pointers.size === 0) {
			dist += (wantDist - dist) * ease * .35;
			elev += (wantElev - elev) * ease;
		}
		lookY += (wantLook - lookY) * ease;
		fogD += (wantFog - fogD) * ease;
		scene.fog.density = fogD;
		if (!dragging && pointers.size === 0) yaw += (view === "constellation" ? .1 : .06) * dt;
		if (toast && now - toastAt > 3800) toast = null;
		world.tick(now / 1e3, dt);
		placeCam();
		renderer.render(scene, camera);
		if (now - lastHud > 80) {
			lastHud = now;
			emit();
		}
		requestAnimationFrame(loop);
	}
	emit();
	requestAnimationFrame(loop);
	return {
		dispose() {
			running = false;
			ro.disconnect();
			canvas.removeEventListener("pointerdown", onPointerDown);
			canvas.removeEventListener("pointermove", onPointerMove);
			canvas.removeEventListener("pointerup", onPointerUp);
			canvas.removeEventListener("pointercancel", onPointerUp);
			canvas.removeEventListener("wheel", onWheel);
			world.dispose();
			renderer.dispose();
		},
		enter() {
			const a = artifactById(pickId);
			return a?.open ? a.id : null;
		},
		setView(v) {
			applyView(v);
		},
		select(id) {
			pickId = id;
			world.select(id);
			const art = artifactById(id);
			toast = art?.open ? `${art.name} — open.` : art ? `${art.name} — sealed.` : null;
			toastAt = performance.now();
			emit();
		}
	};
}
//#endregion
export { startSky };
