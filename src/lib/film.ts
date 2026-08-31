/** Drop a video so Samsung can free the decoder. */
export function dropFilm(v: HTMLVideoElement | null) {
  if (!v) return;
  try {
    v.pause();
    v.removeAttribute("src");
    v.load();
  } catch {
    /* ok */
  }
}
