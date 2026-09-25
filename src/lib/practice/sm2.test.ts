// src/lib/practice/sm2.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { createNewCard, gradeCard } from "./sm2";

test("Again on new → learning, due now, ease floor path", () => {
  const now = new Date("2026-09-25T12:00:00.000Z");
  const card = createNewCard("bits-01", now);
  const next = gradeCard(card, "again", now);
  assert.equal(next.state, "learning");
  assert.equal(next.reps, 0);
  assert.equal(next.dueAt, now.toISOString());
  assert.ok(next.ease <= card.ease);
});

test("Good on new → review, interval 1 day", () => {
  const now = new Date("2026-09-25T12:00:00.000Z");
  const next = gradeCard(createNewCard("bits-01", now), "good", now);
  assert.equal(next.state, "review");
  assert.equal(next.reps, 1);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.dueAt, new Date("2026-09-26T12:00:00.000Z").toISOString());
});

test("Good on review multiplies interval by ease", () => {
  const now = new Date("2026-09-25T12:00:00.000Z");
  let card = gradeCard(createNewCard("bits-01", now), "good", now);
  const day2 = new Date("2026-09-26T12:00:00.000Z");
  card = gradeCard(card, "good", day2);
  assert.equal(card.state, "review");
  assert.equal(card.reps, 2);
  assert.equal(card.intervalDays, 3); // ease 2.6 after +0.1; round(1 * 2.6)
  assert.ok(card.ease >= 2.5);
});

test("Again on review increments lapses and due now", () => {
  const now = new Date("2026-09-25T12:00:00.000Z");
  let card = gradeCard(createNewCard("bits-01", now), "good", now);
  const later = new Date("2026-09-26T12:00:00.000Z");
  card = gradeCard(card, "again", later);
  assert.equal(card.state, "learning");
  assert.equal(card.lapses, 1);
  assert.equal(card.dueAt, later.toISOString());
});
