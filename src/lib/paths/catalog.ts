import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, type LevelId } from "@/lib/content/schema";
import { FIRST_LESSON_HREF } from "@/lib/routes";
import { lessonHref } from "@/lib/paths/lesson-urls";
import {
  foundationsItemRole,
  foundationsLiveItems,
} from "@/lib/paths/foundations-outline";

export type PathStatus = "live" | "soon";

export type PathKind = "foundation" | "role";

export type PathCourse = {
  id: string;
  title: string;
  body: string;
  /** Live curriculum level, if any */
  levelId?: LevelId;
  /** Capstone / special href when not a level */
  href?: string;
  plannedLessons?: number;
  plannedProjects?: number;
};

export type PathDef = {
  slug: string;
  kind: PathKind;
  status: PathStatus;
  eyebrow: string;
  title: string;
  /** One sentence: what the path is and what you leave with. */
  pitch?: string;
  body: string;
  /** Shown on catalog meta line */
  requiresLabel?: string;
  requiresSlug?: string;
  courses: PathCourse[];
};

export const PATHS: PathDef[] = [
  {
    slug: "foundations",
    kind: "foundation",
    status: "live",
    eyebrow: "Foundations",
    title: "Foundations",
    pitch: "Bits, logic and how a machine makes decisions: the ground every other path stands on.",
    body: "A hands-on introduction to the ideas every real machine is built on: bits and binary, logic and gates, and the loop a processor runs. No background needed. You'll finish by building a half-adder, and every other path starts from here.",
    courses: [
      {
        id: "foundations-course",
        title: "Foundations",
        body: "Bits, binary, logic gates and the fetch-execute loop: how on and off become decisions.",
        levelId: "level-00-bits-logic",
      },
    ],
  },
  {
    slug: "python-foundations",
    kind: "foundation",
    status: "soon",
    eyebrow: "Foundations",
    title: "Python Foundations",
    pitch: "The Python you need for applied AI: the language, the tools and good project habits.",
    body: "This course is the Python on-ramp for applied AI. You'll learn language basics, tooling, and project habits in the order shown — everything you need before RAG, agents, and LLM apps, without wandering the whole Python universe first.",
    courses: [
      {
        id: "python-language",
        title: "Python language basics",
        body: "Syntax, data, functions, and the habits you'll use every day in AI work.",
        plannedLessons: 12,
        plannedProjects: 2,
      },
      {
        id: "python-tooling",
        title: "Tooling & environments",
        body: "venv, packages, notebooks, and a clean project layout.",
        plannedLessons: 6,
        plannedProjects: 1,
      },
    ],
  },
  {
    slug: "systems-programmer",
    kind: "role",
    status: "live",
    eyebrow: "Path",
    title: "Systems Programmer",
    pitch: "How the machine runs, how C talks to it and how the OS keeps it alive, ending with a shell you write yourself.",
    body: "This path takes you through Ascend's systems curriculum. Take the courses in the order shown: how the machine runs, how C touches hardware, how the OS keeps it alive — then prove it with ShellForge. You'll learn everything you need to understand the machine end-to-end and write software that meets it.",
    requiresLabel: "Requires Foundations",
    requiresSlug: "foundations",
    courses: [
      {
        id: "machine-memory",
        title: LEVELS["level-01-machine-memory"].name,
        body: "How the machine actually runs — CPU, memory, and the address space.",
        levelId: "level-01-machine-memory",
      },
      {
        id: "the-c-language",
        title: LEVELS["level-02-the-c-language"].name,
        body: "How code touches that hardware — C as craft.",
        levelId: "level-02-the-c-language",
      },
      {
        id: "systems-software",
        title: LEVELS["level-03-systems-software"].name,
        body: "Processes, syscalls, and the OS boundary.",
        levelId: "level-03-systems-software",
      },
      {
        id: "shellforge",
        title: "ShellForge",
        body: "Capstone — prove the path with a working shell.",
        href: "/projects/shellforge",
        plannedProjects: 1,
      },
    ],
  },
  {
    slug: "linux-engineer",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "Linux Engineer",
    pitch: "From living on a Linux distro to running virtual machines and containers like practitioners do.",
    body: "This path takes you from living on a distro to shipping real systems. Work through the courses in order: Linux fundamentals, virtual machines, containers & Docker, then bone-to-bone projects. You'll learn to run, isolate, and operate Linux systems the way practitioners actually do.",
    requiresLabel: "Requires Foundations",
    requiresSlug: "foundations",
    courses: [
      {
        id: "linux-distro",
        title: "Linux fundamentals",
        body: "Ubuntu, Debian, shell, packages, and living on the terminal.",
        plannedLessons: 14,
        plannedProjects: 2,
      },
      {
        id: "virtual-machines",
        title: "Virtual machines",
        body: "Hypervisors, guests, and when a VM is the right isolation story.",
        plannedLessons: 8,
        plannedProjects: 1,
      },
      {
        id: "containers-docker",
        title: "Containers & Docker",
        body: "Images, containers, and shipping the same runtime everywhere.",
        plannedLessons: 10,
        plannedProjects: 2,
      },
      {
        id: "bone-to-bone",
        title: "Bone to bone",
        body: "Build and operate a system from the ground up — projects that stick.",
        plannedLessons: 6,
        plannedProjects: 3,
      },
    ],
  },
  {
    slug: "network-engineer",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "Network Engineer",
    pitch: "How machines talk: what a packet is, the protocols that carry it and how to change a network safely.",
    body: "This path takes you through how machines talk. Follow the courses in order: network foundations, core protocols, then operating networks. You'll learn what packets are, how stacks and tools reveal them, and how to change networks without flying blind.",
    requiresLabel: "Requires Foundations",
    requiresSlug: "foundations",
    courses: [
      {
        id: "network-foundations",
        title: "Network foundations",
        body: "Layers, addressing, and what a packet actually is.",
        plannedLessons: 10,
        plannedProjects: 1,
      },
      {
        id: "protocols",
        title: "Core protocols",
        body: "TCP/IP, DNS, HTTP, and the tools you use to see them.",
        plannedLessons: 12,
        plannedProjects: 2,
      },
      {
        id: "network-ops",
        title: "Operating networks",
        body: "Routing intuition, debugging, and safe change.",
        plannedLessons: 8,
        plannedProjects: 2,
      },
    ],
  },
  {
    slug: "ai-engineer",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "AI Engineer",
    pitch: "Build grounded AI apps that use tools: from a first API call to RAG, agents and outputs you can trust.",
    body: "This path takes you through applied LLM systems. Take the courses in order: LLM applications, RAG, agents, then contracts & decoding. You'll learn to build grounded, tool-using AI apps — from first API call to structured outputs you can trust.",
    requiresLabel: "Requires Python Foundations",
    requiresSlug: "python-foundations",
    courses: [
      {
        id: "llm-apps",
        title: "LLM applications",
        body: "APIs, prompts, and production-minded model use.",
        plannedLessons: 10,
        plannedProjects: 2,
      },
      {
        id: "rag",
        title: "RAG systems",
        body: "Retrieval, chunking, and grounding answers in your data.",
        plannedLessons: 8,
        plannedProjects: 2,
      },
      {
        id: "agents",
        title: "AI agents",
        body: "Tools, loops, and agents that do real work.",
        plannedLessons: 8,
        plannedProjects: 2,
      },
      {
        id: "contracts",
        title: "Contracts & decoding",
        body: "Structured outputs, schemas, and reliable decoding.",
        plannedLessons: 6,
        plannedProjects: 1,
      },
    ],
  },
];

