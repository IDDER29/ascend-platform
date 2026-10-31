import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "./bank";
import { MASTERY_SKILLS, masteryLabel, masteryOf } from "./mastery";

test("every card kind has a skill, and the skills run recognise to debug", () => {
  assert.deepEqual(
    MASTERY_SKILLS.map((s) => s.value),
    ["recognise", "explain", "predict", "build", "debug"],
  );
  assert.equal(masteryOf("mcq"), "recognise");
  assert.equal(masteryOf("typed"), "explain");
  assert.equal(masteryOf("output"), "predict");
  assert.equal(masteryOf("bits"), "build");
  assert.equal(masteryOf("bug"), "debug");
  assert.equal(masteryLabel("predict"), "Predict");
});

test("the bank has cards at every skill", () => {
  const skills = new Set(PRACTICE_BANK.map((q) => masteryOf(q.kind)));
  for (const s of MASTERY_SKILLS) assert.ok(skills.has(s.value), s.value);
});
