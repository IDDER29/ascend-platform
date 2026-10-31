import assert from "node:assert/strict";
import { test } from "node:test";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import type { PracticeCard } from "@/lib/practice/sm2";
import { curriculumProject } from "@/lib/profile/projects";
import type { ProfileLesson } from "@/lib/profile/profile-model";
import { buildAchievementsModel, type AchievementsInput } from "./achievements-model";
import { ACHIEVEMENTS, INSIGNIA, TITLES } from "./catalog";

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
  // Every project lesson exists here, so every project can be shipped.
  const entry = (level: string, slug: string) => ({ key: `${level}/${slug}`, level, slug, title: "", href: "" });
  const extra = [
    ...["project-codebook", "project-machine-atlas", "project-number-workbench", "project-byte-lab", "project-gate-workbench", "project-alu", "project-register-lab", "project-memory-board", "project-build-datapath", "project-tiny-cpu", "project-build-the-cpu", "project-assembly-puzzles", "project-assembler", "project-memory-visualizer", "project-translator", "project-real-c", "project-os-boundary", "project-trace-a-program"].map((slug) => entry(BITS, slug)),
    entry("level-04-c-basics", "project-guessing-game"),
    entry("level-05-c-contract", "project-ub-hunt"),
    entry("level-07-data-structures", "project-hash-map"),
    entry("level-08-vm-threads-files", "project-thread-pool"),
  ];
  const lessons = [...LESSONS, ...extra];
  const all = [...done(...LESSONS.map((l) => l.slug)), ...extra.map((l) => ({ key: l.key, completedAt: daysAgo(5) }))];
  const model = (patch: Partial<AchievementsInput>) =>
    buildAchievementsModel({ lessons, completions: [], projectLinks: [], cards: [], history: [], now: NOW, ...patch });
  const links = [
    { projectId: "codebook", repoUrl: "https://github.com/a/c", addedAt: daysAgo(4) },
    { projectId: "machine-atlas", repoUrl: "https://github.com/a/m", addedAt: daysAgo(4) },
    { projectId: "number-workbench", repoUrl: "https://github.com/a/n", addedAt: daysAgo(4) },
    { projectId: "byte-lab", repoUrl: "https://github.com/a/b", addedAt: daysAgo(4) },
    { projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(4) },
    { projectId: "gate-workbench", repoUrl: "https://github.com/a/g", addedAt: daysAgo(4) },
    { projectId: "alu", repoUrl: "https://github.com/a/u", addedAt: daysAgo(4) },
    { projectId: "register-lab", repoUrl: "https://github.com/a/r", addedAt: daysAgo(4) },
    { projectId: "memory-board", repoUrl: "https://github.com/a/mb", addedAt: daysAgo(4) },
    { projectId: "build-datapath", repoUrl: "https://github.com/a/bd", addedAt: daysAgo(4) },
    { projectId: "build-the-cpu", repoUrl: "https://github.com/a/bc", addedAt: daysAgo(4) },
    { projectId: "assembly-puzzles", repoUrl: "https://github.com/a/ap", addedAt: daysAgo(4) },
    { projectId: "assembler", repoUrl: "https://github.com/a/as", addedAt: daysAgo(4) },
    { projectId: "memory-visualizer", repoUrl: "https://github.com/a/mv", addedAt: daysAgo(4) },
    { projectId: "translator", repoUrl: "https://github.com/a/tr", addedAt: daysAgo(4) },
    { projectId: "real-c", repoUrl: "https://github.com/a/rc", addedAt: daysAgo(4) },
    { projectId: "os-boundary", repoUrl: "https://github.com/a/ob", addedAt: daysAgo(4) },
    { projectId: "trace-a-program", repoUrl: "https://github.com/a/tp", addedAt: daysAgo(4) },
    { projectId: "guessing-game", repoUrl: "https://github.com/a/gg", addedAt: daysAgo(4) },
    { projectId: "ub-hunt", repoUrl: "https://github.com/a/ub", addedAt: daysAgo(4) },
    { projectId: "hash-map", repoUrl: "https://github.com/a/hm", addedAt: daysAgo(4) },
    { projectId: "thread-pool", repoUrl: "https://github.com/a/tp2", addedAt: daysAgo(4) },
    { projectId: "tiny-cpu", repoUrl: "https://github.com/a/t", addedAt: daysAgo(3) },
    { projectId: "shellforge", repoUrl: "https://github.com/a/s", addedAt: daysAgo(2) },
  ];
  const m = model({ completions: all, projectLinks: links });
  const builder = badge(m, "builder");
  assert.deepEqual(builder.criteria.map((c) => c.badgeId), ["code-maker", "cartographer", "converter", "byte-detective", "gate-builder", "nand-maker", "alu-architect", "clockmaker", "memory-keeper", "bus-driver", "cpu-tracer", "microcoder", "puzzle-solver", "assembler", "memory-watcher", "translator", "compiler-reader", "boundary-walker", "system-tracer", "game-maker", "ub-hunter", "map-maker", "pool-keeper", "ship-it"]);
  assert.equal(builder.earned, true);
  assert.equal(builder.earnedAt, daysAgo(2));
  assert.equal(badge(m, "whole-machine").earned, true);

  const half = model({ completions: all, projectLinks: links.slice(0, 1) });
  assert.deepEqual(badge(half, "builder").criteria.map((c) => c.done), [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
  // A combination's next step is the next step of the first badge it still needs.
  assert.deepEqual(badge(half, "builder").action, badge(half, "cartographer").action);
  assert.equal(badge(half, "builder").action?.href, "/profile");
  assert.equal(badge(half, "whole-machine").earned, false);
});

