import assert from "node:assert/strict";
import { test } from "node:test";
import {
  answerText,
  blankWidth,
  looksLikeCode,
  officialWording,
  outputMatches,
  shuffledOrder,
  splitBlank,
  splitCodeBlank,
} from "./session-view";

test("code-shaped answers are code, plain words are not", () => {
  for (const code of ["int *p", "0x1F", "0b1010", "argv[0]", "size_t", "printf()", "a = b", "8", "3.14", "#include"]) {
    assert.equal(looksLikeCode(code), true, code);
  }
  for (const words of ["One byte of memory", "two", "Eight switches wired in parallel", "bit", ""]) {
    assert.equal(looksLikeCode(words), false, words);
  }
});

test("a shuffled order is a permutation of every option", () => {
  const order = shuffledOrder(4, () => 0.5);
  assert.deepEqual([...order].sort(), [0, 1, 2, 3]);
  assert.deepEqual(shuffledOrder(0), []);
});

test("shuffling moves the answer around across showings", () => {
  let seed = 1;
  const rng = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const firstSlots = new Set(Array.from({ length: 40 }, () => shuffledOrder(4, rng).indexOf(0)));
  assert.ok(firstSlots.size >= 3);
});

test("a prose blank splits around {{blank}}", () => {
  assert.deepEqual(splitBlank("A bit has exactly {{blank}} possible states."), {
    before: "A bit has exactly ",
    after: " possible states.",
  });
  assert.equal(splitBlank("No blank here"), null);
  assert.equal(splitBlank(undefined), null);
});

test("a code blank finds its line", () => {
  assert.deepEqual(splitCodeBlank(["int main(void) {", "  return {{blank}};", "}"]), {
    line: 1,
    before: "  return ",
    after: ";",
  });
  assert.equal(splitCodeBlank(["no blank"]), null);
});

test("blank inputs fit the answer, within limits", () => {
  assert.equal(blankWidth(["2"]), 5);
  assert.equal(blankWidth(["sizeof"]), 8);
  assert.equal(blankWidth(["a very long accepted answer indeed"]), 24);
});

test("the official wording shows only when it differs", () => {
  assert.equal(officialWording("two", ["2", "two"]), "2");
  assert.equal(officialWording(" 2 ", ["2"]), null);
  assert.equal(officialWording("Bit", ["bit"]), null);
  assert.equal(officialWording("x", []), null);
});

test("predicted output matches apart from trailing whitespace and line endings", () => {
  const expected = "*p = 10\n*(p + 2) = 30";
  assert.equal(outputMatches("*p = 10\n*(p + 2) = 30\n", expected), true);
  assert.equal(outputMatches("*p = 10  \r\n*(p + 2) = 30", expected), true);
  assert.equal(outputMatches("*p = 10\n*(p+2) = 30", expected), false);
  assert.equal(outputMatches("*P = 10\n*(p + 2) = 30", expected), false); // output is case-sensitive
  assert.equal(outputMatches("*p = 10", expected), false);
});

test("every card type has an answer as text", () => {
  const base = { id: "x", lessonLevel: "l", lessonSlug: "s", conceptId: "c", reviewLabel: "r" };
  assert.equal(answerText({ ...base, kind: "output", prompt: "p", code: ["x"], output: "7" }), "7");
  assert.equal(
    answerText({ ...base, kind: "bug", prompt: "p", code: ["a", "b"], bugLine: 1, fix: "Use ==." }),
    "Line 2: Use ==.",
  );
  assert.equal(answerText({ ...base, kind: "mcq", prompt: "p", options: ["a", "b"], correct: 1 }), "b");
});
