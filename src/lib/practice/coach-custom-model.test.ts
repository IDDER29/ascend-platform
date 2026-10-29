import assert from "node:assert/strict";
import { test } from "node:test";
import type { BankRow, BankStrength } from "./coach-bank-model";
import {
  buildCustomLessons,
  deckSessionHref,
  defaultDeckName,
  quickPickKeys,
  savedDeckItems,
  summarizeDeck,
} from "./coach-custom-model";
import { DECK_FORMATS, type DeckFormat } from "./deck-recipe";
import { PRACTICE_ROUTES } from "./routes";

const A = "level-00-bits-logic/what-is-a-bit";
const B = "level-00-bits-logic/binary-and-number-bases";
const C = "level-00-bits-logic/boolean-logic-and-truth-tables";
const D = "level-01-machine-memory/inside-the-cpu";

function row(
  id: string,
  lessonKey: string,
  format: DeckFormat,
  strength: BankStrength,
  due: { today?: boolean; sort?: number } = {},
): BankRow {
  return {
    id,
    text: id,
    format,
    formatLabel: format,
    lessonKey,
    lessonTitle: lessonKey,
    strength,
    dueLabel: "",
    dueToday: due.today ?? false,
    dueSort: strength === "new" ? Number.POSITIVE_INFINITY : (due.sort ?? 1000),
    correct: 0,
    seen: 0,
  };
}

const ROWS: BankRow[] = [
  row("a1", A, "mcq", "learning", { today: true, sort: 100 }),
  row("a2", A, "flashcard", "solid", { sort: 5000 }),
  row("a3", A, "typed", "mastered", { sort: 9000 }),
  row("b1", B, "mcq", "new"),
  row("b2", B, "cloze", "new"),
  row("c1", C, "flashcard", "learning", { today: true, sort: 50 }),
  row("c2", C, "mcq", "learning", { sort: 3000 }),
  row("d1", D, "mcq", "solid", { today: true, sort: 200 }),
];

const ALL_FORMATS = [...DECK_FORMATS];

test("buildCustomLessons groups lessons by path and section in curriculum order", () => {
  const paths = buildCustomLessons(ROWS);
  assert.deepEqual(
    paths.map((p) => [p.pathSlug, p.cardCount, p.sections.map((s) => [s.id, s.lessons.map((l) => l.key)])]),
    [
      ["foundations", 7, [["bits", [A, B]], ["logic", [C]]]],
      ["systems-programmer", 1, [["cpu-instructions", [D]]]],
    ],
  );
  assert.deepEqual(paths[0]!.lessonKeys, [A, B, C]);

  const [a, b] = paths[0]!.sections[0]!.lessons;
  assert.deepEqual(
    { title: a!.title, total: a!.total, due: a!.due, weak: a!.weak, seen: a!.seen, tag: a!.tag },
    { title: "What is a bit?", total: 3, due: 1, weak: 1, seen: 3, tag: "needs-work" },
  );
  assert.deepEqual(a!.strength, { new: 0, learning: 1, solid: 1, mastered: 1 });
  assert.equal(b!.tag, "not-started");
  assert.equal(b!.seen, 0);
  assert.equal(paths[1]!.sections[0]!.lessons[0]!.tag, null);
});

test("quickPickKeys selects lessons by tag or due cards", () => {
  const paths = buildCustomLessons(ROWS);
  assert.deepEqual(quickPickKeys(paths, "needs-work"), [A, C]);
  assert.deepEqual(quickPickKeys(paths, "due"), [A, C, D]);
  assert.deepEqual(quickPickKeys(paths, "not-started"), [B]);
});

test("summarizeDeck counts and prioritizes the picked lessons", () => {
  const summary = summarizeDeck(ROWS, { lessonKeys: [A, C], filter: "all", formats: ALL_FORMATS });
  assert.equal(summary.total, 5);
  assert.deepEqual(summary.counts, { all: 5, weak: 3, due: 2 });
  assert.deepEqual(summary.formats, [
    { value: "mcq", label: "Choices", count: 2 },
    { value: "flashcard", label: "Flashcards", count: 2 },
    { value: "typed", label: "Short answer", count: 1 },
  ]);
  assert.deepEqual(summary.pickedIds, ["c1", "a1", "c2", "a2", "a3"]);
  assert.deepEqual(summary.lessonTitles, ["What is a bit?", "Boolean logic & truth tables"]);
});

test("summarizeDeck applies which-cards and format filters", () => {
  const summary = summarizeDeck(ROWS, { lessonKeys: [A, C], filter: "weak", formats: ["mcq"] });
  assert.deepEqual(summary.counts, { all: 2, weak: 2, due: 1 });
  assert.deepEqual(
    summary.formats.map((f) => [f.value, f.count]),
    [["mcq", 2], ["flashcard", 1]],
  );
  assert.equal(summary.total, 2);
  assert.deepEqual(summary.pickedIds, ["a1", "c2"]);
});

test("summarizeDeck caps at 20 and ignores unknown lessons", () => {
  const many = Array.from({ length: 25 }, (_, i) => row(`n${i}`, A, "mcq", "new"));
  const summary = summarizeDeck(many, { lessonKeys: [A, "nope/x"], filter: "all", formats: ALL_FORMATS });
  assert.equal(summary.total, 25);
  assert.equal(summary.pickedIds.length, 20);
  assert.deepEqual(summary.lessonTitles, ["What is a bit?"]);
  assert.equal(summarizeDeck(ROWS, { lessonKeys: [], filter: "all", formats: ALL_FORMATS }).total, 0);
});

test("savedDeckItems summarizes each deck with a start link", () => {
  const items = savedDeckItems(ROWS, [
    { id: "d1", name: "Logic", lessonKeys: [C], filter: "all", formats: ALL_FORMATS, updatedAt: "" },
    { id: "d2", name: "Gone", lessonKeys: ["nope/x"], filter: "all", formats: ALL_FORMATS, updatedAt: "" },
  ]);
  assert.equal(items[0]!.summary.total, 2);
  assert.equal(items[0]!.href, `${PRACTICE_ROUTES.session}?scope=all&cards=c1,c2&label=Logic`);
  assert.equal(items[1]!.summary.total, 0);
  assert.equal(items[1]!.href, null);
});

test("defaultDeckName and deckSessionHref", () => {
  assert.equal(defaultDeckName([]), "Custom deck");
  assert.equal(defaultDeckName(["What is a bit?"]), "What is a bit?");
  assert.equal(
    defaultDeckName(["What is a bit?", "Binary & number bases"]),
    "What is a bit? + Binary & number bases",
  );
  assert.equal(defaultDeckName(["What is a bit?", "Binary", "Logic"]), "What is a bit? + 2 more");
  const long = defaultDeckName(["x".repeat(50)]);
  assert.equal(long.length, 40);
  assert.ok(long.endsWith("…"));
  assert.equal(
    deckSessionHref(["a", "b"], "Logic & gates"),
    `${PRACTICE_ROUTES.session}?scope=all&cards=a,b&label=Logic%20%26%20gates`,
  );
});
