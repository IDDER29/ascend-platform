import "server-only";
import type { BadgeView } from "@/lib/achievements/achievements-model";
import { buildAchievementsModel } from "@/lib/achievements/achievements-model";
import { ACHIEVEMENTS, INSIGNIA } from "@/lib/achievements/catalog";
import { loadAchievementsInput } from "@/lib/achievements/server-page-data";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, type LevelId } from "@/lib/content/schema";
import { completionKey } from "@/lib/practice/session";
import { PATHS, type PathDef } from "./catalog";
import { courseOutlineForLevel } from "./course-outlines";
import { FOUNDATIONS_LEVEL, FOUNDATIONS_OUTLINE, foundationsUpcoming } from "./foundations-outline";
import { lessonHref } from "./lesson-urls";
import { buildPathViews, type PathInput, type PathLessonInfo, type PathView } from "./paths-v2-model";
import { getFollowingMap } from "./selected-path";

export const PATHS_INDEX_HREF = "/paths";

const PROJECT_BADGE: Record<string, string> = {
  "level-00-bits-logic/project-half-adder": "gate-builder",
  "/projects/shellforge": "ship-it",
};

function firstSentence(text: string): string {
  const m = /^(.+?[.!?])(\s|$)/.exec(text.trim());
  return m ? m[1] : text;
}

/** A topic's named sections, each with its lessons; lessons no section names come last. */
function sectionsFor(levelId: LevelId, lessons: PathLessonInfo[]): PathInput["courses"][number]["sections"] {
  const inLevel = lessons.filter((l) => l.key.startsWith(`${levelId}/`));
  const named =
    levelId === FOUNDATIONS_LEVEL
      ? FOUNDATIONS_OUTLINE.map((s) => ({
          id: s.id,
          title: s.title,
          blurb: s.blurb ?? "",
          slugs: s.items.flatMap((i) => (i.kind === "live" ? [i.slug] : [])),
          upcoming: foundationsUpcoming()[s.id] ?? [],
        }))
      : (courseOutlineForLevel(levelId) ?? []).map((s) => ({
          id: s.id,
          title: s.title,
          blurb: s.blurb ?? "",
          slugs: s.items.map((i) => i.slug),
          upcoming: [],
        }));
  const sections = named
    .map((s) => ({
      id: s.id,
      title: s.title,
      blurb: s.blurb,
      lessonKeys: s.slugs.map((slug) => `${levelId}/${slug}`).filter((k) => inLevel.some((l) => l.key === k)),
      upcoming: s.upcoming,
    }))
    .filter((s) => s.lessonKeys.length > 0 || s.upcoming.length > 0);
  const used = new Set(sections.flatMap((s) => s.lessonKeys));
  const rest = inLevel.filter((l) => !used.has(l.key)).map((l) => l.key);
  return rest.length > 0
    ? [
        ...sections,
        { id: "more", title: sections.length > 0 ? "More in this topic" : "Lessons", blurb: "", lessonKeys: rest },
      ]
    : sections;
}

function pathInput(p: PathDef, lessons: PathLessonInfo[]): PathInput {
  const requires = p.requiresSlug ? PATHS.find((x) => x.slug === p.requiresSlug) : undefined;
  return {
    slug: p.slug,
    title: p.title,
    pitch: p.pitch ?? firstSentence(p.body),
    body: p.body,
    status: p.status,
    href: `${PATHS_INDEX_HREF}/${p.slug}`,
    requires: requires ? { slug: requires.slug, title: requires.title } : null,
    courses: p.courses.map((c) => ({
      id: c.id,
      // A topic goes by its own name (Bits & Logic), not the course's (Foundations).
      title: c.levelId ? LEVELS[c.levelId].name : c.title,
      body: c.body,
      levelId: c.levelId,
      href: c.href,
      plannedLessons: c.plannedLessons,
      plannedProjects: c.plannedProjects,
      sections: c.levelId ? sectionsFor(c.levelId, lessons) : [],
    })),
  };
}

