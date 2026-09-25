import assert from "node:assert/strict";
import { test } from "node:test";
import {
  countDueQuestions,
  practicePathDrillIn,
  practiceSectionDrillIn,
} from "./drill-in";

test("countDueQuestions intersects due IDs with scope question IDs", () => {
  assert.equal(
    countDueQuestions(["q-1", "q-2", "q-3"], new Set(["q-2", "q-3", "q-4"])),
    2,
  );
  assert.equal(countDueQuestions(["q-1"], new Set()), 0);
});

test("practicePathDrillIn returns sections with unlocked card counts", () => {
  const data = practicePathDrillIn(new Set(), "foundations");

  assert.ok(data);
  assert.equal(data.title, "Foundations");
  assert.deepEqual(
    data.sections.map((section) => section.id),
    ["bits", "logic", "machine-runs"],
  );
  assert.ok((data.sections[0]?.questionCount ?? 0) > 0);
  assert.equal(
    data.sections[0]?.questionIds.length,
    data.sections[0]?.questionCount,
  );
  assert.equal(practicePathDrillIn(new Set(), "missing"), null);
});

test("practiceSectionDrillIn returns lesson rows scoped to the section", () => {
  const level = "level-02-the-c-language";
  const data = practiceSectionDrillIn(
    new Set([
      `${level}/what-a-pointer-really-is`,
      `${level}/pointer-arithmetic`,
      `${level}/double-pointers`,
    ]),
    "systems-programmer",
    "pointers",
  );

  assert.ok(data);
  assert.equal(data.pathTitle, "Systems Programmer");
  assert.equal(data.title, "Pointers");
  assert.deepEqual(
    data.lessons.map((lesson) => lesson.key),
    [
      `${level}/what-a-pointer-really-is`,
      `${level}/pointer-arithmetic`,
      `${level}/double-pointers`,
    ],
  );
  assert.ok(data.lessons.every((lesson) => lesson.questionCount > 0));
  assert.ok(
    data.lessons.every(
      (lesson) => lesson.questionIds.length === lesson.questionCount,
    ),
  );
  assert.equal(
    practiceSectionDrillIn(new Set(), "foundations", "pointers"),
    null,
  );
});
