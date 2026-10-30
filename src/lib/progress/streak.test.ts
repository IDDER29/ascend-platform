import assert from "node:assert/strict";
import { test } from "node:test";
import { lessonStreak, lessonWeek } from "@/lib/progress/streak";

// Friday, October 30 2026, mid-afternoon.
const NOW = new Date(2026, 9, 30, 15);
const day = (d: number) => new Date(2026, 9, d, 10).toISOString();

test("the streak counts days with a finished lesson, back from today or yesterday", () => {
  assert.equal(lessonStreak([], NOW), 0);
  assert.equal(lessonStreak([day(28), day(29)], NOW), 2); // today not done yet: still 2
  assert.equal(lessonStreak([day(28), day(29), day(30)], NOW), 3);
  assert.equal(lessonStreak([day(27)], NOW), 0); // a missed day ends it
  assert.equal(lessonStreak([day(29), day(29)], NOW), 1); // two lessons, one day
});

test("the week runs Monday to Sunday and marks the days with a lesson", () => {
  const week = lessonWeek([day(26), day(28), day(30), day(25)], NOW);
  assert.deepEqual(
    week.map((d) => `${d.letter}${d.learned ? "●" : "○"}${d.today ? "!" : ""}${d.future ? "…" : ""}`),
    ["M●", "T○", "W●", "T○", "F●!", "S○…", "S○…"],
  );
  assert.equal(week[0].label, "Monday, October 26");
});
