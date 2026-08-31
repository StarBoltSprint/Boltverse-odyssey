import { o as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as pub } from "./routes-BoVHVS11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CircuitHud-Db3TNnW8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CircuitHud({ hud, pack = 1, live = false, onStart, onCitadel, onAskBot, botOpen = false }) {
	const filmRef = (0, import_react.useRef)(null);
	const huntRef = (0, import_react.useRef)(null);
	const [hunt, setHunt] = (0, import_react.useState)(true);
	const [skipOn, setSkipOn] = (0, import_react.useState)(false);
	const bots = hud.botOn ? 1 : 0;
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
	}, [hunt, hud.mode]);
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
	if (hud.mode === "title" && hunt) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "slash-hunt",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: huntRef,
				className: "slash-hunt-film",
				src: pub("luminous-circuit/hunt.mp4") + "?v=1",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "slash-hunt-mark",
				children: "The Howling Crucible"
			}),
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
	if (hud.mode === "title") {
		const still = pub("luminous-circuit/gate.jpg") + "?v=1";
		const film = pub("luminous-circuit/gate.mp4") + "?v=1";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "slash-gate",
			"data-class": "circuit",
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-vignette" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-bloom" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-frame" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "slash-gate-mark",
					children: "The Howling Crucible"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "slash-gate-plate",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "slash-title",
							children: "StarBoltSprint"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "slash-class",
							children: hud.host ? hud.island || "Your beginning" : `Guest · ${hud.island}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "slash-sub",
							children: hud.host ? "Howl. Knock the Door. Teach it. Crystal from leftover Charge." : `Visiting ${hud.island}. Howl with them. Your bot grows yours.`
						}),
						pack > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "circuit-live-note",
							children: [pack, " already in the crucible"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "circuit-live-note",
							children: "Hold the Spire to Howl. The Door grows the rest."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "slash-enter",
							onClick: onStart,
							children: "Land True"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "slash-back",
							onClick: onCitadel,
							children: "Citadel"
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
					children: "The Howling Crucible"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "slash-title",
					children: "Paused"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "slash-sub",
					children: "The island holds. Pause is sacred."
				}),
				pack > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "circuit-live-note",
					children: [pack, " still in the crucible"]
				}) : null,
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "circuit-play",
		"data-village": "true",
		"data-bot": botOpen ? "true" : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "circuit-dock",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "circuit-isle",
					onClick: onAskBot,
					"aria-label": hud.island,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: hud.island || "Beginning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hud.host ? hud.landId : "guest" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "circuit-pack",
					"data-live": live ? "true" : void 0,
					"aria-label": `${pack} live`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: pack }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "live" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "circuit-bots",
					"data-on": hud.botOn ? "true" : void 0,
					"aria-label": `${bots} grok bot`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: bots }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "grok" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "circuit-bot-chip",
					"data-on": hud.botOn ? "true" : void 0,
					onClick: onAskBot,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: hud.botOn ? hud.botName : "Grok Bot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hud.botOn ? "talk" : "connect" })]
				})
			]
		}), hud.toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "slash-toast",
			children: hud.toast
		}) : null]
	});
}
//#endregion
export { CircuitHud };
