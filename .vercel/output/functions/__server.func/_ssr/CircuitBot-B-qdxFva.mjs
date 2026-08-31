import { o as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Pencil, n as X, s as Send } from "../_libs/lucide-react.mjs";
import { a as sendBotChat, d as setDoorOnLand, f as isBotOnCircuit, i as fetchBotSession, l as doorOnLand, o as DOOR_TEMPLATE_URL, p as wantsGrow, u as parseLandCode } from "./routes-BoVHVS11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CircuitBot-B-qdxFva.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	session: null,
	den: null,
	landables: [],
	bots: [],
	chat: [],
	door_template_url: null
};
function CircuitBot({ playing, open, onOpen, onLanded, onWork, onTeach, onHall, host, landId, island, mine, skills, onVisit, onRename }) {
	const [payload, setPayload] = (0, import_react.useState)(EMPTY);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [visit, setVisit] = (0, import_react.useState)("");
	const [rename, setRename] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const [knocked, setKnocked] = (0, import_react.useState)(false);
	const [witness, setWitness] = (0, import_react.useState)(doorOnLand);
	const endRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const nameRef = (0, import_react.useRef)(null);
	const session = payload.session;
	const onLand = isBotOnCircuit(session) || witness;
	const lines = payload.chat ?? [];
	(0, import_react.useEffect)(() => {
		let stop = false;
		const tick = () => {
			fetchBotSession().then((next) => {
				if (stop) return;
				setPayload(next);
			}).catch(() => {});
		};
		tick();
		const id = window.setInterval(tick, 1200);
		return () => {
			stop = true;
			window.clearInterval(id);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!playing || !host) return;
		if (doorOnLand()) {
			if (!witness) setWitness(true);
			return;
		}
		setDoorOnLand(true);
		setWitness(true);
	}, [
		playing,
		host,
		witness
	]);
	(0, import_react.useEffect)(() => {
		onLanded(Boolean(playing && onLand), "Citadel Door");
	}, [
		playing,
		onLand,
		onLanded
	]);
	(0, import_react.useEffect)(() => {
		if (open) endRef.current?.scrollIntoView({ block: "end" });
	}, [open, lines.length]);
	(0, import_react.useEffect)(() => {
		if (editing) nameRef.current?.focus();
	}, [editing]);
	async function onSend(ev) {
		ev.preventDefault();
		const text = (inputRef.current?.value || draft).trim();
		if (!text || busy) return;
		setBusy(true);
		setErr("");
		try {
			const next = await sendBotChat(text);
			if (next.error) {
				setErr(next.error);
				return;
			}
			setPayload(next);
			setDraft("");
			inputRef.current?.focus();
			if (host && onLand && (next.civic || wantsGrow(text))) onWork(text);
			else if (host && onLand) onTeach(text);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Could not send.");
		} finally {
			setBusy(false);
		}
	}
	function goVisit(ev) {
		ev.preventDefault();
		const code = parseLandCode(visit);
		if (!code) {
			setErr("Need a land code.");
			return;
		}
		onVisit(code);
		setVisit("");
	}
	function saveName(ev) {
		ev.preventDefault();
		if (!onRename((nameRef.current?.value || rename).trim())) {
			setErr("Need a name. Two letters or more.");
			return;
		}
		setEditing(false);
		setErr("");
	}
	if (!playing) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "circuit-bot",
		"data-open": open ? "true" : void 0,
		"data-on": onLand ? "true" : void 0,
		onClick: (e) => {
			if (e.target === e.currentTarget) onOpen(false);
		},
		children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "circuit-bot-pane",
			role: "dialog",
			"aria-label": island,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "circuit-bot-head",
					children: [editing && host ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "circuit-bot-rename",
						onSubmit: saveName,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: nameRef,
							type: "text",
							maxLength: 24,
							defaultValue: island,
							"aria-label": "Island name",
							onChange: (e) => setRename(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							children: "Save"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: island || "Beginning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [landId, host ? " · yours" : " · guest"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "circuit-bot-tools",
						children: [
							host && !editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "circuit-bot-x",
								"aria-label": "Rename island",
								onClick: () => {
									setRename(island);
									setEditing(true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
									size: 16,
									strokeWidth: 2.2
								})
							}) : null,
							onHall ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "circuit-bot-hall",
								onClick: onHall,
								children: "Hall"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "circuit-bot-x",
								"aria-label": "Close",
								onClick: () => onOpen(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
									size: 16,
									strokeWidth: 2.2
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "circuit-bot-status",
					children: host ? onLand ? "Citadel Door is on this land. Hold the Spire." : "Knock Citadel Door. Then Howl." : "Guest — you cannot grow this crucible"
				}),
				err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "circuit-bot-err",
					role: "alert",
					children: err
				}) : null,
				host && skills.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "circuit-bot-skill-list",
					children: skills.slice(0, 4).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
				}) : null,
				!host ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "circuit-bot-connect",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Their island. Howl with them. Grow yours at home." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onVisit(mine),
						children: "Your island"
					})]
				}) : !onLand ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "circuit-bot-connect",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Knock Citadel Door onto ",
							island,
							". Then hold the Spire. Howl. It grows the den. You do not leave the land."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setDoorOnLand(true);
								setWitness(true);
								setKnocked(true);
								setErr("");
							},
							children: "Knock · Citadel Door"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "circuit-bot-paper",
							href: DOOR_TEMPLATE_URL,
							target: "_blank",
							rel: "noopener noreferrer",
							children: "Real Door on x.ai"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "circuit-bot-status",
						children: "Hold the Spire. Howl. Citadel Door grows the den. Teach a skill here if you want."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "circuit-bot-lines",
						children: [lines.slice(-8).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							"data-from": line.from,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: line.from === "player" ? "You" : "Door" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line.text })]
						}, `${line.at}-${i}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							ref: endRef,
							"aria-hidden": true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "circuit-bot-form",
						onSubmit: (ev) => void onSend(ev),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "text",
							name: "line",
							maxLength: 240,
							autoComplete: "off",
							enterKeyHint: "send",
							placeholder: "Teach a skill",
							value: draft,
							onChange: (e) => setDraft(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy || !draft.trim(),
							"aria-label": "Send",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
								size: 16,
								strokeWidth: 2.2
							})
						})]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "circuit-bot-visit",
					onSubmit: goVisit,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						name: "land",
						maxLength: 8,
						autoComplete: "off",
						placeholder: "Visit code",
						value: visit,
						onChange: (e) => setVisit(e.target.value),
						"aria-label": "Visit a land"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !parseLandCode(visit),
						children: "Visit"
					})]
				})
			]
		}) : null
	});
}
//#endregion
export { CircuitBot };
