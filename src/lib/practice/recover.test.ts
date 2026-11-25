import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { readCards, writeCards } from "./cards";
import { readLocalHistory, writeLocalHistory, type PracticeSessionRecord } from "./history";
import { recoverPractice } from "./recover";
import { createNewCard, gradeCard } from "./sm2";
import type { SyncState } from "./store";
import { SYNC_BATCH } from "./sync-limits";

const values = new Map<string, string>();
Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => void values.set(key, value),
      removeItem: (key: string) => void values.delete(key),
    },
  },
});
beforeEach(() => values.clear());

const at = (day: number) => new Date(Date.UTC(2026, 10, day, 12));
const reviewed = (id: string, day: number) => gradeCard(createNewCard(id, at(day)), "good", at(day));
const session = (id: string, day: number): PracticeSessionRecord => ({
  id,
  at: at(day).toISOString(),
  scopeType: "due",
  scopeLabel: "Due cards",
  pathSlug: null,
  correct: 1,
  total: 1,
  missIds: [],
  questionIds: ["q1"],
});
const account = (over: Partial<SyncState> = {}): SyncState => ({
  cards: [],
  sessionIds: [],
  oldestSessionAt: null,
  resetAt: null,
  ...over,
});

function api(state: SyncState | null, ok = true) {
  const pushes: { cards: number; sessions: string[] }[] = [];
  return {
    pushes,
    state: async () => state,
    push: async (data: { cards: unknown[]; sessions: PracticeSessionRecord[] }) => {
      pushes.push({ cards: data.cards.length, sessions: data.sessions.map((s) => s.id) });
      return { ok };
    },
  };
}

test("reviews that only this browser holds are uploaded", async () => {
  writeCards("u1", [reviewed("q1", 5), reviewed("q2", 5), createNewCard("q3", at(5))]);
  writeLocalHistory("u1", [session("s2", 5), session("s1", 3)]);
  const remote = api(account({ sessionIds: ["s1", "s2"].slice(0, 1), oldestSessionAt: at(3).getTime() }));

  await recoverPractice("u1", remote);

  assert.deepEqual(remote.pushes, [{ cards: 2, sessions: ["s2"] }]);
  assert.equal(readCards("u1").length, 3);
});

test("nothing changes when the account can't be read", async () => {
  writeCards("u1", [reviewed("q1", 5)]);
  const remote = api(null);
  await recoverPractice("u1", remote);
  assert.deepEqual(remote.pushes, []);
  assert.deepEqual(readCards("u1"), [reviewed("q1", 5)]);
});

test("after a reset elsewhere, this browser's older data goes and isn't uploaded", async () => {
  writeCards("u1", [reviewed("q1", 5), reviewed("q2", 20)]);
  writeLocalHistory("u1", [session("new", 20), session("old", 5)]);
  const remote = api(account({ resetAt: at(10).getTime() }));

  await recoverPractice("u1", remote);

  assert.deepEqual(readCards("u1").map((c) => c.questionId), ["q2"]);
  assert.deepEqual(readLocalHistory("u1").map((s) => s.id), ["new"]);
  assert.deepEqual(remote.pushes, [{ cards: 1, sessions: ["new"] }]);
});

test("a large deck goes up in batches, and stops at the first failure", async () => {
  const deck = Array.from({ length: SYNC_BATCH + 5 }, (_, i) => reviewed(`q${i}`, 5));
  const state = account({ sessionIds: [], oldestSessionAt: at(1).getTime() });

  writeCards("u1", deck);
  const working = api(state);
  await recoverPractice("u1", working);
  assert.deepEqual(working.pushes.map((p) => p.cards), [SYNC_BATCH, 5]);

  const failing = api(state, false);
  await recoverPractice("u1", failing);
  assert.equal(failing.pushes.length, 1);
});

test("nothing to send means no request", async () => {
  const remote = api(account({ cards: [reviewed("q1", 5)], oldestSessionAt: at(1).getTime() }));
  await recoverPractice("u1", remote);
  assert.deepEqual(remote.pushes, []);
  assert.equal(readCards("u1").length, 1);
});
