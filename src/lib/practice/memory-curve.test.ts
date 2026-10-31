import assert from "node:assert/strict";
import { test } from "node:test";
import { memoryCurve, recall } from "./memory-curve";
import type { PracticeCard } from "./sm2";

const NOW = new Date(2026, 9, 30, 12);
const iso = (days: number) => new Date(NOW.getTime() + days * 86_400_000).toISOString();

function card(patch: Partial<PracticeCard>): PracticeCard {
  return {
    questionId: "q",
    state: "review",
    reps: 2,
    ease: 2.5,
    intervalDays: 6,
    dueAt: iso(3),
    lapses: 0,
    updatedAt: iso(-3),
    ...patch,
  };
}

test("the curve: 90% at S days, falling slower and slower, never to zero quickly", () => {
  assert.equal(recall(0, 6), 1);
  assert.ok(Math.abs(recall(6, 6) - 0.9) < 1e-9);
  assert.ok(recall(12, 6) < recall(6, 6));
  assert.ok(recall(6, 6) - recall(12, 6) < recall(0, 6) - recall(6, 6));
  assert.ok(recall(30, 1) > 0.3); // a month after a one-day card: forgotten mostly, not entirely
});

test("new cards aren't counted; nothing reviewed gives an empty curve", () => {
  assert.deepEqual(memoryCurve([card({ state: "new" })], NOW), { cards: 0, today: 0, points: [] });
});

test("today's recall comes from time since the last review", () => {
  // Interval 6 days, due in 3: reviewed 3 days ago.
  const c = memoryCurve([card({})], NOW);
  assert.equal(c.cards, 1);
  assert.ok(Math.abs(c.today - Math.pow(1 + (19 / 81) * (3 / 6), -0.5)) < 1e-9);
  assert.equal(c.points.length, 31);
});

test("reviewing when due keeps recall at 90% or more; stopping lets it fall", () => {
  const c = memoryCurve(
    [
      card({}),
      card({ intervalDays: 1, dueAt: iso(-2) }),
      card({ state: "learning", intervalDays: 0, dueAt: iso(0), updatedAt: iso(0) }),
    ],
    NOW,
  );
  for (const p of c.points) assert.ok(p.kept >= 0.9 - 1e-9, `day ${p.day}: ${p.kept}`);
  const last = c.points.at(-1)!;
  assert.ok(last.stopped < 0.5, `stopped at 30 days: ${last.stopped}`);
  assert.ok(c.points[0].stopped < c.points[0].kept); // an overdue card is below 90% today
});
