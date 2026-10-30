import assert from "node:assert/strict";
import { test } from "node:test";
import { streakDays } from "./coach-home-model";
import type { PracticeSessionRecord } from "./history";

const NOW = new Date(2026, 9, 30, 15);
const day = (d: number) => new Date(2026, 9, d, 10).toISOString();
const session = (d: number): PracticeSessionRecord => ({
  id: `s${d}`,
  at: day(d),
  scopeType: "due",
  scopeLabel: "Due",
  pathSlug: null,
  correct: 1,
  total: 1,
  missIds: [],
  questionIds: ["q"],
});

test("one streak: a review or a finished lesson keeps the day", () => {
  // Reviews on the 27th and 29th, a lesson on the 28th.
  assert.equal(streakDays([session(27), session(29)], NOW), 1);
  assert.equal(streakDays([session(27), session(29)], NOW, [day(28)]), 3);
});

test("today counts once something is done; before that the streak runs to yesterday", () => {
  assert.equal(streakDays([session(29)], NOW, [day(30)]), 2);
  assert.equal(streakDays([], NOW, [day(28), day(29)]), 2);
  assert.equal(streakDays([], NOW, [day(27)]), 0);
});
