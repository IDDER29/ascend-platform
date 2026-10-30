import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "./bank";
import { hasLengthCue, longestIsRightShare } from "./bank-quality";
import { truthTable } from "./figures";
import type { McqItem } from "./types";

const MCQ = PRACTICE_BANK.filter((q): q is McqItem => q.kind === "mcq");

test("a right option much longer than the rest is a cue", () => {
  assert.equal(hasLengthCue({ options: ["a", "b", "the long careful right answer", "c"], correct: 2 }), true);
  assert.equal(hasLengthCue({ options: ["one full option", "another option", "a third option"], correct: 0 }), false);
  assert.equal(hasLengthCue({ options: ["short", "a much longer wrong option"], correct: 0 }), false);
});

test("no multiple-choice card gives its answer away by length", () => {
  const cued = MCQ.filter(hasLengthCue).map((q) => q.id);
  assert.deepEqual(cued, [], `right option over ${"1.2"}× the longest wrong one: ${cued.join(", ")}`);
});

test("'pick the longest' is not a winning strategy across the bank", () => {
  // Chance is ~25% with four options; allow some slack, never a majority.
  assert.ok(longestIsRightShare(MCQ) <= 0.35, `longest option is right in ${Math.round(longestIsRightShare(MCQ) * 100)}%`);
});

test("predict-the-output cards have code and an exact output", () => {
  for (const q of PRACTICE_BANK) {
    if (q.kind !== "output") continue;
    assert.ok(q.code.length > 0, q.id);
    assert.ok(q.output.trim().length > 0, q.id);
    assert.equal(q.output, q.output.replace(/\s+$/, ""), `${q.id}: no trailing whitespace in output`);
  }
});

test("spot-the-bug cards point at a real, non-blank line", () => {
  for (const q of PRACTICE_BANK) {
    if (q.kind !== "bug") continue;
    assert.ok(Number.isInteger(q.bugLine) && q.bugLine >= 0 && q.bugLine < q.code.length, q.id);
    assert.ok(q.code[q.bugLine].trim().length > 0, `${q.id}: the bug line is blank`);
    assert.ok(q.fix.length > 20, `${q.id}: explain the fix`);
  }
});

test("put-in-order cards have 3 to 7 distinct steps", () => {
  for (const q of PRACTICE_BANK) {
    if (q.kind !== "order") continue;
    assert.ok(q.steps.length >= 3 && q.steps.length <= 7, q.id);
    assert.equal(new Set(q.steps).size, q.steps.length, `${q.id}: steps must be distinct`);
  }
});

test("flip-the-bits cards: bits only, and a gate's answer is its real truth table", () => {
  for (const q of PRACTICE_BANK) {
    if (q.kind !== "bits") continue;
    assert.match(q.bits, /^[01]+$/, q.id);
    if (q.gate) {
      const outputs = truthTable(q.gate).rows.flatMap((r) => r.out).join("");
      assert.equal(q.bits, outputs, `${q.id}: answer doesn't match the ${q.gate} table`);
    }
  }
});
