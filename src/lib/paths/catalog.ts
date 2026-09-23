import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, type LevelId } from "@/lib/content/schema";
import { FIRST_LESSON_HREF } from "@/lib/routes";

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
    body: "Hands-on first principles — how a bit becomes a decision, and what you'll lean on before systems paths.",
    courses: [
      {
        id: "foundations-course",
        title: "Foundations",
        body: "Bits, logic, and the groundwork every systems path builds on.",
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
    body: "The Python on-ramp for applied AI — language basics you'll need before RAG, agents, and LLM apps.",
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
    body: "Understand the machine and write C that touches it — through systems software and a working shell.",
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
        title: "Shellforge",
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
    body: "From distro and shell to VMs and containers — run and ship real Linux systems bone to bone.",
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
    body: "How machines talk — protocols, stacks, and the paths packets take.",
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
    body: "Build with LLMs — RAG, agents, contract decoding, and applied AI systems.",
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

function lessonsForLevel(levelId: LevelId) {
  return getAllLessons()
    .filter((l) => l.meta.level === levelId)
    .sort((a, b) => a.meta.order - b.meta.order);
}

export function firstLessonHrefForLevel(levelId: LevelId): string {
  const first = lessonsForLevel(levelId)[0];
  if (!first) return FIRST_LESSON_HREF;
  return `/curriculum/${first.meta.level}/${first.meta.slug}`;
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
