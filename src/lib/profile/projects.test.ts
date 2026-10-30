import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { BADGES } from "@/lib/achievements-data";
import { CURRICULUM_PROJECTS } from "./projects";

const CURRICULUM = join(process.cwd(), "content/curriculum");

test("every project-* lesson is a curriculum project, and every project lesson exists", () => {
  const projectLessons = readdirSync(CURRICULUM).flatMap((level) =>
    readdirSync(join(CURRICULUM, level))
      .filter((f) => f.startsWith("project-") && f.endsWith(".mdx"))
      .map((f) => `${level}/${f.replace(/\.mdx$/, "")}`),
  );
  const listed = CURRICULUM_PROJECTS.flatMap((p) =>
    p.requires.kind === "lesson" ? [`${p.requires.level}/${p.requires.slug}`] : [],
  );
  assert.deepEqual([...listed].sort(), [...projectLessons].sort());
});

test("project ids are unique and every badge exists", () => {
  const ids = CURRICULUM_PROJECTS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const p of CURRICULUM_PROJECTS) assert.ok(BADGES.some((b) => b.id === p.badgeId), p.badgeId);
});
