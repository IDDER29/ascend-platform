import assert from "node:assert/strict";
import { test } from "node:test";
import { createNewCard, gradeCard, localDayKey } from "./sm2";
import {
  NEW_PER_DAY,
  applyGrades,
  cardsStorageKey,
  dueCount,
  dueQueueIds,
  ensureUnlockedCards,
  gradeFromMcqCorrect,
  mergeMissesAsLearning,
  migrateMissQueueOnce,
  newDayStorageKey,
  nextReviewAt,
  readCards,
  readNewDayMeta,
  writeCards,
  writeNewDayMeta,
} from "./cards";
import { missQueueKey } from "./miss-queue";

function installLocalStorage(t: { after(fn: () => void): void }) {
  const values = new Map<string, string>();
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const localStorage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage },
  });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  });
  return localStorage;
}

test("dueCount respects new-per-day remaining", () => {
  const now = new Date("2026-09-25T15:00:00");
  const cards = Array.from({ length: 25 }, (_, i) =>
    createNewCard(`q-${i}`, now),
  );
  const meta = { date: "2026-09-25", count: 0 };
  assert.equal(dueCount(cards, meta, now), NEW_PER_DAY);
  const ids = dueQueueIds(cards, meta, now, 8);
  assert.equal(ids.length, 8);
});

test("stale new-day metadata from prior day does not block new cards", () => {
  const now = new Date("2026-09-25T15:00:00");
  const cards = Array.from({ length: 25 }, (_, i) =>
    createNewCard(`q-${i}`, now),
  );
  const staleMeta = { date: "2026-09-24", count: NEW_PER_DAY };
  assert.equal(dueCount(cards, staleMeta, now), NEW_PER_DAY);
  assert.equal(dueQueueIds(cards, staleMeta, now, 8).length, 8);
});

test("reviews due are unlimited ahead of new drip", () => {
  const now = new Date("2026-09-25T15:00:00");
  const review = gradeCard(createNewCard("r1", now), "good", now);
  review.dueAt = now.toISOString();
  review.state = "review";
  const news = Array.from({ length: 5 }, (_, i) => createNewCard(`n-${i}`, now));
  const meta = { date: "2026-09-25", count: 0 };
  const ids = dueQueueIds([review, ...news], meta, now, 8);
  assert.equal(ids[0], "r1");
});

test("mergeMissesAsLearning resets existing misses and creates missing cards", () => {
  const now = new Date("2026-09-25T15:00:00.000Z");
  const existing = gradeCard(createNewCard("existing", now), "good", now);
  const cards = mergeMissesAsLearning(
    [existing],
    ["existing", "missing"],
    now,
  );

  assert.deepEqual(
    cards.map((card) => card.questionId),
    ["existing", "missing"],
  );
  for (const card of cards) {
    assert.equal(card.state, "learning");
    assert.equal(card.dueAt, now.toISOString());
  }
  assert.equal(cards[0].ease, existing.ease - 0.2);
  assert.equal(cards[0].reps, 0);
});

test("storage helpers persist cards, metadata, unlocked cards, grades, and misses", (t) => {
  const storage = installLocalStorage(t);
  const now = new Date("2026-09-25T15:00:00.000Z");

  assert.equal(cardsStorageKey(null), "ascend_practice_cards_v1:guest");
  assert.equal(newDayStorageKey("u1"), "ascend_practice_new_day_v1:u1");
  assert.deepEqual(readCards("u1"), []);
  assert.deepEqual(readNewDayMeta("u1"), {
    date: localDayKey(),
    count: 0,
  });

  const initial = createNewCard("q1", now);
  writeCards("u1", [initial]);
  writeNewDayMeta("u1", { date: "2026-09-25", count: 2 });
  assert.deepEqual(readCards("u1"), [initial]);
  assert.deepEqual(readNewDayMeta("u1"), {
    date: "2026-09-25",
    count: 2,
  });

  const unlocked = ensureUnlockedCards("u1", ["q1", "q2"], now);
  assert.deepEqual(
    unlocked.map((card) => card.questionId),
    ["q1", "q2"],
  );
  const graded = applyGrades(
    "u1",
    [
      { questionId: "q1", grade: "good" },
      { questionId: "q2", grade: "again" },
    ],
    now,
  );
  assert.deepEqual(
    graded.map((card) => card.state),
    ["review", "learning"],
  );
  assert.equal(readNewDayMeta("u1").count, 4);

  storage.setItem(missQueueKey("u1"), JSON.stringify(["q1", "q3"]));
  const migrated = migrateMissQueueOnce("u1", now);
  assert.deepEqual(
    migrated.map((card) => card.questionId),
    ["q1", "q2", "q3"],
  );
  assert.equal(storage.getItem(missQueueKey("u1")), null);
});

test("gradeFromMcqCorrect maps binary MCQ results to Again or Good", () => {
  assert.equal(gradeFromMcqCorrect(false), "again");
  assert.equal(gradeFromMcqCorrect(true), "good");
});

test("applyGrades passes Hard and Easy through to card scheduling", (t) => {
  installLocalStorage(t);
  const now = new Date("2026-09-25T15:00:00.000Z");
  writeCards("u1", [
    createNewCard("hard-card", now),
    createNewCard("easy-card", now),
  ]);

  const graded = applyGrades(
    "u1",
    [
      { questionId: "hard-card", grade: "hard" },
      { questionId: "easy-card", grade: "easy" },
    ],
    now,
  );

  assert.equal(graded[0].state, "learning");
  assert.equal(graded[0].dueAt, now.toISOString());
  assert.equal(graded[1].state, "review");
  assert.equal(graded[1].intervalDays, 4);
});

test("nextReviewAt returns the earliest future due date", () => {
  const now = new Date("2026-09-25T15:00:00.000Z");
  const past = createNewCard("past", now);
  const later = createNewCard("later", now);
  later.dueAt = "2026-09-27T15:00:00.000Z";
  const sooner = createNewCard("sooner", now);
  sooner.dueAt = "2026-09-26T15:00:00.000Z";

  assert.equal(
    nextReviewAt([past, later, sooner], now),
    "2026-09-26T15:00:00.000Z",
  );
  assert.equal(nextReviewAt([past], now), null);
});
