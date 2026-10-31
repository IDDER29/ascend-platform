import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanSession } from "./session-rules";

const NOW = Date.parse("2026-11-01T12:00:00Z");
const KNOWN = new Set(["a", "b"]);
const ok = { id: "s-1", scopeType: "due", scopeLabel: "Due cards", pathSlug: "foundations", correct: 1, total: 2, missIds: ["b"], questionIds: ["a", "b"] };

test("a valid session passes, with unknown card ids dropped", () => {
  const s = cleanSession({ ...ok, questionIds: ["a", "b", "retired"] }, KNOWN, NOW);
  assert.deepEqual(s?.questionIds, ["a", "b"]);
  assert.equal(s?.createdAt.getTime(), NOW);
});

test("impossible scores, scopes and ids are refused", () => {
  assert.equal(cleanSession({ ...ok, correct: 3 }, KNOWN, NOW), null);
  assert.equal(cleanSession({ ...ok, correct: -1 }, KNOWN, NOW), null);
  assert.equal(cleanSession({ ...ok, total: 1.5 }, KNOWN, NOW), null);
  assert.equal(cleanSession({ ...ok, total: 100000, correct: 0 }, KNOWN, NOW), null);
  assert.equal(cleanSession({ ...ok, scopeType: "everything" }, KNOWN, NOW), null);
  assert.equal(cleanSession({ ...ok, id: "x".repeat(65) }, KNOWN, NOW), null);
  assert.equal(cleanSession(null, KNOWN, NOW), null);
});

test("dates: older history is fine, the future and the distant past are not", () => {
  assert.equal(cleanSession({ ...ok, at: "2026-10-20T08:00:00Z" }, KNOWN, NOW)?.createdAt.toISOString(), "2026-10-20T08:00:00.000Z");
  assert.equal(cleanSession({ ...ok, at: "2027-01-01T00:00:00Z" }, KNOWN, NOW), null);
  assert.equal(cleanSession({ ...ok, at: "2020-01-01T00:00:00Z" }, KNOWN, NOW), null);
  assert.equal(cleanSession({ ...ok, at: "not a date" }, KNOWN, NOW), null);
});

test("labels are capped and a bad path slug is dropped", () => {
  const s = cleanSession({ ...ok, scopeLabel: "x".repeat(500), pathSlug: "../etc" }, KNOWN, NOW);
  assert.equal(s?.scopeLabel.length, 120);
  assert.equal(s?.pathSlug, null);
});
