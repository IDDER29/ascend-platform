/**
 * Client-safe model for the profile: who the learner is and what they have
 * built, from real records only — profile fields, lesson completions,
 * project links, own projects, earned badges and Practice session counts.
 * Private numbers (retention, accuracy, due cards) belong to Progress.
 */
import { achievementById, type AchievementGroup, type CrestId } from "@/lib/achievements/catalog";
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { displayUrl, linkKind, linkLabel, type LinkKind } from "./links";
import { CURRICULUM_PROJECTS } from "./projects";
import { levelFinishedAt, projectStatuses } from "./curriculum-records";
import { PROFILE_ROUTES } from "./routes";

const LOCALE = "en-US";

/** What finishing each topic means, said as an ability. */
const LEVEL_SKILLS: Record<LevelId, string> = {
  "level-00-bits-logic": "Explains bits, binary and logic gates, and builds an adder from them",
  "level-01-machine-memory": "Traces how a CPU runs a program and where its data lives",
  "level-04-c-basics": "Writes, compiles and debugs whole C programs with loops, functions and arrays",
  "level-02-the-c-language": "Writes C that manages its own memory with pointers",
  "level-05-c-contract": "Knows exactly what C promises, and finds and fixes undefined behaviour",
  "level-06-c-tools": "Builds, inspects and debugs C with gcc, make, gdb, objdump, strace and sanitizers",
  "level-07-data-structures": "Builds dynamic arrays, lists, hash tables, trees and heaps in C, and knows what each costs",
  "level-03-systems-software": "Builds systems software with processes, pipes and signals",
  "level-08-vm-threads-files": "Explains virtual memory, writes correct multithreaded C, and knows how files reach the disk",
  "level-09-memory-allocator": "Writes a working memory allocator and debugs heap corruption from the inside",
  "level-10-performance": "Measures and reasons about performance with CPI, Amdahl's law and honest benchmarks",
  "level-11-pipelining": "Explains pipelines, hazards, forwarding and branch prediction, and counts cycles exactly",
  "level-12-advanced-execution": "Explains superscalar, out-of-order execution, renaming and speculation, and schedules code for them",
  "level-13-caches-memory": "Predicts cache hits and misses, and explains the hierarchy from L1 to DRAM",
};

export type ProfileViewer = "owner" | "visitor";

export type ProfileLesson = { key: string; level: string; slug: string; title: string; href: string };

export type ProfileInput = {
  viewer: ProfileViewer;
  profile: { name: string; username: string; bio: string; joinedAt: string };
  isPublic: boolean;
  /** Every lesson, in curriculum order. */
  lessons: ProfileLesson[];
  completions: { key: string; completedAt: string }[];
  projectLinks: { projectId: string; repoUrl: string; addedAt: string }[];
  ownProjects: { id: string; title: string; description: string; url: string; tags: string[]; createdAt: string }[];
  links: { id: string; url: string; label: string | null }[];
  badges: { badgeId: string; earnedAt: string }[];
  practice: { sessions: number; firstAt: string | null; tenthAt: string | null };
};

export type ProfileLink = { id: string; url: string; kind: LinkKind; label: string };

/** shipped: requirement met + link · ready: met, link missing (owner only) · next: first not yet reached (owner only). */
export type ProjectState = "shipped" | "ready" | "next";

export type ProfileProject = {
  id: string;
  title: string;
  proves: string;
  levelNumber: string;
  levelName: string;
  state: ProjectState;
  repoUrl: string | null;
  repoLabel: string | null;
  shippedLabel: string | null;
  badge: { label: string; glyph: string } | null;
  href: string;
};

export type ProfileSkill = {
  levelNumber: string;
  levelName: string;
  statement: string;
  state: "done" | "current" | "next";
  done: number;
  total: number;
  /** Lessons in curriculum order, for the per-lesson pips. */
  lessons: { title: string; href: string; done: boolean }[];
};

export type JourneyKind = "joined" | "lesson" | "level" | "project" | "practice";

export type JourneyEvent = { at: string; dateLabel: string; text: string; kind: JourneyKind };