export function getPathBySlug(slug: string): PathDef | undefined {
  return PATHS.find((p) => p.slug === slug);
}

export function getFoundationPaths(): PathDef[] {
  return PATHS.filter((p) => p.kind === "foundation");
}

export function getRolePaths(): PathDef[] {
  return PATHS.filter((p) => p.kind === "role");
}

export function pathHref(slug: string): string {
  return `/paths/${slug}`;
}

export function catalogMeta(path: PathDef): string {
  const bits: string[] = [];
  if (path.status === "soon") bits.push("Coming soon");
  else bits.push("Open");
  if (path.requiresLabel) bits.push(path.requiresLabel);
  return bits.join(" · ");
}

/** Catalog row/tile meta — course shape first, then requires (status lives in the badge). */
export function pathOutlineMeta(path: PathDef): string {
  const n = path.courses.length;
  const courses = `${n} course${n === 1 ? "" : "s"}`;
  const bits: string[] = [];

  if (path.status === "soon") {
    bits.push(`${courses} planned`);
  } else {
    const lessons = path.courses.reduce((sum, course) => {
      const count = courseLessonCount(course);
      return count != null ? sum + count : sum;
    }, 0);
    if (lessons > 0) bits.push(`${lessons} lesson${lessons === 1 ? "" : "s"}`);
    bits.push(courses);
  }

  if (path.requiresLabel) bits.push(path.requiresLabel);
  return bits.join(" · ");
}