test("a learner away two weeks is offered Comeback first", () => {
  const m = model({ history: [session(daysAgo(30))] });
  assert.equal(m.closest[0].id, "comeback");
});

test("decorations carry no rank; insignia and title rules point at real badges", () => {
  const ids = new Set([...ACHIEVEMENTS, ...INSIGNIA, ...TITLES].map((a) => a.id));
  for (const a of ACHIEVEMENTS) assert.equal("rank" in a, false, a.id);
  for (const a of [...INSIGNIA, ...TITLES]) {
    for (const rule of a.rules) {
      if (rule.kind === "badges" || rule.kind === "anyOf") for (const id of rule.ids) assert.ok(ids.has(id), `${a.id} → ${id}`);
    }
  }
  // Topic ribbons and clan crests are separate: both exist, with the same topic rule.
  assert.ok(ACHIEVEMENTS.some((a) => a.id === "gatekeeper" && !a.insignia));
  assert.ok(INSIGNIA.some((a) => a.id === "gate-clan" && a.insignia?.kind === "crest"));
});

test("the headband is earned by the first topic finished, whichever it is", () => {
  const none = model();
  assert.equal(none.insignia.find((b) => b.id === "headband")!.earned, false);
  assert.equal(none.title, null);
  assert.equal(none.nextTitle?.label, "Genin");

  // Machine & Memory has one lesson in this curriculum; finishing it graduates.
  const m = model({ completions: done("inside-the-cpu") });
  const headband = m.insignia.find((b) => b.id === "headband")!;
  assert.equal(headband.earned, true);
  assert.equal(headband.earnedAt, daysAgo(20));
  assert.equal(m.title?.label, "Genin");
  // Finishing the topic earns both its ribbon and its clan crest.
  assert.equal(badge(m, "machinist").earned, true);
  assert.equal(m.insignia.find((b) => b.id === "core-clan")!.earned, true);
});

