export function goFull(node?: HTMLElement | null) {
  const el = node ?? document.documentElement;
  const anyEl = el as HTMLElement & {
    webkitRequestFullscreen?: (opts?: FullscreenOptions) => Promise<void> | void;
    webkitRequestFullScreen?: (opts?: FullscreenOptions) => Promise<void> | void;
  };
  const req =
    el.requestFullscreen?.bind(el) ||
    anyEl.webkitRequestFullscreen?.bind(anyEl) ||
    anyEl.webkitRequestFullScreen?.bind(anyEl);
  if (!req) return;
  try {
    void Promise.resolve(req({ navigationUI: "hide" })).catch(() => {
      void Promise.resolve(req()).catch(() => {});
    });
  } catch {
    try {
      req();
    } catch {
      /* samsung */
    }
  }
  try {
    const orient = screen.orientation as ScreenOrientation & {
      lock?: (mode: string) => Promise<void>;
    };
    void orient.lock?.("portrait")?.catch(() => {});
  } catch {
    /* no lock */
  }
}