export type PathsV2Data = {
  views: PathView[];
  /** What finishing each path earns: its clans, topic badges and project badges (earned or not). */
  earns: Record<string, BadgeView[]>;
  signedIn: boolean;
};

function lessonInfos(): PathLessonInfo[] {
  return getAllLessons().map(({ meta }) => ({
    key: completionKey(meta.level, meta.slug),
    title: meta.title,
    href: lessonHref(meta.level, meta.slug),
    timeMin: meta.timeMin,
    project: meta.slug.startsWith("project-"),
  }));
}

const topicOf = (a: { rules: { kind: string; topic?: string }[] }) => a.rules.find((r) => r.kind === "topic")?.topic;

/** The badge ids finishing each path earns: its clans, topic badges and project badges. */
function earnIds(lessons: PathLessonInfo[]): Record<string, string[]> {
  return Object.fromEntries(
    PATHS.map((p) => {
      const ids = p.courses.flatMap((c) => {
        if (c.levelId) {
          const clan = INSIGNIA.find((a) => topicOf(a) === c.levelId)?.id;
          const topicBadge = ACHIEVEMENTS.find((a) => topicOf(a) === c.levelId)?.id;
          const projects = lessons
            .filter((l) => l.project && l.key.startsWith(`${c.levelId}/`))
            .map((l) => PROJECT_BADGE[l.key]);
          return [clan, topicBadge, ...projects];
        }
        return [c.href ? PROJECT_BADGE[c.href] : undefined];
      });
      return [p.slug, ids.filter((x): x is string => Boolean(x))];
    }),
  );
}

/** A badge from the catalog, not earned: what guests and the public site see. */
function unearned(id: string): BadgeView | null {
  const def = [...ACHIEVEMENTS, ...INSIGNIA].find((a) => a.id === id);
  if (!def) return null;
  return {
    id: def.id,
    group: def.group,
    insignia: def.insignia ?? null,
    label: def.label,
    glyph: def.glyph,
    means: def.means,
    criteria: [],
    earned: false,
    earnedAt: null,
    earnedLabel: null,
    ratio: 0,
    action: null,
    repoUrl: null,
    repoLabel: null,
    missions: [],
  };
}

export async function loadPathsV2(): Promise<PathsV2Data> {
  const [loaded, following] = await Promise.all([loadAchievementsInput(), getFollowingMap()]);
  const lessons = lessonInfos();
  const model = loaded ? buildAchievementsModel(loaded.input) : null;
  const badge = (id: string): BadgeView | null =>
    [...(model?.parts ?? []), ...(model?.insignia ?? [])].find((b) => b.id === id) ?? null;

  const views = buildPathViews({
    paths: PATHS.map((p) => pathInput(p, lessons)),
    lessons,
    completions: loaded?.input.completions ?? [],
    following: Object.fromEntries(Object.entries(following).map(([slug, d]) => [slug, d.toISOString()])),
    shipped: new Set(badge("ship-it")?.earned ? ["/projects/shellforge"] : []),
  });

  // Earned-or-not badges per path, from the full catalog so guests see them too.
  const earns = Object.fromEntries(
    Object.entries(earnIds(lessons)).map(([slug, ids]) => [
      slug,
      ids.map((id) => badge(id) ?? unearned(id)).filter((b): b is BadgeView => b !== null),
    ]),
  );

  return { views, earns, signedIn: Boolean(loaded) };
}

/**
 * Every path for the public site: no session, no progress, so the pages stay static.
 * Each path's own page there lives under `base` (the in-app pages stay at /paths).
 */
export function loadPublicPaths(base: string): Omit<PathsV2Data, "signedIn"> {
  const lessons = lessonInfos();
  const views = buildPathViews({
    paths: PATHS.map((p) => ({ ...pathInput(p, lessons), href: `${base}/${p.slug}` })),
    lessons,
    completions: [],
    following: {},
    shipped: new Set(),
  });
  const earns = Object.fromEntries(
    Object.entries(earnIds(lessons)).map(([slug, ids]) => [
      slug,
      ids.map(unearned).filter((b): b is BadgeView => b !== null),
    ]),
  );
  return { views, earns };
}
