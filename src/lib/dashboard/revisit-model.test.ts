import assert from "node:assert/strict";
import { test } from "node:test";
import type { Bookmark } from "@/lib/bookmarks/model";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import { buildRevisit } from "./revisit-model";

const BITS = "level-00-bits-logic";
const NOW = new Date(2026, 9, 30, 12);
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

const idsOf = (slug: string) =>
  PRACTICE_BANK.filter((q) => q.lessonLevel === BITS && q.lessonSlug === slug).map((q) => q.id);
const BIT = idsOf("what-is-a-bit");
const BINARY = idsOf("binary-and-number-bases");

const LESSONS = [
  { key: `${BITS}/what-is-a-bit`, title: "What is a bit?", href: "/lessons/bit" },
  { key: `${BITS}/binary-and-number-bases`, title: "Binary & number bases", href: "/lessons/binary" },
];

function session(at: string, questionIds: string[], missIds: string[]): PracticeSessionRecord {
  return {
    id: at,
    at,
    scopeType: "due",
    scopeLabel: "Due",
    pathSlug: null,
    correct: questionIds.length - missIds.length,
    total: questionIds.length,
    missIds,
    questionIds,
  };
}

function flag(patch: Partial<Bookmark>): Bookmark {
  return {
    ref: "section:x",
    kind: "section",
    title: "Counting in binary",
    where: "Binary & number bases",
    href: "/lessons/binary#counting",
    topic: BITS,
    lessonKey: `${BITS}/binary-and-number-bases`,
    reason: "revisit",
    note: "read it again",
    savedAt: daysAgo(1),
    ...patch,
  };
}

test("flags first, then lessons Practice shows you missing lately", () => {
  const { items, total } = buildRevisit({
    flagged: [flag({}), flag({ ref: "lesson:later", reason: "later" })],
    history: [session(daysAgo(2), BIT.slice(0, 4), BIT.slice(0, 3))],
    lessons: LESSONS,
    now: NOW,
  });
  assert.equal(total, 2);
  assert.deepEqual(
    items.map((i) => [i.source, i.title, i.context]),
    [
      ["flag", "Counting in binary", "Section in Binary & number bases"],
      ["practice", "What is a bit?", "1 of 4 right in Practice lately"],
    ],
  );
  const practice = items[1];
  assert.ok(practice.source === "practice" && practice.practiceHref.includes("cards="));
});

test("old answers, few answers, and lessons going fine aren't listed", () => {
  const { items } = buildRevisit({
    flagged: [],
    history: [
      session(daysAgo(45), BIT.slice(0, 4), BIT.slice(0, 4)), // too long ago
      session(daysAgo(3), BINARY.slice(0, 2), BINARY.slice(0, 2)), // only 2 answers
      session(daysAgo(3), BIT.slice(0, 4), []), // going fine
    ],
    lessons: LESSONS,
    now: NOW,
  });
  assert.deepEqual(items, []);
});

test("a lesson flagged as a whole isn't listed again from Practice", () => {
  const { items } = buildRevisit({
    flagged: [flag({ ref: "lesson:bit", kind: "lesson", title: "What is a bit?", lessonKey: `${BITS}/what-is-a-bit` })],
    history: [session(daysAgo(2), BIT.slice(0, 4), BIT.slice(0, 3))],
    lessons: LESSONS,
    now: NOW,
  });
  assert.deepEqual(
    items.map((i) => [i.source, i.context]),
    [["flag", "Lesson"]],
  );
});
