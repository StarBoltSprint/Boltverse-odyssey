export type SeedRelic = {
  id: string;
  href: string;
  plays?: number;
  created_at?: string;
  last_land?: string | null;
};

export function idFromHref(href: string): string {
  let n = 0;
  for (let i = 0; i < href.length; i++) n = (n * 33 + href.charCodeAt(i)) >>> 0;
  return `forged-${n.toString(36)}`;
}

export function relicName(href: string): string {
  try {
    const host = new URL(href).hostname;
    const raw = host.split(".")[0] || "relic";
    const words = raw.replace(/[-_]+/g, " ").trim();
    return words.replace(/\b[a-z]/g, (c) => c.toUpperCase()).slice(0, 28) || "Bound Relic";
  } catch {
    return "Bound Relic";
  }
}

export function relicHost(href: string): string {
  try {
    return new URL(href).hostname;
  } catch {
    return href;
  }
}

export function parseGrokSeed(raw: string): { href: string } | null {
  const text = String(raw || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, "")
    .trim();
  if (!text) return null;
  let url: URL;
  try {
    url = new URL(text.includes("://") ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  const ok =
    host === "grok.me" ||
    host.endsWith(".grok.me") ||
    host === "grok-sandbox.com" ||
    host.endsWith(".grok-sandbox.com");
  if (!ok) return null;
  const href = `${url.origin}${url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "")}`;
  return { href };
}
