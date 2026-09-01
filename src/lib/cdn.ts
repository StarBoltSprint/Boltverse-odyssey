/** Odyssey civic stills + clips. Engine film plates. Citadel sprint plates. */
export const ODYSSEY =
  "https://cdn.jsdelivr.net/gh/StarBoltSprint/Boltverse-odyssey@main/public/citadel";
export const ENGINE =
  "https://cdn.jsdelivr.net/gh/StarBoltSprint/bolt-engine@main/public/films";
/** Hung sprint rooms from the citadel engine — Asteroid Sprint lives here. */
export const CITADEL_FILMS = "/films";

export function citadel(file: string) {
  return `${ODYSSEY}/${file}`;
}

export function engineFilm(file: string) {
  return `${ENGINE}/${file}`;
}

export function citadelFilm(file: string) {
  return `${CITADEL_FILMS}/${file}`;
}
