import { o as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as pub } from "./routes-BoVHVS11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CircuitTrial-D2trgzwH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "lc-trial-v1";
var SEAL = pub("luminous-circuit/trial-seal.jpg");
var PLATE = pub("luminous-circuit/trial-plate.jpg");
var BEATS = [
	{
		title: "First Howl",
		body: "Hold the Core Spire. Charge gathers. You do not grow. Howl is civic gather — leftover First Howl, never bottled."
	},
	{
		title: "The Door",
		body: "Knock Grok Bot. It walks onto your island. That is the teammate. You Howl. It works."
	},
	{
		title: "The Work",
		body: "Ask it to grow. Crystal from leftover Charge. Never chrome. That is Grok Build on the land — iterate here, not in a form."
	},
	{
		title: "Your name",
		body: "Tap the island name. Teach a skill. Visit a land. Guests may Howl with you. They cannot grow yours."
	}
];
function loadSeen() {
	try {
		return localStorage.getItem(KEY) === "1";
	} catch {
		return false;
	}
}
function writeSeen() {
	try {
		localStorage.setItem(KEY, "1");
	} catch {}
}
function CircuitTrial({ playing, hidden = false }) {
	const [seen, setSeen] = (0, import_react.useState)(loadSeen);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [beat, setBeat] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!playing) setOpen(false);
	}, [playing]);
	function close(mark) {
		setOpen(false);
		setBeat(0);
		if (mark) {
			writeSeen();
			setSeen(true);
		}
	}
	function next() {
		if (beat >= BEATS.length - 1) {
			close(true);
			return;
		}
		setBeat((n) => n + 1);
	}
	if (!playing) return null;
	const step = BEATS[beat];
	const last = beat >= BEATS.length - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [hidden || open ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "circuit-trial",
		"data-pulse": seen ? void 0 : "true",
		onClick: () => {
			setBeat(0);
			setOpen(true);
		},
		"aria-label": "First Howl — the trial",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "circuit-trial-ring",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "circuit-trial-ring circuit-trial-ring-late",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: SEAL,
				alt: "",
				width: 72,
				height: 72,
				draggable: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "First Howl" })
		]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "circuit-trial-veil",
		onClick: (e) => {
			if (e.target === e.currentTarget) close(false);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "circuit-trial-card",
			role: "dialog",
			"aria-label": "The Howling Crucible",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "circuit-trial-hero",
					src: PLATE,
					alt: "",
					draggable: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "circuit-trial-kicker",
					children: "The Howling Crucible"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: step.title }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "circuit-trial-body",
					children: step.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "circuit-trial-dots",
					"aria-hidden": true,
					children: BEATS.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { "data-on": i === beat ? "true" : void 0 }, b.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "circuit-trial-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "circuit-trial-skip",
						onClick: () => close(true),
						children: "Already true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "circuit-trial-next",
						onClick: next,
						children: last ? "I hear it" : "Next"
					})]
				})
			]
		})
	}) : null] });
}
//#endregion
export { CircuitTrial };