test("tasks are ranked: lessons and sessions D, a strong 10+ card session C, a topic B, projects A and S", () => {
  const m = model({
    completions: done("what-is-a-bit", "project-half-adder"),
    projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(3) }],
    history: [session(daysAgo(5), 4, 5), session(daysAgo(4), 9, 10), session(daysAgo(3), 7, 10)],
  });
  // D: 2 lessons + 2 sessions (a 4/5 session is short; 7/10 is under 80%). C: the 9/10 session.
  assert.deepEqual(m.missionRecord, { S: 0, A: 1, B: 1, C: 1, D: 4 });
});

test("titles climb by completing ranked tasks", () => {
  const lessons = done("what-is-a-bit", "project-half-adder");
  const history = [
    ...Array.from({ length: 13 }, (_, i) => session(daysAgo(30 - i), 3, 5)),
    ...Array.from({ length: 5 }, (_, i) => session(daysAgo(10 - i), 10, 10)),
  ];
  const m = model({ completions: lessons, history });
  // 2 lessons + 13 short sessions = 15 D; 5 strong sessions = 5 C; the headband makes them Genin first.
  assert.equal(m.title?.label, "Chūnin");
  const jonin = m.titles.find((t) => t.id === "title-jonin")!;
  assert.deepEqual(
    jonin.criteria.map((c) => [c.text, c.progress?.done ?? null]),
    [
      ["Become Chūnin", null],
      ["Complete 40 D-rank tasks", 15],
      ["Complete 15 C-rank tasks", 5],
      ["Complete 2 B-rank tasks", 1],
      ["Complete 1 A-rank task", 0],
    ],
  );
});

test("a title is never skipped: each one needs the title before it", () => {
  for (const [i, t] of TITLES.entries()) {
    if (i === 0) continue;
    const ids = t.rules.flatMap((r) => (r.kind === "badges" ? r.ids : []));
    assert.ok(ids.includes(TITLES[i - 1].id), t.id);
  }
});

test("the mission log lists every task with its rank and a readable label, newest first", () => {
  const m = model({
    completions: done("what-is-a-bit", "project-half-adder"),
    projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(3) }],
    history: [session(daysAgo(2), 9, 10)],
  });
  assert.deepEqual(
    m.missions.map((t) => [t.rank, t.label]),
    [
      ["C", "Review session, 9 of 10 right"],
      ["A", "Shipped the half adder"],
      ["B", "Finished every lesson in Bits & Logic"],
      ["D", "Finished project-half-adder"],
      ["D", "Finished what-is-a-bit"],
    ],
  );
  assert.equal(m.missions.length, Object.values(m.missionRecord).reduce((a, b) => a + b, 0));
});

test("every badge lists the missions behind it, newest first", () => {
  const history = [8, 7, 6, 5, 4, 3, 2].map((d) => session(daysAgo(d), d === 2 ? 12 : 4, d === 2 ? 12 : 5));
  const m = model({
    completions: done("what-is-a-bit", "project-half-adder"),
    projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(3) }],
    history,
  });
  const labels = (id: string) => badge(m, id).missions.map((x) => x.label);
  assert.deepEqual(labels("first-bit"), ["Finished what-is-a-bit"]);
  assert.deepEqual(labels("gatekeeper"), [
    "Finished every lesson in Bits & Logic",
    "Finished project-half-adder",
    "Finished what-is-a-bit",
  ]);
  assert.deepEqual(labels("gate-builder"), ["Shipped the half adder", "Finished project-half-adder"]);
  assert.deepEqual(labels("clean-run"), ["Review session, 12 of 12 right"]);
  assert.equal(badge(m, "week-of-practice").missions.length, 7);
  assert.equal(badge(m, "week-of-practice").missions[0].label, "Review session, 12 of 12 right");
  // Card counts aren't missions: nothing to list.
  assert.deepEqual(badge(m, "steady-hands").missions, []);
  // A title lists the ranked missions that count toward it.
  const genin = m.titles[0];
  assert.deepEqual(genin.missions.map((x) => x.rank), ["B", "D", "D"]);
});
