import assert from "node:assert/strict";
import { test } from "node:test";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as sqliteSchema from "@/lib/db/schema.sqlite";
import { SQLITE_DDL } from "@/lib/db/sqlite-ddl";
import { pickCard } from "./card-merge";
import { createNewCard, type CardState, type PracticeCard } from "./sm2";
import { applyCards, applySessions, readSyncState, writeResetMarker, type Store } from "./store";

const NOW = Date.parse("2026-11-20T12:00:00.000Z");
const day = (d: number) => new Date(Date.UTC(2026, 10, d, 12)).toISOString();
const IDS = Array.from({ length: 30 }, (_, i) => `q${i}`);
const KNOWN = new Set(IDS);

function makeStore(): Store {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(SQLITE_DDL);
  const db = drizzle(sqlite, { schema: sqliteSchema });
  db.insert(sqliteSchema.users).values({ id: "u1", email: "a@b.test", passwordHash: "x", createdAt: new Date(NOW) }).run();
  return { db, schema: sqliteSchema } as unknown as Store;
}

const card = (id: string, over: Partial<PracticeCard> = {}): PracticeCard => ({
  ...createNewCard(id, new Date(day(10))),
  state: "review",
  reps: 1,
  intervalDays: 1,
  dueAt: day(11),
  ...over,
});

const session = (id: string, over: Record<string, unknown> = {}) => ({
  id,
  scopeType: "due",
  scopeLabel: "Due cards",
  pathSlug: null,
  correct: 1,
  total: 1,
  missIds: [],
  questionIds: ["q0"],
  at: day(10),
  ...over,
});

const cards = async (store: Store) => (await readSyncState(store, "u1", NOW)).cards;

test("a full session of 20 cards is saved", async () => {
  const store = makeStore();
  await applyCards(store, "u1", IDS.slice(0, 20).map((id) => card(id)), KNOWN, NOW);
  assert.equal((await cards(store)).length, 20);
});

test("one bad card is skipped and the rest are saved", async () => {
  const store = makeStore();
  const batch = [
    card("q0"),
    card("unknown"),
    card("q1", { ease: 99 }),
    card("q2", { dueAt: "never" }),
    card("q3", { reps: -1 }),
    null,
    card("q4"),
  ];
  await applyCards(store, "u1", batch, KNOWN, NOW);
  assert.deepEqual((await cards(store)).map((c) => c.questionId).sort(), ["q0", "q4"]);
});

test("the same card twice in one batch keeps the better copy", async () => {
  const store = makeStore();
  await applyCards(store, "u1", [card("q0", { reps: 3 }), card("q0", { reps: 1 })], KNOWN, NOW);
  assert.equal((await cards(store))[0].reps, 3);
});

test("dates are normalised, a fast clock is clamped and the interval is capped", async () => {
  const store = makeStore();
  await applyCards(
    store,
    "u1",
    [card("q0", { updatedAt: "2027-03-01T00:00:00+01:00", dueAt: "2026-11-21T01:00:00+01:00", intervalDays: 9e9 })],
    KNOWN,
    NOW,
  );
  const [saved] = await cards(store);
  assert.equal(saved.updatedAt, new Date(NOW).toISOString());
  assert.equal(saved.dueAt, "2026-11-21T00:00:00.000Z");
  assert.equal(saved.intervalDays, 36500);
});

test("the account keeps the same copy the browser would", async () => {
  const states: CardState[] = ["new", "learning", "review"];
  const copies: PracticeCard[] = [];
  for (const state of states)
    for (const lapses of [0, 1])
      for (const reps of [0, 1])
        for (const ease of [2.5, 2.6])
          for (const updatedAt of [day(1), day(2)]) copies.push(card("q0", { state, lapses, reps, ease, updatedAt }));

  const store = makeStore();
  for (const server of copies) {
    for (const local of copies) {
      await (store.db as never as ReturnType<typeof drizzle>).delete(sqliteSchema.practiceCards).run();
      await applyCards(store, "u1", [server], KNOWN, NOW);
      await applyCards(store, "u1", [local], KNOWN, NOW);
      const expected = pickCard(local, server) === "local" ? local : server;
      assert.deepEqual((await cards(store))[0], expected, JSON.stringify({ server, local }));
    }
  }
});

test("sessions are saved once; empty ones are not saved", async () => {
  const store = makeStore();
  const batch = [session("s1"), session("s1"), session("empty", { total: 0, correct: 0, questionIds: [] }), null];
  await applySessions(store, "u1", batch, KNOWN, NOW);
  await applySessions(store, "u1", batch, KNOWN, NOW);
  assert.deepEqual((await readSyncState(store, "u1", NOW)).sessionIds, ["s1"]);
});

test("the sync state gives the oldest session and no reset by default", async () => {
  const store = makeStore();
  await applySessions(store, "u1", [session("late", { at: day(12) }), session("early", { at: day(3) })], KNOWN, NOW);
  const state = await readSyncState(store, "u1", NOW);
  assert.equal(state.oldestSessionAt, Date.parse(day(3)));
  assert.equal(state.resetAt, null);
});

test("after a reset, older cards and sessions are refused and the marker stays hidden", async () => {
  const store = makeStore();
  await writeResetMarker(store, "u1", Date.parse(day(15)));
  await applyCards(store, "u1", [card("q0", { updatedAt: day(14) }), card("q1", { updatedAt: day(16) })], KNOWN, NOW);
  await applySessions(store, "u1", [session("old", { at: day(14) }), session("new", { at: day(16) })], KNOWN, NOW);
  const state = await readSyncState(store, "u1", NOW);
  assert.equal(state.resetAt, Date.parse(day(15)));
  assert.deepEqual(state.cards.map((c) => c.questionId), ["q1"]);
  assert.deepEqual(state.sessionIds, ["new"]);

  // A second reset moves the line forward.
  await writeResetMarker(store, "u1", Date.parse(day(18)));
  assert.equal((await readSyncState(store, "u1", NOW)).resetAt, Date.parse(day(18)));
});
