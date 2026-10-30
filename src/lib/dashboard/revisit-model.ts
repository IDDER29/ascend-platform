/**
 * "To revisit" on the dashboard: what didn't click. Two sources, shown
 * together: what the learner flagged themselves (bookmarks saved as "Didn't
 * get it"), then lessons Practice shows they keep missing lately. Overdue
 * cards aren't here — the Practice card covers those.
 */
import type { Bookmark } from "@/lib/bookmarks/model";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { deckSessionHref } from "@/lib/practice/coach-custom-model";
import { COACH_V2_MAX_SIZE } from "@/lib/practice/coach-v2-flow";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import { completionKey } from "@/lib/practice/session";

const DAY_MS = 86_400_000;
/** Practice answers older than this don't count: what matters is how it's going lately. */
export const RECENT_DAYS = 30;
const MIN_ANSWERS = 3;
const WEAK_SHARE = 0.7;
export const REVISIT_SHOWN = 4;

const KIND_WORD: Record<Bookmark["kind"], string> = {
  lesson: "Lesson",
  section: "Section",
  snippet: "Snippet",
  resource: "Resource",
  card: "Card",
};

export type RevisitItem =
  | {
      source: "flag";
      ref: string;
      title: string;
      /** "Section in Binary & number bases". */
      context: string;
      note: string;
      href: string | null;
      openLabel: string;
    }
  | {
      source: "practice";
      ref: string;
      title: string;
      /** "3 of 8 right in Practice lately". */
      context: string;
      practiceHref: string;
      lessonHref: string;
    };

export type RevisitInput = {
  flagged: Bookmark[];
  history: PracticeSessionRecord[];
  lessons: { key: string; title: string; href: string }[];
  now: Date;
};

export function buildRevisit(input: RevisitInput): { items: RevisitItem[]; total: number } {
  const flags: RevisitItem[] = input.flagged
    .filter((b) => b.reason === "revisit")
    .sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt))
    .map((b) => ({
      source: "flag",
      ref: b.ref,
      title: b.title,
      context:
        b.kind === "lesson"
          ? "Lesson"
          : b.kind === "card"
            ? `Practice card · ${b.where}`
            : `${KIND_WORD[b.kind]} in ${b.where.replace(/^From /, "")}`,
      note: b.note,
      href: b.href,
      openLabel: b.kind === "card" ? "Try the card again" : `Revisit ${KIND_WORD[b.kind].toLowerCase()}`,
    }));

  // Lessons already flagged as a whole aren't listed twice.
  const flaggedLessons = new Set(
    input.flagged.filter((b) => b.reason === "revisit" && b.kind === "lesson").map((b) => b.lessonKey),
  );
  const since = input.now.getTime() - RECENT_DAYS * DAY_MS;
  const tally = new Map<string, { seen: number; missed: number }>();
  const lessonOf = new Map(PRACTICE_BANK.map((q) => [q.id, completionKey(q.lessonLevel, q.lessonSlug)]));
  for (const s of input.history) {
    if (Date.parse(s.at) < since) continue;
    const missed = new Set(s.missIds);
    for (const id of s.questionIds) {
      const key = lessonOf.get(id);
      if (!key) continue;
      const t = tally.get(key) ?? { seen: 0, missed: 0 };
      t.seen += 1;
      if (missed.has(id)) t.missed += 1;
      tally.set(key, t);
    }
  }

  const weak: RevisitItem[] = input.lessons
    .map((l) => ({ l, t: tally.get(l.key) }))
    .filter(
      (x): x is { l: (typeof input.lessons)[number]; t: { seen: number; missed: number } } =>
        Boolean(x.t) && x.t!.seen >= MIN_ANSWERS && (x.t!.seen - x.t!.missed) / x.t!.seen < WEAK_SHARE,
    )
    .filter(({ l }) => !flaggedLessons.has(l.key))
    .sort((a, b) => (a.t.seen - a.t.missed) / a.t.seen - (b.t.seen - b.t.missed) / b.t.seen || b.t.missed - a.t.missed)
    .map(({ l, t }) => {
      const ids = PRACTICE_BANK.filter((q) => completionKey(q.lessonLevel, q.lessonSlug) === l.key).map((q) => q.id);
      return {
        source: "practice",
        ref: `practice:${l.key}`,
        title: l.title,
        context: `${t.seen - t.missed} of ${t.seen} right in Practice lately`,
        practiceHref: deckSessionHref(ids.slice(0, COACH_V2_MAX_SIZE), l.title),
        lessonHref: l.href,
      };
    });

  const all = [...flags, ...weak];
  return { items: all.slice(0, REVISIT_SHOWN), total: all.length };
}
