import { m as pub } from "./routes-BoVHVS11.mjs";
import { n as createInput, t as createAudio } from "./audio-DDruFsM2.mjs";
import { A as PlaneGeometry, E as OctahedronGeometry, F as RingGeometry, H as Vector2, I as SRGBColorSpace, L as Scene, N as Raycaster, O as PerspectiveCamera, P as RepeatWrapping, R as SphereGeometry, S as MeshStandardMaterial, U as Vector3, V as TorusGeometry, a as CapsuleGeometry, b as MeshBasicMaterial, c as ConeGeometry, d as DirectionalLight, f as FogExp2, h as IcosahedronGeometry, j as PointLight, k as Plane, l as CylinderGeometry, m as HemisphereLight, n as BoxGeometry, o as CircleGeometry, p as Group, t as WebGLRenderer, y as Mesh, z as TextureLoader } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/slash-engine-CQpDMeee.js
var SLASH_CLASSES = [
	{
		id: "fang",
		name: "Fang",
		line: "Teeth first. Bite and hold the pack.",
		resource: "Fury",
		skills: [
			{
				id: "bite",
				name: "Bite",
				cost: 0,
				hot: "1"
			},
			{
				id: "thrash",
				name: "Thrash",
				cost: 22,
				hot: "2"
			},
			{
				id: "maul",
				name: "Maul",
				cost: 36,
				hot: "3"
			},
			{
				id: "howl",
				name: "Howl",
				cost: 0,
				hot: "4"
			}
		]
	},
	{
		id: "blitz",
		name: "Blitz",
		line: "The leash is off. Speed is the wound.",
		resource: "Momentum",
		skills: [
			{
				id: "dash",
				name: "Dash",
				cost: 0,
				hot: "1"
			},
			{
				id: "wake",
				name: "Wake",
				cost: 20,
				hot: "2"
			},
			{
				id: "crash",
				name: "Crash",
				cost: 34,
				hot: "3"
			},
			{
				id: "howl",
				name: "Howl",
				cost: 0,
				hot: "4"
			}
		]
	},
	{
		id: "arc",
		name: "Arc",
		line: "Silence loads it. Noise delivers the spark.",
		resource: "Spark",
		skills: [
			{
				id: "bolt",
				name: "Bolt",
				cost: 0,
				hot: "1"
			},
			{
				id: "aura",
				name: "Aura",
				cost: 22,
				hot: "2"
			},
			{
				id: "storm",
				name: "Storm",
				cost: 36,
				hot: "3"
			},
			{
				id: "howl",
				name: "Howl",
				cost: 0,
				hot: "4"
			}
		]
	}
];
var SAVE = "bv-slash-v1";
var CLASS_SAVE = "bv-slash-class";
var HP_MAX0 = 140;
var FURY_MAX = 100;
var ARENA = 22;
var CD = {
	bite: .38,
	thrash: 5.5,
	maul: 7.2,
	howl: 11,
	dash: .36,
	wake: 6.2,
	crash: 7,
	bolt: .32,
	aura: 8.4,
	storm: 7.4
};
function classKit(id) {
	return SLASH_CLASSES.find((c) => c.id === id) ?? SLASH_CLASSES[0];
}
function emptyCd() {
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
		storm: 0
	};
}
function loadClass() {
	try {
		const v = localStorage.getItem(CLASS_SAVE);
		if (v === "fang" || v === "blitz" || v === "arc") return v;
		if (v === "kiln") return "fang";
		if (v === "canal") return "blitz";
		if (v === "spark") return "arc";
	} catch {}
	return "fang";
}
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function goldMat(hex, emissive = 4861972, e = .28) {
	return new MeshStandardMaterial({
		color: hex,
		metalness: .22,
		roughness: .46,
		emissive,
		emissiveIntensity: e
	});
}
function glowMat(hex) {
	return new MeshBasicMaterial({ color: hex });
}
function blobShadow(r, opacity = .45) {
	const m = new Mesh(new CircleGeometry(r, 18), new MeshBasicMaterial({
		color: 328456,
		transparent: true,
		opacity,
		depthWrite: false
	}));
	m.rotation.x = -Math.PI / 2;
	m.position.y = .03;
	return m;
}
function makeHero() {
	const g = new Group();
	const plate = goldMat(16770996, 9067032, .52);
	const dark = goldMat(4864040, 2365456, .1);
	const cyan = glowMat(10417407);
	const cyanSoft = new MeshStandardMaterial({
		color: 11072767,
		emissive: 3854568,
		emissiveIntensity: 1.2,
		metalness: .16,
		roughness: .28
	});
	const fur = new MeshStandardMaterial({
		color: 16249836,
		roughness: .84,
		metalness: .02,
		emissive: 3814444,
		emissiveIntensity: .1
	});
	const muzzle = new MeshStandardMaterial({
		color: 1709072,
		roughness: .65,
		metalness: .04
	});
	const innerEar = new MeshStandardMaterial({
		color: 12876394,
		roughness: .78,
		metalness: 0
	});
	const scarMat = new MeshStandardMaterial({
		color: 4861992,
		roughness: .9,
		metalness: 0
	});
	const fangMat = new MeshStandardMaterial({
		color: 16249578,
		roughness: .35,
		metalness: .08
	});
	const cloth = goldMat(3810328, 1707016, .08);
	const pelvis = new Mesh(new BoxGeometry(.7, .3, .44), plate);
	pelvis.position.y = .92;
	g.add(pelvis);
	const fauld = new Mesh(new BoxGeometry(.78, .18, .5), goldMat(15255672, 6965780, .3));
	fauld.position.y = 1.08;
	g.add(fauld);
	const torso = new Mesh(new BoxGeometry(.88, .82, .52), plate);
	torso.position.y = 1.46;
	torso.castShadow = true;
	g.add(torso);
	const ridge = new Mesh(new BoxGeometry(.18, .72, .12), goldMat(16770728, 9068568, .4));
	ridge.position.set(0, 1.48, .28);
	g.add(ridge);
	const crystal = new Mesh(new OctahedronGeometry(.2, 0), cyan);
	crystal.position.set(0, 1.5, .34);
	g.add(crystal);
	const belt = new Mesh(new BoxGeometry(.76, .12, .48), goldMat(15778378, 6965776, .32));
	belt.position.y = 1.04;
	g.add(belt);
	const gorget = new Mesh(new CylinderGeometry(.28, .36, .18, 10), plate);
	gorget.position.y = 1.9;
	g.add(gorget);
	const head = new Group();
	head.position.set(0, 2.16, .06);
	const skull = new Mesh(new SphereGeometry(.38, 14, 12), fur);
	skull.scale.set(.95, 1.08, 1.14);
	head.add(skull);
	const brow = new Mesh(new BoxGeometry(.32, .07, .14), fur);
	brow.position.set(0, .12, .24);
	head.add(brow);
	const brand = new Mesh(new OctahedronGeometry(.065, 0), cyan);
	brand.position.set(0, .18, .28);
	head.add(brand);
	const snout = new Mesh(new BoxGeometry(.24, .16, .42), fur);
	snout.position.set(0, -.04, .34);
	head.add(snout);
	const nose = new Mesh(new SphereGeometry(.06, 8, 6), muzzle);
	nose.position.set(0, -.02, .54);
	head.add(nose);
	const jaw = new Mesh(new BoxGeometry(.18, .08, .28), fur);
	jaw.position.set(0, -.18, .28);
	jaw.rotation.x = .18;
	head.add(jaw);
	const mkFang = (sx) => {
		const f = new Mesh(new ConeGeometry(.03, .12, 5), fangMat);
		f.position.set(sx * .055, -.2, .4);
		f.rotation.x = Math.PI;
		head.add(f);
	};
	mkFang(-1);
	mkFang(1);
	const scar = new Mesh(new BoxGeometry(.025, .18, .045), scarMat);
	scar.position.set(-.12, .07, .28);
	scar.rotation.z = .45;
	head.add(scar);
	const mkEar = (sx) => {
		const ear = new Group();
		const outer = new Mesh(new ConeGeometry(.13, .5, 4), fur);
		const inner = new Mesh(new ConeGeometry(.07, .32, 4), innerEar);
		inner.position.set(0, .02, .025);
		ear.add(outer);
		ear.add(inner);
		ear.position.set(sx * .2, .4, -.04);
		ear.rotation.z = sx * -.3;
		ear.rotation.x = -.2;
		head.add(ear);
	};
	mkEar(-1);
	mkEar(1);
	const mkEye = (sx) => {
		const eye = new Mesh(new SphereGeometry(.048, 8, 6), muzzle);
		eye.position.set(sx * .11, .05, .28);
		head.add(eye);
		const glint = new Mesh(new SphereGeometry(.022, 6, 4), cyan);
		glint.position.set(sx * .11, .055, .32);
		head.add(glint);
	};
	mkEye(-1);
	mkEye(1);
	g.add(head);
	const tail = new Mesh(new ConeGeometry(.08, .82, 6), fur);
	tail.position.set(0, 1.02, -.48);
	tail.rotation.x = .95;
	g.add(tail);
	const mkPauldron = (sx) => {
		const p = new Mesh(new BoxGeometry(.4, .26, .46), plate);
		p.position.set(sx, 1.78, 0);
		p.rotation.z = sx > 0 ? -.38 : .38;
		g.add(p);
		const trim = new Mesh(new BoxGeometry(.12, .08, .48), cyanSoft);
		trim.position.set(sx * 1.12, 1.86, 0);
		trim.rotation.z = sx > 0 ? -.38 : .38;
		g.add(trim);
	};
	mkPauldron(-.52);
	mkPauldron(.52);
	const cape = new Mesh(new PlaneGeometry(.86, 1.28), cloth);
	cape.position.set(0, 1.32, -.36);
	cape.rotation.y = Math.PI;
	g.add(cape);
	const leftLeg = new Group();
	leftLeg.position.set(-.22, .8, 0);
	const ll = new Mesh(new BoxGeometry(.24, .74, .26), dark);
	ll.position.y = -.36;
	leftLeg.add(ll);
	const lb = new Mesh(new BoxGeometry(.28, .16, .4), plate);
	lb.position.set(0, -.72, .06);
	leftLeg.add(lb);
	g.add(leftLeg);
	const rightLeg = new Group();
	rightLeg.position.set(.22, .8, 0);
	const rl = new Mesh(new BoxGeometry(.24, .74, .26), dark);
	rl.position.y = -.36;
	rightLeg.add(rl);
	const rb = new Mesh(new BoxGeometry(.28, .16, .4), plate);
	rb.position.set(0, -.72, .06);
	rightLeg.add(rb);
	g.add(rightLeg);
	const rightArm = new Group();
	rightArm.position.set(.56, 1.62, 0);
	const ra = new Mesh(new BoxGeometry(.22, .74, .22), plate);
	ra.position.y = -.28;
	rightArm.add(ra);
	const vambrace = new Mesh(new BoxGeometry(.26, .22, .26), goldMat(15778378, 6965776, .3));
	vambrace.position.y = -.52;
	rightArm.add(vambrace);
	const sword = new Group();
	sword.position.set(0, -.78, .14);
	const hilt = new Mesh(new CylinderGeometry(.055, .055, .34, 8), goldMat(15778378, 6965776, .3));
	hilt.rotation.x = Math.PI / 2;
	sword.add(hilt);
	const pommel = new Mesh(new OctahedronGeometry(.1, 0), cyan);
	pommel.position.z = -.22;
	sword.add(pommel);
	const guard = new Mesh(new BoxGeometry(.56, .12, .14), plate);
	sword.add(guard);
	const blade = new Mesh(new BoxGeometry(.14, .07, 2.5), cyan);
	blade.position.z = 1.28;
	sword.add(blade);
	const fuller = new Mesh(new BoxGeometry(.045, .09, 2.2), goldMat(15778378, 6965776, .45));
	fuller.position.z = 1.22;
	sword.add(fuller);
	const tip = new Mesh(new ConeGeometry(.1, .36, 5), cyan);
	tip.rotation.x = Math.PI / 2;
	tip.position.z = 2.64;
	sword.add(tip);
	sword.visible = false;
	rightArm.add(sword);
	const bell = new Group();
	bell.position.set(0, -.78, .1);
	const bellBowl = new Mesh(new SphereGeometry(.34, 12, 10, 0, Math.PI * 2, 0, Math.PI * .7), goldMat(15778378, 6965776, .4));
	bellBowl.rotation.x = Math.PI;
	bell.add(bellBowl);
	const bellRim = new Mesh(new TorusGeometry(.3, .045, 8, 16), cyan);
	bellRim.rotation.x = Math.PI / 2;
	bellRim.position.y = -.22;
	bell.add(bellRim);
	const clapper = new Mesh(new SphereGeometry(.08, 8, 6), cyan);
	clapper.position.y = -.28;
	bell.add(clapper);
	const bellGrip = new Mesh(new CylinderGeometry(.04, .05, .28, 8), goldMat(15778378, 6965776, .3));
	bellGrip.position.y = .22;
	bell.add(bellGrip);
	bell.visible = false;
	rightArm.add(bell);
	const stave = new Group();
	stave.position.set(0, -.7, .12);
	const shaft = new Mesh(new CylinderGeometry(.045, .055, 2.15, 8), goldMat(13152384, 4861972, .22));
	shaft.rotation.x = Math.PI / 2;
	shaft.position.z = .72;
	stave.add(shaft);
	const staveGrip = new Mesh(new CylinderGeometry(.07, .07, .28, 8), goldMat(15778378, 6965776, .35));
	staveGrip.rotation.x = Math.PI / 2;
	stave.add(staveGrip);
	const staveTip = new Mesh(new OctahedronGeometry(.22, 0), cyan);
	staveTip.position.z = 1.82;
	stave.add(staveTip);
	const staveCollar = new Mesh(new TorusGeometry(.1, .03, 6, 12), cyan);
	staveCollar.position.z = 1.58;
	stave.add(staveCollar);
	stave.visible = false;
	rightArm.add(stave);
	const clawR = new Group();
	clawR.position.set(0, -.74, .18);
	for (let i = 0; i < 3; i++) {
		const nail = new Mesh(new ConeGeometry(.055, .46, 5), cyan);
		nail.rotation.x = Math.PI / 2;
		nail.position.set((i - 1) * .1, -.02, .26);
		clawR.add(nail);
	}
	const padR = new Mesh(new SphereGeometry(.13, 8, 6), plate);
	clawR.add(padR);
	rightArm.add(clawR);
	g.add(rightArm);
	const leftArm = new Group();
	leftArm.position.set(-.56, 1.62, 0);
	const la = new Mesh(new BoxGeometry(.22, .7, .22), plate);
	la.position.y = -.28;
	leftArm.add(la);
	const shield = new Group();
	shield.position.set(-.2, -.32, .1);
	const disc = new Mesh(new CylinderGeometry(.5, .54, .1, 8), plate);
	disc.rotation.z = Math.PI / 2;
	shield.add(disc);
	const boss = new Mesh(new OctahedronGeometry(.14, 0), cyan);
	boss.position.x = -.08;
	shield.add(boss);
	const shieldRim = new Mesh(new TorusGeometry(.5, .04, 6, 12), goldMat(15778378, 6965776, .35));
	shieldRim.rotation.z = Math.PI / 2;
	shield.add(shieldRim);
	shield.visible = false;
	leftArm.add(shield);
	const clawL = new Group();
	clawL.position.set(0, -.7, .16);
	for (let i = 0; i < 3; i++) {
		const nail = new Mesh(new ConeGeometry(.05, .4, 5), cyan);
		nail.rotation.x = Math.PI / 2;
		nail.position.set((i - 1) * .09, -.02, .22);
		clawL.add(nail);
	}
	const padL = new Mesh(new SphereGeometry(.12, 8, 6), plate);
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
	g.add(blobShadow(.86, .55));
	g.scale.setScalar(1.32);
	return g;
}
function addHpBar(g, y) {
	const bar = new Group();
	bar.position.y = y;
	const bg = new Mesh(new PlaneGeometry(.95, .1), new MeshBasicMaterial({
		color: 1313802,
		depthTest: false,
		transparent: true,
		opacity: .85
	}));
	const fg = new Mesh(new PlaneGeometry(.9, .06), new MeshBasicMaterial({
		color: 12864058,
		depthTest: false
	}));
	fg.position.z = .01;
	bar.add(bg);
	bar.add(fg);
	g.add(bar);
	g.userData.hpBar = bar;
	g.userData.hpFill = fg;
}
function makeEnemy(kind, elite) {
	const g = new Group();
	const bodyC = kind === "shard" ? 3828360 : kind === "hound" ? 6961704 : kind === "brute" ? 4860504 : 1716296;
	const glowC = kind === "heart" ? 16738874 : elite ? 15778378 : 8317170;
	const mat = new MeshStandardMaterial({
		color: bodyC,
		metalness: .35,
		roughness: .5,
		emissive: glowC,
		emissiveIntensity: elite || kind === "heart" ? .45 : .18
	});
	const glow = glowMat(glowC);
	const scale = kind === "shard" ? .78 : kind === "hound" ? 1.05 : kind === "brute" ? 1.55 : 2.2;
	if (kind === "shard") {
		const core = new Mesh(new OctahedronGeometry(.42, 0), mat);
		core.position.y = .55;
		core.castShadow = true;
		g.add(core);
		for (let i = 0; i < 4; i++) {
			const spike = new Mesh(new OctahedronGeometry(.16, 0), glow);
			const a = i / 4 * Math.PI * 2;
			spike.position.set(Math.cos(a) * .38, .62, Math.sin(a) * .38);
			spike.scale.set(.55, 1.4, .55);
			g.add(spike);
		}
	} else if (kind === "hound") {
		const body = new Mesh(new CapsuleGeometry(.32, .7, 4, 8), mat);
		body.rotation.z = Math.PI / 2;
		body.position.set(0, .42, .1);
		body.castShadow = true;
		g.add(body);
		const head = new Mesh(new SphereGeometry(.26, 8, 6), mat);
		head.position.set(0, .55, .55);
		g.add(head);
		const snout = new Mesh(new ConeGeometry(.12, .32, 5), mat);
		snout.rotation.x = Math.PI / 2;
		snout.position.set(0, .48, .82);
		g.add(snout);
		const tail = new Mesh(new ConeGeometry(.08, .5, 4), glow);
		tail.rotation.x = -Math.PI / 2;
		tail.position.set(0, .4, -.55);
		g.add(tail);
	} else if (kind === "brute") {
		const torso = new Mesh(new CapsuleGeometry(.48, .7, 4, 8), mat);
		torso.position.y = 1;
		torso.castShadow = true;
		g.add(torso);
		const helm = new Mesh(new SphereGeometry(.38, 8, 6), mat);
		helm.position.y = 1.62;
		g.add(helm);
		const hornL = new Mesh(new ConeGeometry(.08, .45, 5), glow);
		hornL.position.set(-.22, 1.95, 0);
		hornL.rotation.z = .4;
		g.add(hornL);
		const hornR = hornL.clone();
		hornR.position.x = .22;
		hornR.rotation.z = -.4;
		g.add(hornR);
		const maul = new Mesh(new BoxGeometry(.28, .28, .9), glow);
		maul.position.set(.7, .85, .2);
		g.add(maul);
	} else {
		const core = new Mesh(new OctahedronGeometry(.7, 0), glow);
		core.position.y = 1.2;
		core.castShadow = true;
		g.add(core);
		const shell = new Mesh(new IcosahedronGeometry(.95, 0), mat);
		shell.position.y = 1.2;
		g.add(shell);
		const orbit = new Group();
		orbit.position.y = 1.2;
		for (let i = 0; i < 4; i++) {
			const s = new Mesh(new OctahedronGeometry(.22, 0), glow);
			const a = i / 4 * Math.PI * 2;
			s.position.set(Math.cos(a) * 1.35, Math.sin(a * 2) * .3, Math.sin(a) * 1.35);
			orbit.add(s);
		}
		g.add(orbit);
		g.userData.orbit = orbit;
		const eye = new Mesh(new SphereGeometry(.28, 8, 6), glow);
		eye.position.set(0, 1.7, .4);
		g.add(eye);
	}
	addHpBar(g, kind === "heart" ? 2.55 : kind === "brute" ? 2.15 : kind === "hound" ? 1.05 : 1.15);
	g.add(blobShadow(kind === "heart" ? 1.1 : kind === "brute" ? .7 : .48, .4));
	g.scale.setScalar(scale);
	return g;
}
function makePillar() {
	const g = new Group();
	const stone = goldMat(2893346, 1183244, .06);
	const cyan = glowMat(8317170);
	const plinth = new Mesh(new BoxGeometry(1.35, .42, 1.35), stone);
	plinth.position.y = .21;
	g.add(plinth);
	const shaft = new Mesh(new BoxGeometry(.72, 2.35, .72), stone);
	shaft.position.y = 1.5;
	shaft.rotation.y = .18;
	g.add(shaft);
	const cap = new Mesh(new BoxGeometry(.95, .28, .95), goldMat(9071154, 3811344, .2));
	cap.position.y = 2.72;
	g.add(cap);
	const shard = new Mesh(new OctahedronGeometry(.48, 0), cyan);
	shard.position.y = 3.35;
	shard.rotation.y = .4;
	shard.scale.set(.7, 1.55, .7);
	g.add(shard);
	const chip = new Mesh(new OctahedronGeometry(.22, 0), cyan);
	chip.position.set(.38, 3.05, .12);
	chip.rotation.z = .6;
	g.add(chip);
	g.add(blobShadow(.95, .35));
	return g;
}
function startSlash(canvas, onHud) {
	const mobile = (navigator.maxTouchPoints || 0) > 0 || window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const renderer = new WebGLRenderer({
		canvas,
		antialias: !mobile,
		powerPreference: "high-performance"
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 2));
	renderer.setClearColor(460300, 1);
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.shadowMap.enabled = !mobile;
	renderer.toneMapping = 4;
	renderer.toneMappingExposure = 1.38;
	renderer.shadowMap.type = 2;
	const scene = new Scene();
	scene.fog = new FogExp2(657424, .016);
	const camera = new PerspectiveCamera(mobile ? 34 : 32, 1, .35, 140);
	const CAM_XZ = mobile ? 6 : 6.6;
	const CAM_Y = mobile ? 7.2 : 7.8;
	const ZOOM_MIN = .7;
	const ZOOM_MAX = 2.5;
	const hemi = new HemisphereLight(6981808, 2757644, .95);
	scene.add(hemi);
	const sun = new DirectionalLight(16769712, 1.6);
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
	const rimLight = new DirectionalLight(5953774, .9);
	rimLight.position.set(-12, 8, -10);
	scene.add(rimLight);
	const cyanL = new PointLight(5163240, 22, 42, 1.8);
	cyanL.position.set(-6, 4, -4);
	scene.add(cyanL);
	const ember = new PointLight(16742970, 18, 34, 1.8);
	ember.position.set(8, 3, 6);
	scene.add(ember);
	const heroLight = new PointLight(16766112, 14, 10, 2);
	scene.add(heroLight);
	const bladeLight = new PointLight(8317170, 9, 7, 2);
	scene.add(bladeLight);
	const loader = new TextureLoader();
	const groundTex = loader.load(pub("slash/floor.jpg") + "?v=kiln3");
	groundTex.colorSpace = SRGBColorSpace;
	groundTex.wrapS = groundTex.wrapT = RepeatWrapping;
	groundTex.repeat.set(2.15, 2.15);
	const ground = new Mesh(new CircleGeometry(26, 48), new MeshStandardMaterial({
		map: groundTex,
		roughness: .86,
		metalness: .14,
		emissive: 16751168,
		emissiveMap: groundTex,
		emissiveIntensity: .32
	}));
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	scene.add(ground);
	const skyTex = loader.load(pub("slash/sky.jpg") + "?v=kiln3");
	skyTex.colorSpace = SRGBColorSpace;
	const sky = new Mesh(new SphereGeometry(70, 24, 16), new MeshBasicMaterial({
		map: skyTex,
		side: 1,
		fog: false,
		depthWrite: false
	}));
	scene.add(sky);
	const rim = new Mesh(new TorusGeometry(22.4, .38, 8, 48), goldMat(9071154, 3811344, .22));
	rim.rotation.x = Math.PI / 2;
	rim.position.y = .22;
	scene.add(rim);
	const pillars = [];
	for (const [x, z] of [
		[8, -6],
		[-9, 5],
		[5, -12],
		[-7, -9],
		[13, -8],
		[-13, 8],
		[-4, 13],
		[11, -3]
	]) {
		const p = makePillar();
		p.position.set(x, 0, z);
		scene.add(p);
		pillars.push({
			x,
			z,
			r: 1.15
		});
	}
	const pits = [];
	const pitStone = goldMat(1708558, 3807240, .22);
	for (const [x, z] of [
		[6, -6],
		[-7, 7],
		[10, 8],
		[-11, -5]
	]) {
		const lip = new Mesh(new TorusGeometry(1.08, .16, 6, 20), pitStone);
		lip.rotation.x = Math.PI / 2;
		lip.position.set(x, .08, z);
		scene.add(lip);
		const glow = new Mesh(new CircleGeometry(1.08, 18), new MeshBasicMaterial({
			color: 16738856,
			transparent: true,
			opacity: .7
		}));
		glow.rotation.x = -Math.PI / 2;
		glow.position.set(x, .03, z);
		scene.add(glow);
		pits.push(glow);
		const hot = new Mesh(new CircleGeometry(.42, 12), new MeshBasicMaterial({
			color: 16766112,
			transparent: true,
			opacity: .85
		}));
		hot.rotation.x = -Math.PI / 2;
		hot.position.set(x, .05, z);
		scene.add(hot);
	}
	const ruinMat = goldMat(2761244, 1708040, .1);
	for (let i = 0; i < 16; i++) {
		const a = i / 16 * Math.PI * 2 + .1;
		const h = 1.35 + i % 4 * .55;
		const wall = new Mesh(new BoxGeometry(3.1, h, .52), ruinMat);
		wall.position.set(Math.cos(a) * 22.95, h * .5, Math.sin(a) * 22.95);
		wall.rotation.y = -a;
		scene.add(wall);
	}
	const brandRing = new Mesh(new RingGeometry(3.05, 3.32, 48), new MeshBasicMaterial({
		color: 12884554,
		transparent: true,
		opacity: .22,
		side: 2
	}));
	brandRing.rotation.x = -Math.PI / 2;
	brandRing.position.y = .04;
	scene.add(brandRing);
	const brandInner = new Mesh(new RingGeometry(1.48, 1.66, 40), new MeshBasicMaterial({
		color: 5953774,
		transparent: true,
		opacity: .18,
		side: 2
	}));
	brandInner.rotation.x = -Math.PI / 2;
	brandInner.position.y = .045;
	scene.add(brandInner);
	const moteGeo = new SphereGeometry(.045, 5, 4);
	const moteMat = new MeshBasicMaterial({
		color: 16747080,
		transparent: true,
		opacity: .78
	});
	const motes = [];
	const moteN = mobile ? 14 : 22;
	for (let i = 0; i < moteN; i++) {
		const m = new Mesh(moteGeo, moteMat);
		const a = i / moteN * Math.PI * 2;
		const r = 3.6 + i % 7 * 2.15;
		const ox = Math.cos(a) * r;
		const oz = Math.sin(a) * r;
		m.position.set(ox, .8, oz);
		scene.add(m);
		motes.push({
			mesh: m,
			ox,
			oz,
			ph: i * .7
		});
	}
	const heroRing = new Mesh(new RingGeometry(.68, .84, 28), new MeshBasicMaterial({
		color: 15778378,
		transparent: true,
		opacity: .55,
		side: 2
	}));
	heroRing.rotation.x = -Math.PI / 2;
	heroRing.position.y = .05;
	scene.add(heroRing);
	const floatCrystalMat = new MeshStandardMaterial({
		color: 8317170,
		emissive: 2792368,
		emissiveIntensity: .7,
		metalness: .4,
		roughness: .25
	});
	const crystals = [];
	for (let i = 0; i < 6; i++) {
		const c = new Mesh(new OctahedronGeometry(.28 + i % 3 * .08, 0), floatCrystalMat);
		const a = i / 6 * Math.PI * 2;
		c.position.set(Math.cos(a) * 16, 2.2 + i % 2 * .8, Math.sin(a) * 16);
		scene.add(c);
		crystals.push(c);
	}
	const hero = makeHero();
	scene.add(hero);
	const rightArm = hero.userData.rightArm;
	const leftArm = hero.userData.leftArm;
	const leftLeg = hero.userData.leftLeg;
	const rightLeg = hero.userData.rightLeg;
	const cape = hero.userData.cape;
	const heroCrystal = hero.userData.crystal;
	const heroHead = hero.userData.head;
	const heroTail = hero.userData.tail;
	const gearSword = hero.userData.sword;
	const gearShield = hero.userData.shield;
	const gearBell = hero.userData.bell;
	const gearStave = hero.userData.stave;
	const gearClawR = hero.userData.clawR;
	const gearClawL = hero.userData.clawL;
	function applyGear() {
		const fang = classId === "fang";
		const arc = classId === "arc";
		gearSword.visible = false;
		gearShield.visible = false;
		gearBell.visible = false;
		gearStave.visible = arc;
		gearClawR.visible = fang;
		gearClawL.visible = fang;
		const col = arc ? 8317170 : classId === "blitz" ? 16769162 : 15778378;
		heroRing.material.color.setHex(col);
	}
	const destMark = new Mesh(new RingGeometry(.28, .42, 20), new MeshBasicMaterial({
		color: 8317170,
		transparent: true,
		opacity: 0,
		side: 2
	}));
	destMark.rotation.x = -Math.PI / 2;
	destMark.position.y = .08;
	scene.add(destMark);
	const whirlDisc = new Mesh(new TorusGeometry(1.7, .08, 6, 28), new MeshBasicMaterial({
		color: 8317170,
		transparent: true,
		opacity: 0
	}));
	whirlDisc.rotation.x = Math.PI / 2;
	whirlDisc.position.y = .9;
	scene.add(whirlDisc);
	const input = createInput(canvas);
	const audio = createAudio();
	const ray = new Raycaster();
	const pointer = new Vector2();
	const groundPlane = new Plane(new Vector3(0, 1, 0), 0);
	const hit = new Vector3();
	const camRight = new Vector3();
	const camFwd = new Vector3();
	const tmp = new Vector3();
	const proj = new Vector3();
	const camDesired = new Vector3();
	let camSnap = true;
	let zoom = 1;
	let pinchHint = false;
	const pins = /* @__PURE__ */ new Map();
	let pinchD = 0;
	let pinching = false;
	let mode = "title";
	let classId = loadClass();
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
	let toast = null;
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
	let dest = null;
	let stickX = 0;
	let stickY = 0;
	let cd = emptyCd();
	let novaKind = "maul";
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
	let spawnQ = [];
	let spawnWait = 0;
	let floaterId = 1;
	const prevKeys = /* @__PURE__ */ new Set();
	const enemies = [];
	const drops = [];
	const floaters = [];
	const sparkGeo = new SphereGeometry(.07, 5, 4);
	const sparkMatGold = new MeshBasicMaterial({ color: 16242026 });
	const sparkMatCyan = new MeshBasicMaterial({ color: 8317170 });
	const sparkMatEmber = new MeshBasicMaterial({ color: 16738874 });
	const sparks = [];
	for (let i = 0; i < 72; i++) {
		const m = new Mesh(sparkGeo, sparkMatGold);
		m.visible = false;
		scene.add(m);
		sparks.push({
			mesh: m,
			vx: 0,
			vy: 0,
			vz: 0,
			life: 0,
			on: false
		});
	}
	const hpMat = new MeshBasicMaterial({ color: 5163128 });
	const goldDropMat = new MeshBasicMaterial({ color: 15778378 });
	const shock = new Mesh(new RingGeometry(.4, .7, 24), new MeshBasicMaterial({
		color: 8317170,
		transparent: true,
		opacity: 0,
		side: 2
	}));
	shock.rotation.x = -Math.PI / 2;
	shock.position.y = .12;
	scene.add(shock);
	const howlRing = shock.clone();
	howlRing.material.color.setHex(15778378);
	scene.add(howlRing);
	const auraRing = shock.clone();
	auraRing.material.color.setHex(8317170);
	auraRing.scale.setScalar(2.4);
	scene.add(auraRing);
	const threadBeam = new Mesh(new BoxGeometry(.12, .12, 7.2), new MeshBasicMaterial({
		color: 8317170,
		transparent: true,
		opacity: 0
	}));
	threadBeam.position.y = 1.15;
	scene.add(threadBeam);
	const shotGeo = new OctahedronGeometry(.16, 0);
	const shotMat = new MeshBasicMaterial({ color: 10417407 });
	const shots = [];
	for (let i = 0; i < 12; i++) {
		const m = new Mesh(shotGeo, shotMat);
		m.visible = false;
		scene.add(m);
		shots.push({
			mesh: m,
			x: 0,
			z: 0,
			vx: 0,
			vz: 0,
			life: 0,
			on: false
		});
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
			localStorage.setItem(SAVE, JSON.stringify({
				best: Math.max(loadBest(), wave),
				kills
			}));
		} catch {}
	}
	function size() {
		const w = canvas.clientWidth || window.innerWidth;
		const h = canvas.clientHeight || window.innerHeight;
		renderer.setSize(w, h, false);
		camera.aspect = w / Math.max(1, h);
		camera.updateProjectionMatrix();
	}
	size();
	function blocked(x, z, r) {
		if (Math.hypot(x, z) > ARENA - r) return true;
		for (const p of pillars) if (Math.hypot(x - p.x, z - p.z) < r + p.r) return true;
		return false;
	}
	function sparkBurst(x, y, z, n, color) {
		const mat = color === 16738874 ? sparkMatEmber : color === 8317170 ? sparkMatCyan : sparkMatGold;
		let left = mobile ? Math.min(n, 8) : n;
		for (const s of sparks) {
			if (left <= 0) break;
			if (s.on) continue;
			s.on = true;
			s.mesh.material = mat;
			s.mesh.visible = true;
			s.mesh.position.set(x, y, z);
			s.vx = (Math.random() - .5) * 6;
			s.vy = 2 + Math.random() * 5;
			s.vz = (Math.random() - .5) * 6;
			s.life = .32 + Math.random() * .32;
			left -= 1;
		}
	}
	function say(line) {
		toast = line;
		toastAt = 2.2;
	}
	function pushDrop(x, z, kind) {
		const m = new Mesh(new SphereGeometry(kind === "hp" ? .22 : .16, 8, 6), kind === "hp" ? hpMat : goldDropMat);
		m.position.set(x, .4, z);
		scene.add(m);
		drops.push({
			mesh: m,
			x,
			z,
			kind,
			t: 14
		});
	}
	function addFloater(x, y, z, n, crit) {
		floaters.push({
			id: floaterId++,
			text: crit ? `${n}!` : String(n),
			wx: x,
			wy: y,
			wz: z,
			t: .85,
			crit
		});
		if (floaters.length > 18) floaters.shift();
	}
	function spawnEnemy(kind, elite = false) {
		const ang = Math.random() * Math.PI * 2;
		const dist = 19;
		let x = Math.cos(ang) * dist;
		let z = Math.sin(ang) * dist;
		if (Math.hypot(x - px, z - pz) < 6) {
			x = -x;
			z = -z;
		}
		const stats = kind === "shard" ? {
			hp: 28 + wave * 4,
			speed: 4.4,
			r: .55,
			dmg: 8,
			xp: 12,
			gold: 4
		} : kind === "hound" ? {
			hp: 55 + wave * 6,
			speed: 5.4,
			r: .7,
			dmg: 12,
			xp: 22,
			gold: 8
		} : kind === "brute" ? {
			hp: 170 + wave * 18,
			speed: 3.05,
			r: 1.1,
			dmg: 20,
			xp: 60,
			gold: 24
		} : {
			hp: 560 + wave * 24,
			speed: 2.55,
			r: 1.55,
			dmg: 24,
			xp: 220,
			gold: 90
		};
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
			slow: 0
		});
	}
	function beginWave() {
		wave += 1;
		spawnQ = [];
		spawnWait = .15;
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
		for (let i = 0; i < shards; i++) spawnQ.push({
			kind: "shard",
			elite: wave >= 4 && i === 0
		});
		for (let i = 0; i < hounds; i++) spawnQ.push({
			kind: "hound",
			elite: false
		});
		if (wave >= 3) spawnQ.push({
			kind: "brute",
			elite: true
		});
		say(`Wave ${wave}`);
	}
	function gainXp(n) {
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
	function hurtPlayer(n) {
		if (iFrames > 0 || mode !== "play") return;
		hp = Math.max(0, hp - n * (buffT > 0 ? .55 : 1));
		iFrames = .55;
		trauma = Math.min(1, trauma + .45);
		audio.talk();
		if (hp <= 0) {
			mode = "dead";
			saveBest();
			say("StarBoltSprint falls.");
		}
	}
	function hurtEnemy(e, dmg, kx, kz, quiet = false) {
		if (!e.alive) return;
		const mul = buffT > 0 ? 1.35 : 1;
		const crit = Math.random() < (buffT > 0 ? .22 : .12);
		const dealt = Math.round(dmg * mul * (.9 + level * .08) * (crit ? 1.85 : 1));
		e.hp -= dealt;
		e.flash = .12;
		e.x += kx;
		e.z += kz;
		if (!quiet) {
			trauma = Math.min(1, trauma + (crit ? .32 : .18));
			stopT = Math.max(stopT, crit ? .07 : .045);
			sparkBurst(e.x, 1.1, e.z, crit ? 10 : 6, e.elite ? 15778378 : crit ? 16738874 : 8317170);
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
			if (Math.random() < .5) pushDrop(e.x, e.z, Math.random() < .42 ? "hp" : "gold");
			sparkBurst(e.x, 1.2, e.z, 16, 16242026);
			audio.grow();
			if (e.kind === "heart") {
				mode = "win";
				saveBest();
				say("The Veil shatters.");
				audio.howl();
			}
		}
	}
	function foesIn(x, z, r, facingLock, cone = 0) {
		return enemies.filter((e) => {
			if (!e.alive) return false;
			if (Math.hypot(e.x - x, e.z - z) > r + e.r) return false;
			if (cone && facingLock != null) {
				let dlt = Math.atan2(e.x - x, e.z - z) - facingLock;
				while (dlt > Math.PI) dlt -= Math.PI * 2;
				while (dlt < -Math.PI) dlt += Math.PI * 2;
				if (Math.abs(dlt) > cone) return false;
			}
			return true;
		});
	}
	function nearest() {
		let best = null;
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
	function faceToward(x, z) {
		if (Math.hypot(x - px, z - pz) > .05) facing = Math.atan2(x - px, z - pz);
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
	function skillCost(id) {
		return kit().skills.find((s) => s.id === id)?.cost ?? 0;
	}
	function pay(id) {
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
			s.x = px + fx * .9;
			s.z = pz + fz * .9;
			s.vx = fx * 22;
			s.vz = fz * 22;
			s.life = .95;
			s.mesh.position.set(s.x, 1.18, s.z);
			break;
		}
	}
	function dashStrike() {
		const n = nearest();
		if (n) faceToward(n.x, n.z);
		const fx = Math.sin(facing);
		const fz = Math.cos(facing);
		const mom = lastSpd + fury * .045;
		const dist = 2.6 + clamp(mom * .2, 0, 3.4);
		const dmg = 12 + mom * 4.4;
		const steps = 7;
		for (let i = 1; i <= steps; i++) {
			const nx = px + fx * (dist / steps);
			const nz = pz + fz * (dist / steps);
			if (!blocked(nx, nz, .48)) {
				px = nx;
				pz = nz;
			}
		}
		sparkBurst(px, .55, pz, 10, 16769162);
		destMark.position.set(px + fx * .4, .08, pz + fz * .4);
		for (const e of foesIn(px - fx * dist * .45, pz - fz * dist * .45, dist * .55 + 1.2, facing, 1.05)) hurtEnemy(e, dmg, fx * 1.05, fz * 1.05);
		iFrames = Math.max(iFrames, .14);
		strikeT = .2;
		fury = Math.min(FURY_MAX, fury + 10 + lastSpd * 1.5);
	}
	function cast(id) {
		if (mode !== "play") return;
		audio.unlock();
		if (id === "bite") {
			if (!pay("bite")) return;
			const n = nearest();
			if (n) faceToward(n.x, n.z);
			strikeT = .28;
			fury = Math.min(FURY_MAX, fury + 16);
			const fx = Math.sin(facing);
			const fz = Math.cos(facing);
			let fed = 0;
			for (const e of foesIn(px + fx * 1.15, pz + fz * 1.15, 1.7, facing, .95)) {
				hurtEnemy(e, 28, fx * .7, fz * .7);
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
			strikeT = .22;
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
			whirlDisc.material.color.setHex(16769162);
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
			slamT = .5;
			audio.kiln();
			return;
		}
		if (id === "crash") {
			if (!pay("crash")) return;
			novaKind = "crash";
			slamT = .28;
			audio.kiln();
			return;
		}
		if (id === "storm") {
			if (!pay("storm")) return;
			novaKind = "storm";
			slamT = .58;
			audio.kiln();
			return;
		}
		if (id === "howl") {
			if (!pay("howl")) return;
			howlT = .55;
			buffT = 6.5;
			howlRing.position.set(px, .12, pz);
			howlRing.scale.setScalar(1);
			howlRing.material.color.setHex(15778378);
			howlRing.material.opacity = .9;
			for (const e of foesIn(px, pz, 4.4)) {
				const dx = e.x - px;
				const dz = e.z - pz;
				const m = Math.hypot(dx, dz) || 1;
				hurtEnemy(e, 20, dx / m * 1.5, dz / m * 1.5);
			}
			audio.howl();
			say("Howl of the pack.");
		}
	}
	function setClass(id) {
		classId = id;
		try {
			localStorage.setItem(CLASS_SAVE, id);
		} catch {}
		applyGear();
		emitHud();
	}
	function pressed(code) {
		return input.keys.has(code) && !prevKeys.has(code);
	}
	function setPointer(ev) {
		const rect = canvas.getBoundingClientRect();
		pointer.x = (ev.clientX - rect.left) / rect.width * 2 - 1;
		pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
	}
	function pinchSpan() {
		const a = [...pins.values()];
		if (a.length < 2) return 0;
		return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
	}
	function onPointer(ev) {
		if (mode !== "play") return;
		if (ev.target?.closest?.(".slash-hud, .slash-gate")) return;
		pins.set(ev.pointerId, {
			x: ev.clientX,
			y: ev.clientY
		});
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
		dest = {
			x: p.x,
			z: p.z
		};
	}
	function onPointerMove(ev) {
		if (pins.has(ev.pointerId)) pins.set(ev.pointerId, {
			x: ev.clientX,
			y: ev.clientY
		});
		if (pinching && pins.size >= 2) {
			const d = pinchSpan();
			if (pinchD > 12 && d > 12) zoom = clamp(zoom * (d / pinchD), ZOOM_MIN, ZOOM_MAX);
			pinchD = d;
			return;
		}
		if (!holdAtk || mode !== "play") return;
		setPointer(ev);
	}
	function onPointerUp(ev) {
		pins.delete(ev.pointerId);
		if (pins.size < 2) pinching = false;
		if (pins.size === 0) holdAtk = false;
	}
	function onWheel(ev) {
		if (mode !== "play") return;
		if (ev.target?.closest?.("button, .slash-stick, .slash-gate")) return;
		ev.preventDefault();
		zoom = clamp(zoom * Math.exp(ev.deltaY * .0015), ZOOM_MIN, ZOOM_MAX);
	}
	canvas.addEventListener("pointerdown", onPointer);
	window.addEventListener("pointermove", onPointerMove);
	window.addEventListener("pointerup", onPointerUp);
	window.addEventListener("pointercancel", onPointerUp);
	window.addEventListener("wheel", onWheel, { passive: false });
	function emitHud() {
		const w = canvas.clientWidth || 1;
		const h = canvas.clientHeight || 1;
		const projected = [];
		for (const f of floaters) {
			proj.set(f.wx, f.wy, f.wz).project(camera);
			projected.push({
				id: f.id,
				text: f.text,
				x: (proj.x * .5 + .5) * w,
				y: (-proj.y * .5 + .5) * h,
				crit: f.crit
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
				ready: clamp(1 - cd[s.id] / CD[s.id], 0, 1)
			}))
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
	function tick(now) {
		if (!running) return;
		const dt = Math.min(.05, (now - last) / 1e3);
		last = now;
		input.beginFrame();
		sky.rotation.y += dt * .012;
		for (let i = 0; i < crystals.length; i++) {
			const c = crystals[i];
			c.position.y = 2.1 + Math.sin(now * .0014 + i) * .45;
			c.rotation.y += dt * .6;
		}
		for (const pit of pits) pit.material.opacity = .52 + Math.sin(now * .004) * .18;
		for (const m of motes) {
			m.mesh.position.y = .5 + Math.abs(Math.sin(now * 9e-4 + m.ph)) * 2.5;
			m.mesh.position.x = m.ox + Math.sin(now * 4e-4 + m.ph) * .55;
			m.mesh.position.z = m.oz + Math.cos(now * 35e-5 + m.ph) * .55;
		}
		if (mode === "title") {
			const t = reduce ? .4 : now * 18e-5;
			camera.position.set(Math.sin(t) * 8.6, 6.4, Math.cos(t) * 8.6);
			camera.lookAt(0, 1.55, 0);
			hero.rotation.y += dt * (reduce ? .12 : .32);
			heroCrystal.rotation.y += dt * 1.6;
			heroHead.rotation.y = Math.sin(now * .002) * .08;
			heroTail.rotation.z = Math.sin(now * .01) * .22;
			cape.rotation.x = .12 + Math.sin(now * .002) * .08;
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
			if (input.keys.has("Minus") || input.keys.has("NumpadSubtract")) zoom = clamp(zoom + dt * .9, ZOOM_MIN, ZOOM_MAX);
			if (input.keys.has("Equal") || input.keys.has("NumpadAdd")) zoom = clamp(zoom - dt * .9, ZOOM_MIN, ZOOM_MAX);
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
			if (camRight.lengthSq() > 1e-4) camRight.normalize();
			camFwd.set(0, 0, -1).applyQuaternion(camera.quaternion);
			camFwd.y = 0;
			if (camFwd.lengthSq() > 1e-4) camFwd.normalize();
			if (holdAtk) {
				const p = aimFromPointer();
				const n = nearest();
				const reach = classId === "arc" ? 10.5 : classId === "blitz" ? 6.4 : 2.4;
				if (n && Math.hypot(n.x - px, n.z - pz) < reach) {
					dest = null;
					faceToward(n.x, n.z);
					if (cd[primary()] <= 0) cast(primary());
				} else if (p) dest = {
					x: p.x,
					z: p.z
				};
			}
			let vx = 0;
			let vz = 0;
			if (mag > .08) {
				dest = null;
				vx = camRight.x * mx + camFwd.x * my;
				vz = camRight.z * mx + camFwd.z * my;
			} else if (dest) {
				const dx = dest.x - px;
				const dz = dest.z - pz;
				const d = Math.hypot(dx, dz);
				if (d < .35) dest = null;
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
				if (!blocked(nx, pz, .62)) px = nx;
				if (!blocked(px, nz, .62)) pz = nz;
				if (whirlT <= 0) facing = Math.atan2(vx, vz);
				lastSpd = spd;
				walkPhase += dt * spd * 2.4;
			} else walkPhase *= Math.max(0, 1 - dt * 8);
			destMark.visible = !!dest;
			if (dest) {
				destMark.position.set(dest.x, .08, dest.z);
				destMark.material.opacity = .55 + Math.sin(now * .01) * .25;
				destMark.scale.setScalar(1 + Math.sin(now * .008) * .12);
			}
			for (const k of Object.keys(CD)) cd[k] = Math.max(0, cd[k] - dt);
			buffT = Math.max(0, buffT - dt);
			iFrames = Math.max(0, iFrames - dt);
			if (classId === "blitz") {
				if (lastSpd > 1.2) fury = Math.min(FURY_MAX, fury + dt * 18);
				else fury = Math.max(0, fury - dt * 10);
			} else if (classId === "arc") fury = Math.min(FURY_MAX, fury + dt * 1.9);
			else fury = Math.min(FURY_MAX, fury + dt * 2.4);
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
					spawnWait = .32;
				}
			}
			if (whirlT > 0) {
				whirlT -= dt;
				hero.rotation.y += dt * 18;
				whirlDisc.position.set(px, .9, pz);
				whirlDisc.rotation.z += dt * 14;
				whirlDisc.material.opacity = .7;
				if (Math.floor(now / 90) !== Math.floor((now - dt * 1e3) / 90)) for (const e of foesIn(px, pz, 2.2)) {
					const dx = e.x - px;
					const dz = e.z - pz;
					const m = Math.hypot(dx, dz) || 1;
					hurtEnemy(e, 10, dx / m * .28, dz / m * .28);
				}
			} else whirlDisc.material.opacity = Math.max(0, whirlDisc.material.opacity - dt * 3);
			if (wakeT > 0 && whirlT <= 0) {
				wakeT -= dt;
				whirlDisc.position.set(px, .38, pz);
				whirlDisc.scale.setScalar(.72);
				whirlDisc.rotation.z += dt * 8;
				whirlDisc.material.color.setHex(16769162);
				whirlDisc.material.opacity = .62;
				if (lastSpd > 1 && Math.floor(now / 80) !== Math.floor((now - dt * 1e3) / 80)) for (const e of foesIn(px, pz, 1.9)) {
					const dx = e.x - px;
					const dz = e.z - pz;
					const m = Math.hypot(dx, dz) || 1;
					hurtEnemy(e, 7 + lastSpd * .85, dx / m * .2, dz / m * .2, true);
				}
			} else if (whirlT <= 0) whirlDisc.scale.setScalar(1);
			if (auraT > 0) {
				auraT -= dt;
				auraRing.position.set(px, .1, pz);
				auraRing.scale.setScalar(2.35);
				auraRing.material.opacity = .42 + Math.sin(now * .012) * .12;
				if (Math.floor(now / 220) !== Math.floor((now - dt * 1e3) / 220)) for (const e of foesIn(px, pz, 2.75)) hurtEnemy(e, 9, 0, 0, true);
			} else auraRing.material.opacity = Math.max(0, auraRing.material.opacity - dt * 2.2);
			if (slamT > 0) {
				slamT -= dt;
				if (slamT <= 0) {
					shock.position.set(px, .12, pz);
					shock.scale.setScalar(1);
					const crash = novaKind === "crash";
					const storm = novaKind === "storm";
					shock.material.color.setHex(storm ? 8317170 : crash ? 16769162 : 15778378);
					shock.material.opacity = .9;
					const r = crash ? 5.1 : storm ? 5.7 : 4.5;
					const dmg = crash ? 16 + fury * .58 : storm ? 50 : 54;
					for (const e of foesIn(px, pz, r)) {
						const dx = e.x - px;
						const dz = e.z - pz;
						const m = Math.hypot(dx, dz) || 1;
						hurtEnemy(e, dmg, dx / m * (crash ? 2.1 : 1.9), dz / m * (crash ? 2.1 : 1.9));
					}
					if (crash) fury = Math.max(0, fury * .18);
					sparkBurst(px, .4, pz, 24, storm ? 8317170 : 15778378);
					trauma = Math.min(1, trauma + .72);
					stopT = .09;
				}
			}
			if (howlT > 0) howlT -= dt;
			if (strikeT > 0) {
				strikeT -= dt;
				rightArm.rotation.x = -Math.sin((1 - strikeT / .28) * Math.PI) * 1.45;
				leftArm.rotation.x = Math.sin((1 - strikeT / .28) * Math.PI) * .35;
			} else {
				rightArm.rotation.x = -.28;
				leftArm.rotation.x = .08 + Math.sin(walkPhase) * .35 * (lastSpd > .2 ? 1 : 0);
			}
			const step = Math.sin(walkPhase) * .55 * (lastSpd > .2 ? 1 : 0);
			leftLeg.rotation.x = step;
			rightLeg.rotation.x = -step;
			cape.rotation.x = .16 + Math.sin(now * .003) * .06 + (lastSpd > .2 ? .12 : 0);
			heroCrystal.rotation.y += dt * 2.2;
			heroHead.rotation.y = Math.sin(now * .0022) * .1;
			heroTail.rotation.z = Math.sin(now * .01) * .28;
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
					if (od > .05 && od < 1.7) {
						sx += ox / od;
						sz += oz / od;
					}
				}
				const seek = e.kind === "heart" ? .68 : 1;
				let vx2 = dx / d * seek + sx * .55;
				let vz2 = dz / d * seek + sz * .55;
				const nm = Math.hypot(vx2, vz2) || 1;
				const stepE = e.speed * (e.slow > 0 ? .42 : 1) * dt;
				let nx = e.x + vx2 / nm * stepE;
				let nz = e.z + vz2 / nm * stepE;
				if (!blocked(nx, e.z, e.r * .7)) e.x = nx;
				if (!blocked(e.x, nz, e.r * .7)) e.z = nz;
				const bob = e.kind === "shard" ? Math.sin(now * .006 + e.x) * .12 : e.flash > 0 ? .08 : 0;
				e.mesh.position.set(e.x, bob, e.z);
				e.mesh.lookAt(px, .8, pz);
				const orbit = e.mesh.userData.orbit;
				if (orbit) orbit.rotation.y += dt * 1.4;
				const fill = e.mesh.userData.hpFill;
				const bar = e.mesh.userData.hpBar;
				if (fill) fill.scale.x = Math.max(.04, e.hp / e.hpMax);
				if (bar) bar.quaternion.copy(camera.quaternion);
				e.mesh.traverse((c) => {
					const mat = c.material;
					if (mat?.emissive && mat !== floatCrystalMat) mat.emissiveIntensity = e.flash > 0 ? 1.45 : e.elite || e.kind === "heart" ? .5 : .2;
				});
				if (d < e.r + .72 && e.hitCd <= 0) {
					hurtPlayer(e.dmg);
					e.hitCd = .85;
				}
			}
			const heart = enemies.find((e) => e.kind === "heart" && e.alive);
			if (heart && mode === "play") {
				heartPulse += dt;
				if (heartPulse > 4.1 && heartTele <= 0) {
					heartTele = .55;
					heartPulse = 0;
				}
				if (heartTele > 0) {
					heartTele -= dt;
					heart.mesh.scale.setScalar(2.15 + (.55 - heartTele) * .35);
					if (heartTele <= 0) {
						heart.mesh.scale.setScalar(2.15);
						shock.position.set(heart.x, .12, heart.z);
						shock.scale.setScalar(1);
						shock.material.color.setHex(16738874);
						shock.material.opacity = .85;
						if (Math.hypot(heart.x - px, heart.z - pz) < 6.2) hurtPlayer(16);
						sparkBurst(heart.x, 1.4, heart.z, 18, 16738874);
						trauma = Math.min(1, trauma + .5);
						if (!heartSummoned && heart.hp < heart.hpMax * .5) {
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
					const pull = clamp((3.6 - dist) * 3.2 * dt, 0, .4);
					const inv = dist || 1;
					d.x += (px - d.x) / inv * pull * 8;
					d.z += (pz - d.z) / inv * pull * 8;
				}
				d.mesh.position.set(d.x, .35 + Math.sin(now * .006 + i) * .1, d.z);
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
		hero.position.set(px, slamT > .25 ? 1.45 * (slamT - .25) : 0, pz);
		if (whirlT <= 0) hero.rotation.y = facing;
		hero.visible = iFrames <= 0 || Math.floor(now / 70) % 2 === 0;
		shock.scale.multiplyScalar(1 + dt * 6);
		const sm = shock.material;
		sm.opacity = Math.max(0, sm.opacity - dt * 1.55);
		if (sm.opacity <= 0) sm.color.setHex(8317170);
		howlRing.scale.multiplyScalar(1 + dt * 5.5);
		howlRing.material.opacity = Math.max(0, howlRing.material.opacity - dt * 1.4);
		threadBeam.material.opacity = Math.max(0, threadBeam.material.opacity - dt * 2.4);
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
				if (Math.hypot(e.x - s.x, e.z - s.z) < e.r + .28) {
					const m = Math.hypot(s.vx, s.vz) || 1;
					hurtEnemy(e, 18, s.vx / m * .45, s.vz / m * .45);
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
		} else camera.position.lerp(camDesired, 1 - Math.exp(-8 * dt));
		tmp.set(px, 1.72, pz);
		camera.lookAt(tmp);
		if (shake > .01) {
			camera.position.x += (Math.random() - .5) * shake * 1.15;
			camera.position.y += (Math.random() - .5) * shake * .65;
		}
		heroLight.position.set(px, 2.55, pz);
		heroLight.intensity = buffT > 0 ? 22 : 16;
		bladeLight.position.set(px + Math.sin(facing) * 1.25, 1.65, pz + Math.cos(facing) * 1.25);
		bladeLight.intensity = whirlT > 0 ? 18 : strikeT > 0 ? 14 : 8;
		sun.position.set(px + 12, 20, pz + 7);
		sun.target.position.set(px, 0, pz);
		heroRing.position.set(px, .05, pz);
		heroRing.material.opacity = .42 + Math.sin(now * .006) * .14;
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
	if (new URLSearchParams(location.search).has("qa")) window.__controlsTest = {
		getYaw: () => facing,
		getSpeed: () => lastSpd,
		getZoom: () => zoom,
		setZoom: (z) => {
			zoom = clamp(z, ZOOM_MIN, ZOOM_MAX);
		},
		setKeys: (codes) => {
			input.keys.clear();
			for (const c of codes) input.keys.add(c);
		}
	};
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
		audio
	};
}
//#endregion
export { SLASH_CLASSES, startSlash };
