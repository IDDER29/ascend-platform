import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeDeckInput, parseStoredList } from "./deck-recipe";

const KNOWN = new Set(["level-00/a", "level-00/b"]);
const VALID = {
  name: "  Logic   drills ",
  lessonKeys: ["level-00/a", "nope/x", "level-00/a", "level-00/b"],
  filter: "weak",
  formats: ["mcq", "bogus", "mcq", "cloze"],
};

test("normalizeDeckInput cleans a valid deck", () => {
  assert.deepEqual(normalizeDeckInput(VALID, KNOWN), {
    ok: true,
    deck: {
      name: "Logic drills",
      lessonKeys: ["level-00/a", "level-00/b"],
      filter: "weak",
      formats: ["mcq", "cloze"],
    },
  });
});

test("normalizeDeckInput rejects bad names", () => {
  assert.equal(normalizeDeckInput({ ...VALID, name: "   " }, KNOWN).ok, false);
  assert.equal(normalizeDeckInput({ ...VALID, name: "x".repeat(41) }, KNOWN).ok, false);
  assert.equal(normalizeDeckInput({ ...VALID, name: 7 }, KNOWN).ok, false);
  assert.equal(normalizeDeckInput({ ...VALID, name: "x".repeat(40) }, KNOWN).ok, true);
});

test("normalizeDeckInput rejects empty lessons, bad filter, empty formats", () => {
  assert.equal(normalizeDeckInput({ ...VALID, lessonKeys: ["nope/x"] }, KNOWN).ok, false);
  assert.equal(normalizeDeckInput({ ...VALID, lessonKeys: "level-00/a" }, KNOWN).ok, false);
  assert.equal(normalizeDeckInput({ ...VALID, filter: "hard" }, KNOWN).ok, false);
  assert.equal(normalizeDeckInput({ ...VALID, formats: ["bogus"] }, KNOWN).ok, false);
  assert.equal(normalizeDeckInput(null, KNOWN).ok, false);
  assert.equal(normalizeDeckInput("deck", KNOWN).ok, false);
});

test("parseStoredList reads JSON string arrays leniently", () => {
  assert.deepEqual(parseStoredList('["a",1,"b"]'), ["a", "b"]);
  assert.deepEqual(parseStoredList("{}"), []);
  assert.deepEqual(parseStoredList("not json"), []);
});
