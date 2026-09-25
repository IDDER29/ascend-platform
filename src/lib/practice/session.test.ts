import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSession, coalesceAnsweredSnapshot } from "./session";

test("buildSession includes a priority flashcard in a mixed session", () => {
  const session = buildSession({
    completedKeys: new Set(),
    priorityIds: ["bits-fc-01"],
    size: 1,
    scope: { type: "all" },
  });

  assert.equal(session.length, 1);
  assert.equal(session[0]?.id, "bits-fc-01");
  assert.equal(session[0]?.kind, "flashcard");
});

test("coalesceAnsweredSnapshot ignores non-array overrides (e.g. click events)", () => {
  const fallback = [{ questionId: "q1", grade: "good" as const }];
  assert.deepEqual(coalesceAnsweredSnapshot(null, fallback), fallback);
  assert.deepEqual(coalesceAnsweredSnapshot({ type: "click" }, fallback), fallback);
  const override = [{ questionId: "q2", grade: "again" as const }];
  assert.deepEqual(coalesceAnsweredSnapshot(override, fallback), override);
});
