import assert from "node:assert/strict";
import { test } from "node:test";
import GithubSlugger from "github-slugger";
import { getAllLessons } from "./lessons";

test("every Check-yourself link points at a real heading in its lesson", () => {
  for (const lesson of getAllLessons()) {
    const slugger = new GithubSlugger();
    const ids = new Set([...lesson.body.matchAll(/^##\s+(.+)$/gm)].map((m) => slugger.slug(m[1].trim())));
    for (const k of lesson.meta.knowledgeCheck) {
      assert.ok(ids.has(k.jumpToId), `${lesson.meta.slug}: no heading for #${k.jumpToId}`);
    }
  }
});

test("lesson orders are unique within each topic", () => {
  const seen = new Map<string, string>();
  for (const lesson of getAllLessons()) {
    const key = `${lesson.meta.level}#${lesson.meta.order}`;
    assert.ok(!seen.has(key), `${lesson.meta.slug} and ${seen.get(key)} share order ${lesson.meta.order}`);
    seen.set(key, lesson.meta.slug);
  }
});
