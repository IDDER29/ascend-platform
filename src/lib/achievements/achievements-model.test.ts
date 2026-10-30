import assert from "node:assert/strict";
import { test } from "node:test";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import type { PracticeCard } from "@/lib/practice/sm2";
import { curriculumProject } from "@/lib/profile/projects";
import type { ProfileLesson } from "@/lib/profile/profile-model";
import { buildAchievementsModel, type AchievementsInput } from "./achievements-model";
import { ACHIEVEMENTS } from "./catalog";

const NOW = new Date(2026, 9, 30, 12, 0);
const BITS = "level-00-bits-logic";
const MACHINE = "level-01-machine-memory";
const SYSTEMS = "level-03-systems-software";

const LESSONS: ProfileLesson[] = [
  [BITS, "what-is-a-bit"],
  [BITS, "project-half-adder"],
  [MACHINE, "inside-the-cpu"],
  [SYSTEMS, "signals"],
].map(([level, slug]) => ({ key: `${level}/${slug}`, level, slug, title: slug, href: `/lessons/${slug}` }));

function daysAgo(n: number, hour = 10): string {
  return new Date(2026, 9, 30 - n, hour).toISOString();
}

function done(...slugs: string[]) {
  return slugs.map((slug, i) => ({ key: LESSONS.find((l) => l.slug === slug)!.key, completedAt: daysAgo(20 - i) }));
}

function solid(i: number): PracticeCard {
  return { questionId: `q${i}`, state: "review", reps: 3, ease: 2.5, intervalDays: 8, dueAt: daysAgo(-5), lapses: 0, updatedAt: daysAgo(30 - i / 10) };
}

function session(at: string, correct = 4, total = 5): PracticeSessionRecord {
  return { id: at, at, scopeType: "due", scopeLabel: "Due", pathSlug: null, correct, total, missIds: [], questionIds: [] };
}

function model(patch: Partial<AchievementsInput> = {}) {
  return buildAchievementsModel({ lessons: LESSONS, completions: [], projectLinks: [], cards: [], history: [], now: NOW, ...patch });
}

const badge = (m: ReturnType<typeof model>, id: string) => m.parts.find((p) => p.id === id)!;

test("every badge has at least one rule; combinations only point at real badges; projects exist", () => {
  const ids = new Set(ACHIEVEMENTS.map((a) => a.id));
  assert.equal(ids.size, ACHIEVEMENTS.length);
  for (const a of ACHIEVEMENTS) {
    assert.ok(a.rules.length > 0, a.id);
    for (const rule of a.rules) {
      if (rule.kind === "badges") for (const id of rule.ids) assert.ok(ids.has(id) && id !== a.id, `${a.id} → ${id}`);
      if (rule.kind === "project") assert.ok(curriculumProject(rule.projectId), rule.projectId);
    }
  }
});

test("new learner: nothing earned, every rule shown as an open criterion, First Bit starts them off", () => {
  const m = model();
  assert.equal(m.earnedCount, 0);
  assert.equal(m.total, ACHIEVEMENTS.length);
  assert.ok(m.parts.every((p) => p.criteria.length > 0 && p.criteria.every((c) => !c.done)));
  assert.match(m.headline, /^No badges yet\./);
  assert.equal(badge(m, "first-bit").action?.label, "Start your first lesson");
});

test("lesson-count and topic badges are dated by the lesson that met them", () => {
  const m = model({ completions: done("what-is-a-bit", "project-half-adder") });
  assert.equal(badge(m, "first-bit").earnedAt, daysAgo(20));
  assert.equal(badge(m, "gatekeeper").earned, true);
  assert.equal(badge(m, "gatekeeper").earnedAt, daysAgo(19));
  assert.deepEqual(badge(m, "machinist").criteria[0].progress, { done: 0, total: 1 });
  assert.deepEqual(badge(m, "ten-down").criteria[0].progress, { done: 2, total: 10 });
});

test("a project badge is two criteria: the lessons, then the repo link", () => {
  const ready = model({ completions: done("what-is-a-bit", "project-half-adder") });
  const gate = badge(ready, "gate-builder");
  assert.deepEqual(gate.criteria.map((c) => c.done), [true, false]);
  assert.equal(gate.action?.href, "/profile");

  const shipped = model({
    completions: done("what-is-a-bit", "project-half-adder"),
    projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(3) }],
  });
  assert.equal(badge(shipped, "gate-builder").earned, true);
  assert.equal(badge(shipped, "gate-builder").earnedAt, daysAgo(3));
  assert.equal(badge(shipped, "gate-builder").repoUrl, "https://github.com/a/h");
});

test("card counts, a clean run, a week in a row and a comeback each have their own rule", () => {
  const cards = Array.from({ length: 30 }, (_, i) => solid(i));
  const m = model({
    cards,
    history: [
      session(daysAgo(40)),
      ...[9, 8, 7, 6, 5, 4, 3].map((d) => session(daysAgo(d))),
      session(daysAgo(2), 12, 12),
    ],
  });
  assert.equal(badge(m, "steady-hands").earned, true);
  assert.deepEqual(badge(m, "deep-memory").criteria[0].progress, { done: 30, total: 100 });
  assert.equal(badge(m, "clean-run").earned, true);
  assert.equal(badge(m, "week-of-practice").earned, true);
  assert.equal(badge(m, "comeback").earned, true);
  assert.deepEqual(badge(m, "regular").criteria[0].progress, { done: 9, total: 25 });
});

test("a clean run needs at least 10 cards", () => {
  assert.equal(badge(model({ history: [session(daysAgo(1), 8, 8)] }), "clean-run").earned, false);
});

test("combination badges list their parts and are earned when the last part is", () => {
  const all = done(...LESSONS.map((l) => l.slug));
  const links = [
    { projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(4) },
    { projectId: "shellforge", repoUrl: "https://github.com/a/s", addedAt: daysAgo(2) },
  ];
  const m = model({ completions: all, projectLinks: links });
  const builder = badge(m, "builder");
  assert.deepEqual(builder.criteria.map((c) => c.badgeId), ["gate-builder", "ship-it"]);
  assert.equal(builder.earned, true);
  assert.equal(builder.earnedAt, daysAgo(2));
  assert.equal(badge(m, "whole-machine").earned, true);

  const half = model({ completions: all, projectLinks: links.slice(0, 1) });
  assert.deepEqual(badge(half, "builder").criteria.map((c) => c.done), [true, false]);
  // A combination's next step is the next step of the first badge it still needs.
  assert.deepEqual(badge(half, "builder").action, badge(half, "ship-it").action);
  assert.equal(badge(half, "builder").action?.href, "/profile");
  assert.equal(badge(half, "whole-machine").earned, false);
});

test("a learner away two weeks is offered Comeback first", () => {
  const m = model({ history: [session(daysAgo(30))] });
  assert.equal(m.closest[0].id, "comeback");
});
