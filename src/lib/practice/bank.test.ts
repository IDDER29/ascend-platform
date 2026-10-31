import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { PRACTICE_BANK } from "./bank";
import { completionKey } from "./session";

const CURRICULUM = path.join(process.cwd(), "content", "curriculum");
const MIN_CARDS_PER_LESSON = 5;

function lessonKeysOnDisk(): string[] {
  return readdirSync(CURRICULUM).flatMap((level) =>
    readdirSync(path.join(CURRICULUM, level))
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => completionKey(level, file.replace(/\.mdx$/, ""))),
  );
}

test("card ids are unique", () => {
  const ids = PRACTICE_BANK.map((q) => q.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(dupes, []);
});

test("every card points at a real lesson", () => {
  for (const q of PRACTICE_BANK) {
    const file = path.join(CURRICULUM, q.lessonLevel, `${q.lessonSlug}.mdx`);
    assert.ok(existsSync(file), `${q.id} → missing ${q.lessonLevel}/${q.lessonSlug}`);
  }
});

test(`every lesson has at least ${MIN_CARDS_PER_LESSON} cards`, () => {
  const counts = new Map<string, number>();
  for (const q of PRACTICE_BANK) {
    const key = completionKey(q.lessonLevel, q.lessonSlug);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const key of lessonKeysOnDisk()) {
    assert.ok((counts.get(key) ?? 0) >= MIN_CARDS_PER_LESSON, `${key} has ${counts.get(key) ?? 0}`);
  }
});

test("cards are well formed for their kind", () => {
  for (const q of PRACTICE_BANK) {
    assert.ok(q.reviewLabel.trim(), `${q.id} reviewLabel`);
    assert.ok(q.conceptId.trim(), `${q.id} conceptId`);
    if (q.kind === "mcq") {
      assert.ok(q.options.length >= 2, `${q.id} options`);
      assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length, `${q.id} correct`);
    }
    if (q.kind === "typed" || q.kind === "cloze") {
      assert.ok(q.answers.some((a) => a.trim()), `${q.id} answers`);
    }
    if (q.kind === "cloze") {
      assert.ok(!(q.template && q.templateCode), `${q.id} uses both template forms`);
      const text = q.template ?? q.templateCode?.join("\n") ?? "";
      assert.equal(text.split("{{blank}}").length - 1, 1, `${q.id} needs exactly one {{blank}}`);
    }
  }
});
