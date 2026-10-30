import assert from "node:assert/strict";
import { test } from "node:test";
import type { CoachHomeModel } from "@/lib/practice/coach-home-model";
import { practiceCardView } from "./practice-card-model";

const WEEK = ["Today", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"].map((label, i) => ({
  label,
  title: label,
  count: i,
  isToday: i === 0,
}));

function model(hero: Partial<CoachHomeModel["hero"]>, missesDue = 0): CoachHomeModel {
  return {
    hero: {
      dueNow: 35,
      sessionSize: 8,
      action: { href: "/practice/session?scope=due", label: "Start review", mode: "due" },
      lastScore: { correct: 2, total: 3 },
      nextReviewLabel: null,
      ...hero,
    },
    modes: { missesDue, unlockedCount: 40 },
    week: WEEK,
  } as unknown as CoachHomeModel;
}

test("due: the review's size and time, what's waiting, and the last score", () => {
  const v = practiceCardView(model({}, 3), false);
  assert.equal(v.headline, "Review ready");
  assert.equal(v.size, "8 cards · about 4 min");
  assert.equal(v.detail, "35 due in all, 3 of them ones you missed.");
  assert.deepEqual(v.primary, { label: "Start review", href: "/practice/session?scope=due" });
  assert.equal(v.last, "Last review: 2 of 3 right");
  assert.equal(v.week?.length, 7);
});

test("a small review says nothing about what's waiting; after one today it's 'another'", () => {
  const v = practiceCardView(model({ dueNow: 3, sessionSize: 3 }), true);
  assert.equal(v.headline, "Another review ready");
  assert.equal(v.size, "3 cards · about 2 min");
  assert.equal(v.detail, null);
});

test("caught up: when the next card is due, and free study", () => {
  const v = practiceCardView(
    model({
      dueNow: 0,
      sessionSize: 0,
      nextReviewLabel: "Nov 2, 9:00 AM",
      action: { href: "/practice/session?scope=all", label: "Free study", mode: "all" },
    }),
    true,
  );
  assert.equal(v.state, "caught-up");
  assert.equal(v.detail, "Next card comes due Nov 2, 9:00 AM.");
  assert.equal(v.primary?.label, "Free study");
});

test("no cards yet: no button and no week", () => {
  const v = practiceCardView(
    model({
      dueNow: 0,
      sessionSize: 0,
      lastScore: null,
      action: { href: "/curriculum", label: "x", mode: "continue" },
    }),
    false,
  );
  assert.equal(v.state, "locked");
  assert.equal(v.primary, null);
  assert.equal(v.week, null);
});
