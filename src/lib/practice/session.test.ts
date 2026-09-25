import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSession } from "./session";

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
