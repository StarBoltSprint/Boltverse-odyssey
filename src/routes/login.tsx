import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-screen place-items-center p-6" style={{ background: "#070918", color: "#f0c24a" }}>
      <div className="w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Howl in</h1>
        {authEnabled ? (
          GROK_PROVIDERS.filter((p) => p.providerId === "grok-x").map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              className="w-full cursor-pointer rounded-full px-4 py-3 font-bold"
              style={{ background: "linear-gradient(180deg,#f7e08a,#b88620)", color: "#1a140c" }}
            >
              Connect with {p.label}
            </button>
          ))
        ) : (
          <p className="text-sm">Sign-in is disabled.</p>
        )}
      </div>
    </main>
  );
}
