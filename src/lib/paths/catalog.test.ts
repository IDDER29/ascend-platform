import assert from "node:assert/strict";
import { test } from "node:test";
import { PATHS } from "./catalog";
import { COURSE_OUTLINES } from "./course-outlines";

const slugs = new Set(PATHS.map((p) => p.slug));

test("path slugs are unique, and every requiresSlug and branchOf names a real path", () => {
  assert.equal(slugs.size, PATHS.length);
  for (const p of PATHS) {
    if (p.requiresSlug) assert.ok(slugs.has(p.requiresSlug), `${p.slug} requires ${p.requiresSlug}`);
    if (p.branchOf) assert.ok(slugs.has(p.branchOf), `${p.slug} branches off ${p.branchOf}`);
  }
});

test("the main track has one path per stage, 1 to 3, each with a milestone, and side paths branch off it", () => {
  const stages = PATHS.filter((p) => p.stage).sort((a, b) => a.stage! - b.stage!);
  assert.deepEqual(
    stages.map((p) => p.stage),
    [1, 2, 3],
  );
  assert.deepEqual(
    stages.map((p) => p.slug),
    ["foundations", "systems-programmer", "computer-architect"],
  );
  for (const p of stages) assert.ok(p.milestone, `${p.slug} has a milestone`);
  for (const p of PATHS.filter((x) => x.branchOf)) {
    assert.ok(!p.stage, `${p.slug} is a side path, not a stage`);
    assert.ok(PATHS.find((x) => x.slug === p.branchOf)?.stage, `${p.slug} branches off a stage`);
  }
});

test("course ids, outline section ids and outline item ids are unique within their path and course", () => {
  for (const p of PATHS) {
    const ids = p.courses.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length, `${p.slug} course ids`);
    for (const c of p.courses) {
      if (!c.outline) continue;
      assert.ok(!c.levelId, `${c.id}: a course with lessons keeps its outline in course-outlines.ts`);
      const sections = c.outline.map((s) => s.id);
      assert.equal(new Set(sections).size, sections.length, `${c.id} section ids`);
      const items = c.outline.flatMap((s) => s.items.map((i) => i.id));
      assert.equal(new Set(items).size, items.length, `${c.id} item ids`);
      for (const s of c.outline) assert.ok(s.items.length > 0, `${c.id}/${s.id} is empty`);
    }
  }
});

test("planned items in live topics don't clash with the topic's lesson slugs or each other", () => {
  for (const [level, sections] of Object.entries(COURSE_OUTLINES)) {
    const ids = sections!.flatMap((s) => [...s.items.map((i) => i.slug), ...(s.upcoming ?? []).map((u) => u.id)]);
    assert.equal(new Set(ids).size, ids.length, level);
    const sectionIds = sections!.map((s) => s.id);
    assert.equal(new Set(sectionIds).size, sectionIds.length, `${level} section ids`);
  }
});

test("titles follow the writing rules: no em dash, never 'level'", () => {
  const titles = PATHS.flatMap((p) => [
    p.title,
    p.pitch ?? "",
    p.body,
    p.milestone ?? "",
    ...p.courses.flatMap((c) => [
      c.title,
      c.body,
      c.milestone ?? "",
      ...(c.outline ?? []).flatMap((s) => [s.title, s.blurb ?? "", ...s.items.map((i) => i.title)]),
    ]),
  ]);
  const upcoming = Object.values(COURSE_OUTLINES).flatMap((sections) =>
    sections!.flatMap((s) => [s.title, s.blurb ?? "", ...(s.upcoming ?? []).map((u) => u.title)]),
  );
  for (const t of [...titles, ...upcoming]) {
    assert.ok(!t.includes("—"), `em dash in "${t}"`);
    assert.ok(!/\blevels?\b/i.test(t), `"level" in "${t}"`);
  }
});

test("planned projects are titled as projects", () => {
  for (const p of PATHS) {
    for (const c of p.courses) {
      for (const i of (c.outline ?? []).flatMap((s) => s.items)) {
        assert.equal(Boolean(i.project), /^(Project|Capstone): /.test(i.title), `${c.id}/${i.id}`);
      }
    }
  }
});
