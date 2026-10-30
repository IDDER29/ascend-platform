import type { LessonCompletion } from "@/lib/progress/queries";
import { listRecentShellforgeSubmissions } from "@/lib/projects/queries";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, type LevelId, type Lesson } from "@/lib/content/schema";
import { courseOpenHref, pathHref as catalogPathHref, type PathDef, type PathCourse } from "@/lib/paths/catalog";
import { pathItemRole } from "@/components/paths/path-outline-marks";
import { lessonHref } from "@/lib/paths/lesson-urls";

export type RecentProject = {
  id: string;
  title: string;
  href: string;
  statusLabel: string;
  statusTone: "pass" | "fail" | "neutral";
  meta?: string;
  repoUrl?: string;
};

export type NextProjectCta = {
  title: string;
  href: string;
  blurb: string;
  kind: "project" | "shellforge" | "explore";
};

export type PathHandoff = {
  kind: "next-course" | "capstone" | "path-complete";
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatHeaderDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** ISO calendar day from streak → short relative label for the Continue band. */
export function formatLastActiveLabel(isoDay: string | null | undefined, now: Date): string | null {
  if (!isoDay) return null;
  const today = now.toISOString().slice(0, 10);
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  const yesterday = y.toISOString().slice(0, 10);
  if (isoDay === today) return "Last active today";
  if (isoDay === yesterday) return "Last active yesterday";
  const then = new Date(`${isoDay}T12:00:00`);
  if (Number.isNaN(then.getTime())) return null;
  const days = Math.max(1, Math.round((now.getTime() - then.getTime()) / 86_400_000));
  if (days < 14) return `Last active ${days}d ago`;
  return `Last active ${then.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

export function lessonBlurb(why: string, max = 140): string {
  const one = why.replace(/\s+/g, " ").trim();
  if (one.length <= max) return one;
  const cut = one.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return `${(at > 80 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

/** Honest lesson-local structure (no fake checkpoint %). */
export function lessonStructureLabel(lesson: Lesson): string {
  const checks = lesson.meta.knowledgeCheck.length;
  return `${checks} check${checks === 1 ? "" : "s"} · assignment`;
}

/**
 * Habit nudge under pulse. Only when signed in.
 * Secured when last active is today; otherwise nudge with continue time.
 */
export function streakHabitLine(opts: {
  signedIn: boolean;
  lastActiveDate: string | null;
  streakCurrent: number;
  continueTimeMin: number;
  now: Date;
}): { text: string; secured: boolean } | null {
  if (!opts.signedIn) return null;
  const today = opts.now.toISOString().slice(0, 10);
  if (opts.lastActiveDate === today) {
    return {
      secured: true,
      text:
        opts.streakCurrent > 0 ? `Day ${opts.streakCurrent} secured — come back tomorrow.` : "Today's session logged.",
    };
  }
  const mins = Math.max(1, opts.continueTimeMin);
  return {
    secured: false,
    text:
      opts.streakCurrent > 0
        ? `~${mins} min keeps your ${opts.streakCurrent}-day streak.`
        : `~${mins} min starts your streak today.`,
  };
}

export function githubHref(repoUrl: string): string {
  if (/^https?:\/\//i.test(repoUrl)) return repoUrl;
  return `https://${repoUrl.replace(/^\/+/, "")}`;
}

function formatProjectWhen(d: Date, now: Date): string {
  const days = Math.round((now.getTime() - d.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 14) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function buildRecentProjects(
  submissions: Awaited<ReturnType<typeof listRecentShellforgeSubmissions>>,
  completed: LessonCompletion[],
  now: Date,
): RecentProject[] {
  const items: RecentProject[] = [];

  for (const sub of submissions) {
    const passed = sub.outcome === "passed";
    const failed = sub.outcome === "failed";
    items.push({
      id: `shellforge-${sub.id}`,
      title: "Shellforge",
      href: `/projects/shellforge/result?outcome=${encodeURIComponent(sub.outcome)}`,
      statusLabel: passed ? "Passed" : failed ? "Needs work" : sub.outcome,
      statusTone: passed ? "pass" : failed ? "fail" : "neutral",
      meta: `Attempt ${sub.attempt} · ${formatProjectWhen(sub.submittedAt, now)}`,
      repoUrl: sub.repoUrl,
    });
  }

  if (items.length >= 3) return items.slice(0, 3);

  const projectCompletions = completed
    .filter((c) => pathItemRole({ slug: c.slug }) === "project")
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

  for (const c of projectCompletions) {
    if (items.length >= 3) break;
    const lesson = getAllLessons().find((l) => l.meta.level === c.level && l.meta.slug === c.slug);
    items.push({
      id: `lesson-${c.level}-${c.slug}`,
      title: lesson?.meta.title ?? c.slug,
      href: lessonHref(c.level, c.slug),
      statusLabel: "Complete",
      statusTone: "pass",
      meta: formatProjectWhen(c.completedAt, now),
    });
  }

  return items;
}

export function nextProjectCta(path: PathDef, completed: LessonCompletion[]): NextProjectCta {
  const done = new Set(completed.map((c) => `${c.level}/${c.slug}`));

  for (const course of path.courses) {
    if (course.levelId) {
      const next = getAllLessons()
        .filter(
          (l) =>
            l.meta.level === course.levelId &&
            pathItemRole({ slug: l.meta.slug, title: l.meta.title }) === "project" &&
            !done.has(`${l.meta.level}/${l.meta.slug}`),
        )
        .sort((a, b) => a.meta.order - b.meta.order)[0];
      if (next) {
        return {
          title: next.meta.title,
          href: lessonHref(next.meta.level, next.meta.slug),
          blurb: lessonBlurb(next.meta.whyThisMatters, 110),
          kind: "project",
        };
      }
    }
    if (course.href === "/projects/shellforge") {
      return {
        title: course.title,
        href: course.href,
        blurb: "Ship a shell that meets the machine — submit, get graded, keep the proof.",
        kind: "shellforge",
      };
    }
  }

  return {
    title: "Explore projects on your path",
    href: catalogPathHref(path.slug),
    blurb: "Open the path outline to find the next build that proves what you've learned.",
    kind: "explore",
  };
}

export function lessonsOnPath(path: PathDef) {
  const ids = path.courses.map((c) => c.levelId).filter((id): id is LevelId => Boolean(id));
  return getAllLessons()
    .filter((l) => ids.includes(l.meta.level as LevelId))
    .sort((a, b) => {
      const ai = ids.indexOf(a.meta.level as LevelId);
      const bi = ids.indexOf(b.meta.level as LevelId);
      if (ai !== bi) return ai - bi;
      return a.meta.order - b.meta.order;
    });
}

function courseIsComplete(course: PathCourse, done: Set<string>): boolean {
  if (course.levelId) {
    const lessons = getAllLessons().filter((l) => l.meta.level === course.levelId);
    if (lessons.length === 0) return false;
    return lessons.every((l) => done.has(`${l.meta.level}/${l.meta.slug}`));
  }
  return false;
}

/**
 * When the Up next queue is empty: next course, capstone, or path complete.
 */
export function resolvePathHandoff(
  path: PathDef,
  completed: ReadonlyArray<{ level: string; slug: string }>,
  currentLevelId: LevelId | null,
): PathHandoff | null {
  if (path.status !== "live") return null;
  const done = new Set(completed.map((c) => `${c.level}/${c.slug}`));
  const pathLink = catalogPathHref(path.slug);

  let passedCurrent = currentLevelId == null;
  for (const course of path.courses) {
    if (!passedCurrent) {
      if (course.levelId === currentLevelId) {
        passedCurrent = true;
        if (!courseIsComplete(course, done)) return null;
      }
      continue;
    }

    if (course.levelId) {
      if (courseIsComplete(course, done)) continue;
      const href = courseOpenHref(course);
      if (!href) continue;
      const levelName = LEVELS[course.levelId].name;
      return {
        kind: "next-course",
        eyebrow: "Level clear · next course",
        title: course.title || levelName,
        body: course.body,
        href,
        cta: `Start ${levelName}`,
      };
    }

    if (course.href) {
      return {
        kind: "capstone",
        eyebrow: "Path nearly done · prove it",
        title: course.title,
        body: course.body,
        href: course.href,
        cta: `Open ${course.title}`,
      };
    }
  }

  const allLevelsDone = path.courses.filter((c) => c.levelId).every((c) => courseIsComplete(c, done));
  if (allLevelsDone || currentLevelId != null) {
    return {
      kind: "path-complete",
      eyebrow: "Path clear",
      title: `${path.title} — review anytime`,
      body: "You've finished the live courses on this path. Revisit lessons, ship proof, or explore another path.",
      href: pathLink,
      cta: "Open path",
    };
  }

  return null;
}
