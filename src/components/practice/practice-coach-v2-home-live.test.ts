import assert from "node:assert/strict";
import { test } from "node:test";
import { selectCoachHomeAction } from "./practice-coach-v2-home-live";

test("due cards are the primary Coach home action", () => {
  assert.deepEqual(selectCoachHomeAction(3, 12), {
    href: "/practicev2/session?scope=due",
    label: "Start 3 due",
    mode: "due",
  });
});

test("caught-up learners with unlocked cards enter free study", () => {
  assert.deepEqual(selectCoachHomeAction(0, 12), {
    href: "/practicev2/session?scope=all",
    label: "Free study",
    mode: "all",
  });
});

test("learners without unlocked cards continue learning instead of starting an empty session", () => {
  assert.deepEqual(selectCoachHomeAction(0, 0), {
    href: "/curriculum",
    label: "Continue learning",
    mode: "continue",
  });
});