/** Per-course lines for catalog cards (title + lesson count when known). */
export function pathCourseSummaries(
  path: PathDef,
): { title: string; lessonsLabel: string | null }[] {
  return path.courses.map((course) => {
    const n = courseLessonCount(course);
    return {
      title: course.title,
      lessonsLabel:
        n != null ? `${n} lesson${n === 1 ? "" : "s"}` : null,
    };
  });
}

/** Type + size line for catalog cards: "Course · 6 lessons" / "Path · 4 courses". */
export function pathTypeMeta(path: PathDef): {
  typeLabel: string;
  sizeLabel: string;
} {
  const courseN = path.courses.length;
  const isCourse = courseN <= 1;
  const typeLabel = isCourse ? "Course" : "Path";

  const lessons = path.courses.reduce((sum, course) => {
    const count = courseLessonCount(course);
    return count != null ? sum + count : sum;
  }, 0);

  if (isCourse) {
    return {
      typeLabel,
      sizeLabel:
        lessons > 0
          ? `${lessons} lesson${lessons === 1 ? "" : "s"}`
          : "1 course",
    };
  }

  return {
    typeLabel,
    sizeLabel: `${courseN} course${courseN === 1 ? "" : "s"}`,
  };
}

const PATH_MARKS: Record<string, string> = {
  foundations: "F",
  "python-foundations": "Py",
  "systems-programmer": "SP",
  "linux-engineer": "Lx",
  "network-engineer": "Net",
  "ai-engineer": "AI",
};

/** Short mark for path identity circles. */
export function pathMark(path: PathDef): string {
  return PATH_MARKS[path.slug] ?? path.title.slice(0, 2).toUpperCase();
}

/**
 * Progress 0–1 for live paths with curriculum levels (and href capstones).
 * `null` = soon / not measurable (no progress ring fill).
 * Href-only courses (e.g. Shellforge) count as 1 unit; treated incomplete
 * until the learner has any completion on that path’s levels *and* we can’t
 * prove the capstone — so they hold the fraction below 1 when levels are done.
 */
export function pathProgressFraction(
  path: PathDef,
  completed: ReadonlyArray<{ level: string; slug: string }>,
): number | null {
  if (path.status !== "live") return null;
  const levelIds = path.courses
    .map((c) => c.levelId)
    .filter((id): id is LevelId => Boolean(id));
  const hrefOnly = path.courses.filter((c) => !c.levelId && c.href);

  const lessons = getAllLessons().filter((l) =>
    levelIds.includes(l.meta.level as LevelId),
  );
  const total = lessons.length + hrefOnly.length;
  if (total === 0) return null;

  const done = new Set(completed.map((c) => `${c.level}/${c.slug}`));
  const lessonDone = lessons.filter((l) =>
    done.has(`${l.meta.level}/${l.meta.slug}`),
  ).length;
  // Capstones without lesson_progress stay incomplete (never inflate to 100%).
  const hrefDone = 0;
  return (lessonDone + hrefDone) / total;
}

