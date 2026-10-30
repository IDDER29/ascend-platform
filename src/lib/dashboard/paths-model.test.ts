import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPathCards, type PathsInput } from "./paths-model";
import type { TodayLesson } from "./today-model";

const BITS = "level-00-bits-logic";
const MACHINE = "level-01-machine-memory";
const C = "level-02-the-c-language";

const LESSONS: TodayLesson[] = [
  [BITS, "bit"],
  [BITS, "gates"],
  [MACHINE, "cpu"],
  [MACHINE, "memory"],
  [C, "pointers"],
].map(([level, slug]) => ({
  key: `${level}/${slug}`,
  level,
  title: slug,
  href: `/lessons/${slug}`,
  timeMin: 5,
  blurb: "",
}));

const PATHS: PathsInput["paths"] = [
  {
    slug: "foundations",
    title: "Foundations",
    href: "/paths/foundations",
    courses: [{ id: "f", title: "Bits & Logic", levelId: BITS }],
  },
  {
    slug: "systems",
    title: "Systems Programmer",
    href: "/paths/systems",
    courses: [
      { id: "m", title: "Machine & Memory", levelId: MACHINE },
      { id: "c", title: "The C Language", levelId: C },
      { id: "sf", title: "ShellForge", href: "/projects/shellforge" },
    ],
  },
];

const at = (d: number) => new Date(2026, 9, d, 10).toISOString();

function cards(patch: Partial<PathsInput>) {
  return buildPathCards({
    paths: PATHS,
    following: { foundations: at(1), systems: at(2) },
    lessons: LESSONS,
    completions: [],
    shipped: new Set(),
    ...patch,
  });
}

test("only joined paths, newest joined first before any lesson", () => {
  assert.deepEqual(
    cards({}).map((c) => c.slug),
    ["systems", "foundations"],
  );
  assert.deepEqual(
    cards({ following: { foundations: at(1) } }).map((c) => c.slug),
    ["foundations"],
  );
});

test("groups: lessons per topic, the current topic, and the capstone's state", () => {
  const [sys] = cards({ completions: [{ key: `${MACHINE}/cpu`, completedAt: at(5) }] });
  assert.deepEqual([sys.done, sys.total], [1, 3]);
  assert.deepEqual(
    sys.groups.map((g) => [g.title, g.lessons.map(Number).join(""), g.current, g.capstone]),
    [
      ["Machine & Memory", "10", true, null],
      ["The C Language", "0", false, null],
      ["ShellForge", "", false, "not-started"],
    ],
  );
  assert.deepEqual(sys.next, { title: "memory", href: "/lessons/memory" });
  assert.deepEqual(sys.sections, { done: 0, total: 3 });
  assert.equal(sys.active, true);
  assert.equal(sys.groups[0].href, "/lessons/memory");
});

test("the path worked on last leads; a finished path goes after the rest", () => {
  const order = cards({
    completions: [
      { key: `${MACHINE}/cpu`, completedAt: at(5) },
      { key: `${BITS}/bit`, completedAt: at(8) },
    ],
  }).map((c) => c.slug);
  assert.deepEqual(order, ["foundations", "systems"]);

  const done = cards({
    completions: [
      { key: `${BITS}/bit`, completedAt: at(8) },
      { key: `${BITS}/gates`, completedAt: at(9) },
    ],
  });
  assert.deepEqual(
    done.map((c) => [c.slug, c.finished]),
    [
      ["systems", false],
      ["foundations", true],
    ],
  );
  assert.equal(done[1].groups[0].crest, "gate");
  assert.deepEqual(done[1].sections, { done: 1, total: 1 });
  assert.deepEqual(
    done.map((c) => c.active),
    [true, false],
  );
});

test("capstone: ready once every topic is done, shipped when its project is", () => {
  const all = ["cpu", "memory"].map((s) => ({ key: `${MACHINE}/${s}`, completedAt: at(5) }));
  all.push({ key: `${C}/pointers`, completedAt: at(6) });
  const [ready] = cards({ completions: all, following: { systems: at(2) } });
  assert.equal(ready.groups[2].capstone, "ready");
  assert.deepEqual(ready.next, { title: "ShellForge", href: "/projects/shellforge" });
  const [shipped] = cards({
    completions: all,
    following: { systems: at(2) },
    shipped: new Set(["/projects/shellforge"]),
  });
  assert.equal(shipped.finished, true);
  assert.equal(shipped.next, null);
});
