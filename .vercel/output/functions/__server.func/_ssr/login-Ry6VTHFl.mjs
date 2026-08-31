import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as GROK_PROVIDERS } from "./router-BoyCL76v.mjs";
import { r as signIn } from "./client-CfpWr7Hj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Ry6VTHFl.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center p-6",
		style: {
			background: "#070918",
			color: "#f0c24a"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Howl in"
			}), GROK_PROVIDERS.filter((p) => p.providerId === "grok-x").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => signIn(p.providerId, { callbackURL: "/" }),
				className: "w-full cursor-pointer rounded-full px-4 py-3 font-bold",
				style: {
					background: "linear-gradient(180deg,#f7e08a,#b88620)",
					color: "#1a140c"
				},
				children: ["Connect with ", p.label]
			}, p.providerId))]
		})
	});
}
//#endregion
export { Login as component };
