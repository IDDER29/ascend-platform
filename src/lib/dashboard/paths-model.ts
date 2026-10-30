/**
 * "Your paths" on the dashboard: every path the learner joined, each split
 * into its groups (topics, then a capstone), with lessons done per group. The
 * path worked on last leads, and the dashboard's next lesson comes from it.
 * Pure: path definitions, lessons and records come in as data.
 */
import { CREST_OF } from "@/lib/achievements/scrolls-model";
import type { CrestId } from "@/lib/achievements/catalog";
import type { LevelId } from "@/lib/content/schema";
import type { TodayLesson } from "./today-model";

export type PathInput = {
  slug: string;
  title: string;
  href: string;
  courses: { id: string; title: string; levelId?: string; href?: string }[];
};

export type PathGroup = {
  id: string;
  title: string;
  kind: "topic" | "capstone";
  /** Topic: the next open lesson, or the first once all are done. Capstone: its page. */
  href: string;
  /** Topic: one entry per lesson, in order. */
  lessons: boolean[];
  done: number;
  total: number;
  finished: boolean;
  /** The group the learner is in: the first topic not finished. */
  current: boolean;
  crest: CrestId | null;
  /** Capstone only. */
  capstone: "not-started" | "ready" | "shipped" | null;
};

export type PathCard = {
  slug: string;
  title: string;
  href: string;
  done: number;
  total: number;
  finished: boolean;
  groups: PathGroup[];
  next: { title: string; href: string } | null;
  /** When the learner last finished a lesson on it, or joined it. */
  lastActive: string;
};

export type PathsInput = {
  paths: PathInput[];
  /** Joined paths: slug → when joined. */
  following: Record<string, string>;
  /** Every lesson, in curriculum order. */
  lessons: TodayLesson[];
  completions: { key: string; completedAt: string }[];
  /** Capstone hrefs whose project is shipped (repo linked). */
  shipped: ReadonlySet<string>;
};

export function buildPathCards(input: PathsInput): PathCard[] {
  const doneAt = new Map(input.completions.map((c) => [c.key, c.completedAt]));

  const cards = input.paths
    .filter((p) => input.following[p.slug])
    .map((path): PathCard => {
      const topicLessons = path.courses.flatMap((c) => input.lessons.filter((l) => l.level === c.levelId));
      const topicsDone = topicLessons.every((l) => doneAt.has(l.key));
      let currentSet = false;

      const groups = path.courses.map((course): PathGroup => {
        if (course.levelId) {
          const lessons = input.lessons.filter((l) => l.level === course.levelId);
          const marks = lessons.map((l) => doneAt.has(l.key));
          const done = marks.filter(Boolean).length;
          const finished = lessons.length > 0 && done === lessons.length;
          const current = !finished && !currentSet;
          if (current) currentSet = true;
          const open = lessons.find((l) => !doneAt.has(l.key)) ?? lessons[0];
          return {
            id: course.id,
            title: course.title,
            kind: "topic",
            href: open?.href ?? path.href,
            lessons: marks,
            done,
            total: lessons.length,
            finished,
            current,
            crest: CREST_OF[course.levelId as LevelId] ?? null,
            capstone: null,
          };
        }
        const shipped = Boolean(course.href && input.shipped.has(course.href));
        return {
          id: course.id,
          title: course.title,
          kind: "capstone",
          href: course.href ?? path.href,
          lessons: [],
          done: shipped ? 1 : 0,
          total: 1,
          finished: shipped,
          current: false,
          crest: null,
          capstone: shipped ? "shipped" : topicsDone ? "ready" : "not-started",
        };
      });

      const done = topicLessons.filter((l) => doneAt.has(l.key)).length;
      const capstones = groups.filter((g) => g.kind === "capstone");
      const open = topicLessons.find((l) => !doneAt.has(l.key));
      const openCapstone = capstones.find((g) => !g.finished);
      const dates = topicLessons.map((l) => doneAt.get(l.key)).filter((d): d is string => Boolean(d));
      const lastLesson = dates.sort().at(-1);
      return {
        slug: path.slug,
        title: path.title,
        href: path.href,
        done,
        total: topicLessons.length,
        finished: topicsDone && capstones.every((g) => g.finished),
        groups,
        next: open
          ? { title: open.title, href: open.href }
          : openCapstone
            ? { title: openCapstone.title, href: openCapstone.href }
            : null,
        lastActive: lastLesson ?? input.following[path.slug],
      };
    });

  // The path worked on last first; finished paths after the ones still going.
  return cards.sort(
    (a, b) => Number(a.finished) - Number(b.finished) || Date.parse(b.lastActive) - Date.parse(a.lastActive),
  );
}
