import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "./bank";
import { buildCoachCompleteModel } from "./coach-complete-model";
import type { PracticeSessionRecord } from "./history";
import type { McqItem } from "./types";

const NOW = new Date(2026, 8, 29, 15, 0);

function at(daysAgo: number, hour = 12): string {
  return new Date(2026, 8, 29 - daysAgo, hour).toISOString();
}

function session(
  overrides: Partial<PracticeSessionRecord> = {},
): PracticeSessionRecord {
  const questionIds = overrides.questionIds ?? ["a", "b", "c", "d"];
  const missIds = overrides.missIds ?? [];
  return {
    id: "s1",
    at: at(0, 14),
    scopeType: "due",
    scopeLabel: "Due review",
    pathSlug: null,
    correct: questionIds.length - missIds.length,
    total: questionIds.length,
    missIds,
    questionIds,
    ...overrides,
  };
}

test("summary, results, accuracy and strength for a 3-of-4 session", () => {
  const record = session({ missIds: ["c"] });
  const model = buildCoachCompleteModel({ record, history: [record], goal: 20, now: NOW });

  assert.equal(model.correct, 3);
  assert.equal(model.total, 4);
  assert.equal(model.missed, 1);
  assert.equal(
    model.summary,
    "3 of 4 right. The 1 you missed is already scheduled to come back.",
  );
  assert.deepEqual(model.results, [true, true, false, true]);
  assert.equal(model.accuracy.percent, 75);
  assert.deepEqual(model.strength, { movedUp: 3, backToLearning: 1 });
});

test("plural miss copy and caught-up copy", () => {
  const many = session({ missIds: ["a", "b"] });
  assert.equal(
    buildCoachCompleteModel({ record: many, history: [many], goal: 20, now: NOW }).summary,
    "2 of 4 right. The 2 you missed are already scheduled to come back.",
  );
  const perfect = session();
  assert.equal(
    buildCoachCompleteModel({ record: perfect, history: [perfect], goal: 20, now: NOW }).summary,
    "4 of 4 right. You're caught up for now.",
  );
});

test("lastPercent comes from the newest earlier session", () => {
  const record = session();
  const older = session({ id: "s0", at: at(1), questionIds: ["a", "b", "c"], missIds: ["a"] });
  const oldest = session({ id: "s-1", at: at(3), missIds: ["a", "b", "c", "d"] });
  const model = buildCoachCompleteModel({
    record,
    history: [record, older, oldest],
    goal: 20,
    now: NOW,
  });
  assert.equal(model.accuracy.lastPercent, 67);

  const first = buildCoachCompleteModel({ record, history: [record], goal: 20, now: NOW });
  assert.equal(first.accuracy.lastPercent, null);
});

test("daily goal counts today's cards and streak counts consecutive days", () => {
  const record = session();
  const earlierToday = session({ id: "s0", at: at(0, 9), questionIds: ["x", "y"] });
  const yesterday = session({ id: "s-1", at: at(1) });
  const history = [record, earlierToday, yesterday];

  const model = buildCoachCompleteModel({ record, history, goal: 10, now: NOW });
  assert.deepEqual(model.goal, { answeredToday: 6, goal: 10, met: false, remaining: 4 });
  assert.equal(model.streak, 2);
});

test("goal is met once today's cards reach it", () => {
  const record = session({ questionIds: Array.from({ length: 10 }, (_, i) => `q${i}`) });
  const model = buildCoachCompleteModel({ record, history: [record], goal: 10, now: NOW });
  assert.deepEqual(model.goal, { answeredToday: 10, goal: 10, met: true, remaining: 0 });
});

test("misses carry label, correct answer and lesson title", () => {
  const mcq = PRACTICE_BANK.find((q): q is McqItem => q.kind === "mcq");
  const flash = PRACTICE_BANK.find((q) => q.kind === "flashcard");
  assert.ok(mcq && flash && flash.kind === "flashcard");
  const record = session({
    questionIds: [mcq.id, flash.id, "unknown-id"],
    missIds: [mcq.id, flash.id, "unknown-id"],
  });
  const [m, f, u] = buildCoachCompleteModel({
    record,
    history: [record],
    goal: 20,
    now: NOW,
  }).misses;

  assert.equal(m.id, mcq.id);
  assert.equal(m.label, mcq.reviewLabel);
  assert.equal(m.answer, mcq.options[mcq.correct]);
  assert.equal(f.answer, flash.back);
  assert.equal(typeof f.lessonTitle, "string");
  assert.deepEqual(u, { id: "unknown-id", label: "unknown-id", answer: null, lessonTitle: null });
});

test("links: fix misses first, otherwise back to practice", () => {
  const withMisses = session({ missIds: ["a", "b"] });
  const model = buildCoachCompleteModel({
    record: withMisses,
    history: [withMisses],
    goal: 20,
    now: NOW,
  });
  assert.deepEqual(model.primary, {
    label: "Fix 2 misses now",
    href: "/practicev2/session?scope=due",
  });
  assert.deepEqual(model.secondary, { label: "Back to practice", href: "/practicev2" });

  const one = session({ missIds: ["a"] });
  assert.equal(
    buildCoachCompleteModel({ record: one, history: [one], goal: 20, now: NOW }).primary.label,
    "Fix 1 miss now",
  );

  const perfect = session();
  const clean = buildCoachCompleteModel({ record: perfect, history: [perfect], goal: 20, now: NOW });
  assert.deepEqual(clean.primary, { label: "Back to practice", href: "/practicev2" });
  assert.equal(clean.secondary, null);
});
