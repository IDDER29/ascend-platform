import assert from "node:assert/strict";
import { test } from "node:test";
import { answersMatch, normalizeAnswer } from "./normalize";

test("normalizeAnswer ignores surrounding whitespace and ASCII case", () => {
  assert.equal(normalizeAnswer("  Fetch  "), "fetch");
  assert.equal(normalizeAnswer("DeCoDe"), "decode");
});

test("normalizeAnswer collapses internal whitespace", () => {
  assert.equal(normalizeAnswer("fetch \n\t decode   execute"), "fetch decode execute");
});

test("normalizeAnswer strips one trailing semicolon", () => {
  assert.equal(normalizeAnswer("return;"), "return");
  assert.equal(normalizeAnswer("return;;"), "return;");
});

test("answersMatch accepts any normalized answer", () => {
  assert.equal(answersMatch("  Exclusive   OR; ", ["XOR", "exclusive or"]), true);
  assert.equal(answersMatch("AND", ["OR", "XOR"]), false);
});
