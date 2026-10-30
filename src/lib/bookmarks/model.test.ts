import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { buildBookmarksView, cardTarget, textHash, type Bookmark } from "./model";

const BITS = "level-00-bits-logic";
const MACHINE = "level-01-machine-memory";

function bm(patch: Partial<Bookmark> & Pick<Bookmark, "ref" | "kind">): Bookmark {
  return {
    title: patch.ref,
    where: "",
    href: "/lessons/x",
    topic: BITS,
    lessonKey: `${BITS}/what-is-a-bit`,
    reason: "reference",
    note: "",
    savedAt: "2026-10-20T10:00:00Z",
    ...patch,
  };
}

const ALL: Bookmark[] = [
  bm({
    ref: "section:a",
    kind: "section",
    reason: "revisit",
    note: "still confused about base 10",
    savedAt: "2026-10-25T10:00:00Z",
  }),
  bm({
    ref: "lesson:b",
    kind: "lesson",
    reason: "later",
    topic: MACHINE,
    lessonKey: `${MACHINE}/inside-the-cpu`,
    savedAt: "2026-10-24T10:00:00Z",
  }),
  bm({ ref: "snippet:c", kind: "snippet", title: "half_adder.c", savedAt: "2026-10-23T10:00:00Z" }),
  bm({ ref: "resource:d", kind: "resource", title: "Crash Course", topic: null, lessonKey: null, reason: "later" }),
  bm({ ref: "card:e", kind: "card", topic: BITS, questionId: "q-1" }),
];

const NONE = { query: "", reason: null, kind: null };

test("revisit items come first and the shelf never repeats them", () => {
  const v = buildBookmarksView(ALL, NONE);
  assert.deepEqual(
    v.revisit.map((b) => b.ref),
    ["section:a"],
  );
  const shelf = v.groups.flatMap((g) => g.items.map((b) => b.ref));
  assert.ok(!shelf.includes("section:a"));
  assert.deepEqual(
    v.groups.map((g) => g.title),
    ["Bits & Logic", "Machine & Memory", "Outside resources"],
  );
  assert.deepEqual(v.counts.reason, { later: 2, reference: 2, revisit: 1 });
});

test("search looks in titles, where-from and notes; filters narrow by reason and kind", () => {
  assert.deepEqual(
    buildBookmarksView(ALL, { ...NONE, query: "base 10" }).revisit.map((b) => b.ref),
    ["section:a"],
  );
  const later = buildBookmarksView(ALL, { ...NONE, reason: "later" });
  assert.deepEqual(later.revisit, []);
  assert.deepEqual(
    later.groups.flatMap((g) => g.items.map((b) => b.ref)),
    ["lesson:b", "resource:d"],
  );
  const snippets = buildBookmarksView(ALL, { ...NONE, kind: "snippet" });
  assert.deepEqual(
    snippets.groups.flatMap((g) => g.items.map((b) => b.ref)),
    ["snippet:c"],
  );
});

test("later lessons and sections are offered to pick up again", () => {
  assert.deepEqual(
    buildBookmarksView(ALL, NONE).later.map((b) => b.ref),
    ["lesson:b"],
  );
});

test("Practice covers saved cards and the cards of saved lessons", () => {
  const v = buildBookmarksView(ALL, NONE);
  assert.ok(v.practiceIds.includes("q-1"));
  const bitCard = PRACTICE_BANK.find((q) => q.lessonLevel === BITS && q.lessonSlug === "what-is-a-bit")!;
  assert.ok(v.practiceIds.includes(bitCard.id));
  assert.equal(new Set(v.practiceIds).size, v.practiceIds.length);
});

test("text hashes are stable and short", () => {
  assert.equal(textHash("int main"), textHash("int main"));
  assert.notEqual(textHash("a"), textHash("b"));
});

test("a card saves its question and opens as a one-card review", () => {
  const q = PRACTICE_BANK.find((x) => x.kind === "cloze")!;
  const t = cardTarget(q);
  assert.equal(t.ref, `card:${q.id}`);
  assert.equal(t.questionId, q.id);
  assert.ok(!t.title.includes("{{blank}}"));
  assert.ok(t.href?.includes(`cards=${q.id}`));
});
