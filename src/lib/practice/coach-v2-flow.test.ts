import assert from "node:assert/strict";
import { test } from "node:test";
import {
  findCoachV2SessionRecord,
  labelCoachV2Scope,
  parseCoachV2Scope,
  parseCoachV2Size,
} from "./coach-v2-flow";
import type { PracticeSessionRecord } from "./history";

test("parseCoachV2Size defaults to 8 and clamps to 1–20", () => {
  assert.equal(parseCoachV2Size({}), 8);
  assert.equal(parseCoachV2Size({ size: "5" }), 5);
  assert.equal(parseCoachV2Size({ size: "0" }), 1);
  assert.equal(parseCoachV2Size({ size: "99" }), 20);
  assert.equal(parseCoachV2Size({ size: "abc" }), 8);
  assert.equal(parseCoachV2Size(new URLSearchParams("size=3")), 3);
});

test("parseCoachV2Scope defaults to due", () => {
  assert.deepEqual(parseCoachV2Scope({}), { type: "due" });
});

test("parseCoachV2Scope reads scope=all", () => {
  assert.deepEqual(parseCoachV2Scope({ scope: "all" }), { type: "all" });
});

test("parseCoachV2Scope reads path + pathSlug", () => {
  assert.deepEqual(parseCoachV2Scope({ scope: "path", path: "foundations" }), {
    type: "path",
    pathSlug: "foundations",
  });
});

test("parseCoachV2Scope invalid scope falls back to due", () => {
  assert.deepEqual(parseCoachV2Scope({ scope: "nope" }), { type: "due" });
});

test("labelCoachV2Scope due label", () => {
  const labeled = labelCoachV2Scope({ type: "due" });
  assert.equal(labeled.scope.type, "due");
  assert.ok(labeled.scopeLabel.length > 0);
  assert.equal(labeled.pathSlug, null);
});

test("findCoachV2SessionRecord by id", () => {
  const row: PracticeSessionRecord = {
    id: "s1",
    at: "2026-09-25T12:00:00.000Z",
    scopeType: "due",
    scopeLabel: "Due",
    pathSlug: null,
    correct: 6,
    total: 8,
    missIds: ["a", "b"],
    questionIds: ["a", "b", "c", "d", "e", "f", "g", "h"],
  };
  assert.equal(findCoachV2SessionRecord([row], "s1")?.id, "s1");
  assert.equal(findCoachV2SessionRecord([row], "missing"), null);
  assert.equal(findCoachV2SessionRecord([row], null)?.id, "s1"); // latest fallback
});
