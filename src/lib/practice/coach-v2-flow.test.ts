import assert from "node:assert/strict";
import { test } from "node:test";
import {
  findCoachV2SessionRecord,
  labelCoachV2Scope,
  parseCoachV2CardIds,
  parseCoachV2Scope,
  parseCoachV2Size,
  sessionProgress,
} from "./coach-v2-flow";
import type { PracticeSessionRecord } from "./history";

test("parseCoachV2CardIds reads a deduped, capped comma list", () => {
  assert.deepEqual(parseCoachV2CardIds({}), []);
  assert.deepEqual(parseCoachV2CardIds({ cards: "" }), []);
  assert.deepEqual(parseCoachV2CardIds({ cards: " a-1, b_2 ,a-1,," }), ["a-1", "b_2"]);
  assert.deepEqual(parseCoachV2CardIds({ cards: "ok,<script>,x y" }), ["ok"]);
  const many = Array.from({ length: 30 }, (_, i) => `c${i}`).join(",");
  assert.equal(parseCoachV2CardIds({ cards: many }).length, 20);
  assert.deepEqual(parseCoachV2CardIds(new URLSearchParams("cards=p,q")), ["p", "q"]);
});

test("sessionProgress marks results, skips, current and upcoming cards", () => {
  const ids = ["a", "b", "c", "d", "e"];
  const answered = [
    { questionId: "a", grade: "good" as const },
    { questionId: "c", grade: "again" as const },
  ];
  assert.deepEqual(sessionProgress(ids, answered, 3), {
    segments: ["correct", "skipped", "missed", "current", "upcoming"],
    done: 3,
    total: 5,
  });
});

test("sessionProgress shows the current card's result during feedback", () => {
  const progress = sessionProgress(
    ["a", "b"],
    [{ questionId: "a", grade: "hard" }],
    0,
  );
  assert.deepEqual(progress.segments, ["missed", "upcoming"]);
  assert.equal(progress.done, 1);
});

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
