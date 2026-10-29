import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "./bank";
import { buildCoachPathModel, practicePathSlugs, type CoachPathInput } from "./coach-path-model";
import type { PracticeSessionRecord } from "./history";
import { completionKey } from "./session";
import { createNewCard, localDayKey, type PracticeCard } from "./sm2";

const NOW = new Date(2026, 9, 29, 14, 0);
const L00 = "level-00-bits-logic";

function input(patch: Partial<CoachPathInput> = {}): CoachPathInput {
  return {
    slug: "foundations",
    cards: [],
    history: [],
    meta: { date: localDayKey(NOW), count: 0 },
    completedKeys: new Set(),
    lessonHrefs: {},
    now: NOW,
    ...patch,
  };
}

function idsFor(slug: string): string[] {
  return PRACTICE_BANK.filter((q) => q.lessonSlug === slug).map((q) => q.id);
}

function session(questionIds: string[], missIds: string[]): PracticeSessionRecord {
  return {
    id: `s-${questionIds.join("-")}`,
    at: new Date(2026, 9, 28).toISOString(),
    scopeType: "all",
    scopeLabel: "Free study",
    pathSlug: null,
    correct: questionIds.length - missIds.length,
    total: questionIds.length,
    missIds,
    questionIds,
  };
}

function seenCard(id: string, patch: Partial<PracticeCard> = {}): PracticeCard {
  return {
    ...createNewCard(id, NOW),
    state: "review",
    reps: 2,
    intervalDays: 3,
    dueAt: new Date(2026, 10, 5).toISOString(),
    ...patch,
  };
}

test("unknown path has no desk", () => {
  assert.equal(buildCoachPathModel(input({ slug: "nope" })), null);
});

test("lists every path that has cards, Foundations first", () => {
  const slugs = practicePathSlugs();
  assert.equal(slugs[0], "foundations");
  assert.ok(slugs.includes("systems-programmer"));
});

test("fresh Foundations: open, not started, no focus or hit rate", () => {
  const model = buildCoachPathModel(input())!;
  assert.equal(model.title, "Foundations");
  assert.equal(model.alwaysOpen, true);
  assert.equal(model.cardCount, model.unlockedCount);
  assert.equal(model.hitRate, null);
  assert.equal(model.focus, null);
  assert.equal(model.dueHref, null);
  const lessons = model.sections.flatMap((s) => s.lessons);
  assert.equal(lessons.length, model.lessonCount);
  assert.deepEqual(lessons.map((l) => l.number), lessons.map((_, i) => i + 1));
  for (const lesson of lessons.filter((l) => l.cardCount > 0)) {
    assert.equal(lesson.status, "not-started");
    assert.ok(lesson.practiceHref?.includes("cards="));
  }
  assert.ok(model.sections.every((s) => s.practiceHref?.includes("scope=section")));
});

test("locked lessons on a path you have not started", () => {
  const model = buildCoachPathModel(input({ slug: "systems-programmer" }))!;
  assert.equal(model.unlockedCount, 0);
  assert.equal(model.alwaysOpen, false);
  const withCards = model.sections.flatMap((s) => s.lessons).filter((l) => l.cardCount > 0);
  assert.ok(withCards.length > 0);
  assert.ok(withCards.every((l) => l.status === "locked" && l.practiceHref === null));
});

test("completing a lesson unlocks its cards", () => {
  const sample = PRACTICE_BANK.find((q) => q.lessonLevel === "level-02-the-c-language")!;
  const key = completionKey(sample.lessonLevel, sample.lessonSlug);
  const model = buildCoachPathModel(
    input({ slug: "systems-programmer", completedKeys: new Set([key]) }),
  )!;
  const lesson = model.sections.flatMap((s) => s.lessons).find((l) => l.key === key)!;
  assert.equal(lesson.status, "not-started");
  assert.ok(lesson.practiceHref);
});

test("misses flag the lesson and point the focus tip at its section", () => {
  const ids = idsFor("what-is-a-bit").slice(0, 4);
  const model = buildCoachPathModel(
    input({
      cards: ids.map((id) => seenCard(id)),
      history: [session(ids, ids.slice(0, 3))],
    }),
  )!;
  const lesson = model.sections
    .flatMap((s) => s.lessons)
    .find((l) => l.key === completionKey(L00, "what-is-a-bit"))!;
  assert.equal(lesson.status, "needs-work");
  assert.ok(model.focus);
  assert.ok(model.focus.lessonTitles.includes(lesson.title));
  assert.ok(model.focus.href.includes(encodeURIComponent(lesson.key)));
  assert.equal(model.hitRate?.correct, 1);
});

test("due cards are counted per lesson and for the path", () => {
  const ids = idsFor("binary-and-number-bases").slice(0, 2);
  const model = buildCoachPathModel(
    input({
      cards: ids.map((id) => seenCard(id, { dueAt: new Date(2026, 9, 28).toISOString() })),
    }),
  )!;
  const lesson = model.sections
    .flatMap((s) => s.lessons)
    .find((l) => l.key === completionKey(L00, "binary-and-number-bases"))!;
  assert.equal(lesson.dueToday, 2);
  assert.equal(model.dueNow, 2);
  assert.ok(model.dueHref?.includes("scope=path"));
});
