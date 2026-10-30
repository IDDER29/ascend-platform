import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import type { PracticeCard } from "@/lib/practice/sm2";
import type { ProfileLesson } from "@/lib/profile/profile-model";
import { buildAchievementsModel, type AchievementsInput } from "./achievements-model";
import { buildScrolls } from "./scrolls-model";

const NOW = new Date(2026, 9, 30, 12, 0);
const BITS = "level-00-bits-logic";
const MACHINE = "level-01-machine-memory";

const LESSONS: ProfileLesson[] = [
  [BITS, "what-is-a-bit"],
  [BITS, "project-half-adder"],
  [MACHINE, "inside-the-cpu"],
].map(([level, slug]) => ({ key: `${level}/${slug}`, level, slug, title: slug, href: `/lessons/${slug}` }));

const bitCards = PRACTICE_BANK.filter((q) => q.lessonLevel === BITS && q.lessonSlug === "what-is-a-bit").map((q) => q.id);

function daysAgo(n: number): string {
  return new Date(2026, 9, 30 - n, 10).toISOString();
}

function card(questionId: string, state: PracticeCard["state"]): PracticeCard {
  return { questionId, state, reps: 2, ease: 2.5, intervalDays: 6, dueAt: daysAgo(-3), lapses: 0, updatedAt: daysAgo(2) };
}

function session(questionIds: string[], missIds: string[]): PracticeSessionRecord {
  return {
    id: questionIds.join(","),
    at: daysAgo(1),
    scopeType: "due",
    scopeLabel: "Due",
    pathSlug: null,
    correct: questionIds.length - missIds.length,
    total: questionIds.length,
    missIds,
    questionIds,
  };
}

function scrolls(patch: Partial<AchievementsInput> = {}) {
  const input: AchievementsInput = {
    lessons: LESSONS,
    completions: [],
    projectLinks: [],
    cards: [],
    history: [],
    now: NOW,
    ...patch,
  };
  return buildScrolls(input, buildAchievementsModel(input));
}

test("one scroll per topic, a skill per lesson, with card and accuracy scores", () => {
  const { scrolls: list } = scrolls({
    completions: [{ key: `${BITS}/what-is-a-bit`, completedAt: daysAgo(5) }],
    cards: bitCards.map((id, i) => card(id, i === 0 ? "learning" : "review")),
    history: [session(bitCards.slice(0, 4), [bitCards[0]])],
  });
  assert.deepEqual(list.map((s) => s.name), ["Bits & Logic", "Machine & Memory"]);
  const bits = list[0];
  assert.equal(bits.learned, 1);
  assert.equal(bits.total, 2);
  const bit = bits.skills[0];
  assert.equal(bit.learned, true);
  assert.deepEqual(bit.cards, { solid: bitCards.length - 1, total: bitCards.length });
  assert.equal(bit.accuracy, 75);
  assert.equal(bit.mastered, false); // one card is still learning
  assert.equal(bits.skills[1].learned, false);
  assert.equal(bits.skills[1].accuracy, null);
});

test("a skill is mastered when its lesson is done and every one of its cards is solid", () => {
  const { scrolls: list } = scrolls({
    completions: [{ key: `${BITS}/what-is-a-bit`, completedAt: daysAgo(5) }],
    cards: bitCards.map((id) => card(id, "review")),
  });
  assert.equal(list[0].skills[0].mastered, true);
  assert.equal(list[0].mastered, 1);
});

test("forbidden scrolls are sealed until earned and the learner is Jōnin", () => {
  const shipped = scrolls({
    completions: LESSONS.filter((l) => l.level === BITS).map((l) => ({ key: l.key, completedAt: daysAgo(6) })),
    projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(4) }],
  });
  const adder = shipped.forbidden.find((f) => f.id === "adder-seal")!;
  assert.equal(adder.met, true);
  assert.equal(adder.unsealed, false); // not Jōnin yet
  assert.deepEqual(
    adder.conditions.map((c) => [c.text, c.done]),
    [
      ["Ship the half adder", true],
      ["Become Jōnin", false],
    ],
  );
  assert.equal(shipped.forbidden.find((f) => f.id === "shell-seal")!.met, false);
});
