/**
 * The rules behind Settings' account actions, kept pure so they can be tested:
 * what you have to type to confirm, and what "reset progress" clears.
 */

/** Confirming a reset or a deletion means typing your username exactly (case and spaces aside). */
export function confirmationMatches(typed: string, username: string): boolean {
  const want = username.trim().toLowerCase();
  return want.length > 0 && typed.trim().toLowerCase() === want;
}

/**
 * Tables "reset progress" empties for the learner: what they finished, practised and shipped.
 * Kept: the account, profile and settings, profile links, own projects, saved decks and bookmarks.
 */
export const PROGRESS_TABLES = [
  "lessonProgress",
  "streaks",
  "badgesEarned",
  "practiceSessions",
  "practiceCards",
  "shellforgeSubmissions",
  "projectLinks",
] as const;

/** Browser-stored progress keys: Practice history, cards and misses for this learner, and Check-yourself answers. */
const USER_PROGRESS_PREFIXES = [
  "ascend_practice_history_v1",
  "ascend_practice_cards_v1",
  "ascend_practice_new_day_v1",
  "ascend_practice_misses_v1",
];
const SHARED_PROGRESS_PREFIXES = ["ascend:check-yourself:"];
/** Kept by a reset, cleared with the account. */
const USER_SETTING_PREFIXES = ["ascend_practice_daily_goal_v1", "ascend:bookmarks-synced"];
/** This browser's bookmarks belong to the account once synced, so they go with it (a reset keeps them). */
const ACCOUNT_SHARED_KEYS = ["ascend:bookmarks"];

/** The localStorage keys to remove for a progress reset ("progress") or a deleted account ("account"). */
export function storageKeysToClear(keys: string[], userId: string, what: "progress" | "account"): string[] {
  const mine = [...USER_PROGRESS_PREFIXES, ...(what === "account" ? USER_SETTING_PREFIXES : [])];
  return keys.filter(
    (k) =>
      mine.some((p) => k === `${p}:${userId}`) ||
      SHARED_PROGRESS_PREFIXES.some((p) => k.startsWith(p)) ||
      (what === "account" && ACCOUNT_SHARED_KEYS.includes(k)),
  );
}
