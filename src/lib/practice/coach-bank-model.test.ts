import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCoachBankModel,
  filterBankRows,
  type BankFilters,
} from "./coach-bank-model";
import type { PracticeSessionRecord } from "./history";
import { unlockedQuestions } from "./session";
import type { PracticeCard } from "./sm2";

const NOW = new Date(2026, 8, 29, 15, 0);
const COMPLETED = new Set<string>();
const UNLOCKED = unlockedQuestions(COMPLETED);
const [Q1, Q2, Q3, Q4] = UNLOCKED;
const NO_FILTERS: BankFilters = { query: "", lesson: null, format: null, strength: null };

function card(questionId: string, overrides: Partial<PracticeCard> = {}): PracticeCard {
  return {
    questionId,
    state: "review",
    reps: 3,
    ease: 2.5,
    intervalDays: 5,
    dueAt: new Date(2026, 8, 26, 9).toISOString(),
    lapses: 0,
    updatedAt: NOW.toISOString(),
    ...overrides,
  };
}

function session(questionIds: string[], missIds: string[]): PracticeSessionRecord {
  return {
    id: `s-${questionIds.join("-")}`,
    at: NOW.toISOString(),
    scopeType: "all",
    scopeLabel: "Free study",
    pathSlug: null,
    correct: questionIds.length - missIds.length,
    total: questionIds.length,
    missIds,
    questionIds,
  };
}

function build(cards: PracticeCard[], history: PracticeSessionRecord[] = []) {
  return buildCoachBankModel({ cards, history, completedKeys: COMPLETED, now: NOW });
}

test("one row per unlocked question; missing cards count as new", () => {
  const model = build([]);
  assert.equal(model.rows.length, UNLOCKED.length);
  assert.equal(model.total, UNLOCKED.length);
  assert.ok(model.rows.every((row) => row.strength === "new"));
  assert.ok(model.rows.every((row) => row.dueLabel === "Not seen yet"));
  assert.equal(model.strengthCounts.new, UNLOCKED.length);
});

test("strength, due labels and sort order", () => {
  const cards = [
    card(Q1.id, { dueAt: new Date(2026, 9, 4, 9).toISOString(), intervalDays: 30 }),
    card(Q2.id, { state: "learning", intervalDays: 0, dueAt: new Date(2026, 8, 28).toISOString() }),
    card(Q3.id, { dueAt: new Date(2026, 8, 30, 9).toISOString(), intervalDays: 4 }),
    card(Q4.id, { state: "new", intervalDays: 0 }),
  ];
  const rows = build(cards).rows;
  const byId = new Map(rows.map((row) => [row.id, row]));

  assert.equal(byId.get(Q1.id)?.strength, "mastered");
  assert.equal(byId.get(Q1.id)?.dueLabel, "Sun, Oct 4");
  assert.equal(byId.get(Q2.id)?.strength, "learning");
  assert.equal(byId.get(Q2.id)?.dueLabel, "Today");
  assert.equal(byId.get(Q2.id)?.dueToday, true);
  assert.equal(byId.get(Q3.id)?.strength, "solid");
  assert.equal(byId.get(Q3.id)?.dueLabel, "Wed, Sep 30");
  assert.equal(byId.get(Q4.id)?.strength, "new");

  assert.deepEqual(rows.slice(0, 3).map((row) => row.id), [Q2.id, Q3.id, Q1.id]);
  assert.equal(rows.at(-1)?.strength, "new");
});

test("counts: total, due today and per strength", () => {
  const model = build([
    card(Q1.id, { state: "learning", dueAt: new Date(2026, 8, 29, 8).toISOString() }),
    card(Q2.id, { dueAt: new Date(2026, 8, 20).toISOString() }),
    card(Q3.id, { intervalDays: 40, dueAt: new Date(2026, 10, 1).toISOString() }),
  ]);
  assert.equal(model.dueToday, 2);
  assert.equal(model.strengthCounts.learning, 1);
  assert.equal(model.strengthCounts.solid, 1);
  assert.equal(model.strengthCounts.mastered, 1);
  assert.equal(model.strengthCounts.new, UNLOCKED.length - 3);
});

test("correct/seen comes from session history", () => {
  const history = [session([Q1.id, Q2.id], [Q2.id]), session([Q1.id], [])];
  const byId = new Map(build([], history).rows.map((row) => [row.id, row]));
  assert.deepEqual([byId.get(Q1.id)?.correct, byId.get(Q1.id)?.seen], [2, 2]);
  assert.deepEqual([byId.get(Q2.id)?.correct, byId.get(Q2.id)?.seen], [0, 1]);
  assert.deepEqual([byId.get(Q3.id)?.correct, byId.get(Q3.id)?.seen], [0, 0]);
});

test("rows carry text, format label and lesson; options list lessons and formats", () => {
  const model = build([]);
  const row = model.rows.find((r) => r.id === Q1.id);
  assert.ok(row);
  assert.ok(row.text.length > 0);
  assert.ok(["Choices", "Flashcard", "Short answer", "Cloze"].includes(row.formatLabel));
  assert.equal(row.lessonKey, `${Q1.lessonLevel}/${Q1.lessonSlug}`);
  assert.ok(row.lessonTitle.length > 0);
  assert.ok(model.lessons.some((lesson) => lesson.key === row.lessonKey));
  assert.ok(model.formats.some((format) => format.value === row.format));
  assert.equal(new Set(model.lessons.map((l) => l.key)).size, model.lessons.length);
});

test("filters combine: query, lesson, format and strength", () => {
  const rows = build([card(Q1.id, { state: "learning" })]).rows;
  const target = rows.find((r) => r.id === Q1.id);
  assert.ok(target);

  assert.equal(filterBankRows(rows, NO_FILTERS).length, rows.length);
  const byQuery = filterBankRows(rows, { ...NO_FILTERS, query: target.text.slice(0, 12).toUpperCase() });
  assert.ok(byQuery.some((r) => r.id === Q1.id));
  const byLessonTitle = filterBankRows(rows, { ...NO_FILTERS, query: target.lessonTitle });
  assert.ok(byLessonTitle.every((r) => r.lessonTitle === target.lessonTitle || r.text.includes(target.lessonTitle)));
  assert.ok(filterBankRows(rows, { ...NO_FILTERS, lesson: target.lessonKey }).every((r) => r.lessonKey === target.lessonKey));
  assert.ok(filterBankRows(rows, { ...NO_FILTERS, format: target.format }).every((r) => r.format === target.format));
  assert.deepEqual(filterBankRows(rows, { ...NO_FILTERS, strength: "learning" }).map((r) => r.id), [Q1.id]);
  assert.deepEqual(filterBankRows(rows, { ...NO_FILTERS, strength: "learning", format: target.format === "mcq" ? "cloze" : "mcq" }), []);
  assert.deepEqual(filterBankRows(rows, { ...NO_FILTERS, query: "zzz-no-match" }), []);
});
