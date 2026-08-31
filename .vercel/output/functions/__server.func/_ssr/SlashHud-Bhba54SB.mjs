import { o as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as RotateCw, d as Gauge, f as Footprints, h as ChevronsRight, i as Volume2, m as CloudLightning, o as Sparkles, r as VolumeX, t as Zap, u as PawPrint, v as Castle, y as Axe } from "../_libs/lucide-react.mjs";
import { m as pub } from "./routes-BoVHVS11.mjs";
import { SLASH_CLASSES } from "./slash-engine-CQpDMeee.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SlashHud-Bhba54SB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	bite: PawPrint,
	thrash: RotateCw,
	maul: Axe,
	howl: Volume2,
	dash: ChevronsRight,
	wake: Footprints,
	crash: Gauge,
	bolt: Zap,
	aura: Sparkles,
	storm: CloudLightning
};
var GATE = {
	fang: {
		still: "slash/gate.jpg",
		film: "slash/gate.mp4"
	},
	blitz: {
		still: "slash/gate-blitz.jpg",
		film: "slash/gate-blitz.mp4"
	},
	arc: {
		still: "slash/gate-arc.jpg",
		film: "slash/gate-arc.mp4"
	}
};
function SlashHud({ hud, muted, onStart, onCast, onStick, onCitadel, onMute, onClass }) {
	const stickRef = (0, import_react.useRef)(null);
	const filmRef = (0, import_react.useRef)(null);
	const huntRef = (0, import_react.useRef)(null);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [hunt, setHunt] = (0, import_react.useState)(true);
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
		v.addEventListener("loadeddata", kick);
		return () => {
			v.removeEventListener("canplay", kick);
			v.removeEventListener("loadeddata", kick);
		};
	}, [hud.classId, hud.mode]);
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
	}
	function stick(ev) {
		const el = stickRef.current;
		if (!el) return;
		el.setPointerCapture(ev.pointerId);
		const r = el.getBoundingClientRect();
		const x = (ev.clientX - r.left) / r.width * 2 - 1;
		const y = -((ev.clientY - r.top) / r.height * 2 - 1);
		const m = Math.hypot(x, y);
		const s = m > 1 ? 1 / m : 1;
		const nx = x * s;
		const ny = y * s;
		onStick(nx, ny);
		setKnob({
			x: nx,
			y: ny
		});
	}
	if (hud.mode === "title" && hunt) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "slash-hunt",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: huntRef,
				className: "slash-hunt-film",
				src: pub("slash/hunt.mp4") + "?v=2",
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
		const kit = GATE[hud.classId] ?? GATE.fang;
		const still = pub(kit.still) + "?v=widein2";
		const film = pub(kit.film) + "?v=widein2";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "slash-gate",
			"data-class": hud.classId,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "slash-gate-stage",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "slash-gate-art",
							src: still,
							alt: ""
						}, hud.classId + "-still"),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: filmRef,
							className: "slash-gate-art slash-gate-live",
							src: film,
							poster: still,
							autoPlay: true,
							muted: true,
							loop: true,
							playsInline: true,
							preload: "auto",
							disablePictureInPicture: true,
							controls: false,
							onLoadedData: (e) => {
								e.currentTarget.muted = true;
								e.currentTarget.play().catch(() => {});
							}
						}, hud.classId),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-vignette" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-bloom" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-frame" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "slash-gate-sparks",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "slash-gate-mark",
					children: dead ? "The Veil holds" : win ? "The Heart shatters" : "Shatter Veil"
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
							children: hud.className
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "slash-sub",
							children: dead || win ? `Wave ${hud.wave} · ${hud.kills} slain · ${hud.gold} gold` : SLASH_CLASSES.find((c) => c.id === hud.classId)?.line ?? "Walk the Veil. Break the Heart."
						}),
						hud.mode === "title" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "slash-classes",
							role: "radiogroup",
							"aria-label": "Class",
							children: SLASH_CLASSES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "radio",
								"aria-checked": hud.classId === c.id,
								"data-on": hud.classId === c.id ? "true" : void 0,
								"data-kit": c.id,
								className: "slash-class-pick",
								onClick: () => onClass(c.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.resource })]
							}, c.id))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "slash-enter",
							onClick: onStart,
							children: hud.mode === "title" ? "Enter the Veil" : "Rise again"
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
					children: "Shatter Veil"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "slash-title",
					children: "Paused"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "slash-sub",
					children: [
						hud.className,
						" · Wave ",
						hud.wave,
						" · Lv ",
						hud.level
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
	const furyPct = Math.max(0, hud.fury / hud.furyMax);
	const xpPct = hud.xpNext ? hud.xp / hud.xpNext : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "slash-hud",
		children: [
			hud.floaters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "slash-floater",
				"data-crit": f.crit ? "true" : void 0,
				style: {
					left: f.x,
					top: f.y
				},
				children: f.text
			}, f.id)),
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
						className: "slash-id",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "slash-id-face",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: pub("slash/portrait-war.jpg"),
									alt: ""
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: hud.level })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "slash-id-copy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "StarBoltSprint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [
									hud.className,
									" · Lv ",
									hud.level
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "slash-id-hp",
								"aria-hidden": true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${hpPct * 100}%` } })
							})
						]
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
			hud.toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "slash-toast",
				role: "status",
				children: hud.toast
			}) : null,
			hud.combo > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "slash-combo",
				children: [hud.combo, " hit"]
			}) : null,
			hud.buff > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "slash-buff",
				children: [
					"Howl ",
					Math.ceil(hud.buff),
					"s"
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: stickRef,
				className: "slash-stick",
				onPointerDown: stick,
				onPointerMove: (e) => {
					if (e.buttons) stick(e);
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "slash-dock",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "slash-xp",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${xpPct * 100}%` } })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "slash-bar",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "slash-orb",
							"data-kind": "hp",
							"aria-label": "Health",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { height: `${hpPct * 100}%` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: Math.ceil(hud.hp) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "slash-skills",
							children: hud.skills.map((s) => {
								const Icon = ICONS[s.id] ?? PawPrint;
								const ready = s.ready >= 1 && hud.fury >= s.cost;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "slash-skill",
									disabled: !ready && s.cost > 0 && s.ready >= 1,
									"data-ready": ready ? "true" : void 0,
									"aria-label": `${s.name} ${s.hot}`,
									onClick: () => onCast(s.id),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { strokeWidth: 2.2 }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: s.hot }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: s.name }),
										s.ready < 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "slash-cd",
											style: { height: `${(1 - s.ready) * 100}%` }
										}) : null
									]
								}) }, s.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "slash-orb",
							"data-kind": "fury",
							"data-class": hud.classId,
							"aria-label": hud.resource,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { height: `${furyPct * 100}%` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: Math.ceil(hud.fury) })]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { SlashHud };
