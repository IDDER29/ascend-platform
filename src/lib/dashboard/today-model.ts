/**
 * The dashboard ("Today"): the next lesson, then where the learner stands —
 * title, badges, project — each pointing at its own page. Built from real
 * records; Practice and Bookmarks are added in the browser, where their
 * per-browser parts live.
 */
import type { AchievementsModel, BadgeView, Criterion } from "@/lib/achievements/achievements-model";
import { TITLES } from "@/lib/achievements/catalog";
import { LEVELS, type LevelId } from "@/lib/content/schema";

export type TodayLesson = {
  key: string;
  level: string;
  title: string;
  href: string;
  timeMin: number;
  blurb: string;
};

export type TodayInput = {
  /** Every lesson, in curriculum order. */
  lessons: TodayLesson[];
  completions: { key: string; completedAt: string }[];
  /** Null for guests: nothing is recorded yet. */
  achievements: AchievementsModel | null;
  /** The path worked on last: the next lesson comes from its topics, then its capstone. */
  focus?: { title: string; levels: string[]; capstone: { title: string; href: string } | null } | null;
};

export type NextStep = {
  /** "start": nothing done yet; "continue": the next open lesson; "capstone": every lesson done. */
  kind: "start" | "continue" | "capstone";
  /** The path this step is on, when the learner follows one. */
  path: string | null;
  title: string;
  href: string;
  blurb: string;
  timeMin: number | null;
  topic: string | null;
  /** This lesson's place in its topic, and how many of the topic's lessons are done. */
  topicStep: { index: number; total: number; done: number } | null;
  /** The few lessons after this one. */
  then: { title: string; href: string }[];
};

export type Standing = {
  title: { label: string; kanji: string; gloss: string } | null;
  nextTitle: { label: string; step: Criterion | null } | null;
  /** The newest badge earned, or the closest one to earn when none is. */
  badge: { view: BadgeView; earned: boolean; step: Criterion | null } | null;
  project: { view: BadgeView; step: Criterion | null } | null;
  shippedBoth: boolean;
  earnedCount: number;
  total: number;
};

export type Today = {
  next: NextStep;
  lessons: { done: number; total: number };
  standing: Standing | null;
};

const THEN_COUNT = 3;
const KANJI = Object.fromEntries(TITLES.map((t) => [t.id, t]));

const firstOpen = (b: BadgeView) => b.criteria.find((c) => !c.done) ?? null;

function nextStep(lessons: TodayLesson[], done: Set<string>, focus: TodayInput["focus"]): NextStep {
  const scoped = focus ? lessons.filter((l) => focus.levels.includes(l.level)) : lessons;
  const i = scoped.findIndex((l) => !done.has(l.key));
  if (i === -1) {
    if (focus?.capstone) {
      return {
        kind: "capstone",
        path: focus.title,
        title: focus.capstone.title,
        href: focus.capstone.href,
        blurb: `Every lesson on ${focus.title} is done. Build it and link its repo to ship the capstone.`,
        timeMin: null,
        topic: null,
        topicStep: null,
        then: [],
      };
    }
    // The followed path is done: carry on through the rest of the curriculum.
    if (focus && lessons.some((l) => !done.has(l.key))) return nextStep(lessons, done, null);
    return {
      kind: "capstone",
      path: null,
      title: "ShellForge",
      href: "/projects/shellforge",
      blurb: "Every lesson is done. Build a working shell and link its repo to ship the capstone.",
      timeMin: null,
      topic: null,
      topicStep: null,
      then: [],
    };
  }
  const lesson = scoped[i];
  const inTopic = lessons.filter((l) => l.level === lesson.level);
  return {
    kind: done.size === 0 ? "start" : "continue",
    path: focus?.title ?? null,
    title: lesson.title,
    href: lesson.href,
    blurb: lesson.blurb,
    timeMin: lesson.timeMin,
    topic: LEVELS[lesson.level as LevelId]?.name ?? null,
    topicStep: {
      index: inTopic.indexOf(lesson) + 1,
      total: inTopic.length,
      done: inTopic.filter((l) => done.has(l.key)).length,
    },
    then: scoped
      .slice(i + 1)
      .filter((l) => !done.has(l.key))
      .slice(0, THEN_COUNT)
      .map((l) => ({ title: l.title, href: l.href })),
  };
}

function standing(model: AchievementsModel): Standing {
  const byId = new Map(model.parts.map((p) => [p.id, p]));
  const latest = model.earnedNewestFirst.map((id) => byId.get(id)).find(Boolean) ?? null;
  const closest = model.closest[0] ?? null;
  const projects = ["code-maker", "cartographer", "converter", "byte-detective", "gate-builder", "nand-maker", "alu-architect", "clockmaker", "memory-keeper", "bus-driver", "cpu-tracer", "microcoder", "puzzle-solver", "assembler", "memory-watcher", "translator", "compiler-reader", "boundary-walker", "system-tracer", "ship-it"].map((id) => byId.get(id)!).filter(Boolean);
  const openProject = projects.find((p) => !p.earned) ?? null;
  const title = model.title ? KANJI[model.title.id] : null;

  return {
    title: title ? { label: title.label, kanji: title.kanji, gloss: title.gloss } : null,
    nextTitle: model.nextTitle ? { label: model.nextTitle.label, step: firstOpen(model.nextTitle) } : null,
    badge: latest
      ? { view: latest, earned: true, step: null }
      : closest
        ? { view: closest, earned: false, step: firstOpen(closest) }
        : null,
    project: openProject ? { view: openProject, step: firstOpen(openProject) } : null,
    shippedBoth: projects.length > 0 && projects.every((p) => p.earned),
    earnedCount: model.earnedCount,
    total: model.total,
  };
}

export function buildToday(input: TodayInput): Today {
  const done = new Set(input.completions.map((c) => c.key).filter((k) => input.lessons.some((l) => l.key === k)));
  return {
    next: nextStep(input.lessons, done, input.focus ?? null),
    lessons: { done: done.size, total: input.lessons.length },
    standing: input.achievements ? standing(input.achievements) : null,
  };
}
