import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPathViews, durationLabel, type PathInput, type PathsV2Input } from "./paths-v2-model";

const BITS = "level-00-bits-logic";
const MACHINE = "level-01-machine-memory";
const lesson = (level: string, slug: string, timeMin = 6) => ({
  key: `${level}/${slug}`,
  title: slug,
  href: `/lessons/${slug}`,
  timeMin,
  project: slug.startsWith("project-"),
});
const LESSONS = [
  lesson(BITS, "bit"),
  lesson(BITS, "project-half-adder", 25),
  lesson(MACHINE, "cpu", 8),
  lesson(MACHINE, "memory", 7),
];

const PATHS: PathInput[] = [
  {
    slug: "foundations",
    title: "Foundations",
    pitch: "Where it begins.",
    body: "",
    status: "live",
    href: "/pathsv2/foundations",
    requires: null,
    courses: [
      {
        id: "f",
        title: "Bits & Logic",
        body: "",
        levelId: BITS,
        sections: [{ id: "s", title: "Bits", blurb: "", lessonKeys: [`${BITS}/bit`, `${BITS}/project-half-adder`] }],
      },
    ],
  },
  {
    slug: "systems",
    title: "Systems Programmer",
    pitch: "The machine end to end.",
    body: "",
    status: "live",
    href: "/pathsv2/systems",
    requires: { slug: "foundations", title: "Foundations" },
    courses: [
      {
        id: "m",
        title: "Machine & Memory",
        body: "",
        levelId: MACHINE,
        sections: [
          { id: "cpu", title: "CPU", blurb: "", lessonKeys: [`${MACHINE}/cpu`] },
          { id: "mem", title: "Memory", blurb: "", lessonKeys: [`${MACHINE}/memory`] },
        ],
      },
      { id: "sf", title: "ShellForge", body: "", href: "/projects/shellforge", sections: [] },
    ],
  },
  {
    slug: "linux",
    title: "Linux Engineer",
    pitch: "Run real systems.",
    body: "",
    status: "soon",
    href: "/pathsv2/linux",
    requires: null,
    courses: [{ id: "l", title: "Linux fundamentals", body: "", plannedLessons: 6, sections: [] }],
  },
];

const at = (d: number) => new Date(2026, 9, d, 10).toISOString();

function views(patch: Partial<PathsV2Input> = {}) {
  return buildPathViews({
    paths: PATHS,
    lessons: LESSONS,
    completions: [],
    following: {},
    shipped: new Set(),
    ...patch,
  });
}

test("sizes: lessons, projects, minutes; soon paths show planned courses", () => {
  const [f, s, l] = views();
  assert.deepEqual([f.lessons.total, f.projects, f.minutes], [2, 1, 31]);
  assert.deepEqual([s.lessons.total, s.projects, s.minutes], [2, 1, 15]);
  assert.equal(l.soon, true);
  assert.deepEqual(l.courses[0].planned, { lessons: 6, projects: 0 });
  assert.equal(l.joined, false);
});

test("progress: done marks, the current topic and lesson, the next step", () => {
  const s = views({ completions: [{ key: `${MACHINE}/cpu`, completedAt: at(3) }] })[1];
  assert.deepEqual(s.lessons, { done: 1, total: 2 });
  const course = s.courses[0];
  assert.equal(course.current, true);
  assert.deepEqual(
    course.sections.map((x) => [x.title, x.done, x.items.map((i) => [i.done, i.current])]),
    [
      ["CPU", 1, [[true, false]]],
      ["Memory", 0, [[false, true]]],
    ],
  );
  assert.deepEqual(s.next, { title: "memory", href: "/lessons/memory" });
  assert.equal(s.courses[1].capstone, "not-started");
  assert.deepEqual(s.requires, { slug: "foundations", title: "Foundations", done: false });
});

test("capstone ready after the lessons, shipped when its project is; the path is finished then", () => {
  const done = ["cpu", "memory"].map((x) => ({ key: `${MACHINE}/${x}`, completedAt: at(4) }));
  assert.equal(views({ completions: done })[1].courses[1].capstone, "ready");
  assert.deepEqual(views({ completions: done })[1].next, { title: "ShellForge", href: "/projects/shellforge" });
  const shipped = views({ completions: done, shipped: new Set(["/projects/shellforge"]) })[1];
  assert.equal(shipped.finished, true);
  assert.equal(shipped.next, null);
});

test("active: the joined path you worked on last; soon paths can't be joined", () => {
  const v = views({
    following: { foundations: at(1), systems: at(2), linux: at(3) },
    completions: [{ key: `${BITS}/bit`, completedAt: at(9) }],
  });
  assert.deepEqual(
    v.map((x) => [x.slug, x.joined, x.active]),
    [
      ["foundations", true, true],
      ["systems", true, false],
      ["linux", false, false],
    ],
  );
});

test("durations read naturally", () => {
  assert.equal(durationLabel(31), "about 30 min");
  assert.equal(durationLabel(150), "about 2.5 h");
  assert.equal(durationLabel(185), "about 3 h");
});

test("a course with only an outline is a topic of 'Coming soon' items, never the current one", () => {
  const outlined: PathInput = {
    ...PATHS[1],
    stage: 2,
    milestone: "Understand the OS",
    courses: [
      {
        id: "c-basics",
        title: "C Basics",
        body: "",
        plannedLessons: 1,
        plannedProjects: 1,
        milestone: "Write C",
        sections: [
          {
            id: "first",
            title: "First programs",
            blurb: "",
            lessonKeys: [],
            upcoming: [
              { id: "hello", title: "Hello", project: false },
              { id: "project-game", title: "Project: A game", project: true },
            ],
          },
        ],
      },
      PATHS[1].courses[0],
    ],
  };
  const s = buildPathViews({ paths: [outlined], lessons: LESSONS, completions: [], following: {}, shipped: new Set() })[0];
  const [planned, machine] = s.courses;
  assert.equal(planned.kind, "topic");
  assert.equal(planned.total, 0);
  assert.equal(planned.current, false);
  assert.equal(planned.finished, false);
  assert.equal(planned.milestone, "Write C");
  assert.deepEqual(
    planned.sections[0].upcoming.map((u) => u.project),
    [false, true],
  );
  // The first course with lessons is where you are.
  assert.equal(machine.current, true);
  assert.deepEqual([s.stage, s.milestone, s.lessons.total], [2, "Understand the OS", 2]);
});