export type ProfileModel = {
  owner: boolean;
  isPublic: boolean;
  publicPath: string;
  hero: {
    name: string;
    username: string;
    bio: string;
    /** The topic being worked through, e.g. "Machine & Memory"; null before the first lesson. */
    levelLabel: string | null;
    links: ProfileLink[];
  };
  snapshot: {
    lessonsDone: number;
    lessonTotal: number;
    projectsShipped: number;
    ownProjects: number;
    memberSince: string;
  };
  curriculumProjects: ProfileProject[];
  projectTotal: number;
  ownProjects: (ProfileInput["ownProjects"][number] & { urlLabel: string })[];
  skills: ProfileSkill[];
  achievements: { id: string; group: AchievementGroup; label: string; glyph: string; description: string; earnedLabel: string }[];
  /** What the learner wears: the headband, a title and clan crests (filled from the achievements model). */
  insignia: {
    headband: boolean;
    title: { label: string; kanji: string; gloss: string } | null;
    crests: { crest: CrestId; label: string; earned: boolean }[];
  };
  journey: JourneyEvent[];
  /** Owner only: the next lesson to open. */
  next: { title: string; href: string } | null;
  /** Badges the records earn that aren't stored yet — the server awards these, dated when shipped. */
  eligibleBadges: { badgeId: string; earnedAt: string }[];
};

const JOURNEY_MAX = 8;

function levelNumber(id: string): string {
  return id.match(/level-(\d+)/)?.[1] ?? "";
}

function levelName(id: string): string {
  return LEVELS[id as LevelId]?.name ?? id;
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, { month: "short", day: "numeric" });
}

