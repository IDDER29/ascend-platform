import { PRACTICE_BANK } from "./bank";
import { dueCards, type NewDayMeta } from "./cards";
import { deckSessionHref } from "./coach-custom-model";
import { strengthBuckets, type StrengthBuckets } from "./coach-home-model";
import { COACH_V2_MAX_SIZE } from "./coach-v2-flow";
import {
  pathProgressFromHistory,
  type PathProgressRow,
  type PracticeSessionRecord,
} from "./history";
import {
  PRACTICE_PATH_BLURBS,
  PRACTICE_PATH_MARKS,
  PRACTICE_PATH_TITLES,
  practicePathSlugForLevel,
} from "./path-map";
import {
  practiceCustomHref,
  practiceSessionHref,
  PRACTICE_ROUTES,
} from "./routes";
import { completionKey, isDefaultPracticeQuestion, unlockedQuestions } from "./session";
import type { PracticeCard } from "./sm2";
import { practiceTreeForPath } from "./tree";

/** Below this hit rate (with enough answers) a lesson is flagged. */
const NEEDS_WORK_ACCURACY = 0.7;
const NEEDS_WORK_MIN_SEEN = 3;

export type CoachPathLessonStatus = "locked" | "not-started" | "needs-work" | "practiced";

export type CoachPathLesson = {
  key: string;
  number: number;
  title: string;
  cardCount: number;
  /** Seen cards due by end of today — the same count the bank and deck builder show. */
  dueToday: number;
  status: CoachPathLessonStatus;
  strength: StrengthBuckets;
  /** Session over this lesson's unlocked cards; null while locked. */
  practiceHref: string | null;
  lessonHref: string | null;
};

export type CoachPathSection = {
  id: string;
  title: string;
  blurb: string | null;
  cardCount: number;
  lessons: CoachPathLesson[];
  /** Section-scoped session; null when no lesson in it is unlocked. */
  practiceHref: string | null;
};

export type CoachPathFocus = {
  sectionTitle: string;
  lessonTitles: string[];
  href: string;
};

export type CoachPathModel = {
  slug: string;
  title: string;
  mark: string;
  blurb: string;
  /** Cards here unlock without finishing lessons (the Foundations warm-up). */
  alwaysOpen: boolean;
  sectionCount: number;
  lessonCount: number;
  cardCount: number;
  unlockedCount: number;
  dueNow: number;
  dueHref: string | null;
  customHref: string;
  bankHref: string;
  sections: CoachPathSection[];
  hitRate: PathProgressRow | null;
  strength: StrengthBuckets;
  focus: CoachPathFocus | null;
};

export type CoachPathInput = {
  slug: string;
  cards: PracticeCard[];
  history: PracticeSessionRecord[];
  meta: NewDayMeta;
  completedKeys: ReadonlySet<string>;
  /** `level/slug` → lesson URL (resolved on the server). */
  lessonHrefs: Record<string, string>;
  /** `level/slug` → lesson title from MDX frontmatter; falls back to the outline title. */
  lessonTitles?: Record<string, string>;
  now: Date;
};

function tallyByQuestion(history: PracticeSessionRecord[]) {
  const tallies = new Map<string, { seen: number; missed: number }>();
  for (const session of history) {
    const missed = new Set(session.missIds);
    for (const id of session.questionIds) {
      const tally = tallies.get(id) ?? { seen: 0, missed: 0 };
      tally.seen += 1;
      if (missed.has(id)) tally.missed += 1;
      tallies.set(id, tally);
    }
  }
  return tallies;
}

