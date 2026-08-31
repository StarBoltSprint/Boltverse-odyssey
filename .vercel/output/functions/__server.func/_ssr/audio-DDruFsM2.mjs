//#region node_modules/.nitro/vite/services/ssr/assets/audio-DDruFsM2.js
var empty = () => ({
	moveX: 0,
	moveY: 0,
	lookX: 0,
	lookY: 0,
	howl: false,
	talk: false,
	sprint: false,
	pause: false
});
function radial(x, y, dz = .14) {
	const m = Math.hypot(x, y);
	if (m < dz) return {
		x: 0,
		y: 0
	};
	const scale = (m - dz) / (1 - dz) / m;
	const nx = x * scale;
	const ny = y * scale;
	const mag = Math.hypot(nx, ny);
	if (mag > 1) return {
		x: nx / mag,
		y: ny / mag
	};
	return {
		x: nx,
		y: ny
	};
}
function createInput(target) {
	const keys = /* @__PURE__ */ new Set();
	const stickMove = {
		x: 0,
		y: 0
	};
	const stickLook = {
		x: 0,
		y: 0
	};
	let howlBtn = false;
	let talkBtn = false;
	let eyeBtn = false;
	const prev = {
		talk: false,
		pause: false,
		howl: false,
		eye: false
	};
	const actions = empty();
	const justPressed = {
		talk: false,
		pause: false,
		howl: false,
		eye: false
	};
	const GAME_KEYS = /* @__PURE__ */ new Set([
		"KeyW",
		"KeyA",
		"KeyS",
		"KeyD",
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"Space",
		"ShiftLeft",
		"ShiftRight",
		"KeyE",
		"KeyF",
		"KeyH",
		"KeyT",
		"KeyI",
		"Escape",
		"KeyP",
		"KeyM",
		"KeyL",
		"KeyJ",
		"KeyK",
		"KeyQ",
		"KeyU",
		"KeyO",
		"KeyR",
		"KeyG",
		"KeyB",
		"KeyN",
		"KeyC",
		"KeyV",
		"KeyX",
		"KeyZ",
		"Digit1",
		"Digit2",
		"Digit3",
		"Digit4",
		"Digit5",
		"Digit6",
		"Digit7",
		"Digit8",
		"Digit9",
		"Digit0",
		"Minus",
		"Equal",
		"BracketLeft",
		"BracketRight",
		"Backslash",
		"Semicolon",
		"Quote",
		"Comma",
		"Period",
		"KeyY",
		"Tab"
	]);
	const onKeyDown = (e) => {
		if (e.repeat && (e.code === "Space" || e.code === "KeyH" || e.code === "KeyP" || e.code === "Escape" || e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "KeyW" || e.code === "KeyA" || e.code === "KeyS" || e.code === "KeyD" || e.code === "KeyE" || e.code === "KeyF" || e.code === "KeyT" || e.code === "ShiftLeft" || e.code === "ShiftRight" || e.code === "KeyM" || e.code === "KeyL" || e.code === "KeyJ" || e.code === "Tab" || e.code === "KeyI" || e.code === "KeyK" || e.code === "KeyQ" || e.code === "KeyU" || e.code === "KeyO" || e.code === "KeyR" || e.code === "KeyG" || e.code === "KeyB" || e.code === "KeyN" || e.code === "KeyC" || e.code === "KeyV" || e.code === "KeyX" || e.code === "KeyZ" || e.code === "Digit1" || e.code === "Digit2" || e.code === "Digit3" || e.code === "Digit4" || e.code === "Digit5" || e.code === "Digit6" || e.code === "Digit7" || e.code === "Digit8" || e.code === "Digit9" || e.code === "Digit0" || e.code === "Minus" || e.code === "Equal" || e.code === "BracketLeft" || e.code === "BracketRight" || e.code === "Backslash" || e.code === "Semicolon" || e.code === "Quote" || e.code === "Comma" || e.code === "Period" || e.code === "KeyY")) {
			e.preventDefault();
			return;
		}
		keys.add(e.code);
		if (GAME_KEYS.has(e.code)) e.preventDefault();
	};
	const onKeyUp = (e) => {
		keys.delete(e.code);
	};
	const clearKeys = () => keys.clear();
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("blur", clearKeys);
	const visHide = () => {
		if (document.hidden) clearKeys();
	};
	document.addEventListener("visibilitychange", visHide);
	window.addEventListener("pagehide", clearKeys);
	window.addEventListener("pageshow", clearKeys);
	window.addEventListener("offline", clearKeys);
	return {
		actions,
		justPressed,
		keys,
		setMoveStick(x, y) {
			const r = radial(x, y);
			stickMove.x = r.x;
			stickMove.y = r.y;
		},
		setLookStick(x, y) {
			const r = radial(x, y, .08);
			stickLook.x = r.x;
			stickLook.y = r.y;
		},
		setHowl(v) {
			howlBtn = v;
		},
		setTalkHeld(v) {
			talkBtn = v;
		},
		setEye() {
			eyeBtn = true;
		},
		beginFrame() {
			let mx = stickMove.x;
			let my = stickMove.y;
			if (keys.has("KeyA")) mx -= 1;
			if (keys.has("KeyD")) mx += 1;
			if (keys.has("KeyW")) my += 1;
			if (keys.has("KeyS")) my -= 1;
			const mv = radial(mx, my, .02);
			actions.moveX = mv.x;
			actions.moveY = mv.y;
			let lx = stickLook.x;
			let ly = stickLook.y;
			if (keys.has("ArrowLeft")) lx -= 1;
			if (keys.has("ArrowRight")) lx += 1;
			if (keys.has("ArrowUp")) ly += 1;
			if (keys.has("ArrowDown")) ly -= 1;
			const lk = radial(lx, ly, .02);
			actions.lookX = lk.x;
			actions.lookY = lk.y;
			actions.sprint = keys.has("ShiftLeft") || keys.has("ShiftRight") || Math.hypot(mv.x, mv.y) > .92;
			actions.howl = howlBtn || keys.has("Space") || keys.has("KeyH");
			actions.talk = talkBtn || keys.has("KeyE") || keys.has("KeyF") || keys.has("KeyT");
			actions.pause = keys.has("Escape") || keys.has("KeyP");
			const eyeHeld = eyeBtn || keys.has("KeyY");
			justPressed.talk = actions.talk && !prev.talk;
			justPressed.pause = actions.pause && !prev.pause;
			justPressed.howl = actions.howl && !prev.howl;
			justPressed.eye = eyeHeld && !prev.eye;
			prev.talk = actions.talk;
			prev.pause = actions.pause;
			prev.howl = actions.howl;
			prev.eye = eyeHeld;
			eyeBtn = false;
		},
		dispose() {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("blur", clearKeys);
			document.removeEventListener("visibilitychange", visHide);
			window.removeEventListener("pagehide", clearKeys);
			window.removeEventListener("pageshow", clearKeys);
			window.removeEventListener("offline", clearKeys);
		}
	};
}
function createAudio() {
	let ctx = null;
	let muted = false;
	let lastFoot = 0;
	let blocked = false;
	let drone = null;
	function Ctor() {
		const w = window;
		return w.AudioContext || w.webkitAudioContext || null;
	}
	function ac() {
		if (blocked) return null;
		if (ctx && ctx.state === "closed") ctx = null;
		if (ctx) return ctx;
		try {
			const C = Ctor();
			if (!C) {
				blocked = true;
				return null;
			}
			ctx = new C();
			return ctx;
		} catch {
			blocked = true;
			ctx = null;
			return null;
		}
	}
	function play(fn) {
		if (muted) return;
		try {
			const c = ac();
			if (!c) return;
			if (c.state === "suspended") c.resume().catch(() => {});
			fn(c);
		} catch {}
	}
	function voice(c, spec) {
		const type = spec.type ?? "sine";
		const gain = spec.gain ?? .08;
		const attack = spec.attack ?? .02;
		const delay = spec.delay ?? 0;
		const t0 = c.currentTime + delay;
		const o = c.createOscillator();
		const g = c.createGain();
		o.type = type;
		o.frequency.setValueAtTime(spec.freq, t0);
		if (spec.to && spec.to > 0) o.frequency.exponentialRampToValueAtTime(spec.to, t0 + spec.dur * .92);
		g.gain.setValueAtTime(1e-4, t0);
		g.gain.exponentialRampToValueAtTime(Math.max(2e-4, gain), t0 + attack);
		g.gain.exponentialRampToValueAtTime(1e-4, t0 + spec.dur);
		o.connect(g);
		g.connect(c.destination);
		o.start(t0);
		o.stop(t0 + spec.dur + .05);
	}
	function tone(freq, dur, type, gain = .08, attack = .02) {
		play((c) => {
			voice(c, {
				freq,
				dur,
				type,
				gain,
				attack
			});
		});
	}
	return {
		unlock() {
			blocked = false;
			try {
				const c = ac();
				if (!c) return;
				if (c.state === "suspended") c.resume().catch(() => {});
				if (!drone && !muted) {
					const o = c.createOscillator();
					const o5 = c.createOscillator();
					const op = c.createOscillator();
					const g = c.createGain();
					const g5 = c.createGain();
					const gp = c.createGain();
					o.type = "sine";
					o.frequency.value = 72;
					o5.type = "sine";
					o5.frequency.value = 108;
					op.type = "sine";
					op.frequency.value = 54;
					g.gain.value = .015;
					g5.gain.value = .004;
					gp.gain.value = .005;
					o.connect(g);
					o5.connect(g5);
					op.connect(gp);
					g.connect(c.destination);
					g5.connect(c.destination);
					gp.connect(c.destination);
					o.start();
					o5.start();
					op.start();
					drone = {
						osc: o,
						fifth: o5,
						pad: op,
						gain: g,
						gain5: g5,
						gainPad: gp
					};
				}
				try {
					if (!muted) voice(c, {
						freq: 54,
						dur: .4,
						type: "sine",
						gain: .008,
						delay: .2
					});
				} catch {}
				try {
					if (!muted) voice(c, {
						freq: 46,
						dur: .14,
						type: "sine",
						gain: .006,
						delay: .1
					});
				} catch {}
				try {
					if (!muted) voice(c, {
						freq: 23,
						dur: .12,
						type: "sine",
						gain: .005,
						delay: .16
					});
				} catch {}
				try {
					if (!muted) voice(c, {
						freq: 11,
						dur: .1,
						type: "sine",
						gain: .004,
						delay: .2
					});
				} catch {}
				try {
					if (!muted) voice(c, {
						freq: 2,
						dur: .08,
						type: "sine",
						gain: .003,
						delay: .24
					});
				} catch {}
			} catch {}
		},
		howl() {
			play((c) => {
				const t0 = c.currentTime;
				const o = c.createOscillator();
				const g = c.createGain();
				o.type = "triangle";
				o.frequency.setValueAtTime(220, t0);
				o.frequency.exponentialRampToValueAtTime(88, t0 + .9);
				g.gain.setValueAtTime(0, t0);
				g.gain.linearRampToValueAtTime(.12, t0 + .08);
				g.gain.exponentialRampToValueAtTime(1e-4, t0 + 1.1);
				o.connect(g);
				g.connect(c.destination);
				o.start(t0);
				o.stop(t0 + 1.2);
				try {
					const o5 = c.createOscillator();
					const g5 = c.createGain();
					o5.type = "sine";
					o5.frequency.setValueAtTime(330, t0);
					o5.frequency.exponentialRampToValueAtTime(132, t0 + .42);
					g5.gain.setValueAtTime(0, t0);
					g5.gain.linearRampToValueAtTime(.028, t0 + .05);
					g5.gain.exponentialRampToValueAtTime(1e-4, t0 + .48);
					o5.connect(g5);
					g5.connect(c.destination);
					o5.start(t0);
					o5.stop(t0 + .52);
				} catch {}
				try {
					voice(c, {
						freq: 73,
						dur: .45,
						type: "sine",
						gain: .007,
						attack: .08,
						delay: .4
					});
				} catch {}
				try {
					voice(c, {
						freq: 98,
						dur: .4,
						type: "sine",
						gain: .006,
						attack: .06,
						delay: .2
					});
				} catch {}
				try {
					voice(c, {
						freq: 176,
						dur: .42,
						type: "sine",
						gain: .007,
						attack: .06,
						delay: .32
					});
				} catch {}
				try {
					voice(c, {
						freq: 147,
						dur: .28,
						type: "sine",
						gain: .012,
						delay: .16
					});
				} catch {}
				try {
					voice(c, {
						freq: 98,
						dur: .22,
						type: "sine",
						gain: .008,
						delay: .24
					});
				} catch {}
				try {
					voice(c, {
						freq: 119,
						dur: .16,
						type: "sine",
						gain: .006,
						delay: .2
					});
				} catch {}
				try {
					voice(c, {
						freq: 31,
						dur: .14,
						type: "sine",
						gain: .005,
						delay: .22
					});
				} catch {}
				try {
					voice(c, {
						freq: 41,
						dur: .12,
						type: "sine",
						gain: .004,
						delay: .26
					});
				} catch {}
				try {
					voice(c, {
						freq: 3,
						dur: .08,
						type: "sine",
						gain: .003,
						delay: .3
					});
				} catch {}
			});
		},
		talk() {
			play((c) => {
				voice(c, {
					freq: 523.3,
					to: 392,
					dur: .3,
					type: "sine",
					gain: .03,
					attack: .012
				});
				try {
					voice(c, {
						freq: 784,
						to: 659.3,
						dur: .24,
						type: "sine",
						gain: .012,
						attack: .016,
						delay: .05
					});
				} catch {}
				try {
					voice(c, {
						freq: 523,
						dur: .22,
						type: "sine",
						gain: .01,
						attack: .02,
						delay: .18
					});
				} catch {}
				try {
					voice(c, {
						freq: 261,
						dur: .22,
						type: "sine",
						gain: .007,
						attack: .02,
						delay: .12
					});
				} catch {}
				try {
					voice(c, {
						freq: 349,
						dur: .2,
						type: "sine",
						gain: .006,
						attack: .02,
						delay: .08
					});
				} catch {}
				try {
					voice(c, {
						freq: 196,
						dur: .16,
						type: "sine",
						gain: .01,
						delay: .08
					});
				} catch {}
				try {
					voice(c, {
						freq: 87,
						dur: .14,
						type: "sine",
						gain: .007,
						delay: .14
					});
				} catch {}
				try {
					voice(c, {
						freq: 103,
						dur: .12,
						type: "sine",
						gain: .006,
						delay: .1
					});
				} catch {}
				try {
					voice(c, {
						freq: 111,
						dur: .1,
						type: "sine",
						gain: .005,
						delay: .08
					});
				} catch {}
				try {
					voice(c, {
						freq: 13,
						dur: .1,
						type: "sine",
						gain: .004,
						delay: .12
					});
				} catch {}
				try {
					voice(c, {
						freq: 5,
						dur: .08,
						type: "sine",
						gain: .003,
						delay: .16
					});
				} catch {}
			});
		},
		land() {
			play((c) => {
				voice(c, {
					freq: 110,
					dur: .28,
					type: "sine",
					gain: .05,
					attack: .025
				});
				voice(c, {
					freq: 165,
					dur: .26,
					type: "sine",
					gain: .03,
					attack: .03,
					delay: .02
				});
				try {
					voice(c, {
						freq: 1318.5,
						to: 1046.5,
						dur: .36,
						type: "sine",
						gain: .012,
						attack: .008,
						delay: .22
					});
				} catch {}
				try {
					voice(c, {
						freq: 392,
						dur: .22,
						type: "sine",
						gain: .01,
						attack: .02,
						delay: .22
					});
				} catch {}
				try {
					voice(c, {
						freq: 440,
						dur: .24,
						type: "sine",
						gain: .008,
						attack: .02,
						delay: .12
					});
				} catch {}
				try {
					voice(c, {
						freq: 130,
						dur: .24,
						type: "sine",
						gain: .01,
						delay: .1
					});
				} catch {}
				try {
					voice(c, {
						freq: 73,
						dur: .2,
						type: "sine",
						gain: .008,
						delay: .16
					});
				} catch {}
				try {
					voice(c, {
						freq: 37,
						dur: .18,
						type: "sine",
						gain: .006,
						delay: .12
					});
				} catch {}
				try {
					voice(c, {
						freq: 17,
						dur: .14,
						type: "sine",
						gain: .004,
						delay: .16
					});
				} catch {}
				try {
					voice(c, {
						freq: 8,
						dur: .1,
						type: "sine",
						gain: .003,
						delay: .2
					});
				} catch {}
			});
		},
		eye() {
			play((c) => {
				voice(c, {
					freq: 186,
					to: 92,
					dur: .42,
					type: "sine",
					gain: .028,
					attack: .04
				});
				try {
					voice(c, {
						freq: 93,
						to: 62,
						dur: .36,
						type: "sine",
						gain: .012,
						attack: .05,
						delay: .06
					});
				} catch {}
			});
		},
		foot(speed) {
			if (muted || speed < 4) return;
			const now = performance.now();
			const gap = speed > 22 ? 280 : 420;
			if (now - lastFoot < gap) return;
			lastFoot = now;
			tone(90 + Math.random() * 20, .07, "sine", .015);
			try {
				tone(60, .05, "sine", .006);
			} catch {}
			play((c) => {
				try {
					voice(c, {
						freq: 98,
						dur: .08,
						type: "sine",
						gain: .008,
						delay: .02
					});
				} catch {}
				try {
					voice(c, {
						freq: 65,
						dur: .12,
						type: "sine",
						gain: .006,
						delay: .08
					});
				} catch {}
				try {
					voice(c, {
						freq: 29,
						dur: .1,
						type: "sine",
						gain: .005,
						delay: .06
					});
				} catch {}
			});
		},
		canal() {
			play((c) => {
				voice(c, {
					freq: 164.8,
					to: 196,
					dur: 1.05,
					type: "sine",
					gain: .036,
					attack: .08
				});
				voice(c, {
					freq: 246.9,
					to: 220,
					dur: 1.1,
					type: "sine",
					gain: .022,
					attack: .12,
					delay: .04
				});
				voice(c, {
					freq: 329.6,
					to: 392,
					dur: .7,
					type: "triangle",
					gain: .016,
					attack: .18,
					delay: .1
				});
				voice(c, {
					freq: 659.3,
					to: 523.3,
					dur: .45,
					type: "sine",
					gain: .012,
					attack: .04,
					delay: .22
				});
				try {
					voice(c, {
						freq: 196,
						dur: .55,
						type: "sine",
						gain: .008,
						attack: .08,
						delay: .4
					});
				} catch {}
				try {
					voice(c, {
						freq: 147,
						dur: .4,
						type: "sine",
						gain: .007,
						attack: .06,
						delay: .15
					});
				} catch {}
				try {
					voice(c, {
						freq: 82,
						dur: .3,
						type: "sine",
						gain: .01,
						delay: .12
					});
				} catch {}
				try {
					voice(c, {
						freq: 49,
						dur: .22,
						type: "sine",
						gain: .007,
						delay: .18
					});
				} catch {}
				try {
					voice(c, {
						freq: 41,
						dur: .24,
						type: "sine",
						gain: .006,
						delay: .2
					});
				} catch {}
				try {
					voice(c, {
						freq: 53,
						dur: .2,
						type: "sine",
						gain: .006,
						delay: .14
					});
				} catch {}
				try {
					voice(c, {
						freq: 43,
						dur: .18,
						type: "sine",
						gain: .005,
						delay: .16
					});
				} catch {}
				try {
					voice(c, {
						freq: 29,
						dur: .14,
						type: "sine",
						gain: .004,
						delay: .18
					});
				} catch {}
				try {
					voice(c, {
						freq: 4,
						dur: .1,
						type: "sine",
						gain: .003,
						delay: .22
					});
				} catch {}
			});
		},
		kiln() {
			play((c) => {
				voice(c, {
					freq: 110,
					to: 196,
					dur: .95,
					type: "triangle",
					gain: .045,
					attack: .06
				});
				voice(c, {
					freq: 246.9,
					to: 392,
					dur: .85,
					type: "sine",
					gain: .028,
					attack: .08,
					delay: .06
				});
				voice(c, {
					freq: 329.6,
					to: 523.3,
					dur: .7,
					type: "sine",
					gain: .02,
					attack: .1,
					delay: .16
				});
				voice(c, {
					freq: 659.3,
					dur: .38,
					type: "triangle",
					gain: .018,
					attack: .02,
					delay: .52
				});
				try {
					voice(c, {
						freq: 196,
						dur: .45,
						type: "sine",
						gain: .008,
						attack: .06,
						delay: .28
					});
				} catch {}
				try {
					voice(c, {
						freq: 110,
						dur: .4,
						type: "sine",
						gain: .007,
						attack: .06,
						delay: .14
					});
				} catch {}
				try {
					voice(c, {
						freq: 196,
						dur: .38,
						type: "sine",
						gain: .006,
						attack: .05,
						delay: .52
					});
				} catch {}
				try {
					voice(c, {
						freq: 98,
						dur: .28,
						type: "sine",
						gain: .012,
						delay: .1
					});
				} catch {}
				try {
					voice(c, {
						freq: 55,
						dur: .26,
						type: "sine",
						gain: .008,
						delay: .22
					});
				} catch {}
				try {
					voice(c, {
						freq: 61,
						dur: .2,
						type: "sine",
						gain: .007,
						delay: .18
					});
				} catch {}
				try {
					voice(c, {
						freq: 67,
						dur: .16,
						type: "sine",
						gain: .006,
						delay: .12
					});
				} catch {}
				try {
					voice(c, {
						freq: 71,
						dur: .14,
						type: "sine",
						gain: .005,
						delay: .1
					});
				} catch {}
				try {
					voice(c, {
						freq: 19,
						dur: .12,
						type: "sine",
						gain: .004,
						delay: .14
					});
				} catch {}
				try {
					voice(c, {
						freq: 7,
						dur: .1,
						type: "sine",
						gain: .003,
						delay: .18
					});
				} catch {}
				try {
					voice(c, {
						freq: 9,
						dur: .08,
						type: "sine",
						gain: .003,
						delay: .22
					});
				} catch {}
			});
		},
		grow() {
			play((c) => {
				voice(c, {
					freq: 1046.5,
					to: 1568,
					dur: .18,
					type: "sine",
					gain: .018,
					attack: .006
				});
				try {
					voice(c, {
						freq: 1568,
						to: 2093,
						dur: .14,
						type: "sine",
						gain: .009,
						attack: .004
					});
				} catch {}
				try {
					voice(c, {
						freq: 784,
						dur: .22,
						type: "triangle",
						gain: .008,
						attack: .01,
						delay: .12
					});
				} catch {}
				try {
					voice(c, {
						freq: 261,
						dur: .22,
						type: "sine",
						gain: .009,
						attack: .02,
						delay: .18
					});
				} catch {}
				try {
					voice(c, {
						freq: 196,
						dur: .22,
						type: "sine",
						gain: .008,
						attack: .02,
						delay: .16
					});
				} catch {}
				try {
					voice(c, {
						freq: 82,
						dur: .22,
						type: "sine",
						gain: .006,
						attack: .02,
						delay: .16
					});
				} catch {}
				try {
					voice(c, {
						freq: 196,
						dur: .22,
						type: "sine",
						gain: .018,
						delay: .08
					});
				} catch {}
				try {
					voice(c, {
						freq: 73,
						dur: .2,
						type: "sine",
						gain: .008,
						delay: .2
					});
				} catch {}
				try {
					voice(c, {
						freq: 82,
						dur: .18,
						type: "sine",
						gain: .007,
						delay: .14
					});
				} catch {}
				try {
					voice(c, {
						freq: 91,
						dur: .14,
						type: "sine",
						gain: .006,
						delay: .16
					});
				} catch {}
				try {
					voice(c, {
						freq: 77,
						dur: .12,
						type: "sine",
						gain: .005,
						delay: .18
					});
				} catch {}
				try {
					voice(c, {
						freq: 59,
						dur: .12,
						type: "sine",
						gain: .005,
						delay: .2
					});
				} catch {}
				try {
					voice(c, {
						freq: 37,
						dur: .1,
						type: "sine",
						gain: .004,
						delay: .24
					});
				} catch {}
				try {
					voice(c, {
						freq: 6,
						dur: .08,
						type: "sine",
						gain: .003,
						delay: .28
					});
				} catch {}
			});
		},
		shot() {
			play((c) => {
				voice(c, {
					freq: 240,
					to: 70,
					dur: .12,
					type: "square",
					gain: .07,
					attack: .004
				});
				voice(c, {
					freq: 880,
					to: 220,
					dur: .08,
					type: "sawtooth",
					gain: .03,
					attack: .002,
					delay: .01
				});
			});
		},
		hit() {
			play((c) => {
				voice(c, {
					freq: 1244,
					to: 880,
					dur: .07,
					type: "square",
					gain: .04,
					attack: .002
				});
			});
		},
		empty() {
			play((c) => {
				voice(c, {
					freq: 140,
					to: 90,
					dur: .08,
					type: "square",
					gain: .03,
					attack: .002
				});
			});
		},
		reload() {
			play((c) => {
				voice(c, {
					freq: 180,
					to: 320,
					dur: .16,
					type: "triangle",
					gain: .04,
					attack: .01
				});
				voice(c, {
					freq: 90,
					to: 70,
					dur: .22,
					type: "sine",
					gain: .03,
					attack: .02,
					delay: .12
				});
			});
		},
		hurt() {
			play((c) => {
				voice(c, {
					freq: 90,
					to: 40,
					dur: .22,
					type: "sawtooth",
					gain: .06,
					attack: .01
				});
			});
		},
		setMuted(m) {
			muted = m;
			try {
				if (drone) {
					drone.gain.gain.value = m ? 0 : .015;
					drone.gain5.gain.value = m ? 0 : .004;
					drone.gainPad.gain.value = m ? 0 : .005;
				}
			} catch {}
		},
		muted: () => muted,
		dispose() {
			try {
				drone?.osc.stop();
			} catch {}
			try {
				drone?.fifth.stop();
			} catch {}
			try {
				drone?.pad.stop();
			} catch {}
			drone = null;
			try {
				ctx?.close();
			} catch {}
			ctx = null;
			blocked = false;
		}
	};
}
//#endregion
export { createInput as n, createAudio as t };
