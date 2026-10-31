/**
 * Paths, the Coach way: every path as data the page can show — its topics
 * (each with its sections and lessons), your progress on it, its capstone, and
 * whether you've joined it and are working on it now. Pure: path definitions,
 * lessons and records come in as data (see paths-v2-data.ts).
 */
import { CREST_OF } from "@/lib/achievements/scrolls-model";
import type { CrestId } from "@/lib/achievements/catalog";
import type { LevelId } from "@/lib/content/schema";

export type PathLessonInfo = {
  key: string;
  title: string;
  href: string;
  timeMin: number;
  project: boolean;
  /** One sentence from the outline: what the lesson teaches, readable without opening it. */
  description?: string;
};

export type PathInput = {
  slug: string;
  title: string;
  /** One sentence: what the path is. */
  pitch: string;
  body: string;
  status: "live" | "soon";
  href: string;
  /** The path to take first; `through` limits it to that path's courses up to one course (an id). */
  requires: { slug: string; title: string; through?: string; throughTitle?: string } | null;
  /** What finishing the path means ("Understand the OS"). */
  milestone?: string | null;
  /** Its stage on the main track, if it's on it; or the path it branches off. */
  stage?: number | null;
  branchOf?: string | null;
  courses: {
    id: string;
    title: string;
    body: string;
    levelId?: string;
    /** A capstone or other page instead of lessons. */
    href?: string;
    plannedLessons?: number;
    plannedProjects?: number;
    /** A milestone reached once this course is done. */
    milestone?: string;
    /** Another path this course is best taken alongside. */
    alongside?: { slug: string; title: string };
    /** Named sections of the topic, each with its lessons (keys, in order). */
    sections: {
      id: string;
      title: string;
      blurb: string;
      lessonKeys: string[];
      upcoming?: UpcomingItem[];
      /** Live lessons and coming-soon items in outline order ("lesson:<key>" / "soon:<id>"); else lessons first. */
      order?: string[];
    }[];
  }[];
};

export type PathItem = PathLessonInfo & { done: boolean; current: boolean };
/** An outlined lesson or project that isn't written yet ("Coming soon"). */
export type UpcomingItem = { id: string; title: string; project: boolean; description?: string; timeMin?: number };
/** One row of a section, in outline order. */
export type SectionEntry = { kind: "lesson"; item: PathItem } | { kind: "soon"; item: UpcomingItem };
export type PathSection = {
  id: string;
  title: string;
  blurb: string;
  items: PathItem[];
  done: number;
  upcoming: UpcomingItem[];
  /** Every row, live and coming soon, in outline order. */
  entries: SectionEntry[];
};
export type PathCourse = {
  id: string;
  title: string;
  body: string;
  kind: "topic" | "capstone" | "planned";
  crest: CrestId | null;
  done: number;
  total: number;
  minutes: number;
  finished: boolean;
  /** The topic you're in: the first one not finished. */
  current: boolean;
  sections: PathSection[];
  href: string | null;
  capstone: "not-started" | "ready" | "shipped" | null;
  planned: { lessons: number; projects: number } | null;
  milestone: string | null;
  alongside: { slug: string; title: string } | null;
};

export type PathView = {
  slug: string;
  title: string;
  pitch: string;
  body: string;
  soon: boolean;
  href: string;
  joined: boolean;
  /** Joined and the one you worked on last (not finished). */
  active: boolean;
  lessons: { done: number; total: number };
  projects: number;
  minutes: number;
  finished: boolean;
  courses: PathCourse[];
  /** The next lesson on this path, or its capstone once the lessons are done. */
  next: { title: string; href: string } | null;
  /** `throughTitle`: only the required path's courses up to this one are needed first. */
  requires: { slug: string; title: string; done: boolean; throughTitle: string | null } | null;
  milestone: string | null;
  stage: number | null;
  branchOf: string | null;
  /** When you last finished a lesson on it (or joined it). */
  lastActive: string | null;
};

export type PathsV2Input = {
  paths: PathInput[];
  lessons: PathLessonInfo[];
  completions: { key: string; completedAt: string }[];
  /** Joined paths: slug → when joined. */
  following: Record<string, string>;
  /** Capstone hrefs whose project is shipped. */
  shipped: ReadonlySet<string>;
};

/** A section's rows in outline order; without an order, its live lessons come first. */
function sectionEntries(items: PathItem[], upcoming: UpcomingItem[], order?: string[]): SectionEntry[] {
  const lessons: SectionEntry[] = items.map((item) => ({ kind: "lesson", item }));
  const soon: SectionEntry[] = upcoming.map((item) => ({ kind: "soon", item }));
  if (!order) return [...lessons, ...soon];
  const byRef = new Map<string, SectionEntry>([
    ...items.map((item): [string, SectionEntry] => [`lesson:${item.key}`, { kind: "lesson", item }]),
    ...upcoming.map((item): [string, SectionEntry] => [`soon:${item.id}`, { kind: "soon", item }]),
  ]);
  const ordered = order.map((ref) => byRef.get(ref)).filter((e): e is SectionEntry => Boolean(e));
  // Anything the order leaves out still shows, at the end.
  const listed = new Set(ordered);
  return [...ordered, ...[...lessons, ...soon].filter((e) => ![...listed].some((x) => x.item === e.item))];
}

