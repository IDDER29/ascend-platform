import assert from "node:assert/strict";
import { test } from "node:test";
import {
  practiceSectionsForPath,
  practiceTreeForPath,
  sectionLessonKeys,
} from "./tree";

test("practiceTreeForPath maps live Foundations outline sections", () => {
  const tree = practiceTreeForPath("foundations");

  assert.ok(tree);
  assert.deepEqual(
    tree.sections.map((section) => section.id),
    ["bits", "logic", "machine-runs"],
  );
  assert.deepEqual(
    tree.sections[0]?.lessons.map((lesson) => ({
      key: lesson.key,
      title: lesson.title,
    })),
    [
      {
        key: "level-00-bits-logic/what-is-a-bit",
        title: "What is a bit?",
      },
      {
        key: "level-00-bits-logic/binary-and-number-bases",
        title: "Binary & number bases",
      },
    ],
  );
});

test("practiceSectionsForPath combines course outlines owned by a path", () => {
  assert.deepEqual(
    practiceSectionsForPath("systems-programmer").map(
      (section) => section.id,
    ),
    [
      "cpu-instructions",
      "memory-layout",
      "speed-and-bytes",
      "c-memory-model",
      "pointers",
      "data-and-allocation",
      "c-safety",
      "processes",
      "ipc-signals",
      "files",
    ],
  );
  assert.deepEqual(practiceSectionsForPath("unknown"), []);
});

test("sectionLessonKeys resolves completion keys and rejects mismatched paths", () => {
  assert.deepEqual(
    sectionLessonKeys("systems-programmer", "pointers"),
    [
      "level-02-the-c-language/what-a-pointer-really-is",
      "level-02-the-c-language/pointer-arithmetic",
      "level-02-the-c-language/double-pointers",
    ],
  );
  assert.deepEqual(sectionLessonKeys("foundations", "pointers"), []);
  assert.deepEqual(sectionLessonKeys("systems-programmer", "missing"), []);
});
