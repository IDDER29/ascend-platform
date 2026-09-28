import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCoachHomeModel,
  dueWeek,
  practiceDaysGrid,
  selectCoachHomeAction,
  streakDays,
  strengthBuckets,
  type CoachHomeInput,
} from "./coach-home-model";
import type { PracticeSessionRecord } from "./history";
import { createNewCard, localDayKey, type PracticeCard } from "./sm2";

const NOW = new Date(2026, 8, 29, 14, 0); // Tue Sep 29 2026, 2:00 PM local

function at(daysAgo: number, hour = 10): string {
  return new Date(2026, 8, 29 - daysAgo, hour, 0).toISOString();
}

function session(
  id: string,
  when: string,
  questionIds: string[] = ["q1"],
  missIds: string[] = [],
  scopeLabel = "Due review",
): PracticeSessionRecord {
  return {
    id,
    at: when,
    scopeType: "due",
    scopeLabel,
    pathSlug: null,
    correct: questionIds.length - missIds.length,
    total: questionIds.length,
    missIds,
    questionIds,
  };
}

function card(
  questionId: string,
  patch: Partial<PracticeCard> = {},
): PracticeCard {
  return { ...createNewCard(questionId, NOW), ...patch };
}

function input(patch: Partial<CoachHomeInput> = {}): CoachHomeInput {
  return {
    cards: [],
    history: [],
    meta: { date: localDayKey(NOW), count: 0 },
    completedKeys: new Set(),
    goal: 20,
    now: NOW,
    ...patch,
  };
}

test("primary action prefers due review, then free study, then curriculum", () => {
  assert.deepEqual(selectCoachHomeAction(3, 12), {
    href: "/practicev2/session?scope=due",
    label: "Start review",
    mode: "due",
  });
  assert.deepEqual(selectCoachHomeAction(0, 12), {
    href: "/practicev2/session?scope=all",
    label: "Free study",
    mode: "all",
  });
  assert.deepEqual(selectCoachHomeAction(0, 0), {
    href: "/curriculum",
    label: "Continue learning",
    mode: "continue",
  });
});

test("streak counts consecutive local days ending today", () => {
  const history = [
    session("a", at(0)),
    session("b", at(1)),
    session("c", at(2)),
    session("d", at(4)),
  ];
  assert.equal(streakDays(history, NOW), 3);
});

test("streak stays alive from yesterday when nothing practiced yet today", () => {
  assert.equal(streakDays([session("a", at(1)), session("b", at(2))], NOW), 2);
});

test("streak is zero when the last session was two days ago", () => {
  assert.equal(streakDays([session("a", at(2))], NOW), 0);
  assert.equal(streakDays([], NOW), 0);
});

test("strength buckets split review cards at a 21 day interval", () => {
  const cards = [
    card("n1"),
    card("l1", { state: "learning" }),
    card("l2", { state: "learning" }),
    card("s1", { state: "review", intervalDays: 3 }),
    card("m1", { state: "review", intervalDays: 21 }),
  ];
  assert.deepEqual(strengthBuckets(cards), {
    new: 1,
    learning: 2,
    solid: 1,
    mastered: 1,
    total: 5,
  });
});

test("due week puts due-now cards on today and future cards on their day", () => {
  const cards = [
    card("due-old", { state: "review", dueAt: at(3) }),
    card("tomorrow", {
      state: "review",
      dueAt: new Date(2026, 8, 30, 9).toISOString(),
    }),
    card("in-3", {
      state: "review",
      dueAt: new Date(2026, 9, 2, 23).toISOString(),
    }),
    card("far", {
      state: "review",
      dueAt: new Date(2026, 9, 20).toISOString(),
    }),
  ];
  const week = dueWeek(cards, { date: localDayKey(NOW), count: 0 }, NOW);
  assert.equal(week.length, 7);
  assert.deepEqual(
    week.map((day) => [day.label, day.count]),
    [
      ["Today", 1],
      ["Wed", 1],
      ["Thu", 0],
      ["Fri", 1],
      ["Sat", 0],
      ["Sun", 0],
      ["Mon", 0],
    ],
  );
  assert.equal(week[0].isToday, true);
});