export function buildProfileModel(input: ProfileInput): ProfileModel {
  const { viewer, profile, lessons, completions } = input;
  const owner = viewer === "owner";
  const completedAt = new Map(completions.map((c) => [c.key, c.completedAt]));
  const isDone = (l: ProfileLesson) => completedAt.has(l.key);
  const doneLessons = lessons.filter(isDone);
  const firstOpen = lessons.find((l) => !isDone(l)) ?? null;

  // Levels that have lessons, in order.
  const levels = levelIds
    .map((id) => ({ id, lessons: lessons.filter((l) => l.level === id) }))
    .filter((level) => level.lessons.length > 0);
  const levelFinished = levelFinishedAt(lessons, completedAt);

  // Curriculum projects
  const earned = new Set(input.badges.map((b) => b.badgeId));
  let nextShown = false;
  const allProjects: ProfileProject[] = [];
  const eligibleBadges: ProfileModel["eligibleBadges"] = [];
  const shippedAt = new Map<string, string>();
  for (const { project, metAt, link, shippedAt: shipped } of projectStatuses(
    completedAt,
    levelFinished,
    input.projectLinks,
  )) {
    let state: ProjectState | null = null;
    if (shipped) state = "shipped";
    else if (metAt) state = owner ? "ready" : null;
    else if (owner && !nextShown) {
      state = "next";
      nextShown = true;
    }
    const badge = achievementById(project.badgeId);
    if (shipped) {
      shippedAt.set(project.id, shipped);
      if (!earned.has(project.badgeId) && badge) {
        eligibleBadges.push({ badgeId: project.badgeId, earnedAt: shipped });
      }
    }
    if (!state) continue;
    const { requires } = project;
    const lesson =
      requires.kind === "lesson" ? lessons.find((l) => l.key === `${requires.level}/${requires.slug}`) : null;
    allProjects.push({
      id: project.id,
      title: project.title,
      proves: project.proves,
      levelNumber: levelNumber(project.level),
      levelName: levelName(project.level),
      state,
      repoUrl: state === "shipped" ? link!.repoUrl : null,
      repoLabel: state === "shipped" ? displayUrl(link!.repoUrl) : null,
      shippedLabel: state === "shipped" ? shortDate(shippedAt.get(project.id)!) : null,
      badge: badge ? { label: badge.label, glyph: badge.glyph } : null,
      href: project.href ?? lesson?.href ?? "/paths",
    });
  }

  // Skills
  let currentGiven = false;
  const skills = levels.map((level): ProfileSkill => {
    const done = level.lessons.filter(isDone).length;
    let state: ProfileSkill["state"] = "next";
    if (done === level.lessons.length) state = "done";
    else if (!currentGiven) {
      state = "current";
      currentGiven = true;
    }
    return {
      levelNumber: levelNumber(level.id),
      levelName: levelName(level.id),
      statement: LEVEL_SKILLS[level.id],
      state,
      done,
      total: level.lessons.length,
      lessons: level.lessons.map((l) => ({ title: l.title, href: l.href, done: isDone(l) })),
    };
  });

  // Achievements: stored badges plus the ones about to be awarded.
  const badgeRows = [...input.badges, ...eligibleBadges].sort((a, b) => Date.parse(b.earnedAt) - Date.parse(a.earnedAt));
  const achievements = badgeRows.flatMap((row) => {
    const badge = achievementById(row.badgeId);
    return badge
      ? [{ id: badge.id, group: badge.group, label: badge.label, glyph: badge.glyph, description: badge.means, earnedLabel: shortDate(row.earnedAt) }]
      : [];
  });

  // Journey: real dated events, newest first; joining always closes it.
  const events: Omit<JourneyEvent, "dateLabel">[] = [];
  const firstLesson = [...doneLessons].sort(
    (a, b) => Date.parse(completedAt.get(a.key)!) - Date.parse(completedAt.get(b.key)!),
  )[0];
  if (firstLesson) {
    events.push({ at: completedAt.get(firstLesson.key)!, text: `First lesson: ${firstLesson.title}`, kind: "lesson" });
  }
  for (const [id, at] of levelFinished) {
    events.push({ at, text: `Finished ${levelName(id)}`, kind: "level" });
  }
  for (const project of allProjects) {
    if (project.state === "shipped") {
      events.push({ at: shippedAt.get(project.id)!, text: `Shipped ${project.title}`, kind: "project" });
    }
  }
  if (input.practice.firstAt) {
    events.push({ at: input.practice.firstAt, text: "First review session in Practice", kind: "practice" });
  }
  if (input.practice.tenthAt) {
    events.push({ at: input.practice.tenthAt, text: "10 review sessions in Practice", kind: "practice" });
  }
  events.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  const journey = [
    ...events.slice(0, JOURNEY_MAX - 1),
    { at: profile.joinedAt, text: "Joined Ascend", kind: "joined" as const },
  ].map((e) => ({ ...e, dateLabel: shortDate(e.at) }));

  const allDone = lessons.length > 0 && !firstOpen;
  const levelLabel =
    doneLessons.length === 0
      ? null
      : allDone
        ? "Finished the curriculum"
        : levelName(firstOpen!.level);

  const shippedCount = allProjects.filter((p) => p.state === "shipped").length;

  return {
    owner,
    isPublic: input.isPublic,
    publicPath: PROFILE_ROUTES.public(profile.username),
    hero: {
      name: profile.name,
      username: profile.username,
      bio: profile.bio.trim(),
      levelLabel,
      links: input.links.map((l) => ({ id: l.id, url: l.url, kind: linkKind(l.url), label: linkLabel(l.url, l.label) })),
    },
    snapshot: {
      lessonsDone: doneLessons.length,
      lessonTotal: lessons.length,
      projectsShipped: shippedCount,
      ownProjects: input.ownProjects.length,
      memberSince: new Date(profile.joinedAt).toLocaleDateString(LOCALE, { month: "short", year: "numeric" }),
    },
    curriculumProjects: allProjects,
    projectTotal: CURRICULUM_PROJECTS.length,
    ownProjects: input.ownProjects.map((p) => ({ ...p, urlLabel: displayUrl(p.url) })),
    skills,
    achievements,
    insignia: { headband: false, title: null, crests: [] },
    journey,
    next: owner && firstOpen ? { title: firstOpen.title, href: firstOpen.href } : null,
    eligibleBadges,
  };
}
