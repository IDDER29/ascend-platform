import assert from "node:assert/strict";
import { test } from "node:test";
import { pickCard, reconcileCards, sessionsToUpload, uploadFloor } from "./card-merge";
import { createNewCard, gradeCard, type PracticeCard, type PracticeGrade } from "./sm2";

const at = (day: number) => new Date(Date.UTC(2026, 10, day, 12));
const fresh = (day = 1) => createNewCard("q1", at(day));
const graded = (grades: PracticeGrade[], startDay = 1) =>
  grades.reduce((card, grade, i) => gradeCard(card, grade, at(startDay + i)), fresh(startDay));
const NO_LIMITS = { resetAt: null, floor: null };

test("a reviewed card beats a new one, however recent the new one is", () => {
  const reviewed = graded(["good"], 1);
  const untouched = fresh(20);
  assert.equal(pickCard(untouched, reviewed), "server");
  assert.equal(pickCard(reviewed, untouched), "local");
});

test("a fork from a fresh card cannot beat a mature one", () => {
  const mature = graded(["good", "good", "good", "good"], 1);
  const fork = graded(["good"], 20);
  assert.equal(pickCard(fork, mature), "server");
  assert.equal(pickCard(mature, fork), "local");
});

test("a lapse beats the mature copy it came from", () => {
  const mature = graded(["good", "good", "good"], 1);
  const lapsed = gradeCard(mature, "again", at(10));
  assert.equal(pickCard(lapsed, mature), "local");
  assert.equal(pickCard(mature, lapsed), "server");
});

test("equal lapses and reps fall back to the later review", () => {
  const earlier = graded(["again"], 1);
  const later = graded(["again", "again"], 5);
  assert.equal(pickCard(later, earlier), "local");
  assert.equal(pickCard(earlier, later), "server");
});

test("the same schedule keeps the account's copy, so nothing is uploaded", () => {
  const server = graded(["good"], 1);
  const local = graded(["good"], 3);
  assert.equal(pickCard(local, server), "server");
  assert.deepEqual(reconcileCards([local], [server], NO_LIMITS), { merged: [server], toUpload: [] });
});

test("grading never lowers (lapses, reps)", () => {
  const grades: PracticeGrade[] = ["again", "hard", "good", "easy"];
  let cards: PracticeCard[] = [fresh()];
  for (let step = 0; step < 4; step += 1) {
    cards = cards.flatMap((card) =>
      grades.map((grade) => {
        const next = gradeCard(card, grade, at(2 + step));
        assert.ok(
          next.lapses > card.lapses || (next.lapses === card.lapses && next.reps >= card.reps),
          `${card.state} + ${grade}`,
        );
        return next;
      }),
    );
  }
});

test("reviews the account never received are kept and uploaded", () => {
  const server = graded(["good"], 1);
  const local = graded(["good", "good"], 1);
  const onlyHere = { ...graded(["good"], 2), questionId: "q2" };
  const result = reconcileCards([local, onlyHere], [server], NO_LIMITS);
  assert.deepEqual(result.merged, [local, onlyHere]);
  assert.deepEqual(result.toUpload, [local, onlyHere]);
});

test("account cards this browser lacks are added, and untouched local cards stay here", () => {
  const onServer = { ...graded(["good"], 1), questionId: "q2" };
  const untouched = fresh(1);
  const result = reconcileCards([untouched], [onServer], NO_LIMITS);
  assert.deepEqual(result.merged, [untouched, onServer]);
  assert.deepEqual(result.toUpload, []);
});

test("a reset drops older copies from both sides", () => {
  const old = graded(["good", "good"], 1);
  const after = { ...graded(["good"], 10), questionId: "q2" };
  const result = reconcileCards([old, after], [], { resetAt: at(5).getTime(), floor: null });
  assert.deepEqual(result.merged, [after]);
  assert.deepEqual(result.toUpload, [after]);
});

test("copies older than the upload floor stay in the browser but are never uploaded", () => {
  const old = graded(["good", "good"], 1);
  const missing = { ...graded(["good"], 1), questionId: "q2" };
  const server = graded(["good"], 10);
  const result = reconcileCards([old, missing], [server], { resetAt: null, floor: at(8).getTime() });
  assert.deepEqual(result.merged, [server, missing]);
  assert.deepEqual(result.toUpload, []);
});

test("broken browser entries are ignored", () => {
  const broken = [null, {}, { questionId: 4 }] as unknown as PracticeCard[];
  assert.deepEqual(reconcileCards(broken, [], NO_LIMITS), { merged: [], toUpload: [] });
});

test("the floor comes from the reset marker, then the oldest session, then the cards", () => {
  const day = 24 * 60 * 60 * 1000;
  const oldest = at(5).getTime();
  assert.equal(uploadFloor({ resetAt: 1, oldestSessionAt: oldest, serverCardCount: 3 }), null);
  assert.equal(uploadFloor({ resetAt: null, oldestSessionAt: oldest, serverCardCount: 0 }), oldest - day);
  assert.equal(uploadFloor({ resetAt: null, oldestSessionAt: null, serverCardCount: 3 }), null);
  // An empty account may have just been reset: nothing is pushed into it on its own.
  assert.equal(uploadFloor({ resetAt: null, oldestSessionAt: null, serverCardCount: 0 }), Infinity);
});

test("sessions to upload are the answered ones the account lacks, after any reset", () => {
  const session = (id: string, day: number, total = 3) => ({ id, at: at(day).toISOString(), total });
  const local = [session("had", 9), session("new", 9), session("empty", 9, 0), session("old", 1)];
  const ids = (limits: { resetAt: number | null; floor: number | null }) =>
    sessionsToUpload(local, new Set(["had"]), limits).map((s) => s.id);
  assert.deepEqual(ids(NO_LIMITS), ["new", "old"]);
  assert.deepEqual(ids({ resetAt: at(5).getTime(), floor: null }), ["new"]);
  assert.deepEqual(ids({ resetAt: null, floor: at(5).getTime() }), ["new"]);
  assert.deepEqual(ids({ resetAt: null, floor: Infinity }), []);
});
