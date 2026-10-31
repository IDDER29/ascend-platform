export const MAX_PROFILE_LINKS = 6;
export const MAX_OWN_PROJECTS = 12;
export const MAX_URL_LENGTH = 300;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;

export type LinkKind = "github" | "gitlab" | "linkedin" | "x" | "youtube" | "website";

const KIND_LABELS: Record<Exclude<LinkKind, "website">, string> = {
  github: "GitHub",
  gitlab: "GitLab",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
};

/** A public http(s) URL, or null. Bare hosts get https. */
export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!url.hostname.includes(".")) return null;
  const out = url.toString();
  return out.length > MAX_URL_LENGTH ? null : out;
}

function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function linkKind(url: string): LinkKind {
  const h = host(url);
  const is = (domain: string) => h === domain || h.endsWith(`.${domain}`);
  if (is("github.com")) return "github";
  if (is("gitlab.com")) return "gitlab";
  if (is("linkedin.com")) return "linkedin";
  if (is("x.com") || is("twitter.com")) return "x";
  if (is("youtube.com") || is("youtu.be")) return "youtube";
  return "website";
}

export function linkLabel(url: string, label: string | null): string {
  if (label?.trim()) return label.trim();
  const kind = linkKind(url);
  return kind === "website" ? host(url) : KIND_LABELS[kind];
}

/** Short display form of a URL: host + path, no scheme or trailing slash. */
export function displayUrl(url: string): string {
  try {
    return `${host(url)}${new URL(url).pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

/** "C, rust" → ["C", "rust"]: trimmed, case-insensitively unique, capped. */
export function parseTags(raw: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of raw.split(",")) {
    const tag = part.trim().slice(0, MAX_TAG_LENGTH);
    if (!tag || seen.has(tag.toLowerCase())) continue;
    seen.add(tag.toLowerCase());
    tags.push(tag);
    if (tags.length === MAX_TAGS) break;
  }
  return tags;
}
