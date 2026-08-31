import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RaisingApp } from "@/components/RaisingApp";
import "./styles.css";

try {
  void navigator.serviceWorker?.getRegistrations?.().then((regs) => {
    for (const r of regs) void r.unregister();
  });
} catch {
  /* capture chrome */
}

function isNoise(err: unknown) {
  const name = err instanceof Error ? err.name : "";
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return (
    name === "AbortError" ||
    name === "NotAllowedError" ||
    name === "NotSupportedError" ||
    /play\(\)|The play\(\)|interrupted|NotAllowedError|AbortError/i.test(msg)
  );
}

function showBootError(err: unknown) {
  if (isNoise(err)) return;
  const el = document.getElementById("app");
  if (!el) return;
  const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  el.innerHTML = `<div style="padding:24px;font:16px/1.4 system-ui;color:#e8eef8"><p>Odyssey failed to wake.</p><pre style="white-space:pre-wrap;color:#9ad">${msg}</pre></div>`;
}

window.addEventListener("error", (e) => {
  if (isNoise(e.error ?? e.message)) return;
  if (!(window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED) showBootError(e.error ?? e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  if (isNoise(e.reason)) {
    e.preventDefault();
    return;
  }
  if (!(window as unknown as { __LC_BOOTED?: boolean }).__LC_BOOTED) showBootError(e.reason);
});

const el = document.getElementById("app");
if (el) {
  try {
    createRoot(el).render(
      <StrictMode>
        <RaisingApp />
      </StrictMode>,
    );
  } catch (err) {
    showBootError(err);
  }
}