function lessonsForLevel(levelId: LevelId) {
  return getAllLessons()
    .filter((l) => l.meta.level === levelId)
    .sort((a, b) => a.meta.order - b.meta.order);
}

export function firstLessonHrefForLevel(levelId: LevelId): string {
  const first = lessonsForLevel(levelId)[0];
  if (!first) return FIRST_LESSON_HREF;
  return lessonHref(first.meta.level, first.meta.slug);
}

export function courseLessonCount(course: PathCourse): number | null {
  if (course.levelId) return lessonsForLevel(course.levelId).length;
  if (course.plannedLessons != null) return course.plannedLessons;
  return null;
}

export function courseProjectCount(course: PathCourse): number | null {
  if (course.href === "/projects/shellforge") return 1;
  if (course.plannedProjects != null) return course.plannedProjects;
  return null;
}

/** Lesson + project totals for path progress (Odin-style skills block). */
export function pathSkillsCounts(path: PathDef): {
  lessons: number;
  projects: number;
} {
  if (path.slug === "foundations") {
    const items = foundationsLiveItems();
    return {
      lessons: items.filter((i) => foundationsItemRole(i) === "lesson").length,
      projects: items.filter((i) => foundationsItemRole(i) === "project").length,
    };
  }

  let lessons = 0;
  let projects = 0;
  for (const course of path.courses) {
    lessons += courseLessonCount(course) ?? 0;
    projects += courseProjectCount(course) ?? 0;
  }
  return { lessons, projects };
}

export function courseOpenHref(course: PathCourse): string | null {
  if (course.href) return course.href;
  if (course.levelId) return firstLessonHrefForLevel(course.levelId);
  return null;
}

/** Select path / start: first openable course in the path. */
export function pathSelectHref(path: PathDef): string | null {
  if (path.status !== "live") return null;
  for (const course of path.courses) {
    const href = courseOpenHref(course);
    if (href) return href;
  }
  return null;
}

/**
 * Next incomplete lesson in this path (course order).
 * If all done, last lesson in the path. Used by Continue.
 */
export function pathContinueHref(
  path: PathDef,
  completed: ReadonlyArray<{ level: string; slug: string }>,
): string | null {
  if (path.status !== "live") return null;

  const done = new Set(completed.map((c) => `${c.level}/${c.slug}`));
  let lastHref: string | null = null;

  for (const course of path.courses) {
    if (!course.levelId) {
      const open = courseOpenHref(course);
      if (open) lastHref = open;
      continue;
    }

    const lessons = lessonsForLevel(course.levelId);
    for (const lesson of lessons) {
      const key = `${lesson.meta.level}/${lesson.meta.slug}`;
      const href = lessonHref(lesson.meta.level, lesson.meta.slug);
      lastHref = href;
      if (!done.has(key)) return href;
    }
  }

  return lastHref ?? pathSelectHref(path);
}

/** True when the learner has completed any lesson in this path. */
export function pathHasProgress(
  path: PathDef,
  completed: ReadonlyArray<{ level: string; slug: string }>,
): boolean {
  const fraction = pathProgressFraction(path, completed);
  return fraction != null && fraction > 0;
}

/**
 * Engaged = selected this path, or already has lesson progress on it.
 * Catalog primary CTA: Continue when engaged, Select otherwise.
 */
export function pathIsEngaged(
  path: PathDef,
  selectedSlug: string | null,
  completed: ReadonlyArray<{ level: string; slug: string }>,
): boolean {
  if (path.status !== "live") return false;
  if (selectedSlug === path.slug) return true;
  return pathHasProgress(path, completed);
}

export function pathSelectHrefWithContinue(
  path: PathDef,
  continueHref: string | null,
  continueLevel: string | null,
): string | null {
  if (path.status !== "live") return null;
  const liveLevels = path.courses
    .map((c) => c.levelId)
    .filter((id): id is LevelId => Boolean(id));
  if (
    continueHref &&
    continueLevel &&
    liveLevels.includes(continueLevel as LevelId)
  ) {
    return continueHref;
  }
  return pathSelectHref(path);
}