export function buildPathViews(input: PathsV2Input): PathView[] {
  const lessonByKey = new Map(input.lessons.map((l) => [l.key, l]));
  const doneAt = new Map(input.completions.map((c) => [c.key, c.completedAt]));

  const views = input.paths.map((path): PathView => {
    const topicKeys = path.courses.flatMap((c) => c.sections.flatMap((s) => s.lessonKeys));
    const topicsDone = topicKeys.length > 0 && topicKeys.every((k) => doneAt.has(k));
    const firstOpen = topicKeys.find((k) => !doneAt.has(k)) ?? null;
    let currentSet = false;

    const courses = path.courses.map((course): PathCourse => {
      // A topic with lessons, or a course whose lessons are all still "Coming soon" (its outline).
      if (course.levelId || course.sections.length > 0) {
        const sections = course.sections.map((s) => {
          const items = s.lessonKeys
            .map((k) => lessonByKey.get(k))
            .filter((l): l is PathLessonInfo => Boolean(l))
            .map((l) => ({ ...l, done: doneAt.has(l.key), current: l.key === firstOpen }));
          const upcoming = s.upcoming ?? [];
          return {
            id: s.id,
            title: s.title,
            blurb: s.blurb,
            items,
            done: items.filter((i) => i.done).length,
            upcoming,
            entries: sectionEntries(items, upcoming, s.order),
          };
        });
        const items = sections.flatMap((s) => s.items);
        const done = items.filter((i) => i.done).length;
        const finished = items.length > 0 && done === items.length;
        const current = path.status === "live" && items.length > 0 && !finished && !currentSet;
        if (current) currentSet = true;
        return {
          id: course.id,
          title: course.title,
          body: course.body,
          // A course whose lessons are all still "Coming soon" shows as a topic with its outline.
          kind: items.length > 0 || sections.some((s) => s.upcoming.length > 0) ? "topic" : "planned",
          crest: CREST_OF[course.levelId as LevelId] ?? null,
          done,
          total: items.length,
          minutes: items.reduce((n, i) => n + i.timeMin, 0),
          finished,
          current,
          sections,
          href: null,
          capstone: null,
          planned:
            items.length > 0 ? null : { lessons: course.plannedLessons ?? 0, projects: course.plannedProjects ?? 0 },
          milestone: course.milestone ?? null,
          alongside: course.alongside ?? null,
        };
      }
      if (course.href && path.status === "live") {
        const shipped = input.shipped.has(course.href);
        return {
          id: course.id,
          title: course.title,
          body: course.body,
          kind: "capstone",
          crest: null,
          done: shipped ? 1 : 0,
          total: 1,
          minutes: 0,
          finished: shipped,
          current: false,
          sections: [],
          href: course.href,
          capstone: shipped ? "shipped" : topicsDone ? "ready" : "not-started",
          planned: null,
          milestone: course.milestone ?? null,
          alongside: course.alongside ?? null,
        };
      }
      return {
        id: course.id,
        title: course.title,
        body: course.body,
        kind: "planned",
        crest: null,
        done: 0,
        total: 0,
        minutes: 0,
        finished: false,
        current: false,
        sections: [],
        href: null,
        capstone: null,
        planned: { lessons: course.plannedLessons ?? 0, projects: course.plannedProjects ?? 0 },
        milestone: course.milestone ?? null,
        alongside: course.alongside ?? null,
      };
    });

    const items = courses.flatMap((c) => c.sections.flatMap((s) => s.items));
    const done = items.filter((i) => i.done).length;
    const capstone = courses.find((c) => c.kind === "capstone" && !c.finished);
    const open = items.find((i) => i.current);
    const requiresDef = path.requires ? input.paths.find((p) => p.slug === path.requires!.slug) : undefined;
    // Only the courses up to `through` count, when the path names one.
    const throughAt = requiresDef?.courses.findIndex((c) => c.id === path.requires!.through) ?? -1;
    const requiresCourses = requiresDef ? requiresDef.courses.slice(0, throughAt >= 0 ? throughAt + 1 : undefined) : [];
    const requiresKeys = requiresCourses.flatMap((c) => c.sections.flatMap((s) => s.lessonKeys));
    const dates = items
      .map((i) => doneAt.get(i.key))
      .filter((d): d is string => Boolean(d))
      .sort();
    const joinedAt = input.following[path.slug] ?? null;

    return {
      slug: path.slug,
      title: path.title,
      pitch: path.pitch,
      body: path.body,
      soon: path.status === "soon",
      href: path.href,
      joined: Boolean(joinedAt) && path.status === "live",
      active: false,
      lessons: { done, total: items.length },
      projects: items.filter((i) => i.project).length + courses.filter((c) => c.kind === "capstone").length,
      minutes: items.reduce((n, i) => n + i.timeMin, 0),
      finished: items.length > 0 && done === items.length && courses.every((c) => c.kind !== "capstone" || c.finished),
      courses,
      next: open
        ? { title: open.title, href: open.href }
        : capstone?.href
          ? { title: capstone.title, href: capstone.href }
          : null,
      requires: path.requires
        ? {
            slug: path.requires.slug,
            title: path.requires.title,
            throughTitle: path.requires.throughTitle ?? null,
            done: requiresKeys.length > 0 && requiresKeys.every((k) => doneAt.has(k)),
          }
        : null,
      milestone: path.milestone ?? null,
      stage: path.stage ?? null,
      branchOf: path.branchOf ?? null,
      lastActive: dates.at(-1) ?? joinedAt,
    };
  });

  // Active: of the joined paths still going, the one worked on last.
  const lead = views
    .filter((v) => v.joined && !v.finished)
    .sort((a, b) => Date.parse(b.lastActive ?? "") - Date.parse(a.lastActive ?? ""))[0];
  return views.map((v) => (lead && v.slug === lead.slug ? { ...v, active: true } : v));
}

/** "about 3 h", "about 45 min". */
export function durationLabel(minutes: number): string {
  if (minutes < 60) return `about ${Math.max(5, Math.round(minutes / 5) * 5)} min`;
  const hours = Math.round((minutes / 60) * 2) / 2;
  return `about ${hours % 1 === 0 ? hours : hours.toFixed(1)} h`;
}
