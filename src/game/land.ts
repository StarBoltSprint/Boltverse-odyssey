const ID_KEY = "lc-my-land";

export const DEFAULT_ISLAND = "Beginning";

function mint(): string {
  const id = Math.random().toString(36).slice(2, 6);
  return id.replace(/[^a-z0-9]/g, "k") || "k7m2";
}

export function myLandId(): string {
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

export function parseLandCode(raw: string): string | null {
  const s = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/^y0-/, "");
  if (!/^[a-z0-9]{4,8}$/.test(s)) return null;
  return s;
}

export function landRoom(id: string): string {
  return (`y0-` + id).slice(0, 64);
}

export function readVisitFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return parseLandCode(new URLSearchParams(window.location.search).get("land") || "");
  } catch {
    return null;
  }
}

export function writeLandUrl(id: string, mine: string) {
  try {
    const u = new URL(window.location.href);
    if (id === mine) u.searchParams.delete("land");
    else u.searchParams.set("land", id);
    window.history.replaceState({}, "", u);
  } catch {
    /* private */
  }
}

export function cleanIslandName(raw: string): string | null {
  const s = String(raw || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
  if (s.length < 2) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9 '’-]*$/.test(s)) return null;
  return s;
}

const DOOR_KEY = "lc-door-on-land";

export function doorOnLand(): boolean {
  try {
    return localStorage.getItem(DOOR_KEY) === "1";
  } catch {
    return false;
  }
}

export function setDoorOnLand(on: boolean) {
  try {
    if (on) localStorage.setItem(DOOR_KEY, "1");
    else localStorage.removeItem(DOOR_KEY);
  } catch {
    /* private */
  }
}
