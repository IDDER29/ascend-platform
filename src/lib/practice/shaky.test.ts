import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "./bank";
import type { PracticeSessionRecord } from "./history";
import { shakyCards } from "./shaky";

const MCQ = PRACTICE_BANK.filter((q) => q.kind === "mcq").map((q) => q.id);
const T0 = new Date(2026, 9, 1, 10).getTime();
const at = (d: number) => new Date(T0 + d * 86_400_000).toISOString();

function session(
  day: number,
  ids: string[],
  times: Record<string, number>,
  miss: string[] = [],
): PracticeSessionRecord {
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
    timesMs: times,
  };
}

const fast = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, 4_000]));

test("right but much slower than your usual: shaky; right and quick: not", () => {
  const ids = MCQ.slice(0, 6);
  const m = shakyCards([session(0, ids, { ...fast(ids), [ids[0]]: 16_000 })]);
  assert.deepEqual(
    m.map((c) => [c.id, c.reason]),
    [[ids[0], "slow"]],
  );
  assert.equal(m[0].usualMs, 4_000);
});

test("a slow answer below the floor isn't shaky, even for a fast learner", () => {
  const ids = MCQ.slice(0, 6);
  assert.deepEqual(shakyCards([session(0, ids, { ...fast(ids), [ids[0]]: 9_000 })]), []);
});

test("right after a recent miss: shaky (recovered), even with no times", () => {
  const id = MCQ[0];
  const m = shakyCards([session(0, [id], {}, [id]), session(2, [id], {})]);
  assert.deepEqual(
    m.map((c) => [c.id, c.reason]),
    [[id, "recovered"]],
  );
});

test("a later quick right answer clears it; a miss isn't shaky (it's a miss); away times are ignored", () => {
  const id = MCQ[0];
  assert.deepEqual(shakyCards([session(0, [id], { [id]: 30_000 }), session(3, [id], { [id]: 3_000 })]), []);
  assert.deepEqual(shakyCards([session(0, [id], { [id]: 30_000 }, [id])]), []);
  assert.deepEqual(shakyCards([session(0, [id], { [id]: 600_000 })]), []);
});
