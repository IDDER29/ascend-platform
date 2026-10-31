import assert from "node:assert/strict";
import { test } from "node:test";
import { PATHS } from "./catalog";
import { COURSE_OUTLINES } from "./course-outlines";
import { FOUNDATIONS_MOVED, FOUNDATIONS_OUTLINE } from "./foundations-outline";

/** Every lesson and project in every outline, live or coming soon, with the text shown under its title. */
function allItems(): { where: string; title: string; description: string | undefined }[] {
  const foundations = FOUNDATIONS_OUTLINE.flatMap((s) =>
    s.items.flatMap((i) =>
      i.kind === "link" ? [] : [{ where: `foundations/${s.id}`, title: i.title, description: i.description }],
    ),
  );
  const topics = Object.entries(COURSE_OUTLINES).flatMap(([level, sections]) =>
    sections!.flatMap((s) => [
      ...s.items.map((i) => ({ where: `${level}/${s.id}`, title: i.slug, description: i.description })),
      ...(s.upcoming ?? []).map((u) => ({ where: `${level}/${s.id}`, title: u.title, description: u.description })),
    ]),
  );
  const planned = PATHS.flatMap((p) =>
    p.courses.flatMap((c) =>
      (c.outline ?? []).flatMap((s) =>
        s.items.map((i) => ({ where: `${p.slug}/${c.id}`, title: i.title, description: i.description })),
      ),
    ),
  );
  return [...foundations, ...topics, ...planned];
}

test("every outline item has a one-sentence description a learner can read without opening it", () => {
  for (const { where, title, description } of allItems()) {
    const label = `${where}: ${title}`;
    assert.ok(description, `${label} has no description`);
    assert.ok(description.length >= 50 && description.length <= 160, `${label}: ${description.length} characters`);
    assert.ok(/[.?!]$/.test(description), `${label} ends with a full stop`);
    assert.ok(!description.includes("—"), `${label} has an em dash`);
    assert.ok(!/\blevels?\b/i.test(description), `${label} says "level"`);
    assert.notEqual(description.toLowerCase(), title.toLowerCase(), `${label} repeats its title`);
  }
});

test("Foundations covers every lesson (F001–F106) and project of the blueprint exactly once", () => {
  const covers = FOUNDATIONS_OUTLINE.flatMap((s) => s.items.flatMap((i) => (i.kind === "link" ? [] : (i.covers ?? []))));
  const lessons = Array.from({ length: 106 }, (_, n) => `F${String(n + 1).padStart(3, "0")}`);
  const projects = [1, 2, 3, 4, 5, 6, 7, 8].flatMap((c) => [`P${c}-A`, `P${c}-B`, `P${c}-X`]).concat("P7-C");
  for (const id of [...lessons, ...projects]) {
    assert.equal(covers.filter((c) => c === id).length, 1, `${id} should have exactly one home`);
  }
  assert.equal(covers.length, lessons.length + projects.length, "no unknown ids");
  for (const s of FOUNDATIONS_OUTLINE) {
    for (const i of s.items) if (i.kind !== "link") assert.ok(i.covers?.length, `${i.title} names what it covers`);
  }
});

test("Foundations is eight courses that use every outline section once, in outline order", () => {
  const courses = PATHS.find((p) => p.slug === "foundations")!.courses;
  assert.equal(courses.length, 8);
  assert.deepEqual(
    courses.flatMap((c) => c.sections ?? []),
    FOUNDATIONS_OUTLINE.map((s) => s.id),
  );
});

test("a moved lesson is live in a different section from its old one", () => {
  for (const [slug, oldSection] of Object.entries(FOUNDATIONS_MOVED)) {
    const now = FOUNDATIONS_OUTLINE.find((s) => s.items.some((i) => i.kind === "live" && i.slug === slug));
    assert.ok(now, `${slug} is live`);
    assert.notEqual(now.id, oldSection, `${slug} moved`);
    assert.ok(!FOUNDATIONS_OUTLINE.some((s) => s.id === oldSection && s.items.some((i) => i.kind === "live" && i.slug === slug)));
  }
});
