import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildSession,
  coalesceAnsweredSnapshot,
  shuffleInPlace,
} from "./session";

test("buildSession includes a priority flashcard in a mixed session", () => {
  const session = buildSession({
    completedKeys: new Set(),
    priorityIds: ["bits-fc-01"],
    size: 1,
    scope: { type: "all" },
    rng: () => 0,
  });

  assert.equal(session.length, 1);
  assert.equal(session[0]?.id, "bits-fc-01");
  assert.equal(session[0]?.kind, "flashcard");
});

test("buildSession shuffles final order so formats are not fixed by bank order", () => {
  // rng always returns 0 → Fisher–Yates does not leave the input order intact
  const zeroRng = () => 0;
  assert.deepEqual(shuffleInPlace(["a", "b", "c"], zeroRng), ["b", "c", "a"]);

  const session = buildSession({
    completedKeys: new Set(),
    priorityIds: ["bits-01", "bits-fc-01", "bits-02"],
    size: 3,
    scope: { type: "due" },
    rng: zeroRng,
  });
  assert.deepEqual(
    session.map((q) => q.id),
    ["bits-fc-01", "bits-02", "bits-01"],
  );
  assert.ok(session.some((q) => q.kind === "flashcard"));
  assert.ok(session.some((q) => q.kind === "mcq"));
});

test("coalesceAnsweredSnapshot ignores non-array overrides (e.g. click events)", () => {
  const fallback = [{ questionId: "q1", grade: "good" as const }];
  assert.deepEqual(coalesceAnsweredSnapshot(null, fallback), fallback);
  assert.deepEqual(coalesceAnsweredSnapshot({ type: "click" }, fallback), fallback);
  const override = [{ questionId: "q2", grade: "again" as const }];
  assert.deepEqual(coalesceAnsweredSnapshot(override, fallback), override);
});
