import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDayPlan, type DayPlanInput } from "./day-plan";

const NEXT = [
  { title: "Binary", href: "/lessons/binary" },
  { title: "Logic gates", href: "/lessons/gates" },
  { title: "Half-adder", href: "/lessons/half-adder" },
];

function plan(patch: Partial<DayPlanInput>) {
  return buildDayPlan({
    goal: 20,
    dueNow: 8,
    reviewHref: "/practice/session?scope=due",
    reviewedToday: false,
    lessonsToday: [],
    nextLessons: NEXT,
    ...patch,
  });
}

const texts = (p: ReturnType<typeof plan>) => p.items.map((i) => `${i.done ? "x" : " "} ${i.text}`);

test("Regular: a review and one lesson", () => {
  const p = plan({});
  assert.deepEqual(texts(p), ["  Review your due cards (8)", "  One lesson: Binary"]);
  assert.equal(p.remaining, 2);
  assert.equal(p.done, false);
});

test("Casual is one lesson, no review; Serious adds a second lesson", () => {
  assert.deepEqual(texts(plan({ goal: 10 })), ["  One lesson: Binary"]);
  assert.deepEqual(texts(plan({ goal: 40 })), [
    "  Review your due cards (8)",
    "  One lesson: Binary",
    "  Another lesson: Logic gates",
  ]);
});

test("what happened today ticks the items, and the day is done", () => {
  const p = plan({ reviewedToday: true, dueNow: 27, lessonsToday: [{ title: "What is a bit?" }] });
  assert.deepEqual(texts(p), ["x Reviewed your cards", "x Finished What is a bit?"]);
  assert.equal(p.done, true);
});

test("nothing due: no review line", () => {
  assert.deepEqual(texts(plan({ dueNow: 0 })), ["  One lesson: Binary"]);
});

test("every lesson done and nothing due: an empty day is not 'done'", () => {
  const p = plan({ dueNow: 0, nextLessons: [] });
  assert.deepEqual(p.items, []);
  assert.equal(p.done, false);
});
