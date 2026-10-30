/**
 * Scrolls: the skills a learner holds, one scroll per topic, each skill a
 * lesson with its scores (lesson done, Practice cards held solid, accuracy).
 * Forbidden scrolls are top-tier honours — sealed until earned and the
 * learner is Jōnin. Display only: nothing here ever locks a lesson.
 */
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { completionKey } from "@/lib/practice/session";
import type { AchievementsInput, AchievementsModel } from "./achievements-model";
import type { CrestId } from "./catalog";

const CREST_OF: Record<LevelId, CrestId> = {
  "level-00-bits-logic": "gate",
  "level-01-machine-memory": "core",
  "level-02-the-c-language": "pointer",
  "level-03-systems-software": "shell",
};

export type Skill = {
  key: string;
  title: string;
  href: string;
  learned: boolean;
  /** Lesson done and every one of its Practice cards held solid. */
  mastered: boolean;
  cards: { solid: number; total: number };
  /** Share of answers right on this lesson's cards in Practice, 0–100; null before any review. */
  accuracy: number | null;
};

export type Scroll = {
  id: string;
  name: string;
  crest: CrestId;
  skills: Skill[];
  learned: number;
  mastered: number;
  total: number;
};

export type ForbiddenScroll = {
  id: string;
  name: string;
  /** What the skill inside is, once unsealed. */
  skill: string;
  conditions: { text: string; done: boolean }[];
  /** The skill's own condition is met (the Jōnin seal may still hold). */
  met: boolean;
  unsealed: boolean;
};

const JONIN = "title-jonin";

export function buildScrolls(
  input: AchievementsInput,
  model: AchievementsModel,
): { scrolls: Scroll[]; forbidden: ForbiddenScroll[] } {
  const completed = new Set(input.completions.map((c) => c.key));
  const cardFor = new Map(input.cards.map((c) => [c.questionId, c]));
  const tally = new Map<string, { seen: number; missed: number }>();
  for (const session of input.history) {
    const missed = new Set(session.missIds);
    for (const id of session.questionIds) {
      const t = tally.get(id) ?? { seen: 0, missed: 0 };
      t.seen += 1;
      if (missed.has(id)) t.missed += 1;
      tally.set(id, t);
    }
  }

  const skillFor = (lesson: AchievementsInput["lessons"][number]): Skill => {
    const ids = PRACTICE_BANK.filter((q) => completionKey(q.lessonLevel, q.lessonSlug) === lesson.key).map((q) => q.id);
    const solid = ids.filter((id) => cardFor.get(id)?.state === "review").length;
    const seen = ids.reduce((n, id) => n + (tally.get(id)?.seen ?? 0), 0);
    const missed = ids.reduce((n, id) => n + (tally.get(id)?.missed ?? 0), 0);
    const learned = completed.has(lesson.key);
    return {
      key: lesson.key,
      title: lesson.title,
      href: lesson.href,
      learned,
      mastered: learned && ids.length > 0 && solid === ids.length,
      cards: { solid, total: ids.length },
      accuracy: seen > 0 ? Math.round(((seen - missed) / seen) * 100) : null,
    };
  };

  const scrolls: Scroll[] = levelIds
    .map((level) => ({ level, lessons: input.lessons.filter((l) => l.level === level) }))
    .filter((t) => t.lessons.length > 0)
    .map(({ level, lessons }) => {
      const skills = lessons.map(skillFor);
      return {
        id: level,
        name: LEVELS[level].name,
        crest: CREST_OF[level],
        skills,
        learned: skills.filter((s) => s.learned).length,
        mastered: skills.filter((s) => s.mastered).length,
        total: skills.length,
      };
    });

  const jonin = model.titles.find((t) => t.id === JONIN)?.earned ?? false;
  const badge = (id: string) => model.parts.find((p) => p.id === id)?.earned ?? false;
  const perfectTopic = scrolls.find((s) => s.skills.every((k) => k.mastered));
  const seal = (id: string, name: string, skill: string, condition: string, met: boolean): ForbiddenScroll => ({
    id,
    name,
    skill,
    conditions: [
      { text: condition, done: met },
      { text: "Become Jōnin", done: jonin },
    ],
    met,
    unsealed: met && jonin,
  });

  return {
    scrolls,
    forbidden: [
      seal("adder-seal", "The Adder Seal", "Arithmetic built from nothing but logic gates", "Ship the half adder", badge("gate-builder")),
      seal("shell-seal", "The Shell Seal", "Processes, pipes and signals working as one shell", "Ship ShellForge", badge("ship-it")),
      seal(
        "perfect-memory",
        "Perfect Memory",
        perfectTopic ? `Every card in ${perfectTopic.name} held solid` : "Every card in a topic held solid",
        "Hold every card in one topic solid",
        Boolean(perfectTopic),
      ),
    ],
  };
}
