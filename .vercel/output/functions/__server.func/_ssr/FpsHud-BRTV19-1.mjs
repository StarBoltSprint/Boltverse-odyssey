import { o as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as RotateCw, i as Volume2, p as Crosshair, r as VolumeX, v as Castle } from "../_libs/lucide-react.mjs";
import { m as pub } from "./routes-BoVHVS11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FpsHud-BRTV19-1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FpsHud({ hud, muted, onStart, onStick, onLook, onFire, onReload, onCitadel, onMute }) {
	const stickRef = (0, import_react.useRef)(null);
	const lookRef = (0, import_react.useRef)(null);
	const filmRef = (0, import_react.useRef)(null);
	const huntRef = (0, import_react.useRef)(null);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [hunt, setHunt] = (0, import_react.useState)(false);
	const [skipOn, setSkipOn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const v = filmRef.current;
		if (!v) return;
		v.muted = true;
		v.defaultMuted = true;
		const kick = () => {
			v.play().catch(() => {});
		};
		kick();
		v.addEventListener("canplay", kick);
		return () => v.removeEventListener("canplay", kick);
	}, [hud.mode, hunt]);
	(0, import_react.useEffect)(() => {
		if (!hunt || hud.mode !== "title") return;
		const t = window.setTimeout(() => setSkipOn(true), 5e3);
		return () => window.clearTimeout(t);
	}, [hunt, hud.mode]);
	(0, import_react.useEffect)(() => {
		const v = huntRef.current;
		if (!v || !hunt) return;
		v.muted = true;
		v.defaultMuted = true;
		const kick = () => {
			v.play().catch(() => {});
		};
		kick();
		v.addEventListener("canplay", kick);
		v.addEventListener("error", endHunt);
		return () => {
			v.removeEventListener("canplay", kick);
			v.removeEventListener("error", endHunt);
		};
	}, [hunt]);
	function endHunt() {
		setHunt(false);
		setSkipOn(false);
		if (hud.mode === "title") onStart();
	}
	function stick(ev, look) {
		const el = look ? lookRef.current : stickRef.current;
		if (!el) return;
		el.setPointerCapture(ev.pointerId);
		const r = el.getBoundingClientRect();
		const x = (ev.clientX - r.left) / r.width * 2 - 1;
		const y = -((ev.clientY - r.top) / r.height * 2 - 1);
		const m = Math.hypot(x, y);
		const s = m > 1 ? 1 / m : 1;
		const nx = x * s;
		const ny = y * s;
		if (look) onLook(nx, ny);
		else {
			onStick(nx, ny);
			setKnob({
				x: nx,
				y: ny
			});
		}
	}
	if (hud.mode === "title" && hunt) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "slash-hunt",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: huntRef,
				className: "slash-hunt-film",
				src: pub("slash/hunt-fps.mp4") + "?v=3",
				autoPlay: true,
				muted: true,
				playsInline: true,
				preload: "auto",
				disablePictureInPicture: true,
				controls: false,
				onEnded: endHunt,
				onError: endHunt,
				onLoadedData: (e) => {
					e.currentTarget.muted = true;
					e.currentTarget.play().catch(() => {});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-hunt-vignette" }),
			skipOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "slash-hunt-hit",
				"aria-label": "Skip intro",
				onClick: endHunt
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "slash-hunt-skip",
				onClick: endHunt,
				children: "Skip"
			})] }) : null
		]
	});
	if (hud.mode === "title" || hud.mode === "dead" || hud.mode === "win") {
		const win = hud.mode === "win";
		const dead = hud.mode === "dead";
		const still = pub("slash/gate-fps.jpg") + "?v=sight2";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "slash-gate fps-gate",
			"data-class": "fps",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "slash-gate-stage",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "slash-gate-art",
							src: still,
							alt: ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-vignette" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-bloom" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-frame" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "slash-gate-mark",
					children: dead ? "The kiln holds" : win ? "Sight holds" : "Howl Sight"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "slash-gate-plate",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "slash-title",
							children: dead ? "StarBoltSprint falls" : win ? "StarBoltSprint stands" : "StarBoltSprint"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "slash-class",
							children: "Howl Sight"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "slash-sub",
							children: dead || win ? `Wave ${hud.wave} · ${hud.kills} slain · ${hud.gold} gold` : "First person. The kiln is the range. Crystal never chrome."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "slash-enter",
							onClick: () => {
								if (hud.mode === "title") setHunt(true);
								else onStart();
							},
							children: hud.mode === "title" ? "Take the Sight" : "Rise again"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "slash-back",
							onClick: onCitadel,
							children: hud.mode === "title" ? "Citadel" : "Hall"
						})
					]
				})
			]
		});
	}
	if (hud.mode === "pause") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "slash-gate slash-gate-pause",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-veil" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "slash-gate-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "slash-kicker",
					children: "Howl Sight"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "slash-title",
					children: "Paused"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "slash-sub",
					children: [
						"Wave ",
						hud.wave,
						" · ",
						hud.kills,
						" slain"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "slash-enter",
					onClick: onStart,
					children: "Resume"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "slash-back",
					onClick: onCitadel,
					children: "Hall"
				})
			]
		})]
	});
	const hpPct = Math.max(0, hud.hp / hud.hpMax);
	const magPct = hud.mag ? hud.ammo / hud.mag : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fps-hud",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "slash-top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "slash-citadel",
						onClick: onCitadel,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Castle, { strokeWidth: 2.2 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Citadel" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "slash-wave",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Wave" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: hud.wave }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [hud.gold, "G"] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "slash-mute",
						"aria-label": muted ? "Unmute" : "Mute",
						onClick: onMute,
						children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { strokeWidth: 2.2 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { strokeWidth: 2.2 })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fps-cross",
				"data-hit": hud.hit > .15 ? "true" : void 0,
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { strokeWidth: 1.6 })
				]
			}),
			hud.hurt > .05 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fps-hurt",
				style: { opacity: Math.min(.55, hud.hurt) }
			}) : null,
			hud.toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "slash-toast",
				role: "status",
				children: hud.toast
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: stickRef,
				className: "slash-stick",
				onPointerDown: (e) => stick(e, false),
				onPointerMove: (e) => {
					if (e.buttons) stick(e, false);
				},
				onPointerUp: () => {
					onStick(0, 0);
					setKnob({
						x: 0,
						y: 0
					});
				},
				onPointerCancel: () => {
					onStick(0, 0);
					setKnob({
						x: 0,
						y: 0
					});
				},
				"aria-label": "Move",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: {
					["--kx"]: `${knob.x * 22}px`,
					["--ky"]: `${-knob.y * 22}px`
				} })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: lookRef,
				className: "fps-look",
				onPointerDown: (e) => stick(e, true),
				onPointerMove: (e) => {
					if (e.buttons) stick(e, true);
				},
				onPointerUp: () => onLook(0, 0),
				onPointerCancel: () => onLook(0, 0),
				"aria-label": "Look"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fps-dock",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fps-hp",
						"aria-label": "Health",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${hpPct * 100}%` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: Math.ceil(hud.hp) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "fps-fire",
						"aria-label": "Fire",
						onPointerDown: () => onFire(true),
						onPointerUp: () => onFire(false),
						onPointerCancel: () => onFire(false),
						children: "Fire"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "fps-reload",
						"aria-label": "Reload",
						onClick: onReload,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { strokeWidth: 2.2 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								hud.ammo,
								"/",
								hud.reserve
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${magPct * 100}%` } })
						]
					})
				]
			})
		]
	});
}
//#endregion
export { FpsHud };
