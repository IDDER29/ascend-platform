import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildSession,
  coalesceAnsweredSnapshot,
  questionsForScope,
  shuffleInPlace,
} from "./session";

test("questionsForScope returns only unlocked lessons in a section", () => {
  const level = "level-02-the-c-language";
  const completedKeys = new Set([
    `${level}/what-a-pointer-really-is`,
    `${level}/pointer-arithmetic`,
    `${level}/double-pointers`,
    `${level}/undefined-behaviour`,
  ]);

  const questions = questionsForScope(completedKeys, {
    type: "section",
    pathSlug: "systems-programmer",
    sectionId: "pointers",
  });

  assert.ok(questions.length > 0);
  assert.ok(
    questions.every(
      (question) =>
        question.lessonLevel === level &&
        [
          "what-a-pointer-really-is",
          "pointer-arithmetic",
          "double-pointers",
        ].includes(question.lessonSlug),
    ),
  );
  assert.ok(
    !questions.some(
      (question) => question.lessonSlug === "undefined-behaviour",
    ),
  );
});

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

test("buildSession includes typed and cloze questions", () => {
  const session = buildSession({
    completedKeys: new Set(),
    priorityIds: ["bits-typed-01", "bits-cloze-01"],
    size: 2,
    scope: { type: "due" },
    rng: () => 0,
  });

  assert.deepEqual(
    new Set(session.map((q) => q.kind)),
    new Set(["typed", "cloze"]),
  );
});

test("coalesceAnsweredSnapshot ignores non-array overrides (e.g. click events)", () => {
  const fallback = [{ questionId: "q1", grade: "good" as const }];
  assert.deepEqual(coalesceAnsweredSnapshot(null, fallback), fallback);
  assert.deepEqual(coalesceAnsweredSnapshot({ type: "click" }, fallback), fallback);
  const override = [{ questionId: "q2", grade: "again" as const }];
  assert.deepEqual(coalesceAnsweredSnapshot(override, fallback), override);
});
