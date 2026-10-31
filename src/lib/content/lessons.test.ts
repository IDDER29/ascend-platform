import assert from "node:assert/strict";
import { test } from "node:test";
import GithubSlugger from "github-slugger";
import { COURSE_OUTLINES } from "@/lib/paths/course-outlines";
import { FOUNDATIONS_LEVEL, FOUNDATIONS_OUTLINE } from "@/lib/paths/foundations-outline";
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

test("no lesson calls a topic by its internal number", () => {
  for (const lesson of getAllLessons()) {
    const text = JSON.stringify(lesson.meta) + lesson.body;
    assert.doesNotMatch(text, /\bLevel 0\d\b/, `${lesson.meta.slug} says "Level NN"; use the topic's name`);
  }
});

test("a topic's lessons are ordered as its outline lists them, so Next follows the path", () => {
  const outlines: Record<string, string[]> = {
    [FOUNDATIONS_LEVEL]: FOUNDATIONS_OUTLINE.flatMap((s) => s.items.flatMap((i) => (i.kind === "live" ? [i.slug] : []))),
  };
  for (const [level, sections] of Object.entries(COURSE_OUTLINES)) {
    outlines[level] = sections!.flatMap((s) => s.items.map((i) => i.slug));
  }
  for (const [level, slugs] of Object.entries(outlines)) {
    const ordered = getAllLessons()
      .filter((l) => l.meta.level === level)
      .sort((a, b) => a.meta.order - b.meta.order)
      .map((l) => l.meta.slug);
    assert.deepEqual(ordered, slugs, `${level}: lesson orders don't follow the outline`);
  }
});
