import type { ProfileSettingsPatch } from "./types";

/** What a settings save may contain. Anything else from the browser is dropped before it reaches the database. */
export const NAME_MAX = 80;
export const THEMES = ["System", "Light", "Dark"] as const;
export const PACES = ["casual", "regular", "intense", "serious"] as const;

/** Keep only the fields of a patch that are valid, with strings trimmed and capped. */
export function cleanSettingsPatch(patch: unknown): ProfileSettingsPatch {
  if (typeof patch !== "object" || patch === null) return {};
  const p = patch as Record<string, unknown>;
  const out: ProfileSettingsPatch = {};
  if (typeof p.name === "string") out.name = p.name.trim().slice(0, NAME_MAX);
  if (typeof p.username === "string") out.username = p.username.slice(0, 64);
  if (typeof p.bio === "string") out.bio = p.bio.slice(0, 2000);
  if (typeof p.pace === "string" && (PACES as readonly string[]).includes(p.pace)) out.pace = p.pace;
  if (typeof p.theme === "string" && (THEMES as readonly string[]).includes(p.theme)) out.theme = p.theme;
  if (typeof p.accent === "string" && /^#[0-9a-fA-F]{6}$/.test(p.accent)) out.accent = p.accent;
  if (typeof p.reminderTime === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(p.reminderTime)) out.reminderTime = p.reminderTime;
  for (const k of ["notifStreakReminders", "notifWeeklyRecap", "notifPeerSolutions", "notifProductUpdates"] as const) {
    if (typeof p[k] === "boolean") out[k] = p[k];
  }
  return out;
}
