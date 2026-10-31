import assert from "node:assert/strict";
import { test } from "node:test";
import { cardMemory, recallAt } from "./card-memory";
import type { PracticeSessionRecord } from "./history";

const T0 = new Date(2026, 9, 1, 10);
const at = (day: number) => new Date(T0.getTime() + day * 86_400_000).toISOString();

function session(day: number, ids: string[], miss: string[] = []): PracticeSessionRecord {
  return {
    id: `s${day}`,
    at: at(day),
    scopeType: "due",
    scopeLabel: "Due",
    pathSlug: null,
    correct: ids.length - miss.length,
    total: ids.length,
    questionIds: ids,
    missIds: miss,
  };
}

test("never reviewed: no curve", () => {
  const m = cardMemory("q", [session(0, ["other"])], new Date(at(3)));
  assert.deepEqual(m.reviews, []);
  assert.equal(m.now, null);
});

test("each right answer stretches the curve the way the scheduler does", () => {
  // Learned day 0; reviewed right on days 1 and 4 (SM-2: 1 day, then 3, then 8).
  const m = cardMemory("q", [session(0, ["q"]), session(1, ["q"]), session(4, ["q"])], new Date(at(6)));
  assert.deepEqual(
    m.reviews.map((r) => [r.day, r.correct, r.stability]),
    [
      [0, true, 1],
      [1, true, 3],
      [4, true, 8],
    ],
  );
  assert.equal(m.firstStability, 1);
  assert.equal(m.due?.day, 12);
  // Recall is 90% exactly when each next review was due.
  assert.ok(Math.abs(recallAt(m, 1 - 1e-6)! - 0.9) < 1e-4);
  assert.ok(Math.abs(recallAt(m, 4 - 1e-6)! - 0.9) < 1e-4);
  assert.ok(m.now! > 0.9 && m.now! < 1);
});

test("a miss makes it fragile again", () => {
  const m = cardMemory("q", [session(0, ["q"]), session(1, ["q"]), session(4, ["q"], ["q"])], new Date(at(5)));
  assert.deepEqual(
    m.reviews.map((r) => r.stability),
    [1, 3, 0.5],
  );
  const right = cardMemory("q", [session(0, ["q"]), session(1, ["q"]), session(4, ["q"])], new Date(at(5)));
  assert.ok(m.now! < right.now! - 0.1, `${m.now} vs ${right.now}`);
  assert.ok(m.due!.day < right.due!.day);
});
