/**
 * The topic-complete page, from real records only: whether every lesson in
 * the topic is done, when, what finishing it earned, how well its Practice
 * cards are held, and where to go next. A visit before the topic is finished
 * shows what's left instead of a celebration.
 */
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { AchievementsInput, AchievementsModel, BadgeView } from "./achievements-model";
import { ACHIEVEMENTS, INSIGNIA, type CrestId } from "./catalog";

const DAY_MS = 86_400_000;

export type TopicComplete = {
  topic: LevelId;
  name: string;
  crest: CrestId;
  /** The clan this topic joins: "Gate Clan". */
  clan: string;
  /** Every lesson in the topic is done. */
  finished: boolean;
  done: number;
  total: number;
  /** When the last lesson was done; null until finished. */
  finishedAt: string | null;
  /** Calendar days from the first lesson done to the last, counting both. */
  days: number | null;
  /** Lessons still open, in order. */
  remaining: { title: string; href: string }[];
  /** Earned by finishing this topic: its learning badge, its clan, and the headband if this topic won it. */
  earned: BadgeView[];
  cards: { solid: number; total: number; ids: string[] };
  /** Share right on this topic's cards in Practice, 0–100; null before any review. */
  accuracy: number | null;
  /** The next title and how far finishing topics (B-rank tasks) takes it. */
  nextTitle: { label: string; topics: { done: number; total: number } | null } | null;
  next: { label: string; title: string; href: string };
};

const ruleTopic = (a: { rules: { kind: string; topic?: string }[] }) =>
  a.rules.find((r) => r.kind === "topic")?.topic ?? null;

export function buildTopicComplete(input: AchievementsInput, model: AchievementsModel, topic: LevelId): TopicComplete {
  const lessons = input.lessons.filter((l) => l.level === topic);
  const completedAt = new Map(input.completions.map((c) => [c.key, c.completedAt]));
  const doneDates = lessons
    .map((l) => completedAt.get(l.key))
    .filter((d): d is string => Boolean(d))
    .sort();
  const finished = lessons.length > 0 && doneDates.length === lessons.length;
  const finishedAt = finished ? doneDates[doneDates.length - 1] : null;
  const day = (iso: string) => Math.floor(Date.parse(iso) / DAY_MS);
  const days = finished ? day(finishedAt!) - day(doneDates[0]) + 1 : null;

  const part = (id: string | undefined) => [...model.parts, ...model.insignia].find((p) => p.id === id) ?? null;
  const badge = part(ACHIEVEMENTS.find((a) => ruleTopic(a) === topic)?.id);
  const clan = INSIGNIA.find((a) => ruleTopic(a) === topic)!;
  const clanView = part(clan.id);
  const headband = model.insignia.find((p) => p.insignia?.kind === "headband");
  const wonHeadband = Boolean(finishedAt && headband?.earned && headband.earnedAt === finishedAt);
  const earned = finished
    ? [clanView, badge, wonHeadband ? headband! : null].filter((b): b is BadgeView => Boolean(b))
    : [];

  const ids = PRACTICE_BANK.filter((q) => q.lessonLevel === topic).map((q) => q.id);
  const idSet = new Set(ids);
  const solid = input.cards.filter((c) => idSet.has(c.questionId) && c.state === "review").length;
  let seen = 0;
  let missed = 0;
  for (const s of input.history) {
    const miss = new Set(s.missIds);
    for (const id of s.questionIds) {
      if (!idSet.has(id)) continue;
      seen += 1;
      if (miss.has(id)) missed += 1;
    }
  }

  const titleCriterion = model.nextTitle?.criteria.find((c) => c.text.includes("B-rank"));
  const firstOpen = lessons.find((l) => !completedAt.has(l.key));
  // The first lesson of the next topic that has lessons.
  const later = new Set(levelIds.slice(levelIds.indexOf(topic) + 1));
  const nextTopicFirst = input.lessons.find((l) => later.has(l.level as LevelId));
  const nextTopic = nextTopicFirst?.level as LevelId | undefined;

  const next = !finished
    ? { label: "Continue", title: firstOpen!.title, href: firstOpen!.href }
    : nextTopicFirst
      ? { label: `Start ${LEVELS[nextTopic!].name}`, title: nextTopicFirst.title, href: nextTopicFirst.href }
      : { label: "Open ShellForge", title: "Build a working shell", href: "/projects/shellforge" };

  return {
    topic,
    name: LEVELS[topic].name,
    crest: clan.insignia?.kind === "crest" ? clan.insignia.crest : "gate",
    clan: clan.label,
    finished,
    done: doneDates.length,
    total: lessons.length,
    finishedAt,
    days,
    remaining: lessons.filter((l) => !completedAt.has(l.key)).map((l) => ({ title: l.title, href: l.href })),
    earned,
    cards: { solid, total: ids.length, ids },
    accuracy: seen > 0 ? Math.round(((seen - missed) / seen) * 100) : null,
    nextTitle: model.nextTitle ? { label: model.nextTitle.label, topics: titleCriterion?.progress ?? null } : null,
    next,
  };
}
