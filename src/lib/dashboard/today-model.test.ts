import assert from "node:assert/strict";
import { test } from "node:test";
import { buildAchievementsModel, type AchievementsInput } from "@/lib/achievements/achievements-model";
import type { ProfileLesson } from "@/lib/profile/profile-model";
import { buildToday, type TodayLesson } from "./today-model";

const BITS = "level-00-bits-logic";
const MACHINE = "level-01-machine-memory";
const NOW = new Date(2026, 9, 30, 12);
const at = (day: number) => new Date(2026, 9, day, 10).toISOString();

const LESSONS: TodayLesson[] = [
  [BITS, "what-is-a-bit", "What is a bit?"],
  [BITS, "binary", "Binary"],
  [BITS, "project-half-adder", "Project — Half-adder"],
  [MACHINE, "inside-the-cpu", "Inside the CPU"],
  [MACHINE, "memory", "Memory"],
].map(([level, slug, title]) => ({
  key: `${level}/${slug}`,
  level,
  title,
  href: `/lessons/${slug}`,
  timeMin: 6,
  blurb: "",
}));

function today(completions: { key: string; completedAt: string }[], signedIn = true) {
  const input: AchievementsInput = {
    lessons: LESSONS.map((l): ProfileLesson => ({
      key: l.key,
      level: l.level,
      slug: l.key.split("/")[1],
      title: l.title,
      href: l.href,
    })),
    completions,
    projectLinks: [],
    cards: [],
    history: [],
    now: NOW,
  };
  return buildToday({ lessons: LESSONS, completions, achievements: signedIn ? buildAchievementsModel(input) : null });
}

test("nothing done: start with the first lesson, no standing for a guest", () => {
  const t = today([], false);
  assert.equal(t.next.kind, "start");
  assert.equal(t.next.title, "What is a bit?");
  assert.deepEqual(t.next.topicStep, { index: 1, total: 3, done: 0 });
  assert.deepEqual(
    t.next.then.map((l) => l.title),
    ["Binary", "Project — Half-adder", "Inside the CPU"],
  );
  assert.equal(t.standing, null);
});

test("continue at the first open lesson, counting what's done in its topic", () => {
  const t = today([{ key: `${BITS}/what-is-a-bit`, completedAt: at(2) }]);
  assert.equal(t.next.kind, "continue");
  assert.equal(t.next.title, "Binary");
  assert.equal(t.next.topic, "Bits & Logic");
  assert.deepEqual(t.next.topicStep, { index: 2, total: 3, done: 1 });
  assert.deepEqual(t.lessons, { done: 1, total: 5 });
});

test("standing: the newest badge, the title to aim for, and the open project", () => {
  const t = today([{ key: `${BITS}/what-is-a-bit`, completedAt: at(2) }]);
  assert.equal(t.standing?.badge?.view.id, "first-bit");
  assert.equal(t.standing?.badge?.earned, true);
  assert.equal(t.standing?.title, null);
  assert.equal(t.standing?.nextTitle?.label, "Genin");
  assert.equal(t.standing?.project?.view.id, "gate-builder");
  assert.equal(t.standing?.shippedBoth, false);
});

test("every lesson done: the capstone is next", () => {
  const t = today(LESSONS.map((l, i) => ({ key: l.key, completedAt: at(i + 1) })));
  assert.equal(t.next.kind, "capstone");
  assert.equal(t.next.href, "/projects/shellforge");
});
