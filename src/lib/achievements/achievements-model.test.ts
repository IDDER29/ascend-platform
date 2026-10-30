import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import type { PracticeCard } from "@/lib/practice/sm2";
import type { ProfileLesson } from "@/lib/profile/profile-model";
import { buildAchievementsModel, type AchievementsInput } from "./achievements-model";
import { ACHIEVEMENTS } from "./catalog";

const NOW = new Date(2026, 9, 30, 12, 0);
const L00 = "level-00-bits-logic";
const L01 = "level-01-machine-memory";
const L02 = "level-02-the-c-language";
const L03 = "level-03-systems-software";

const LESSONS: ProfileLesson[] = [
  [L00, "what-is-a-bit"],
  [L00, "project-half-adder"],
  [L01, "inside-the-cpu"],
  [L01, "endianness"],
  [L02, "what-a-pointer-really-is"],
  [L03, "signals"],
].map(([level, slug]) => ({ key: `${level}/${slug}`, level, slug, title: slug, href: `/lessons/${slug}` }));

function daysAgo(n: number, hour = 10): string {
  return new Date(2026, 9, 30 - n, hour).toISOString();
}

function done(...slugs: string[]) {
  return slugs.map((slug, i) => ({ key: LESSONS.find((l) => l.slug === slug)!.key, completedAt: daysAgo(20 - i) }));
}

function solid(questionId: string, updatedDaysAgo = 1): PracticeCard {
  return { questionId, state: "review", reps: 3, ease: 2.5, intervalDays: 8, dueAt: daysAgo(-5), lapses: 0, updatedAt: daysAgo(updatedDaysAgo) };
}

function session(at: string): PracticeSessionRecord {
  return { id: at, at, scopeType: "due", scopeLabel: "Due", pathSlug: null, correct: 4, total: 5, missIds: [], questionIds: [] };
}

function input(patch: Partial<AchievementsInput> = {}): AchievementsInput {
  return { lessons: LESSONS, completions: [], projectLinks: [], cards: [], history: [], now: NOW, ...patch };
}

const part = (model: ReturnType<typeof buildAchievementsModel>, id: string) => model.parts.find((p) => p.id === id)!;

test("new learner: nothing earned, Groundwork and Solid Bits come first", () => {
  const model = buildAchievementsModel(input());
  assert.equal(model.earnedCount, 0);
  assert.equal(model.total, ACHIEVEMENTS.length);
  assert.deepEqual(model.upNext.map((p) => p.id).slice(0, 2), ["groundwork", "solid-00"]);
  assert.match(model.headline, /Your first badge/);
  assert.equal(model.litThrough, -1);
});

test("finishing a level earns its badge, dated by the last lesson, and lights the trace", () => {
  const model = buildAchievementsModel(input({ completions: done("what-is-a-bit", "project-half-adder") }));
  const groundwork = part(model, "groundwork");
  assert.equal(groundwork.earned, true);
  assert.equal(groundwork.earnedAt, daysAgo(19));
  assert.equal(model.litThrough, 0);
  assert.equal(part(model, "machine-head").progress?.done, 0);
});

test("a project ready to ship is the top goal and points at the profile", () => {
  const model = buildAchievementsModel(input({ completions: done("what-is-a-bit", "project-half-adder") }));
  assert.equal(model.upNext[0].id, "gate-builder");
  assert.equal(model.upNext[0].action?.href, "/profile");
  const shipped = buildAchievementsModel(
    input({
      completions: done("what-is-a-bit", "project-half-adder"),
      projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(3) }],
    }),
  );
  assert.equal(part(shipped, "gate-builder").earned, true);
  assert.equal(part(shipped, "gate-builder").repoUrl, "https://github.com/a/h");
});

test("Memory badges need every card of the level solid", () => {
  const l00 = PRACTICE_BANK.filter((q) => q.lessonLevel === L00).map((q) => q.id);
  const almost = buildAchievementsModel(input({ cards: l00.slice(1).map((id) => solid(id)) }));
  assert.equal(part(almost, "solid-00").earned, false);
  assert.deepEqual(part(almost, "solid-00").progress, { done: l00.length - 1, total: l00.length });

  const all = buildAchievementsModel(input({ cards: l00.map((id, i) => solid(id, i === 0 ? 2 : 4)) }));
  assert.equal(part(all, "solid-00").earned, true);
  assert.equal(part(all, "solid-00").earnedAt, daysAgo(2));
});

test("Week of Practice needs 7 days in a row; Comeback needs a two-week gap", () => {
  const sixDays = buildAchievementsModel(input({ history: [1, 2, 3, 4, 5, 6].map((d) => session(daysAgo(d))) }));
  assert.equal(part(sixDays, "week-of-practice").earned, false);
  assert.equal(part(sixDays, "week-of-practice").progress?.done, 6);

  const week = buildAchievementsModel(input({ history: [1, 2, 3, 4, 5, 6, 7].map((d) => session(daysAgo(d))) }));
  assert.equal(part(week, "week-of-practice").earned, true);
  assert.equal(part(week, "week-of-practice").earnedAt?.slice(0, 10), daysAgo(1).slice(0, 10));

  const back = buildAchievementsModel(input({ history: [session(daysAgo(40)), session(daysAgo(10))] }));
  assert.equal(part(back, "comeback").earned, true);
});

test("a learner away for two weeks is offered Comeback first", () => {
  const model = buildAchievementsModel(input({ history: [session(daysAgo(30))] }));
  assert.equal(model.upNext[0].id, "comeback");
});

test("Core Complete needs every lesson and both projects", () => {
  const all = done(...LESSONS.map((l) => l.slug));
  const lessonsOnly = buildAchievementsModel(input({ completions: all }));
  assert.equal(part(lessonsOnly, "core-complete").earned, false);
  const everything = buildAchievementsModel(
    input({
      completions: all,
      projectLinks: [
        { projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(2) },
        { projectId: "shellforge", repoUrl: "https://github.com/a/s", addedAt: daysAgo(1) },
      ],
    }),
  );
  assert.equal(part(everything, "core-complete").earned, true);
  assert.equal(everything.litThrough, everything.columns.length - 1);
});
