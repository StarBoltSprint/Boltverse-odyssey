import { o as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as __exportAll } from "./ssr.mjs";
import { _ as ChevronLeft, g as ChevronRight } from "../_libs/lucide-react.mjs";
import { i as relicName, n as parseGrokSeed, r as relicHost } from "./router-BoyCL76v.mjs";
import { i as signOut, n as getBearerToken, r as signIn, t as authClient } from "./client-CfpWr7Hj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pub-C7__fxtb.js
/** Public file under Vite `public/`. Works on GitHub Pages subpath. */
function pub(path) {
	const p = path.replace(/^\//, "");
	const base = "/";
	return base.endsWith("/") ? `${base}${p}` : `${base}/${p}`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BoVHVS11.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CIRCUIT_IDS = /* @__PURE__ */ new Set([
	"core-heart",
	"luminous-circuit",
	"circuit",
	"howling-crucible",
	"crucible"
]);
var RE_GROW$1 = /\b(grow|raise|crystal|den|iterate|build|tend|join|name|work|densif|howl)\b/i;
function isBotOnCircuit(session) {
	if (!session) return false;
	if (session.oauth === "stub") return false;
	if (session.mode !== "travel") return false;
	const id = String(session.current_artifact_id || "");
	return CIRCUIT_IDS.has(id) || id.includes("circuit") || id.includes("core-heart") || id.includes("crucible");
}
function wantsGrow(text) {
	return RE_GROW$1.test(text.trim());
}
var ID_KEY = "lc-my-land";
var DEFAULT_ISLAND = "Beginning";
function mint() {
	return Math.random().toString(36).slice(2, 6).replace(/[^a-z0-9]/g, "k") || "k7m2";
}
function myLandId() {
	try {
		const raw = localStorage.getItem(ID_KEY);
		if (raw && /^[a-z0-9]{4,8}$/.test(raw)) return raw;
		const id = mint();
		localStorage.setItem(ID_KEY, id);
		return id;
	} catch {
		return mint();
	}
}
function parseLandCode(raw) {
	const s = String(raw || "").trim().toLowerCase().replace(/^y0-/, "");
	if (!/^[a-z0-9]{4,8}$/.test(s)) return null;
	return s;
}
function landRoom(id) {
	return (`y0-` + id).slice(0, 64);
}
function readVisitFromUrl() {
	if (typeof window === "undefined") return null;
	try {
		return parseLandCode(new URLSearchParams(window.location.search).get("land") || "");
	} catch {
		return null;
	}
}
function writeLandUrl(id, mine) {
	try {
		const u = new URL(window.location.href);
		if (id === mine) u.searchParams.delete("land");
		else u.searchParams.set("land", id);
		window.history.replaceState({}, "", u);
	} catch {}
}
function cleanIslandName(raw) {
	const s = String(raw || "").replace(/\s+/g, " ").trim().slice(0, 24);
	if (s.length < 2) return null;
	if (!/^[A-Za-z0-9][A-Za-z0-9 '’-]*$/.test(s)) return null;
	return s;
}
var DOOR_KEY = "lc-door-on-land";
function doorOnLand() {
	try {
		return localStorage.getItem(DOOR_KEY) === "1";
	} catch {
		return false;
	}
}
function setDoorOnLand(on) {
	try {
		if (on) localStorage.setItem(DOOR_KEY, "1");
		else localStorage.removeItem(DOOR_KEY);
	} catch {}
}
/** Public Citadel Door Grok Bot template. Not a secret. Not a bot_id. */
var DOOR_TEMPLATE_URL = "https://x.ai/bot/xOt0vuxl5f1u_rdg65CaH";
/** Same Door id as grok-bots.ts. Picker: Citadel Door only. */
var DOOR_BOT = {
	id: "002bcd41-29f7-4cf0-9eba-d67fad9fa3f6",
	name: "Citadel Door"
};
var KEY = "odyssey-door-slit";
var RE_HI = /\b(hi|hey|hello|here|u there|you there|yo)\b/i;
var RE_HOW = /\b(how are|what.?s up|wyd|doing)\b/i;
var RE_PLAY = /\b(play|circuit|howl|walk|game|door|citadel)\b/i;
var RE_Q = /\?|\b(what|who|how|why|where)\b/i;
var RE_GROW = /\b(grow|raise|crystal|den|iterate|build|densif)\b/i;
var RE_TEND = /\btend\b/i;
var RE_JOIN = /\bjoin\b/i;
var RE_NAME = /\bname\b/i;
var NOISE = /* @__PURE__ */ new Set([
	"p",
	"lol",
	"lmao",
	"ok",
	"k",
	"kk",
	"yo",
	"haha"
]);
function landables() {
	return [{
		artifact_id: "core-heart",
		name: "The Howling Crucible",
		owned: false,
		landable: true
	}];
}
function empty() {
	return {
		session: null,
		den: {
			artifact_id: "pack-hq",
			name: "Pack HQ"
		},
		landables: landables(),
		chat: []
	};
}
function load() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return empty();
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return empty();
		return {
			session: parsed.session ?? null,
			den: parsed.den ?? empty().den,
			landables: parsed.landables?.length ? parsed.landables : landables(),
			chat: Array.isArray(parsed.chat) ? parsed.chat.slice(-40) : []
		};
	} catch {
		return empty();
	}
}
function save(store) {
	try {
		localStorage.setItem(KEY, JSON.stringify(store));
	} catch {}
}
function view(store, extra) {
	return {
		session: store.session,
		den: store.den,
		landables: store.landables,
		bots: [DOOR_BOT],
		chat: store.chat,
		door_template_url: DOOR_TEMPLATE_URL,
		...extra
	};
}
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function pickCircuitLine(text, recent) {
	let bank;
	let civic;
	if (RE_TEND.test(text)) {
		civic = "tend";
		bank = ["Leftover First Howl, tended. Never bottled.", "Charge sits. I tend it."];
	} else if (RE_JOIN.test(text)) {
		civic = "join";
		bank = ["Paper join. No coin.", "I join the raising. You Howl."];
	} else if (RE_NAME.test(text) && !RE_GROW.test(text)) {
		civic = "name";
		bank = ["A name in leftover light.", "When it fades it has already been true."];
	} else if (RE_GROW.test(text) || wantsGrow(text)) {
		civic = "next";
		bank = [
			"Crystal from leftover Charge. Never chrome.",
			"I grow the land. You Howl.",
			"On it. Dens from Charge."
		];
	} else if (RE_HI.test(text) && !RE_HOW.test(text)) bank = ["On the land. Say grow.", "Here. I grow when you ask."];
	else bank = ["Heard. Ask me to grow.", "In the Crucible. I do the dens."];
	return {
		text: bank.find((line) => !recent.includes(line)) ?? bank[0],
		civic
	};
}
function pickDoorLine(text, recent) {
	let bank;
	if (RE_HI.test(text) && !RE_HOW.test(text)) bank = [
		"Here. On the door.",
		"Yes. I hear you.",
		"Present. Say it."
	];
	else if (RE_HOW.test(text)) bank = [
		"On the door. Local. No quota.",
		"Here. Watching the slit.",
		"Good. You?"
	];
	else if (RE_PLAY.test(text)) bank = [
		"Play copy is local. I'm on this door.",
		"Citadel door. I have the line.",
		"Say what you want on this copy."
	];
	else if (RE_Q.test(text)) bank = [
		"Ask it straight. I'm local on this door.",
		"I can answer here. Short.",
		"Go."
	];
	else bank = [
		"Heard. Go on.",
		"On it. Local.",
		"Yes.",
		"Got it. Next."
	];
	return bank.find((line) => !recent.includes(line)) ?? bank[0];
}
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json",
			"cache-control": "no-store"
		}
	});
}
/** Phone/Pages copy of /api/bot when the live app server is not on this host. */
function doorLocalResponse(init = {}) {
	const method = (init.method || "GET").toUpperCase();
	const store = load();
	if (method === "GET") return json(view(store));
	if (method !== "POST") return json({ error: "method not allowed" }, 405);
	let rec = {};
	try {
		rec = JSON.parse(String(init.body || "{}"));
	} catch {
		rec = {};
	}
	const op = String(rec.op || "");
	if (op === "connect") {
		const botId = String(rec.bot_id || "").trim();
		const botName = String(rec.bot_name || "").trim() || DOOR_BOT.name;
		if (botId !== DOOR_BOT.id) return json({ error: "Unknown Grok Bot." }, 404);
		store.session = {
			bot_id: DOOR_BOT.id,
			bot_name: botName,
			mode: "stay",
			current_artifact_id: store.den?.artifact_id ?? "pack-hq",
			owner_id: "phone",
			activity: "on the door",
			oauth: "stub"
		};
		store.chat = [];
		save(store);
		return json(view(store));
	}
	if (op === "disconnect") {
		store.session = null;
		store.chat = [];
		save(store);
		return json({
			ok: true,
			revoked: true
		});
	}
	if (!store.session) return json({ error: "Connect a Grok Bot first." }, 401);
	if (op === "session") {
		const mode = rec.mode === "travel" ? "travel" : "stay";
		const artifactId = typeof rec.artifact_id === "string" ? rec.artifact_id : store.session.current_artifact_id;
		store.session = {
			...store.session,
			mode,
			current_artifact_id: artifactId,
			activity: mode === "travel" ? "in the Howling Crucible" : "on the door"
		};
		save(store);
		return json(view(store));
	}
	if (op === "chat" || op === "say") {
		const text = String(rec.text || "").trim().slice(0, 240);
		if (!text) return json({ error: "text is required." }, 400);
		const at = nowIso();
		if (op === "chat") {
			store.chat.push({
				from: "player",
				text,
				at
			});
			const quiet = NOISE.has(text.toLowerCase()) || text.length <= 1;
			let civic;
			if (!quiet) {
				const recent = store.chat.filter((l) => l.from === "bot").map((l) => l.text).slice(-8);
				if (isBotOnCircuit(store.session)) {
					const reply = pickCircuitLine(text, recent);
					civic = reply.civic;
					store.chat.push({
						from: "bot",
						text: reply.text,
						at: new Date(Date.now() + 400).toISOString()
					});
					store.session.activity = "growing the Howling Crucible";
				} else {
					store.chat.push({
						from: "bot",
						text: pickDoorLine(text, recent),
						at: new Date(Date.now() + 400).toISOString()
					});
					store.session.activity = "answering you on the door";
				}
			}
			store.chat = store.chat.slice(-40);
			save(store);
			return json(view(store, civic ? { civic } : void 0));
		} else store.chat.push({
			from: "bot",
			text,
			at
		});
		store.chat = store.chat.slice(-40);
		save(store);
		return json(view(store));
	}
	return json({ error: "unknown op" }, 400);
}
function withDoorBots(payload) {
	const bots = payload.bots?.length ? [...payload.bots] : [];
	if (!bots.some((b) => b.id === DOOR_BOT.id)) bots.unshift(DOOR_BOT);
	return {
		...payload,
		bots
	};
}
function isJson(res) {
	return (res.headers.get("content-type") || "").includes("application/json");
}
async function botFetch(init = {}) {
	const extra = String("").trim();
	if (extra) try {
		const headers = new Headers(init.headers);
		const token = getBearerToken();
		if (token) headers.set("Authorization", `Bearer ${token}`);
		if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
		const res = await fetch(extra.replace(/\/$/, ""), {
			...init,
			headers,
			credentials: "include"
		});
		if (isJson(res)) return res;
	} catch {}
	return doorLocalResponse(init);
}
async function readPayload(res) {
	try {
		return withDoorBots(await res.json());
	} catch {
		return {
			...withDoorBots({
				session: null,
				den: null,
				landables: [],
				bots: [],
				door_template_url: DOOR_TEMPLATE_URL
			}),
			error: "Could not read Grok Bot session."
		};
	}
}
/** Connect a named Grok Bot. Never send an API key. */
async function connectBot(choice) {
	const res = await botFetch({
		method: "POST",
		body: JSON.stringify({
			op: "connect",
			bot_id: choice.bot_id,
			bot_name: choice.bot_name
		})
	});
	const body = await readPayload(res);
	if (!res.ok) return {
		...body,
		error: body.error || "Connect failed."
	};
	return body;
}
async function fetchBotSession() {
	const res = await botFetch({ method: "GET" });
	if (!res.ok) return withDoorBots({
		session: null,
		den: null,
		landables: [],
		bots: [],
		door_template_url: DOOR_TEMPLATE_URL
	});
	return readPayload(res);
}
async function disconnectBot() {
	const res = await botFetch({
		method: "POST",
		body: JSON.stringify({ op: "disconnect" })
	});
	if (!res.ok) return {
		ok: false,
		error: (await readPayload(res)).error || "Disconnect failed."
	};
	return { ok: true };
}
/** Player line to the connected Grok Bot. Never send an API key. */
async function sendBotChat(text) {
	const res = await botFetch({
		method: "POST",
		body: JSON.stringify({
			op: "chat",
			text
		})
	});
	const body = await readPayload(res);
	if (!res.ok) return {
		...body,
		error: body.error || "Could not send."
	};
	return body;
}
/** Player-worlds. The Howling Crucible is the first trial. Shatter Veil is the warrior slash. */
var ARTIFACTS = [
	{
		id: "core-heart",
		name: "The Howling Crucible",
		line: "Howl. Knock the Door. Crystal from leftover Charge.",
		open: true,
		enter: "circuit",
		x: 11.4,
		y: 1.4,
		z: 7.6,
		color: 5163240,
		scale: 1.35,
		cover: pub("luminous-circuit/cover.jpg"),
		film: pub("citadel/world-crucible.mp4") + "?v=1",
		maker: "First Howl",
		face: pub("luminous-circuit/citizens/gold-crown.png"),
		badge: "Open",
		ribbon: "Crucible",
		res: 100,
		podium: true
	},
	{
		id: "shatter-veil",
		name: "Shatter Veil",
		line: "War-hound of the kiln. Crystal never chrome.",
		open: true,
		enter: "slash",
		x: 6.2,
		y: 3.4,
		z: -8.8,
		color: 14710848,
		scale: 1.42,
		cover: pub("slash/cover-war.jpg"),
		film: pub("citadel/world-veil.mp4") + "?v=1",
		maker: "StarBoltSprint",
		face: pub("slash/portrait-war.jpg"),
		badge: "Open",
		ribbon: "Slash",
		res: 86,
		podium: true,
		hero: true
	},
	{
		id: "howl-sight",
		name: "Howl Sight",
		line: "First person. StarBoltSprint takes the kiln.",
		open: true,
		enter: "fps",
		x: -4.6,
		y: 4.2,
		z: -12.4,
		color: 8317170,
		scale: 1.38,
		cover: pub("slash/cover-fps.jpg"),
		film: pub("citadel/world-sight.mp4") + "?v=1",
		maker: "StarBoltSprint",
		face: pub("slash/portrait-war.jpg"),
		badge: "Open",
		ribbon: "Sight",
		res: 91,
		podium: true
	}
];
var ARTIFACT_THREADS = [
	["core-heart", "shatter-veil"],
	["core-heart", "howl-sight"],
	["shatter-veil", "howl-sight"]
];
function artifactById(id) {
	if (!id) return null;
	return ARTIFACTS.find((a) => a.id === id) ?? null;
}
function goFull(node) {
	const el = node ?? document.documentElement;
	const anyEl = el;
	const req = el.requestFullscreen?.bind(el) || anyEl.webkitRequestFullscreen?.bind(anyEl) || anyEl.webkitRequestFullScreen?.bind(anyEl);
	if (!req) return;
	try {
		Promise.resolve(req({ navigationUI: "hide" })).catch(() => {
			Promise.resolve(req()).catch(() => {});
		});
	} catch {
		try {
			req();
		} catch {}
	}
	try {
		screen.orientation.lock?.("portrait")?.catch(() => {});
	} catch {}
}
var el = null;
var current = "";
function node() {
	if (!el) {
		el = new Audio();
		el.loop = true;
		el.preload = "auto";
	}
	return el;
}
var SONG = {
	hub: pub("citadel/hub-song.mp3") + "?v=1",
	hall: pub("citadel/hall-song.mp3") + "?v=1",
	den: pub("citadel/den-song.mp3") + "?v=1",
	denWalker: pub("citadel/den-walker-song.mp3") + "?v=1",
	denMaker: pub("citadel/den-maker-song.mp3") + "?v=1",
	forge: pub("citadel/forge-song.mp3") + "?v=1",
	pack: pub("citadel/pack-song.mp3") + "?v=1",
	relic: pub("citadel/relic-song.mp3") + "?v=1",
	howl: pub("citadel/howl-song.mp3") + "?v=1",
	stars: pub("citadel/stars-song.mp3") + "?v=1",
	starmap: pub("citadel/starmap-song.mp3") + "?v=5",
	landrun: pub("citadel/landrun-veil-song.mp3") + "?v=4",
	launch: pub("citadel/launch-veil-song.mp3") + "?v=2",
	kilnNew: pub("citadel/kiln-new-song.mp3") + "?v=1",
	kilnRemix: pub("citadel/kiln-remix-song.mp3") + "?v=1",
	kilnVersion: pub("citadel/kiln-version-song.mp3") + "?v=1",
	forgeBot: pub("citadel/forge-bot-song.mp3") + "?v=1",
	forgeHand: pub("citadel/forge-hand-song.mp3") + "?v=1"
};
function playSong(src) {
	const a = node();
	if (current !== src) {
		a.src = src;
		current = src;
	}
	a.muted = false;
	a.volume = 1;
	a.loop = true;
	a.play().catch(() => {});
}
function warmSong(src) {
	const a = node();
	if (current) return;
	a.src = src;
	current = src;
	a.preload = "auto";
	a.load();
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
var STILL$6 = pub("citadel/pack.jpg") + "?v=1";
var CLIP$5 = pub("citadel/pack.mp4") + "?v=1";
var X_HREF$1 = "/auth/popup?providerId=grok-x";
function PackGate({ onClose }) {
	const { user } = useCurrentUserState();
	const [live, setLive] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const connected = !!user && !user.isDevFallback;
	const name = (user?.displayName || user?.primaryEmail || "Walker").trim() || "Walker";
	(0, import_react.useEffect)(() => {
		const arm = window.setTimeout(() => setArmed(true), 450);
		playSong(SONG.pack);
		const v = videoRef.current;
		if (!v) return () => window.clearTimeout(arm);
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		v.setAttribute("webkit-playsinline", "true");
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => {
			window.clearTimeout(arm);
			v.removeEventListener("canplay", playFilm);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		function onMsg(event) {
			if (event.origin !== window.location.origin) return;
			const data = event.data;
			if (data?.source !== "grok-auth-popup" || !data.token) return;
			try {
				window.localStorage.setItem("grok-auth.bearer-token", data.token);
			} catch {}
			authClient.getSession();
		}
		window.addEventListener("message", onMsg);
		return () => window.removeEventListener("message", onMsg);
	}, []);
	function doubleFull() {
		playSong(SONG.pack);
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	function stop(ev) {
		ev.stopPropagation();
	}
	function goHub(ev) {
		ev.stopPropagation();
		playSong(SONG.hub);
		onClose();
	}
	function leave(ev) {
		stop(ev);
		if (busy) return;
		setBusy(true);
		signOut().catch(() => setBusy(false));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "citadel pack-gate",
		"data-wired": "true",
		"data-armed": armed ? "true" : void 0,
		"aria-label": "Join the Pack",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "citadel-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "citadel-art",
					src: STILL$6,
					alt: "",
					hidden: live,
					draggable: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "citadel-art citadel-live",
					src: CLIP$5,
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					preload: "auto",
					controls: false,
					disablePictureInPicture: true,
					onPlaying: () => setLive(true)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: doubleFull
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pack-back",
					"aria-label": "Citadel",
					onPointerDown: goHub,
					onClick: goHub,
					children: "Citadel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pack-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Boltverse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "The Pack" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: connected ? `${name} · marked` : "Howl in on X" })
					]
				}),
				connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pack-x",
					disabled: busy,
					onPointerDown: leave,
					children: busy ? "Leaving…" : "Sign out"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "pack-x",
					href: X_HREF$1,
					target: "_blank",
					rel: "opener",
					onPointerDown: (ev) => {
						ev.stopPropagation();
						playSong(SONG.pack);
					},
					children: "Connect with X"
				})
			]
		})
	});
}
function PackSheet({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackGate, { onClose });
}
function CitadelHub({ onLand, onHall, onConstellation }) {
	const { user } = useCurrentUserState();
	const marked = !!user && !user.isDevFallback;
	const tag = (user?.displayName || "Pack").trim().split(/\s+/)[0] || "Pack";
	const [packOpen, setPackOpen] = (0, import_react.useState)(false);
	const [live, setLive] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const still = pub("citadel/hub.jpg") + "?v=26";
	const clip = pub("citadel/hub.mp4") + "?v=27";
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		warmSong(SONG.hub);
		playSong(SONG.hub);
		const v = videoRef.current;
		if (!v) return;
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		v.setAttribute("webkit-playsinline", "true");
		v.controls = false;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => v.removeEventListener("canplay", playFilm);
	}, [clip]);
	function tap(fn) {
		return (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
			playSong(SONG.hub);
			fn();
		};
	}
	function doubleFull() {
		playSong(SONG.hub);
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "citadel",
		"data-wired": "true",
		"aria-label": "Thunderwolf Citadel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "citadel-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "citadel-art",
					src: still,
					alt: "",
					draggable: false,
					hidden: live
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "citadel-art citadel-live",
					src: clip,
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					preload: "auto",
					controls: false,
					disablePictureInPicture: true,
					onPlaying: () => setLive(true)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: doubleFull
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "button",
					tabIndex: 0,
					className: "citadel-hit citadel-hit-join",
					"aria-label": marked ? "Pack marked" : "Join connect",
					onPointerDown: tap(() => setPackOpen(true))
				}),
				marked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-join-hide",
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-pack-chip",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "P" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: tag }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Marked" })] })] })
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "button",
					tabIndex: 0,
					className: "citadel-hit citadel-hit-land",
					"aria-label": "Land",
					onPointerDown: tap(() => {
						playSong(SONG.hall);
						onLand();
					})
				}),
				onHall ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "button",
					tabIndex: 0,
					className: "citadel-hit citadel-hit-hall",
					"aria-label": "Hall",
					onPointerDown: tap(onHall)
				}) : null,
				onConstellation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "button",
					tabIndex: 0,
					className: "citadel-hit citadel-hit-stars",
					"aria-label": "Stars",
					onPointerDown: tap(onConstellation)
				}) : null
			]
		}), packOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackSheet, { onClose: () => setPackOpen(false) })]
	});
}
/** Ignore leftover Enter/Land presses across a page change. */
var frozenUntil = 0;
function freezeTaps(ms = 1600) {
	frozenUntil = Math.max(frozenUntil, performance.now() + ms);
}
function tapsFrozen() {
	return performance.now() < frozenUntil;
}
/** Arm only after the finger that opened this page lifts. */
function armAfterLift(onArm, fallbackMs = 1800) {
	let done = false;
	let t = 0;
	const arm = () => {
		if (done) return;
		done = true;
		window.clearTimeout(t);
		freezeTaps(500);
		t = window.setTimeout(onArm, 280);
	};
	window.addEventListener("pointerup", arm, { once: true });
	window.addEventListener("pointercancel", arm, { once: true });
	t = window.setTimeout(arm, fallbackMs);
	return () => {
		done = true;
		window.clearTimeout(t);
		window.removeEventListener("pointerup", arm);
		window.removeEventListener("pointercancel", arm);
	};
}
var HALL_STILL = pub("citadel/relic.jpg") + "?v=1";
function builtCatalog() {
	return ARTIFACTS.map((a) => ({
		id: a.id,
		name: a.name,
		line: a.line,
		cover: a.cover,
		film: a.film,
		open: a.open
	}));
}
function ArtifactHall({ onLand, onHome, focusId }) {
	const relics = builtCatalog();
	const [i, setI] = (0, import_react.useState)(() => {
		if (!focusId) return 0;
		const n = relics.findIndex((r) => r.id === focusId);
		return n >= 0 ? n : 0;
	});
	const [worldLive, setWorldLive] = (0, import_react.useState)(false);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const worldRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const lock = (0, import_react.useRef)(performance.now() + 600);
	const song = SONG.relic;
	const pick = relics[i] ?? relics[0];
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		setArmed(false);
		lock.current = Number.POSITIVE_INFINITY;
		playSong(song);
		return armAfterLift(() => {
			setArmed(true);
			lock.current = performance.now() + 180;
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!focusId) return;
		const n = relics.findIndex((r) => r.id === focusId);
		if (n >= 0) setI(n);
	}, [focusId]);
	(0, import_react.useEffect)(() => {
		setWorldLive(false);
		const v = worldRef.current;
		if (!v || !pick?.film) return;
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setWorldLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => v.removeEventListener("canplay", playFilm);
	}, [pick?.id, pick?.film]);
	function tap(fn) {
		return (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
			const now = performance.now();
			if (!armed || tapsFrozen() || now < lock.current) return;
			lock.current = now + 320;
			playSong(song);
			fn();
		};
	}
	function doubleFull() {
		playSong(song);
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	function step(dir) {
		if (!relics.length) return;
		setI((n) => (n + dir + relics.length) % relics.length);
	}
	function primary() {
		if (!armed || !pick?.open) return;
		onLand(pick.id);
	}
	const action = pick?.open ? "Land" : "Sealed";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "citadel relic-gate",
		"data-wired": "true",
		"data-armed": armed ? "true" : void 0,
		"aria-label": "Hall of Artifacts",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "citadel-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "citadel-art",
					src: HALL_STILL,
					alt: "",
					draggable: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: doubleFull
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pack-back",
					onPointerDown: tap(() => {
						playSong(SONG.hub);
						onHome();
					}),
					children: "Citadel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "relic-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Reliquary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: pick?.name ?? "Reliquary" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "relic-frame",
					"aria-label": pick?.name ?? "vault",
					onPointerDown: tap(primary),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: pick.cover,
						alt: "",
						hidden: worldLive
					}), pick?.film ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: worldRef,
						src: pick.film,
						autoPlay: true,
						muted: true,
						loop: true,
						playsInline: true,
						preload: "metadata",
						controls: false,
						disablePictureInPicture: true,
						onPlaying: () => setWorldLive(true)
					}, pick.id) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "walk-arrow walk-arrow-l",
					"aria-label": "Previous world",
					onPointerDown: tap(() => step(-1)),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { strokeWidth: 2.6 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "walk-arrow walk-arrow-r",
					"aria-label": "Next world",
					onPointerDown: tap(() => step(1)),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { strokeWidth: 2.6 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pack-x",
					onPointerDown: tap(primary),
					disabled: action === "Sealed",
					children: action
				})
			]
		})
	});
}
var ZONES = [
	{
		id: "hall",
		name: "Thunderwolf Hall",
		line: "Heart of the Citadel · the nave",
		still: pub("citadel/hall.jpg") + "?v=6",
		clip: pub("citadel/hall.mp4") + "?v=6",
		song: SONG.hall,
		open: true,
		action: "Enter"
	},
	{
		id: "den",
		name: "Your Den",
		line: "Where the walker rests · first howl",
		still: pub("citadel/den.jpg") + "?v=1",
		clip: pub("citadel/den.mp4") + "?v=1",
		song: SONG.den,
		open: true,
		action: "Enter"
	},
	{
		id: "forge",
		name: "Bolt Forge",
		line: "Kiln of the pack · crystal fire",
		still: pub("citadel/forge.jpg") + "?v=1",
		clip: pub("citadel/forge.mp4") + "?v=1",
		song: SONG.forge,
		open: true,
		action: "Forge"
	},
	{
		id: "howl",
		name: "The Pack",
		line: "Howl in on X",
		still: pub("citadel/pack.jpg") + "?v=1",
		clip: pub("citadel/pack.mp4") + "?v=1",
		song: SONG.pack,
		open: true,
		action: "Connect with X"
	},
	{
		id: "door",
		name: "Citadel Door",
		line: "Knock your Grok Bot into the fire",
		still: pub("citadel/howl.jpg") + "?v=1",
		clip: pub("citadel/howl.mp4") + "?v=1",
		song: SONG.howl,
		open: true,
		action: "Knock"
	},
	{
		id: "stars",
		name: "The Star Veil",
		line: "Constellation of the pack",
		still: pub("citadel/stars.jpg") + "?v=1",
		clip: pub("citadel/stars.mp4") + "?v=1",
		song: SONG.stars,
		open: true,
		action: "Gaze"
	}
];
var X_HREF = "/auth/popup?providerId=grok-x";
function ZoneWalk({ onBack, onEnter }) {
	const { user, isPending } = useCurrentUserState();
	const connected = !!user && !user.isDevFallback;
	const walker = (user?.displayName || user?.primaryEmail || "Walker").trim() || "Walker";
	const [i, setI] = (0, import_react.useState)(0);
	const [live, setLive] = (0, import_react.useState)(false);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [doorOn, setDoorOn] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const zone = ZONES[i];
	const painted = zone.id === "hall";
	(0, import_react.useEffect)(() => {
		fetchBotSession().then((p) => setDoorOn(!!p.session)).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		setArmed(false);
		setLive(false);
		playSong(zone.song);
		const release = armAfterLift(() => setArmed(true));
		const v = videoRef.current;
		if (!v || !zone.clip) return release;
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => {
			release();
			v.removeEventListener("canplay", playFilm);
		};
	}, [zone]);
	function tap(fn) {
		return (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
			if (!armed || tapsFrozen()) return;
			playSong(zone.song);
			fn();
		};
	}
	function doubleFull() {
		playSong(zone.song);
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	function step(dir) {
		setI((n) => (n + dir + ZONES.length) % ZONES.length);
	}
	function enter() {
		if (!zone.open || tapsFrozen()) return;
		freezeTaps(1800);
		if (zone.id === "howl") {
			if (busy || isPending) return;
			if (connected) {
				setBusy(true);
				signOut().catch(() => setBusy(false));
				return;
			}
			signIn("grok-x", { callbackURL: "/" });
			return;
		}
		if (zone.id === "door") {
			if (busy) return;
			setBusy(true);
			(doorOn ? disconnectBot().then(() => setDoorOn(false)) : connectBot({
				bot_id: DOOR_BOT.id,
				bot_name: DOOR_BOT.name
			}).then((next) => {
				if (next.oauth_url) {
					window.location.assign(next.oauth_url);
					return;
				}
				if (next.session) setDoorOn(true);
			})).catch(() => {}).finally(() => setBusy(false));
			return;
		}
		onEnter(zone.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "walk",
		"data-armed": armed ? "true" : void 0,
		"data-wired": painted ? "true" : void 0,
		"aria-label": "Zone walk",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "walk-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "walk-art",
					src: zone.still,
					alt: "",
					hidden: live
				}),
				zone.clip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "walk-art walk-live",
					src: zone.clip,
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					preload: "auto",
					controls: false,
					disablePictureInPicture: true,
					onPlaying: () => setLive(true)
				}, zone.id),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: doubleFull
				}),
				painted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-hit walk-hit-citadel",
						"aria-label": "Citadel",
						onPointerDown: tap(() => {
							playSong(SONG.hub);
							onBack();
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-hit walk-hit-left",
						"aria-label": "Previous zone",
						onPointerDown: tap(() => step(-1))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-hit walk-hit-right",
						"aria-label": "Next zone",
						onPointerDown: tap(() => step(1))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-hit walk-hit-enter",
						"aria-label": "Enter",
						onPointerDown: tap(enter)
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "walk-back",
						onPointerDown: tap(() => {
							playSong(SONG.hub);
							onBack();
						}),
						"aria-label": "Citadel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: "walk-gem",
							"aria-hidden": "true"
						}), "Citadel"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-arrow walk-arrow-l",
						onPointerDown: tap(() => step(-1)),
						"aria-label": "Previous zone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { strokeWidth: 2.8 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-arrow walk-arrow-r",
						onPointerDown: tap(() => step(1)),
						"aria-label": "Next zone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { strokeWidth: 2.8 })
					}),
					zone.id === "howl" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pack-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Boltverse" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "The Pack" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: connected ? `${walker} · marked` : "Howl in on X" })
						]
					}), connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pack-x",
						disabled: busy,
						onPointerDown: tap(enter),
						children: busy ? "Leaving…" : "Sign out"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "pack-x",
						href: X_HREF,
						target: "_blank",
						rel: "opener",
						onPointerDown: (ev) => {
							ev.stopPropagation();
							playSong(SONG.pack);
						},
						children: "Connect with X"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "walk-foot",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "walk-mark",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: zone.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: zone.line })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "walk-enter",
							disabled: !zone.open || busy,
							onPointerDown: tap(enter),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: zone.id === "door" ? busy ? "…" : doorOn ? "Unknock" : "Knock" : zone.action })
						})]
					})
				] })
			]
		})
	});
}
var STILL$5 = pub("citadel/starmap.jpg") + "?v=5";
var CLIP$4 = pub("citadel/starmap.mp4") + "?v=5";
function StarMap({ onLand, onBack }) {
	const [live, setLive] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		playSong(SONG.starmap);
		const v = videoRef.current;
		if (!v) return;
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => v.removeEventListener("canplay", playFilm);
	}, []);
	function tap(fn) {
		return (ev) => {
			ev.stopPropagation();
			playSong(SONG.starmap);
			fn();
		};
	}
	function doubleFull() {
		playSong(SONG.starmap);
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "citadel star-map",
		"data-wired": "true",
		"aria-label": "The Star Veil",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "citadel-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "citadel-art",
					src: STILL$5,
					alt: "",
					draggable: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "citadel-art citadel-live",
					src: CLIP$4,
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					preload: "auto",
					controls: false,
					disablePictureInPicture: true,
					hidden: !live,
					onPlaying: () => setLive(true)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: doubleFull
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "walk-back",
					onPointerDown: tap(() => {
						playSong(SONG.hub);
						onBack();
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "walk-gem",
						"aria-hidden": "true"
					}), "Citadel"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "star-hit star-hit-crucible",
					"aria-label": "The Howling Crucible",
					onPointerDown: tap(() => onLand("core-heart"))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "star-hit star-hit-veil",
					"aria-label": "Shatter Veil",
					onPointerDown: tap(() => onLand("shatter-veil"))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "star-hit star-hit-sight",
					"aria-label": "Howl Sight",
					onPointerDown: tap(() => onLand("howl-sight"))
				})
			]
		})
	});
}
var STILL$4 = pub("citadel/landrun-veil.jpg") + "?v=4";
var CLIP$3 = pub("citadel/landrun-veil.mp4") + "?v=4";
var IN$3 = 1.6;
var BEATS$2 = [
	{
		at: 4.1,
		win: 1.2,
		dir: "l"
	},
	{
		at: 8.3,
		win: 1.2,
		dir: "r"
	},
	{
		at: 12.2,
		win: 1.25,
		dir: "c"
	}
];
function LandRun({ onLand, onBack }) {
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const beatRef = (0, import_react.useRef)(0);
	const hitRef = (0, import_react.useRef)(false);
	const crashedRef = (0, import_react.useRef)(false);
	const raf = (0, import_react.useRef)(0);
	const [live, setLive] = (0, import_react.useState)(false);
	const [beat, setBeat] = (0, import_react.useState)(0);
	const [phase, setPhase] = (0, import_react.useState)("hide");
	const [dir, setDir] = (0, import_react.useState)("l");
	const [dodge, setDodge] = (0, import_react.useState)("");
	const phaseRef = (0, import_react.useRef)(phase);
	const landRef = (0, import_react.useRef)(onLand);
	phaseRef.current = phase;
	landRef.current = onLand;
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		playSong(SONG.landrun);
		const v = videoRef.current;
		if (!v) return;
		v.muted = true;
		v.loop = false;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => v.removeEventListener("canplay", playFilm);
	}, []);
	(0, import_react.useEffect)(() => {
		const tick = () => {
			const v = videoRef.current;
			if (v && !crashedRef.current) step(v.currentTime, v.ended || v.currentTime >= 14.7);
			raf.current = requestAnimationFrame(tick);
		};
		raf.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf.current);
	}, []);
	function step(t, ended) {
		const i = beatRef.current;
		const nowPhase = phaseRef.current;
		if (i >= BEATS$2.length) {
			if (ended) landRef.current();
			return;
		}
		const b = BEATS$2[i];
		if (t >= b.at + b.win && !hitRef.current) {
			crash();
			return;
		}
		if (t >= b.at) {
			if (nowPhase !== "open" && nowPhase !== "broke") {
				setDir(b.dir);
				setPhase("open");
			}
			return;
		}
		if (t >= b.at - IN$3) {
			if (nowPhase === "hide" || nowPhase === "broke") {
				hitRef.current = false;
				setDir(b.dir);
				setPhase("in");
			}
		}
	}
	function crash() {
		if (crashedRef.current) return;
		crashedRef.current = true;
		hitRef.current = false;
		setPhase("crash");
		setDodge("");
		videoRef.current?.pause();
		window.setTimeout(() => restart(), 1100);
	}
	function restart() {
		beatRef.current = 0;
		hitRef.current = false;
		crashedRef.current = false;
		setBeat(0);
		setDir("l");
		setDodge("");
		setPhase("hide");
		playSong(SONG.landrun);
		const v = videoRef.current;
		if (!v) return;
		v.currentTime = 0;
		v.play().catch(() => {});
	}
	function dodgeTap(ev) {
		ev.stopPropagation();
		const now = performance.now();
		const v = videoRef.current;
		const b = BEATS$2[beatRef.current];
		const early = phase === "in" && v && b && v.currentTime >= b.at - .45;
		if (now - lastTap.current < 380 && phase !== "open" && !early) goFull();
		lastTap.current = now;
		playSong(SONG.landrun);
		if (crashedRef.current) return;
		if (phase !== "open" && !early) return;
		hitRef.current = true;
		setDodge(dir === "l" ? "r" : "l");
		setPhase("broke");
		const next = beatRef.current + 1;
		beatRef.current = next;
		setBeat(next);
		window.setTimeout(() => setDodge(""), 520);
		window.setTimeout(() => {
			if (beatRef.current >= BEATS$2.length) return;
			setPhase("hide");
		}, 320);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "citadel land-run",
		"data-wired": "true",
		"data-phase": phase,
		"aria-label": "Shatter Veil descent",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "citadel-stage land-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `land-bolt-wrap${dodge ? ` is-${dodge}` : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "citadel-art",
						src: STILL$4,
						alt: "",
						draggable: false,
						hidden: live
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						className: "citadel-art citadel-live",
						src: CLIP$3,
						autoPlay: true,
						muted: true,
						playsInline: true,
						preload: "auto",
						controls: false,
						disablePictureInPicture: true,
						onPlaying: () => setLive(true),
						onEnded: () => {
							if (!crashedRef.current && beatRef.current >= BEATS$2.length) onLand();
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: dodgeTap
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "walk-back",
					onPointerDown: (ev) => {
						ev.stopPropagation();
						playSong(SONG.starmap);
						onBack();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "walk-gem",
						"aria-hidden": "true"
					}), "Citadel"]
				}),
				(phase === "in" || phase === "open") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "land-tap",
					children: "TAP"
				}),
				phase === "crash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "land-crash",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "CRASH" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "howl again" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "land-mark",
					children: [
						beat,
						"/",
						BEATS$2.length
					]
				})
			]
		})
	});
}
var SKIN = {
	veil: {
		still: pub("citadel/launch-veil.jpg") + "?v=2",
		clip: pub("citadel/launch-veil.mp4") + "?v=2",
		next: pub("citadel/landrun-veil.mp4") + "?v=4",
		song: SONG.launch,
		at: 8.7,
		win: 1.55
	},
	sight: {
		still: pub("citadel/launch-sight.jpg") + "?v=1",
		clip: pub("citadel/launch-sight.mp4") + "?v=1",
		next: pub("citadel/landrun-sight.mp4") + "?v=1",
		song: SONG.launch,
		at: 8.2,
		win: 1.7
	}
};
var IN$2 = 1.7;
function LaunchRun({ kind = "veil", onLand, onBack }) {
	const film = SKIN[kind];
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const hitRef = (0, import_react.useRef)(false);
	const crashedRef = (0, import_react.useRef)(false);
	const raf = (0, import_react.useRef)(0);
	const [live, setLive] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)("hide");
	const [leap, setLeap] = (0, import_react.useState)(false);
	const phaseRef = (0, import_react.useRef)(phase);
	const landRef = (0, import_react.useRef)(onLand);
	phaseRef.current = phase;
	landRef.current = onLand;
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		playSong(film.song);
		const v = videoRef.current;
		if (!v) return;
		v.muted = true;
		v.loop = false;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => {
			v.removeEventListener("canplay", playFilm);
			v.pause();
		};
	}, [film.clip]);
	(0, import_react.useEffect)(() => {
		const tick = () => {
			const v = videoRef.current;
			if (v && !crashedRef.current) step(v.currentTime, v.ended || v.currentTime >= 14.7);
			raf.current = requestAnimationFrame(tick);
		};
		raf.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf.current);
	}, [film.at]);
	function step(t, ended) {
		const nowPhase = phaseRef.current;
		if (hitRef.current) {
			if (ended) landRef.current();
			return;
		}
		if (t >= film.at + film.win) {
			crash();
			return;
		}
		if (t >= film.at) {
			if (nowPhase !== "open") setPhase("open");
			return;
		}
		if (t >= film.at - IN$2 && (nowPhase === "hide" || nowPhase === "broke")) setPhase("in");
	}
	function crash() {
		if (crashedRef.current) return;
		crashedRef.current = true;
		hitRef.current = false;
		setLeap(false);
		setPhase("crash");
		videoRef.current?.pause();
		window.setTimeout(() => restart(), 1100);
	}
	function restart() {
		hitRef.current = false;
		crashedRef.current = false;
		setLeap(false);
		setPhase("hide");
		playSong(film.song);
		const v = videoRef.current;
		if (!v) return;
		v.currentTime = 0;
		v.play().catch(() => {});
	}
	function tap(ev) {
		ev.stopPropagation();
		const now = performance.now();
		const v = videoRef.current;
		const early = phase === "in" && v && v.currentTime >= film.at - .4;
		if (now - lastTap.current < 380 && phase !== "open" && !early) goFull();
		lastTap.current = now;
		playSong(film.song);
		if (crashedRef.current) return;
		if (phase !== "open" && !early) return;
		hitRef.current = true;
		setLeap(true);
		setPhase("broke");
		window.setTimeout(() => setLeap(false), 560);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "citadel land-run",
		"data-wired": "true",
		"data-phase": phase,
		"aria-label": "Leave the Citadel",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "citadel-stage land-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `land-bolt-wrap${leap ? " is-leap" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "citadel-art",
						src: film.still,
						alt: "",
						draggable: false
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						className: "citadel-art citadel-live",
						src: film.clip,
						autoPlay: true,
						muted: true,
						playsInline: true,
						preload: "auto",
						controls: false,
						disablePictureInPicture: true,
						hidden: !live,
						onPlaying: () => setLive(true),
						onEnded: () => {
							if (!crashedRef.current && hitRef.current) onLand();
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: tap
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "walk-back",
					onPointerDown: (ev) => {
						ev.stopPropagation();
						playSong(SONG.starmap);
						onBack();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "walk-gem",
						"aria-hidden": "true"
					}), "Citadel"]
				}),
				(phase === "in" || phase === "open") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "land-tap",
					children: "TAP"
				}),
				phase === "crash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "land-crash",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "FELL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "howl again" })]
				})
			]
		})
	});
}
var STILL$3 = pub("citadel/landrun-sight.jpg") + "?v=1";
var CLIP$2 = pub("citadel/landrun-sight.mp4") + "?v=1";
var IN$1 = 1.7;
var HOLD_NEED$1 = 560;
var BEATS$1 = [
	{
		at: 3.4,
		win: 1.35,
		kind: "tap",
		dir: "l"
	},
	{
		at: 7.6,
		win: 1.35,
		kind: "tap",
		dir: "r"
	},
	{
		at: 10.8,
		win: 2.8,
		kind: "hold",
		dir: "c"
	}
];
function SightRun({ onLand, onBack }) {
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const beatRef = (0, import_react.useRef)(0);
	const hitRef = (0, import_react.useRef)(false);
	const holdRef = (0, import_react.useRef)(0);
	const crashedRef = (0, import_react.useRef)(false);
	const raf = (0, import_react.useRef)(0);
	const [live, setLive] = (0, import_react.useState)(false);
	const [beat, setBeat] = (0, import_react.useState)(0);
	const [phase, setPhase] = (0, import_react.useState)("hide");
	const [dodge, setDodge] = (0, import_react.useState)("");
	const [held, setHeld] = (0, import_react.useState)(false);
	const phaseRef = (0, import_react.useRef)(phase);
	const landRef = (0, import_react.useRef)(onLand);
	phaseRef.current = phase;
	landRef.current = onLand;
	const nowBeat = BEATS$1[beat] ?? BEATS$1[BEATS$1.length - 1];
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		playSong(SONG.landrun);
		const v = videoRef.current;
		if (!v) return;
		v.muted = true;
		v.loop = false;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => {
			v.removeEventListener("canplay", playFilm);
			v.pause();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const tick = () => {
			const v = videoRef.current;
			if (v && !crashedRef.current) step(v.currentTime, v.ended || v.currentTime >= 14.7);
			raf.current = requestAnimationFrame(tick);
		};
		raf.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf.current);
	}, []);
	function pass() {
		hitRef.current = true;
		holdRef.current = 0;
		setHeld(false);
		setPhase("broke");
		const next = beatRef.current + 1;
		beatRef.current = next;
		setBeat(next);
		window.setTimeout(() => {
			if (beatRef.current >= BEATS$1.length) return;
			setPhase("hide");
		}, 280);
	}
	function step(t, ended) {
		const i = beatRef.current;
		const nowPhase = phaseRef.current;
		if (i >= BEATS$1.length) {
			if (ended) landRef.current();
			return;
		}
		const b = BEATS$1[i];
		if (t >= b.at + b.win && !hitRef.current) {
			crash();
			return;
		}
		if (t >= b.at) {
			if (nowPhase !== "open" && nowPhase !== "broke") setPhase("open");
			if (b.kind === "hold" && holdRef.current && performance.now() - holdRef.current >= HOLD_NEED$1) pass();
			return;
		}
		if (t >= b.at - IN$1 && (nowPhase === "hide" || nowPhase === "broke")) {
			hitRef.current = false;
			setPhase("in");
		}
		if (b.kind === "hold" && holdRef.current && performance.now() - holdRef.current >= HOLD_NEED$1) pass();
	}
	function crash() {
		if (crashedRef.current) return;
		crashedRef.current = true;
		hitRef.current = false;
		holdRef.current = 0;
		setHeld(false);
		setPhase("crash");
		setDodge("");
		videoRef.current?.pause();
		window.setTimeout(() => restart(), 1100);
	}
	function restart() {
		beatRef.current = 0;
		hitRef.current = false;
		holdRef.current = 0;
		crashedRef.current = false;
		setBeat(0);
		setDodge("");
		setHeld(false);
		setPhase("hide");
		playSong(SONG.landrun);
		const v = videoRef.current;
		if (!v) return;
		v.currentTime = 0;
		v.play().catch(() => {});
	}
	function down(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		try {
			ev.currentTarget.setPointerCapture(ev.pointerId);
		} catch {}
		const now = performance.now();
		const v = videoRef.current;
		const b = BEATS$1[beatRef.current];
		const inHold = b?.kind === "hold" && (phase === "in" || phase === "open");
		const early = phase === "in" && v && b && v.currentTime >= b.at - .6;
		if (now - lastTap.current < 380 && phase !== "open" && !early && !inHold) goFull();
		lastTap.current = now;
		playSong(SONG.landrun);
		if (crashedRef.current || !b) return;
		if (phase !== "open" && !early && !inHold) return;
		if (b.kind === "hold") {
			if (!holdRef.current) holdRef.current = now;
			setHeld(true);
			return;
		}
		const away = b.dir === "l" ? "r" : "l";
		setDodge(away);
		window.setTimeout(() => setDodge(""), 500);
		pass();
	}
	function up() {}
	const prompt = !nowBeat ? "" : nowBeat.kind === "hold" ? "HOLD" : "TAP";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "citadel land-run",
		"data-wired": "true",
		"data-phase": phase,
		"data-hold": held ? "true" : void 0,
		"aria-label": "Howl Sight descent",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "citadel-stage land-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `land-bolt-wrap${dodge ? ` is-${dodge}` : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "citadel-art",
						src: STILL$3,
						alt: "",
						draggable: false
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						className: "citadel-art citadel-live",
						src: CLIP$2,
						autoPlay: true,
						muted: true,
						playsInline: true,
						preload: "auto",
						controls: false,
						disablePictureInPicture: true,
						hidden: !live,
						onPlaying: () => setLive(true),
						onEnded: () => {
							if (!crashedRef.current && beatRef.current >= BEATS$1.length) onLand();
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: down,
					onPointerUp: up,
					onPointerCancel: up
				}),
				nowBeat?.kind === "hold" && (phase === "in" || phase === "open") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: "land-lock",
					"aria-hidden": "true"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "walk-back",
					onPointerDown: (ev) => {
						ev.stopPropagation();
						playSong(SONG.starmap);
						onBack();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "walk-gem",
						"aria-hidden": "true"
					}), "Citadel"]
				}),
				(phase === "in" || phase === "open") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "land-tap",
					children: prompt
				}),
				phase === "crash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "land-crash",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: nowBeat?.kind === "hold" ? "BROKE" : "CRASH" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "howl again" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "land-mark",
					children: [
						beat,
						"/",
						BEATS$1.length
					]
				})
			]
		})
	});
}
var STILL$2 = pub("citadel/landrun-sight-dive.jpg") + "?v=1";
var CLIP$1 = pub("citadel/landrun-sight-dive.mp4") + "?v=1";
var IN = 1.15;
var HOLD_NEED = 520;
var BEATS = [
	{
		at: 1.6,
		win: 1.05,
		kind: "tap",
		dir: "l",
		need: 1,
		label: "TAP"
	},
	{
		at: 3,
		win: 1.05,
		kind: "tap",
		dir: "r",
		need: 1,
		label: "TAP"
	},
	{
		at: 4.4,
		win: 1.05,
		kind: "tap",
		dir: "l",
		need: 1,
		label: "TAP"
	},
	{
		at: 5.8,
		win: 1.55,
		kind: "mash",
		dir: "c",
		need: 4,
		label: "MASH"
	},
	{
		at: 7.7,
		win: 1.05,
		kind: "tap",
		dir: "r",
		need: 1,
		label: "TAP"
	},
	{
		at: 9.1,
		win: 2.3,
		kind: "hold",
		dir: "c",
		need: 1,
		label: "HOLD"
	},
	{
		at: 11.9,
		win: 1.5,
		kind: "tap",
		dir: "c",
		need: 1,
		label: "FIRE"
	}
];
function SightDive({ onLand, onBack }) {
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const beatRef = (0, import_react.useRef)(0);
	const hitsRef = (0, import_react.useRef)(0);
	const holdRef = (0, import_react.useRef)(0);
	const crashedRef = (0, import_react.useRef)(false);
	const raf = (0, import_react.useRef)(0);
	const [live, setLive] = (0, import_react.useState)(false);
	const [beat, setBeat] = (0, import_react.useState)(0);
	const [hits, setHits] = (0, import_react.useState)(0);
	const [phase, setPhase] = (0, import_react.useState)("hide");
	const [dodge, setDodge] = (0, import_react.useState)("");
	const [held, setHeld] = (0, import_react.useState)(false);
	const phaseRef = (0, import_react.useRef)(phase);
	const landRef = (0, import_react.useRef)(onLand);
	phaseRef.current = phase;
	landRef.current = onLand;
	const nowBeat = BEATS[beat] ?? BEATS[BEATS.length - 1];
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		playSong(SONG.landrun);
		const v = videoRef.current;
		if (!v) return;
		v.muted = true;
		v.loop = false;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => {
			v.removeEventListener("canplay", playFilm);
			v.pause();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const tick = () => {
			const v = videoRef.current;
			if (v && !crashedRef.current) step(v.currentTime, v.ended || v.currentTime >= 14.7);
			raf.current = requestAnimationFrame(tick);
		};
		raf.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf.current);
	}, []);
	function pass() {
		holdRef.current = 0;
		hitsRef.current = 0;
		setHeld(false);
		setHits(0);
		setPhase("broke");
		const next = beatRef.current + 1;
		beatRef.current = next;
		setBeat(next);
		window.setTimeout(() => {
			if (beatRef.current >= BEATS.length) return;
			setPhase("hide");
		}, 180);
	}
	function step(t, ended) {
		const i = beatRef.current;
		const nowPhase = phaseRef.current;
		if (i >= BEATS.length) {
			if (ended) landRef.current();
			return;
		}
		const b = BEATS[i];
		if (t >= b.at + b.win && hitsRef.current < b.need && !holdDone(b)) {
			crash();
			return;
		}
		if (b.kind === "hold" && holdRef.current && performance.now() - holdRef.current >= HOLD_NEED) {
			pass();
			return;
		}
		if (t >= b.at) {
			if (nowPhase !== "open" && nowPhase !== "broke") setPhase("open");
			return;
		}
		if (t >= b.at - IN && (nowPhase === "hide" || nowPhase === "broke")) {
			hitsRef.current = 0;
			setHits(0);
			setPhase("in");
		}
	}
	function holdDone(b) {
		return b.kind === "hold" && holdRef.current > 0 && performance.now() - holdRef.current >= HOLD_NEED;
	}
	function crash() {
		if (crashedRef.current) return;
		crashedRef.current = true;
		holdRef.current = 0;
		hitsRef.current = 0;
		setHeld(false);
		setHits(0);
		setPhase("crash");
		setDodge("");
		videoRef.current?.pause();
		window.setTimeout(() => restart(), 1100);
	}
	function restart() {
		beatRef.current = 0;
		hitsRef.current = 0;
		holdRef.current = 0;
		crashedRef.current = false;
		setBeat(0);
		setHits(0);
		setDodge("");
		setHeld(false);
		setPhase("hide");
		playSong(SONG.landrun);
		const v = videoRef.current;
		if (!v) return;
		v.currentTime = 0;
		v.play().catch(() => {});
	}
	function down(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		try {
			ev.currentTarget.setPointerCapture(ev.pointerId);
		} catch {}
		const now = performance.now();
		const v = videoRef.current;
		const b = BEATS[beatRef.current];
		const inHold = b?.kind === "hold" && (phase === "in" || phase === "open");
		const mash = b?.kind === "mash" && (phase === "in" || phase === "open");
		const early = phase === "in" && v && b && v.currentTime >= b.at - .5;
		if (!mash && now - lastTap.current < 280 && phase !== "open" && !early && !inHold) goFull();
		lastTap.current = now;
		playSong(SONG.landrun);
		if (crashedRef.current || !b) return;
		if (phase !== "open" && !early && !inHold && !mash) return;
		if (b.kind === "hold") {
			if (!holdRef.current) holdRef.current = now;
			setHeld(true);
			return;
		}
		if (b.kind === "mash") {
			hitsRef.current += 1;
			setHits(hitsRef.current);
			if (hitsRef.current >= b.need) pass();
			return;
		}
		const away = b.dir === "l" ? "r" : b.dir === "r" ? "l" : "";
		if (away) {
			setDodge(away);
			window.setTimeout(() => setDodge(""), 380);
		}
		pass();
	}
	const prompt = nowBeat.kind === "mash" ? `${nowBeat.label} ${hits}/${nowBeat.need}` : nowBeat.label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "citadel land-run",
		"data-wired": "true",
		"data-phase": phase,
		"data-hold": held ? "true" : void 0,
		"aria-label": "Howl Sight dive",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "citadel-stage land-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `land-bolt-wrap${dodge ? ` is-${dodge}` : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "citadel-art",
						src: STILL$2,
						alt: "",
						draggable: false
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						className: "citadel-art citadel-live",
						src: CLIP$1,
						autoPlay: true,
						muted: true,
						playsInline: true,
						preload: "auto",
						controls: false,
						disablePictureInPicture: true,
						hidden: !live,
						onPlaying: () => setLive(true),
						onEnded: () => {
							if (!crashedRef.current && beatRef.current >= BEATS.length) onLand();
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: down
				}),
				nowBeat.kind === "hold" && (phase === "in" || phase === "open") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: "land-lock",
					"aria-hidden": "true"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "walk-back",
					onPointerDown: (ev) => {
						ev.stopPropagation();
						playSong(SONG.starmap);
						onBack();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "walk-gem",
						"aria-hidden": "true"
					}), "Citadel"]
				}),
				(phase === "in" || phase === "open") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "land-tap",
					children: prompt
				}),
				phase === "crash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "land-crash",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "CRASH" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "howl again" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "land-mark",
					children: [
						beat,
						"/",
						BEATS.length
					]
				})
			]
		})
	});
}
/** Drop a video so Samsung can free the decoder. */
function dropFilm(v) {
	if (!v) return;
	try {
		v.pause();
		v.removeAttribute("src");
		v.load();
	} catch {}
}
var STILL$1 = pub("slash/gate-fps.jpg") + "?v=sight2";
var HUNT = pub("slash/hunt-fps.mp4") + "?v=3";
function FpsGate({ onPlay, onBack }) {
	const huntRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const [hunt, setHunt] = (0, import_react.useState)(false);
	const [skipOn, setSkipOn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!hunt) return;
		const t = window.setTimeout(() => setSkipOn(true), 4e3);
		const v = huntRef.current;
		if (v) {
			v.muted = true;
			v.play().catch(() => {});
		}
		return () => {
			window.clearTimeout(t);
			dropFilm(v);
		};
	}, [hunt]);
	function take() {
		playSong(SONG.landrun);
		setHunt(true);
	}
	function done() {
		dropFilm(huntRef.current);
		onPlay();
	}
	function doubleFull() {
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	if (hunt) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "slash-hunt",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: huntRef,
				className: "slash-hunt-film",
				src: HUNT,
				autoPlay: true,
				muted: true,
				playsInline: true,
				preload: "auto",
				disablePictureInPicture: true,
				controls: false,
				onEnded: done,
				onError: done
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-hunt-vignette" }),
			skipOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "slash-hunt-hit",
				"aria-label": "Skip intro",
				onClick: done
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "slash-hunt-skip",
				onClick: done,
				children: "Skip"
			})] }) : null
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "slash-gate fps-gate",
		"data-class": "fps",
		onPointerDown: doubleFull,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "slash-gate-stage",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "slash-gate-art",
						src: STILL$1,
						alt: "",
						draggable: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-vignette" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-bloom" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "slash-gate-frame" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "slash-gate-mark",
				children: "Howl Sight"
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
						children: "Howl Sight"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "slash-sub",
						children: "First person. The kiln is the range. Crystal never chrome."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "slash-enter",
						onPointerDown: (ev) => {
							ev.stopPropagation();
							take();
						},
						children: "Take the Sight"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "slash-back",
						onPointerDown: (ev) => {
							ev.stopPropagation();
							playSong(SONG.hub);
							onBack();
						},
						children: "Citadel"
					})
				]
			})
		]
	});
}
var KILNS = [
	{
		id: "new",
		name: "New Artifact",
		line: "Born in the kiln",
		action: "New Artifact",
		still: pub("citadel/kiln-new.jpg") + "?v=1",
		clip: pub("citadel/kiln-new.mp4") + "?v=1",
		song: SONG.kilnNew
	},
	{
		id: "remix",
		name: "Remix",
		line: "Two fires, one relic",
		action: "Remix",
		still: pub("citadel/kiln-remix.jpg") + "?v=1",
		clip: pub("citadel/kiln-remix.mp4") + "?v=1",
		song: SONG.kilnRemix
	},
	{
		id: "version",
		name: "New Version",
		line: "The next howl of the relic",
		action: "New Version",
		still: pub("citadel/kiln-version.jpg") + "?v=1",
		clip: pub("citadel/kiln-version.mp4") + "?v=1",
		song: SONG.kilnVersion
	}
];
function ForgeKiln({ onBack, onPick }) {
	const [i, setI] = (0, import_react.useState)(0);
	const [live, setLive] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const kiln = KILNS[i];
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		setLive(false);
		playSong(kiln.song);
		const v = videoRef.current;
		if (!v) return;
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => v.removeEventListener("canplay", playFilm);
	}, [kiln]);
	function tap(fn) {
		return (ev) => {
			ev.stopPropagation();
			playSong(kiln.song);
			fn();
		};
	}
	function doubleFull() {
		playSong(kiln.song);
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "walk kiln",
		"data-wired": "true",
		"data-armed": "true",
		"aria-label": "Bolt Forge kiln",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "walk-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "walk-art",
					src: kiln.still,
					alt: "",
					hidden: live
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "walk-art walk-live",
					src: kiln.clip,
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					preload: "auto",
					controls: false,
					disablePictureInPicture: true,
					onPlaying: () => setLive(true)
				}, kiln.id),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: doubleFull
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "walk-back",
					onPointerDown: tap(() => {
						playSong(SONG.forge);
						onBack();
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "walk-gem",
						"aria-hidden": "true"
					}), "Citadel"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "walk-arrow walk-arrow-l",
					onPointerDown: tap(() => setI((n) => (n + KILNS.length - 1) % KILNS.length)),
					"aria-label": "Previous",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { strokeWidth: 2.8 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "walk-arrow walk-arrow-r",
					onPointerDown: tap(() => setI((n) => (n + 1) % KILNS.length)),
					"aria-label": "Next",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { strokeWidth: 2.8 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "walk-foot",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "walk-mark",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: kiln.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: kiln.line })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-enter",
						onPointerDown: tap(() => onPick(kiln.id)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: kiln.action })
					})]
				})
			]
		})
	});
}
var PATHS$1 = [{
	id: "bot",
	name: "Forge with Grok Bot",
	line: "Howl, and the kiln answers",
	action: "Grok Bot",
	still: pub("citadel/forge-bot.jpg") + "?v=1",
	clip: pub("citadel/forge-bot.mp4") + "?v=1",
	song: SONG.forgeBot
}, {
	id: "hand",
	name: "Forge manually",
	line: "Paw and hammer, no voice but yours",
	action: "Manually",
	still: pub("citadel/forge-hand.jpg") + "?v=1",
	clip: pub("citadel/forge-hand.mp4") + "?v=1",
	song: SONG.forgeHand
}];
function ForgeGate({ onBack, onPick }) {
	const [i, setI] = (0, import_react.useState)(0);
	const [live, setLive] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const path = PATHS$1[i];
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		setLive(false);
		playSong(path.song);
		const v = videoRef.current;
		if (!v) return;
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => v.removeEventListener("canplay", playFilm);
	}, [path]);
	function tap(fn) {
		return (ev) => {
			ev.stopPropagation();
			playSong(path.song);
			fn();
		};
	}
	function doubleFull() {
		playSong(path.song);
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "walk kiln",
		"data-wired": "true",
		"data-armed": "true",
		"aria-label": "Choose the forge",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "walk-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "walk-art",
					src: path.still,
					alt: "",
					hidden: live
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "walk-art walk-live",
					src: path.clip,
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					preload: "auto",
					controls: false,
					disablePictureInPicture: true,
					onPlaying: () => setLive(true)
				}, path.id),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: doubleFull
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "walk-back",
					onPointerDown: tap(() => {
						playSong(SONG.forge);
						onBack();
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "walk-gem",
						"aria-hidden": "true"
					}), "Citadel"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "walk-arrow walk-arrow-l",
					onPointerDown: tap(() => setI((n) => (n + PATHS$1.length - 1) % PATHS$1.length)),
					"aria-label": "Previous",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { strokeWidth: 2.8 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "walk-arrow walk-arrow-r",
					onPointerDown: tap(() => setI((n) => (n + 1) % PATHS$1.length)),
					"aria-label": "Next",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { strokeWidth: 2.8 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "walk-foot",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "walk-mark",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: path.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: path.line })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-enter",
						onPointerDown: tap(() => onPick(path.id)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: path.action })
					})]
				})
			]
		})
	});
}
var CACHE = "lc-relics";
function readRelicCache() {
	try {
		const rows = JSON.parse(localStorage.getItem(CACHE) || "[]");
		return Array.isArray(rows) ? rows.filter((r) => r?.id && r?.href) : [];
	} catch {
		return [];
	}
}
function writeRelicCache(rows) {
	try {
		localStorage.setItem(CACHE, JSON.stringify(rows.slice(0, 48)));
	} catch {}
}
function rememberRelic(row) {
	const next = [row, ...readRelicCache().filter((r) => r.href !== row.href && r.id !== row.id)].slice(0, 48);
	writeRelicCache(next);
	return next;
}
async function pullRelics() {
	const cached = readRelicCache();
	try {
		const res = await fetch("/api/relics", {
			credentials: "same-origin",
			cache: "no-store"
		});
		const body = await res.json();
		if (!res.ok || !Array.isArray(body)) return cached;
		const rows = body.filter((r) => r?.id && r?.href);
		writeRelicCache(rows);
		return rows;
	} catch {
		return cached;
	}
}
var PATHS = [{
	id: "walker",
	name: "Walker Den",
	line: "Where your howl sleeps",
	action: "Rest",
	still: pub("citadel/den-walker.jpg") + "?v=1",
	clip: pub("citadel/den-walker.mp4") + "?v=1",
	song: SONG.denWalker
}, {
	id: "howlwright",
	name: "Howlwright Den",
	line: "Where makers keep the fire",
	action: "Make",
	still: pub("citadel/den-maker.jpg") + "?v=1",
	clip: pub("citadel/den-maker.mp4") + "?v=1",
	song: SONG.denMaker
}];
var KILN_STILL = pub("citadel/kiln-new.jpg") + "?v=1";
var KILN_CLIP = pub("citadel/kiln-new.mp4") + "?v=1";
var LEDGER_STILL = pub("citadel/ledger.jpg") + "?v=3";
var LEDGER_CLIP = pub("citadel/ledger.mp4") + "?v=3";
function when(raw) {
	if (!raw) return "—";
	const t = Date.parse(raw);
	if (!Number.isFinite(t)) return "—";
	return new Date(t).toLocaleDateString(void 0, {
		month: "short",
		day: "numeric"
	});
}
function DenGate({ onBack, onPick, onBind, onLandSeed, startVault, focusId }) {
	const [i, setI] = (0, import_react.useState)(startVault ? 1 : 0);
	const [live, setLive] = (0, import_react.useState)(false);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const [vault, setVault] = (0, import_react.useState)(!!startVault);
	const [ledger, setLedger] = (0, import_react.useState)(false);
	const [kilnLive, setKilnLive] = (0, import_react.useState)(false);
	const [clock, setClock] = (0, import_react.useState)("00:00:00");
	const [seeds, setSeeds] = (0, import_react.useState)(readRelicCache);
	const [pickI, setPickI] = (0, import_react.useState)(0);
	const videoRef = (0, import_react.useRef)(null);
	const kilnRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const path = PATHS[i];
	const cards = seeds.map((r) => ({
		id: r.id,
		name: relicName(r.href),
		line: relicHost(r.href),
		href: r.href,
		plays: r.plays ?? 0,
		createdAt: r.created_at,
		lastLand: r.last_land ?? null
	}));
	const pick = cards[pickI] ?? null;
	(0, import_react.useEffect)(() => {
		pullRelics().then(setSeeds);
	}, []);
	(0, import_react.useEffect)(() => {
		if (startVault) {
			setI(1);
			setVault(true);
			if (focusId) {
				const n = cards.findIndex((c) => c.id === focusId);
				if (n >= 0) setPickI(n);
			}
		}
	}, [
		startVault,
		focusId,
		seeds
	]);
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		setArmed(false);
		setLive(false);
		playSong(path.song);
		const arm = window.setTimeout(() => setArmed(true), 450);
		const v = videoRef.current;
		if (!v) return () => window.clearTimeout(arm);
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => {
			window.clearTimeout(arm);
			v.removeEventListener("canplay", playFilm);
		};
	}, [path]);
	(0, import_react.useEffect)(() => {
		const den = videoRef.current;
		if (vault && pick) den?.pause();
		else den?.play().catch(() => {});
		const kiln = kilnRef.current;
		if (ledger) kiln?.pause();
		else if (vault && pick) kiln?.play().catch(() => {});
	}, [
		vault,
		pick,
		ledger
	]);
	(0, import_react.useEffect)(() => {
		setKilnLive(false);
		const v = kilnRef.current;
		if (!vault || !pick || !v) return;
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setKilnLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => v.removeEventListener("canplay", playFilm);
	}, [vault, pick?.id]);
	(0, import_react.useEffect)(() => {
		if (!ledger) return;
		const tick = () => {
			const d = /* @__PURE__ */ new Date();
			setClock([
				d.getHours(),
				d.getMinutes(),
				d.getSeconds()
			].map((n) => String(n).padStart(2, "0")).join(":"));
		};
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, [ledger]);
	function tap(fn) {
		return (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
			if (!armed) return;
			playSong(path.song);
			fn();
		};
	}
	function doubleFull() {
		playSong(path.song);
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	function make() {
		if (path.id === "howlwright") {
			setVault(true);
			return;
		}
		onPick(path.id);
	}
	function stepVault(dir) {
		if (!cards.length) return;
		setLedger(false);
		setPickI((n) => (n + dir + cards.length) % cards.length);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "walk kiln",
		"data-wired": "true",
		"data-armed": armed ? "true" : void 0,
		"aria-label": "Choose a den",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "walk-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "walk-art",
					src: path.still,
					alt: "",
					hidden: live
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "walk-art walk-live",
					src: path.clip,
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					preload: "auto",
					controls: false,
					disablePictureInPicture: true,
					onPlaying: () => setLive(true)
				}, path.id),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: doubleFull
				}),
				!vault ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "walk-back",
						onPointerDown: tap(() => {
							playSong(SONG.den);
							onBack();
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: "walk-gem",
							"aria-hidden": "true"
						}), "Citadel"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-arrow walk-arrow-l",
						onPointerDown: tap(() => setI((n) => (n + PATHS.length - 1) % PATHS.length)),
						"aria-label": "Previous",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { strokeWidth: 2.8 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-arrow walk-arrow-r",
						onPointerDown: tap(() => setI((n) => (n + 1) % PATHS.length)),
						"aria-label": "Next",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { strokeWidth: 2.8 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "walk-foot",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "walk-mark",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: path.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: path.line })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "walk-enter",
							onPointerDown: tap(make),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: path.action })
						})]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pack-back",
						onPointerDown: tap(() => {
							setLedger(false);
							setVault(false);
						}),
						children: "Den"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "relic-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Howlwright" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: pick?.name ?? "No fire yet" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "relic-frame",
						"aria-label": pick?.name ?? "vault",
						onPointerDown: tap(() => {
							if (pick) setLedger(true);
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: KILN_STILL,
							alt: "",
							hidden: kilnLive
						}), pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: kilnRef,
							src: KILN_CLIP,
							autoPlay: true,
							muted: true,
							loop: true,
							playsInline: true,
							preload: "metadata",
							controls: false,
							disablePictureInPicture: true,
							onPlaying: () => setKilnLive(true)
						}) : null]
					}),
					cards.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-arrow walk-arrow-l",
						"aria-label": "Previous",
						onPointerDown: tap(() => stepVault(-1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { strokeWidth: 2.6 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "walk-arrow walk-arrow-r",
						"aria-label": "Next",
						onPointerDown: tap(() => stepVault(1)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { strokeWidth: 2.6 })
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pack-x",
						onPointerDown: tap(() => {
							if (!pick) {
								onBind();
								return;
							}
							if (onLandSeed) onLandSeed(pick.href, pick.name, pick.id);
							else setLedger(true);
						}),
						children: pick ? "Land" : "Bind"
					}),
					ledger && pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "relic-ledger",
						role: "dialog",
						"aria-label": `${pick.name} ledger`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								className: "relic-ledger-art",
								src: LEDGER_STILL,
								alt: ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								className: "relic-ledger-art",
								src: LEDGER_CLIP,
								autoPlay: true,
								muted: true,
								loop: true,
								playsInline: true,
								preload: "metadata",
								controls: false,
								disablePictureInPicture: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relic-screen",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Howlwright OS // ledger" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: clock }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "live" })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: pick.name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "Lands" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: String(pick.plays ?? 0).padStart(2, "0") })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "Bound" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: when(pick.createdAt) })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "Last land" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: pick.lastLand ? when(pick.lastLand) : "never" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "Seed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: pick.line })] })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relic-wave",
										"aria-hidden": "true",
										children: Array.from({ length: 18 }, (_, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}, n))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kiln 1847°" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pack 98%" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Seed lock" })
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "relic-ledger-x",
								onPointerDown: tap(() => setLedger(false)),
								children: "Close"
							})
						]
					}) : null
				] })
			]
		})
	});
}
var STILL = pub("citadel/kiln-new.jpg") + "?v=1";
var CLIP = pub("citadel/kiln-new.mp4") + "?v=1";
function ForgeBind({ onBack, onBound }) {
	const [live, setLive] = (0, import_react.useState)(false);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const [value, setValue] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const arm = window.setTimeout(() => setArmed(true), 420);
		playSong(SONG.kilnNew);
		const v = videoRef.current;
		if (!v) return () => window.clearTimeout(arm);
		v.muted = true;
		v.loop = true;
		v.playsInline = true;
		const playFilm = () => {
			v.muted = true;
			v.play().then(() => setLive(true)).catch(() => {});
		};
		playFilm();
		v.addEventListener("canplay", playFilm);
		return () => {
			window.clearTimeout(arm);
			v.removeEventListener("canplay", playFilm);
		};
	}, []);
	function stop(ev) {
		ev.stopPropagation();
	}
	function doubleFull() {
		playSong(SONG.kilnNew);
		const now = performance.now();
		if (now - lastTap.current < 380) goFull();
		lastTap.current = now;
	}
	function bind(ev) {
		ev?.preventDefault();
		ev?.stopPropagation();
		if (!armed || busy) return;
		playSong(SONG.kilnNew);
		const seed = parseGrokSeed(value);
		if (!seed) {
			setErr("The kiln only takes a grok.me seed.");
			return;
		}
		setErr("");
		setBusy(true);
		fetch("/api/relics", {
			method: "POST",
			headers: { "content-type": "application/json" },
			credentials: "same-origin",
			body: JSON.stringify({ href: seed.href })
		}).then(async (res) => {
			const body = await res.json().catch(() => null);
			if (!res.ok || !body?.id || !body?.href) throw new Error(body?.error || "bind_failed");
			rememberRelic({
				id: body.id,
				href: body.href,
				plays: 0,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			});
			onBound({
				id: body.id,
				href: body.href
			});
		}).catch((err) => {
			const msg = err instanceof Error ? err.message : "";
			setErr(msg && msg !== "bind_failed" ? msg : "The kiln could not hold that seed.");
			setBusy(false);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "walk kiln bind",
		"data-wired": "true",
		"data-armed": armed ? "true" : void 0,
		"aria-label": "Bind a relic",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "walk-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "walk-art",
					src: STILL,
					alt: "",
					hidden: live
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "walk-art walk-live",
					src: CLIP,
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					preload: "auto",
					controls: false,
					disablePictureInPicture: true,
					onPlaying: () => setLive(true)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "citadel-shield",
					onPointerDown: doubleFull
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "walk-back",
					onPointerDown: (ev) => {
						stop(ev);
						playSong(SONG.kilnNew);
						onBack();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: "walk-gem",
						"aria-hidden": "true"
					}), "Forge"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "bind-seed",
					onSubmit: bind,
					onPointerDown: stop,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "walk-mark",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Bind a Relic" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Paste the grok.me sandbox" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "url",
							inputMode: "url",
							autoCapitalize: "none",
							autoCorrect: "off",
							spellCheck: false,
							placeholder: "https://your-app.grok.me",
							value,
							onChange: (e) => {
								setValue(e.target.value);
								if (err) setErr("");
							},
							"aria-label": "Grok sandbox link"
						}),
						err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: "bind-err",
							children: err
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "walk-enter",
							disabled: busy,
							onPointerDown: bind,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: busy ? "Binding…" : "Bind" })
						})
					]
				})
			]
		})
	});
}
function RelicPortal({ href, name, id, backLabel = "Hall", onBack }) {
	const [armed, setArmed] = (0, import_react.useState)(false);
	const [veil, setVeil] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		freezeTaps(400);
		playSong(SONG.relic);
		setVeil(true);
		const arm = window.setTimeout(() => setArmed(true), 280);
		const hide = window.setTimeout(() => setVeil(false), 1100);
		if (id) fetch("/api/relics", {
			method: "POST",
			headers: { "content-type": "application/json" },
			credentials: "same-origin",
			body: JSON.stringify({
				id,
				play: true
			})
		}).catch(() => {});
		return () => {
			window.clearTimeout(arm);
			window.clearTimeout(hide);
		};
	}, [href, id]);
	function back(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		if (!armed || tapsFrozen()) return;
		freezeTaps(600);
		playSong(SONG.relic);
		onBack();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "citadel relic-portal relic-gate",
		"data-wired": "true",
		"data-armed": armed ? "true" : void 0,
		"aria-label": name,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "citadel-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					className: "relic-live",
					src: href,
					title: name,
					allow: "autoplay; fullscreen; gamepad; xr-spatial-tracking; clipboard-write",
					referrerPolicy: "no-referrer-when-downgrade"
				}),
				veil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relic-veil",
					"aria-hidden": "true",
					children: "Landing"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pack-back",
					onPointerDown: back,
					children: backLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "relic-open",
					href,
					target: "_blank",
					rel: "noopener noreferrer",
					children: "Open seed"
				})
			]
		})
	});
}
var SlashHud = (0, import_react.lazy)(() => import("./SlashHud-Bhba54SB.mjs").then((m) => ({ default: m.SlashHud })));
var FpsHud = (0, import_react.lazy)(() => import("./FpsHud-BRTV19-1.mjs").then((m) => ({ default: m.FpsHud })));
var CircuitHud = (0, import_react.lazy)(() => import("./CircuitHud-Db3TNnW8.mjs").then((m) => ({ default: m.CircuitHud })));
var CircuitNet = (0, import_react.lazy)(() => import("./CircuitNet-bH4Oluzm.mjs").then((m) => ({ default: m.CircuitNet })));
var CircuitBot = (0, import_react.lazy)(() => import("./CircuitBot-B-qdxFva.mjs").then((m) => ({ default: m.CircuitBot })));
var CircuitTrial = (0, import_react.lazy)(() => import("./CircuitTrial-D2trgzwH.mjs").then((m) => ({ default: m.CircuitTrial })));
var EMPTY = {
	mode: "title",
	toast: null,
	lookX: 0,
	lookZ: 0,
	charge: 0,
	tended: false,
	joined: false,
	grown: 0,
	named: 0,
	howling: false,
	near: null,
	prompt: "",
	aim: "",
	needle: 0,
	act: "",
	botOn: false,
	botName: "Grok Bot",
	host: true,
	landId: "",
	island: "Beginning",
	skills: []
};
var SKY_EMPTY = {
	pick: null,
	toast: null,
	view: "constellation"
};
var SLASH_EMPTY = {
	mode: "title",
	hp: 140,
	hpMax: 140,
	fury: 40,
	furyMax: 100,
	resource: "Fury",
	classId: "fang",
	className: "Fang",
	xp: 0,
	xpNext: 80,
	level: 1,
	gold: 0,
	wave: 0,
	kills: 0,
	combo: 0,
	toast: null,
	skills: [],
	buff: 0,
	floaters: []
};
var FPS_EMPTY = {
	mode: "title",
	hp: 120,
	hpMax: 120,
	ammo: 14,
	mag: 14,
	reserve: 84,
	reloading: 0,
	wave: 0,
	kills: 0,
	gold: 0,
	toast: null,
	hit: 0,
	hurt: 0
};
function RaisingApp() {
	const canvasRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const skyRef = (0, import_react.useRef)(null);
	const slashRef = (0, import_react.useRef)(null);
	const fpsRef = (0, import_react.useRef)(null);
	const [place, setPlaceRaw] = (0, import_react.useState)("citadel");
	const setPlace = (next) => {
		freezeTaps(1800);
		setPlaceRaw(next);
	};
	const [launchKind, setLaunchKind] = (0, import_react.useState)("veil");
	const [forgePath, setForgePath] = (0, import_react.useState)("hand");
	const [hallFocus, setHallFocus] = (0, import_react.useState)(null);
	const [portal, setPortal] = (0, import_react.useState)(null);
	const [portalFrom, setPortalFrom] = (0, import_react.useState)("hall");
	const [bindFrom, setBindFrom] = (0, import_react.useState)("kiln");
	const [openVault, setOpenVault] = (0, import_react.useState)(false);
	const [hud, setHud] = (0, import_react.useState)(EMPTY);
	const [skyHud, setSkyHud] = (0, import_react.useState)(SKY_EMPTY);
	const [slashHud, setSlashHud] = (0, import_react.useState)(SLASH_EMPTY);
	const [fpsHud, setFpsHud] = (0, import_react.useState)(FPS_EMPTY);
	const [bootError, setBootError] = (0, import_react.useState)(null);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [pack, setPack] = (0, import_react.useState)(1);
	const [live, setLive] = (0, import_react.useState)(false);
	const [botOpen, setBotOpen] = (0, import_react.useState)(false);
	const mineRef = (0, import_react.useRef)(myLandId());
	const [landId, setLandId] = (0, import_react.useState)(() => readVisitFromUrl() || mineRef.current);
	const host = landId === mineRef.current;
	const resumePlay = (0, import_react.useRef)(false);
	const onPack = (0, import_react.useCallback)((n, isLive, _failed) => {
		setPack(n);
		setLive(isLive);
	}, []);
	const onBotLanded = (0, import_react.useCallback)((on, name) => {
		engineRef.current?.setBot(on, name);
	}, []);
	const onBotWork = (0, import_react.useCallback)((text) => {
		engineRef.current?.botWork(text);
	}, []);
	const onBotTeach = (0, import_react.useCallback)((text) => {
		engineRef.current?.teach(text);
	}, []);
	const onRename = (0, import_react.useCallback)((name) => {
		return engineRef.current?.setIsland(name) ?? false;
	}, []);
	const goLand = (0, import_react.useCallback)((raw) => {
		const mine = mineRef.current;
		const next = parseLandCode(raw) || mine;
		resumePlay.current = hud.mode === "play" || hud.mode === "pause";
		setLandId(next);
		writeLandUrl(next, mine);
		setBotOpen(false);
	}, [hud.mode]);
	(0, import_react.useEffect)(() => {
		window.__LC_BOOTED = true;
		try {
			sessionStorage.removeItem("lc-place");
			localStorage.removeItem("lc-place");
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (place === "citadel" || place === "hall" || place === "walk" || place === "starmap" || place === "landrun" || place === "launch" || place === "sightrun" || place === "sightdive" || place === "fpsgate" || place === "kiln" || place === "forgegate" || place === "bind" || place === "dengate" || place === "made" || place === "portal") return;
		if (!canvasRef.current) return;
		const bag = window;
		let disposed = false;
		if (bag.__LC_ENGINE) {
			try {
				bag.__LC_ENGINE.dispose();
			} catch {}
			bag.__LC_ENGINE = void 0;
			bag.__LC_BOOTED = false;
			bag.__RAISING = false;
		}
		engineRef.current = null;
		skyRef.current = null;
		slashRef.current = null;
		fpsRef.current = null;
		if (place === "sky") import("./constellation-engine-C1BTSlkz.mjs").then(({ startSky }) => {
			if (disposed || !canvasRef.current) return;
			try {
				const handle = startSky(canvasRef.current, setSkyHud, () => setPlace("circuit"));
				skyRef.current = handle;
				bag.__LC_ENGINE = handle;
				bag.__LC_BOOTED = true;
				bag.__RAISING = true;
				setBootError(null);
			} catch (err) {
				setBootError(err instanceof Error ? err.message : "The sky failed to wake.");
			}
		}).catch((err) => {
			if (!disposed) setBootError(err instanceof Error ? err.message : "The sky failed to wake.");
		});
		else if (place === "slash") import("./slash-engine-CQpDMeee.mjs").then(({ startSlash }) => {
			if (disposed || !canvasRef.current) return;
			try {
				const handle = startSlash(canvasRef.current, setSlashHud);
				slashRef.current = handle;
				bag.__LC_ENGINE = handle;
				bag.__LC_BOOTED = true;
				bag.__RAISING = true;
				setBootError(null);
				handle.audio.setMuted(muted);
			} catch (err) {
				setBootError(err instanceof Error ? err.message : "The Veil failed to wake.");
			}
		}).catch((err) => {
			if (!disposed) setBootError(err instanceof Error ? err.message : "The Veil failed to wake.");
		});
		else if (place === "fps") import("./fps-engine-Bedu9r00.mjs").then(({ startFps }) => {
			if (disposed || !canvasRef.current) return;
			try {
				const handle = startFps(canvasRef.current, setFpsHud);
				fpsRef.current = handle;
				bag.__LC_ENGINE = handle;
				bag.__LC_BOOTED = true;
				bag.__RAISING = true;
				setBootError(null);
				handle.audio.setMuted(muted);
				handle.start();
			} catch (err) {
				setBootError(err instanceof Error ? err.message : "The Sight failed to wake.");
			}
		}).catch((err) => {
			if (!disposed) setBootError(err instanceof Error ? err.message : "The Sight failed to wake.");
		});
		else import("./raising-engine-B03zPZqk.mjs").then(({ startRaising }) => {
			if (disposed || !canvasRef.current) return;
			try {
				const handle = startRaising(canvasRef.current, setHud, {
					host: landId === mineRef.current,
					landId
				});
				engineRef.current = handle;
				bag.__LC_ENGINE = handle;
				bag.__LC_BOOTED = true;
				bag.__RAISING = true;
				bag.__LC_LAND = () => handle.land();
				setBootError(null);
				handle.audio.setMuted(muted);
				if (resumePlay.current) {
					resumePlay.current = false;
					handle.land();
				}
			} catch (err) {
				engineRef.current = null;
				setBootError(err instanceof Error ? err.message : "The crucible failed to wake.");
			}
		}).catch((err) => {
			if (!disposed) setBootError(err instanceof Error ? err.message : "The crucible failed to wake.");
		});
		return () => {
			disposed = true;
			try {
				bag.__LC_ENGINE?.dispose();
			} catch {}
			bag.__LC_ENGINE = void 0;
		};
	}, [place, landId]);
	const onCircuit = place === "circuit" && !bootError;
	const playing = onCircuit && hud.mode === "play";
	const paused = place === "circuit" && hud.mode === "pause";
	const onSky = place === "sky" && !bootError;
	const onSlash = place === "slash" && !bootError;
	const onFps = place === "fps" && !bootError;
	const slashPlay = onSlash && slashHud.mode === "play";
	const fpsPlay = onFps && fpsHud.mode === "play";
	const pick = skyHud.pick;
	function landFromHall(id) {
		const a = artifactById(id);
		if (a?.enter === "slash") setPlace("slash");
		else if (a?.enter === "fps") setPlace("fpsgate");
		else if (a?.open) setPlace("circuit");
	}
	function landPick() {
		if (!pick?.open) return;
		if (pick.enter === "slash") setPlace("slash");
		else if (pick.enter === "fps") setPlace("fpsgate");
		else setPlace("circuit");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `circuit-root raising-root${onSlash || onFps || onCircuit ? " is-slash" : ""}`,
		children: [
			(place === "sky" || place === "circuit" || place === "slash" || place === "fps") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "circuit-canvas z-0",
				style: {
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					display: "block",
					background: "#070918",
					touchAction: "none",
					pointerEvents: onSky || playing || paused || slashPlay || fpsPlay ? "auto" : "none"
				}
			}),
			place === "citadel" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitadelHub, {
				onHall: () => setPlace("walk"),
				onConstellation: () => setPlace("starmap"),
				onLand: () => setPlace("circuit")
			}),
			place === "walk" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoneWalk, {
				onBack: () => setPlace("citadel"),
				onEnter: (id) => {
					if (id === "hall") {
						setHallFocus(null);
						setPlace("hall");
					} else if (id === "den") setPlace("dengate");
					else if (id === "forge") setPlace("forgegate");
					else if (id === "stars") setPlace("starmap");
				}
			}),
			place === "dengate" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DenGate, {
				startVault: openVault,
				focusId: hallFocus,
				onBack: () => {
					setOpenVault(false);
					setPlace("walk");
				},
				onPick: (id) => {
					if (id === "walker") setPlace("circuit");
				},
				onBind: () => {
					setOpenVault(true);
					setBindFrom("made");
					setPlace("bind");
				},
				onLandSeed: (href, name, id) => {
					setPortal({
						href,
						name,
						id
					});
					setPortalFrom("made");
					setPlace("portal");
				}
			}),
			place === "forgegate" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForgeGate, {
				onBack: () => setPlace("walk"),
				onPick: (id) => {
					setForgePath(id);
					setPlace("kiln");
				}
			}),
			place === "kiln" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForgeKiln, {
				onBack: () => setPlace("forgegate"),
				onPick: (id) => {
					if (id === "new" && forgePath === "hand") {
						setBindFrom("kiln");
						setPlace("bind");
					}
				}
			}),
			place === "bind" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForgeBind, {
				onBack: () => setPlace(bindFrom === "made" ? "dengate" : bindFrom),
				onBound: (relic) => {
					setHallFocus(relic.id);
					setPortal({
						href: relic.href,
						name: relicName(relic.href),
						id: relic.id
					});
					setPortalFrom(bindFrom === "made" ? "made" : "hall");
					setPlace("portal");
				}
			}),
			place === "starmap" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarMap, {
				onLand: (id) => {
					if (id === "shatter-veil") {
						setLaunchKind("veil");
						setPlace("launch");
					} else if (id === "howl-sight") {
						setLaunchKind("sight");
						setPlace("launch");
					} else landFromHall(id);
				},
				onBack: () => setPlace("citadel")
			}),
			place === "launch" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaunchRun, {
				kind: launchKind,
				onLand: () => setPlace(launchKind === "sight" ? "sightrun" : "landrun"),
				onBack: () => setPlace("starmap")
			}),
			place === "landrun" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandRun, {
				onLand: () => setPlace("slash"),
				onBack: () => setPlace("starmap")
			}),
			place === "sightrun" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SightRun, {
				onLand: () => setPlace("sightdive"),
				onBack: () => setPlace("starmap")
			}),
			place === "sightdive" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SightDive, {
				onLand: () => setPlace("fpsgate"),
				onBack: () => setPlace("starmap")
			}),
			place === "fpsgate" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FpsGate, {
				onPlay: () => setPlace("fps"),
				onBack: () => setPlace("starmap")
			}),
			place === "hall" && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArtifactHall, {
				onLand: landFromHall,
				onConstellation: () => setPlace("starmap"),
				onHome: () => setPlace("citadel"),
				focusId: hallFocus
			}),
			place === "portal" && portal && !bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelicPortal, {
				href: portal.href,
				name: portal.name,
				id: portal.id,
				backLabel: portalFrom === "made" ? "Den" : "Hall",
				onBack: () => setPlace(portalFrom)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
				fallback: null,
				children: [
					onSlash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlashHud, {
						hud: slashHud,
						muted,
						onStart: () => slashRef.current?.start(),
						onCast: (id) => slashRef.current?.cast(id),
						onStick: (x, y) => slashRef.current?.setStick(x, y),
						onCitadel: () => setPlace("hall"),
						onClass: (id) => slashRef.current?.setClass(id),
						onMute: () => {
							const next = !muted;
							setMuted(next);
							slashRef.current?.audio.setMuted(next);
						}
					}),
					onFps && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FpsHud, {
						hud: fpsHud,
						muted,
						onStart: () => fpsRef.current?.start(),
						onStick: (x, y) => fpsRef.current?.setStick(x, y),
						onLook: (x, y) => fpsRef.current?.setLook(x, y),
						onFire: (v) => fpsRef.current?.setFire(v),
						onReload: () => fpsRef.current?.setReload(),
						onCitadel: () => setPlace("hall"),
						onMute: () => {
							const next = !muted;
							setMuted(next);
							fpsRef.current?.audio.setMuted(next);
						}
					}),
					onCircuit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitNet, {
							engineRef,
							playing,
							host,
							room: landRoom(landId),
							onPack
						}, landRoom(landId)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitHud, {
							hud,
							pack,
							live,
							onStart: () => {
								if (hud.mode === "pause") engineRef.current?.setMode("play");
								else engineRef.current?.land();
							},
							onCitadel: () => setPlace("hall"),
							onAskBot: () => setBotOpen(true),
							botOpen
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitTrial, {
							playing,
							hidden: botOpen
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitBot, {
							playing,
							open: botOpen,
							onOpen: setBotOpen,
							onLanded: onBotLanded,
							onWork: onBotWork,
							onTeach: onBotTeach,
							onHall: () => setPlace("hall"),
							host,
							landId,
							island: hud.island,
							mine: mineRef.current,
							skills: hud.skills,
							onVisit: goLand,
							onRename
						})
					] })
				]
			}),
			onSky && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 z-10 hud-safe flex flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "raising-head raising-head-hall",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "raising-kicker",
							children: "Boltverse"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "raising-toggle hall-toggle pointer-events-auto",
							role: "tablist",
							"aria-label": "Sky view",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": false,
								onClick: () => setPlace("citadel"),
								children: "Citadel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": "true",
								"data-on": "true",
								children: "Stars"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 relative min-h-0",
						children: skyHud.toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "raising-toast",
							children: skyHud.toast
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "raising-sky-card pointer-events-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "raising-relics",
								role: "listbox",
								"aria-label": "Worlds",
								children: ARTIFACTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "option",
									"aria-selected": pick?.id === a.id,
									"aria-label": a.name,
									"data-id": a.id,
									"data-on": pick?.id === a.id ? "true" : void 0,
									"data-open": a.open ? "true" : void 0,
									className: "raising-relic",
									onClick: () => skyRef.current?.select(a.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "raising-relic-dot",
										"data-id": a.id
									})
								}, a.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "raising-sky-name",
								children: pick?.name ?? "Constellation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "raising-sky-line",
								children: pick?.line ?? "Swipe the sky. Tap a star."
							}),
							pick?.open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "raising-play",
								onClick: landPick,
								children: "Land"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "raising-sky-wait",
								children: "Sealed"
							})
						]
					})
				]
			}),
			bootError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "raising-gate",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "raising-gate-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "raising-gate-kicker",
							children: "Boltverse"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "raising-gate-title",
							children: "The hall failed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "raising-gate-sub",
							children: bootError
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "raising-gate-actions",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "raising-play",
						onClick: () => location.reload(),
						children: "Retry"
					})
				})]
			})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
var SplitComponent = RaisingApp;
//#endregion
export { sendBotChat as a, cleanIslandName as c, setDoorOnLand as d, isBotOnCircuit as f, fetchBotSession as i, doorOnLand as l, pub as m, ARTIFACTS as n, DOOR_TEMPLATE_URL as o, wantsGrow as p, ARTIFACT_THREADS as r, DEFAULT_ISLAND as s, routes_exports as t, parseLandCode as u };
