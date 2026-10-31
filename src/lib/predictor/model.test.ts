import assert from "node:assert/strict";
import { test } from "node:test";
import { fromPattern, parseBranches, predict } from "./model";

const loop10 = fromPattern(0x40, "TTTTTTTTTN", 10); // a 10-iteration loop, run 10 times

test("static guesses: taken is right 90% of the time on a loop branch", () => {
  assert.equal(predict({ kind: "taken", entries: 1, historyBits: 0 }, loop10).correct, 90);
  assert.equal(predict({ kind: "not-taken", entries: 1, historyBits: 0 }, loop10).correct, 10);
});

test("1-bit mispredicts twice per loop run (exit and re-entry); 2-bit only once", () => {
  const one = predict({ kind: "1-bit", entries: 16, historyBits: 0 }, loop10);
  assert.equal(one.correct, 100 - 2 * 10); // every run: the first test (re-entry) and the exit
  const two = predict({ kind: "2-bit", entries: 16, historyBits: 0 }, loop10);
  assert.equal(two.correct, 100 - (1 + 10)); // one to warm up from weakly not taken, then only the exits
});

test("a 2-bit counter saturates and steps one at a time", () => {
  const r = predict({ kind: "2-bit", entries: 1, historyBits: 0 }, fromPattern(0, "TTTN", 1));
  assert.deepEqual(r.results.map((x) => [x.before, x.after]), [
    [1, 2],
    [2, 3],
    [3, 3],
    [3, 2],
  ]);
});

test("gshare learns an alternating pattern that a 2-bit counter can't", () => {
  const alt = fromPattern(0x80, "TN", 50);
  const two = predict({ kind: "2-bit", entries: 16, historyBits: 0 }, alt);
  const gs = predict({ kind: "gshare", entries: 16, historyBits: 4 }, alt);
  assert.ok(two.accuracy <= 0.5, `2-bit ${two.accuracy}`);
  assert.ok(gs.accuracy >= 0.9, `gshare ${gs.accuracy}`);
});

test("two branches that share a table entry interfere (aliasing)", () => {
  const a = fromPattern(0x00, "T", 20);
  const b = fromPattern(0x40, "N", 20);
  const mixed = a.flatMap((x, i) => [x, b[i]]);
  assert.equal(predict({ kind: "2-bit", entries: 16, historyBits: 0 }, mixed).accuracy < 0.6, true); // 0x00 and 0x40 share entry 0
  assert.equal(predict({ kind: "2-bit", entries: 32, historyBits: 0 }, mixed).correct >= 38, true);
});

test("parseBranches", () => {
  const p = parseBranches(["0x40 T", "64 n", "# comment"]);
  assert.deepEqual(p.ok ? p.trace : null, [
    { pc: 64, taken: true },
    { pc: 64, taken: false },
  ]);
  assert.equal(parseBranches(["0x40 maybe"]).ok, false);
});