/** Path desk for any Practice path; null for unknown paths or paths without cards. */
export function buildCoachPathModel(input: CoachPathInput): CoachPathModel | null {
  const { slug, cards, history, meta, completedKeys, lessonHrefs, lessonTitles = {}, now } = input;
  const tree = practiceTreeForPath(slug);
  const pathCards = PRACTICE_BANK.filter(
    (q) => practicePathSlugForLevel(q.lessonLevel) === slug,
  );
  if (!tree || pathCards.length === 0) return null;

  const idsByLesson = new Map<string, string[]>();
  for (const q of pathCards) {
    const key = completionKey(q.lessonLevel, q.lessonSlug);
    idsByLesson.set(key, [...(idsByLesson.get(key) ?? []), q.id]);
  }
  const unlocked = new Set(
    unlockedQuestions(new Set(completedKeys))
      .filter((q) => practicePathSlugForLevel(q.lessonLevel) === slug)
      .map((q) => q.id),
  );
  const pathIds = new Set(pathCards.map((q) => q.id));
  const pathCardStates = cards.filter(
    (c) => pathIds.has(c.questionId) && unlocked.has(c.questionId),
  );
  const seenIds = new Set(
    pathCardStates.filter((c) => c.state !== "new").map((c) => c.questionId),
  );
  const due = new Set(dueCards(cards, meta, now).map((c) => c.questionId));
  const tallies = tallyByQuestion(history);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  const dueToday = new Set(
    pathCardStates
      .filter((c) => c.state !== "new" && Date.parse(c.dueAt) < endOfToday)
      .map((c) => c.questionId),
  );

  let number = 0;
  const misses: { section: CoachPathSection; lessons: CoachPathLesson[]; count: number }[] = [];
  const sections = tree.sections.map((treeSection): CoachPathSection => {
    const missed: CoachPathLesson[] = [];
    let sectionMisses = 0;
    const lessons = treeSection.lessons.map((lesson): CoachPathLesson => {
      number += 1;
      const title = lessonTitles[lesson.key] ?? lesson.title;
      const ids = idsByLesson.get(lesson.key) ?? [];
      const open = ids.filter((id) => unlocked.has(id));
      let seen = 0;
      let lessonMisses = 0;
      for (const id of open) {
        const tally = tallies.get(id);
        if (!tally) continue;
        seen += tally.seen;
        lessonMisses += tally.missed;
      }
      const status: CoachPathLessonStatus =
        ids.length > 0 && open.length === 0
          ? "locked"
          : !open.some((id) => seenIds.has(id))
            ? "not-started"
            : seen >= NEEDS_WORK_MIN_SEEN && (seen - lessonMisses) / seen < NEEDS_WORK_ACCURACY
              ? "needs-work"
              : "practiced";
      const row: CoachPathLesson = {
        key: lesson.key,
        number,
        title,
        cardCount: ids.length,
        dueToday: open.filter((id) => dueToday.has(id)).length,
        status,
        strength: strengthBuckets(pathCardStates.filter((c) => open.includes(c.questionId))),
        practiceHref:
          open.length > 0
            ? deckSessionHref(open.slice(0, COACH_V2_MAX_SIZE), title)
            : null,
        lessonHref: lessonHrefs[lesson.key] ?? null,
      };
      if (lessonMisses > 0) missed.push(row);
      sectionMisses += lessonMisses;
      return row;
    });
    const section: CoachPathSection = {
      id: treeSection.id,
      title: treeSection.title,
      blurb: treeSection.blurb ?? null,
      cardCount: lessons.reduce((sum, l) => sum + l.cardCount, 0),
      lessons,
      practiceHref: lessons.some((l) => l.practiceHref)
        ? practiceSessionHref({ scope: "section", path: slug, section: treeSection.id })
        : null,
    };
    if (sectionMisses > 0) misses.push({ section, lessons: missed, count: sectionMisses });
    return section;
  });

  const worst = [...misses].sort((a, b) => b.count - a.count)[0];
  const dueNow = [...unlocked].filter((id) => due.has(id)).length;

  return {
    slug,
    title: PRACTICE_PATH_TITLES[slug] ?? tree.title,
    mark: PRACTICE_PATH_MARKS[slug] ?? tree.title.charAt(0),
    blurb: PRACTICE_PATH_BLURBS[slug] ?? "",
    alwaysOpen: pathCards.every(isDefaultPracticeQuestion),
    sectionCount: sections.length,
    lessonCount: number,
    cardCount: pathCards.length,
    unlockedCount: unlocked.size,
    dueNow,
    dueHref: dueNow > 0 ? practiceSessionHref({ scope: "path", path: slug }) : null,
    customHref: practiceCustomHref(),
    bankHref: PRACTICE_ROUTES.bank,
    sections,
    hitRate: pathProgressFromHistory(history).find((row) => row.pathSlug === slug) ?? null,
    strength: strengthBuckets(pathCardStates),
    focus: worst
      ? {
          sectionTitle: worst.section.title,
          lessonTitles: worst.lessons.map((l) => l.title),
          href: practiceCustomHref(worst.lessons.map((l) => l.key)),
        }
      : null,
  };
}

/** Paths that have bank cards, Foundations first. */
export function practicePathSlugs(): string[] {
  return Object.keys(PRACTICE_PATH_TITLES).filter((slug) =>
    PRACTICE_BANK.some((q) => practicePathSlugForLevel(q.lessonLevel) === slug),
  );
}
