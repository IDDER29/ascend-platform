import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  cardsClearedToday,
  sessionsThisWeek,
  trainingMomentum,
} from "./momentum";
import type { PracticeSessionRecord } from "./history";

function session(
  partial: Partial<PracticeSessionRecord> & { at: string; total: number },
): PracticeSessionRecord {
  return {
    id: partial.id ?? `s_${partial.at}`,
    at: partial.at,
    scopeType: "due",
    scopeLabel: "Due",
    pathSlug: "foundations",
    correct: partial.correct ?? partial.total,
    total: partial.total,
    missIds: [],
    questionIds: [],
  };
}

it("cardsClearedToday sums totals for sessions on the local calendar day", () => {
  const now = new Date("2026-09-25T15:00:00");
  const sessions = [
    session({ at: "2026-09-25T10:00:00", total: 5 }),
    session({ at: "2026-09-25T12:00:00", total: 3 }),
    session({ at: "2026-09-24T22:00:00", total: 10 }),
  ];
  assert.equal(cardsClearedToday(sessions, now), 8);
});

it("cardsClearedToday uses a DST-safe local midnight boundary", () => {
  const originalTz = process.env.TZ;
  process.env.TZ = "America/New_York";
  try {
    const now = new Date("2026-03-08T15:00:00");
    const sessions = [
      session({ at: "2026-03-08T23:30:00", total: 2 }),
      // The next local day starts 23 elapsed hours after spring-forward midnight.
      session({ at: "2026-03-09T00:30:00", total: 7 }),
    ];
    assert.equal(cardsClearedToday(sessions, now), 2);
  } finally {
    process.env.TZ = originalTz;
  }
});

it("sessionsThisWeek counts sessions from local Monday 00:00 through now", () => {
  // 2026-09-25 is a Friday; Monday is 2026-09-21
  const now = new Date("2026-09-25T15:00:00");
  const sessions = [
    session({ id: "a", at: "2026-09-22T10:00:00", total: 2 }),
    session({ id: "b", at: "2026-09-24T10:00:00", total: 2 }),
    session({ id: "c", at: "2026-09-20T10:00:00", total: 2 }), // Sunday before Mon
  ];
  assert.equal(sessionsThisWeek(sessions, now), 2);
});

it("trainingMomentum packages both metrics", () => {
  const now = new Date("2026-09-25T15:00:00");
  const m = trainingMomentum(
    [session({ at: "2026-09-25T10:00:00", total: 4 })],
    now,
  );
  assert.equal(m.cardsClearedToday, 4);
  assert.equal(m.sessionsThisWeek, 1);
});
