import assert from "node:assert/strict";
import { test } from "node:test";
import { deckMemory } from "./deck-memory";
import type { PracticeSessionRecord } from "./history";

const NOW = new Date(2026, 9, 30, 12);
const ago = (d: number) => new Date(NOW.getTime() - d * 86_400_000).toISOString();

function session(daysAgo: number, ids: string[], miss: string[] = []): PracticeSessionRecord {
  return {
    id: `s${daysAgo}`,
    at: ago(daysAgo),
    scopeType: "due",
    scopeLabel: "Due",
    pathSlug: null,
    correct: ids.length - miss.length,
    total: ids.length,
    questionIds: ids,
    missIds: miss,
  };
}

test("no reviews: nothing to show", () => {
  assert.equal(deckMemory([], NOW), null);
});

test("overdue cards: review today, and the review lifts it back up", () => {
  const m = deckMemory([session(10, ["a", "b"]), session(9, ["a", "b"])], NOW)!;
  assert.equal(m.cards, 2);
  assert.equal(m.reviewToday, true);
  assert.equal(m.dueNow, 2);
  assert.ok(m.now < 0.9);
  assert.ok(m.afterReview > 0.99);
  assert.ok(Math.abs(m.lastReview!.day + 9) < 1e-9);
  assert.equal(m.nextDue, null);
  // The past ends where today starts, and both futures start there too.
  assert.ok(Math.abs(m.past.at(-1)!.recall - m.now) < 1e-9);
  assert.ok(Math.abs(m.ifReview[0].recall - m.now) < 1e-9);
  assert.ok(Math.abs(m.ifSkip[0].recall - m.now) < 1e-9);
  // The past has a jump up at the review 9 days ago.
  const before = m.past.find((p) => p.day === -9.25)!.recall;
  const after = m.past.find((p) => p.day === -9)!.recall;
  assert.ok(after > before);
});

test("reviewed recently: no review today, and when the next one is", () => {
  const m = deckMemory([session(0.5, ["a"])], NOW)!;
  assert.equal(m.reviewToday, false);
  assert.ok(m.now > 0.9);
  assert.ok(m.nextDue && m.nextDue.day > 0);
  assert.equal(m.from, -1);
});

test("the window reaches back to the last review, even weeks ago", () => {
  const m = deckMemory([session(30, ["a"]), session(20, ["a"])], NOW)!;
  assert.ok(m.from <= -21);
  assert.ok(m.lastReview!.day >= m.from);
});