test("practice days grid is 12 Monday-first weeks with intensity levels", () => {
  const history = [
    session("a", at(0, 9)),
    session("b", at(0, 11)),
    session("c", at(1)),
    ...["d", "e", "f", "g", "h"].map((id) => session(id, at(7))),
  ];
  const grid = practiceDaysGrid(history, NOW);
  assert.equal(grid.cells.length, 84);
  const today = grid.cells.find((cell) => cell.today);
  assert.ok(today);
  assert.equal(today.count, 2);
  assert.equal(today.level, 2);
  assert.equal(grid.cells.find((c) => c.date === localDayKey(new Date(2026, 8, 22)))?.level, 4);
  // Tue is today → Wed..Sun of the current week are future.
  assert.equal(grid.cells.filter((cell) => cell.future).length, 5);
  assert.equal(grid.practicedDays, 3);
  // First column starts on a Monday.
  assert.equal(new Date(`${grid.cells[0].date}T00:00`).getDay(), 1);
});

test("guest with no data gets honest empty values", () => {
  const model = buildCoachHomeModel(input());
  assert.equal(model.dateLabel, "Tuesday, Sep 29");
  assert.equal(model.hero.lastScore, null);
  assert.equal(model.hero.nextReviewLabel, null);
  assert.equal(model.day.streak, 0);
  assert.equal(model.day.answeredToday, 0);
  assert.deepEqual(model.sessions.rows, []);
  assert.equal(model.strength.total, 0);
  assert.equal(model.days.practicedDays, 0);
  assert.equal(model.path.hitRate, null);
  assert.equal(model.path.lessonCount, 6);
  assert.equal(model.path.cardCount, 32);
  assert.ok(model.path.steps.every((step) => !step.done));
  // Foundations is always unlocked, so a guest can free-study.
  assert.equal(model.hero.action.mode, "all");
  assert.equal(model.modes.unlockedCount, 32);
});

test("today's sessions are newest first and exclude earlier days", () => {
  const model = buildCoachHomeModel(
    input({
      history: [
        session("old", at(1), ["q1"]),
        session("morning", at(0, 9), ["q1", "q2"], ["q2"]),
        session("noon", at(0, 12), ["q1", "q2", "q3"], [], "Free study"),
      ],
    }),
  );
  assert.deepEqual(
    model.sessions.rows.map((row) => row.id),
    ["noon", "morning"],
  );
  assert.equal(model.sessions.rows[0].timeLabel, "12:00 PM");
  assert.deepEqual(model.sessions.rows[1].results, [true, false]);
  assert.equal(model.sessions.answered, 5);
  assert.equal(model.sessions.correct, 4);
  assert.equal(model.sessions.toFix, 1);
  assert.equal(model.day.answeredToday, 5);
  assert.deepEqual(model.hero.lastScore, { correct: 3, total: 3 });
});

test("due cards drive the hero and misses badge", () => {
  const model = buildCoachHomeModel(
    input({
      cards: [
        card("miss", { state: "learning", dueAt: at(0, 8) }),
        card("rev", { state: "review", intervalDays: 2, dueAt: at(1) }),
        card("later", {
          state: "review",
          intervalDays: 4,
          dueAt: new Date(2026, 9, 1, 9, 5).toISOString(),
        }),
      ],
    }),
  );
  assert.equal(model.hero.dueNow, 2);
  assert.equal(model.hero.sessionSize, 2);
  assert.equal(model.hero.action.mode, "due");
  assert.equal(model.hero.nextReviewLabel, "Oct 1, 9:05 AM");
  assert.equal(model.modes.missesDue, 1);
});

test("a Foundations step is done once every card for that lesson has been seen", () => {
  const model = buildCoachHomeModel(input());
  const first = model.path.steps[0];
  const cardIds = model.path.stepQuestionIds[first.key];
  const seen = buildCoachHomeModel(
    input({
      cards: cardIds.map((id) => card(id, { state: "review", intervalDays: 1 })),
    }),
  );
  assert.equal(seen.path.steps[0].done, true);
  assert.equal(seen.path.steps[1].done, false);
});
