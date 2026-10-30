import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import { createNewCard, type PracticeCard } from "@/lib/practice/sm2";
import { buildProgressV2Model, type ProgressLesson, type ProgressV2Input } from "./progress-v2-model";

const NOW = new Date(2026, 9, 29, 14, 0); // Thu Oct 29 2026
const L00 = "level-00-bits-logic";
const L01 = "level-01-machine-memory";

const LESSONS: ProgressLesson[] = [
  ...["what-is-a-bit", "binary-and-number-bases"].map((slug) => ({ level: L00, slug })),
  ...["inside-the-cpu", "assembly-a-first-look"].map((slug) => ({ level: L01, slug })),
].map(({ level, slug }) => ({
  key: `${level}/${slug}`,
  level,
  slug,
  title: slug,
  href: `/lessons/${slug}`,
}));

function input(patch: Partial<ProgressV2Input> = {}): ProgressV2Input {
  return { lessons: LESSONS, completions: [], cards: [], history: [], serverStreak: null, now: NOW, ...patch };
}

function daysAgo(n: number): string {
  return new Date(2026, 9, 29 - n, 10).toISOString();
}

function ids(slug: string): string[] {
  return PRACTICE_BANK.filter((q) => q.lessonSlug === slug).map((q) => q.id);
}

function session(id: string, at: string, questionIds: string[], missIds: string[] = []): PracticeSessionRecord {
  return {
    id,
    at,
    scopeType: "all",
    scopeLabel: "Free study",
    pathSlug: null,
    correct: questionIds.length - missIds.length,
    total: questionIds.length,
    missIds,
    questionIds,
  };
}

function solid(id: string, patch: Partial<PracticeCard> = {}): PracticeCard {
  return {
    ...createNewCard(id, NOW),
    state: "review",
    reps: 3,
    intervalDays: 6,
    dueAt: new Date(2026, 10, 10).toISOString(),
    ...patch,
  };
}

test("new learner: not started, next lesson is the first, no slipping or milestones", () => {
  const model = buildProgressV2Model(input());
  assert.equal(model.started, false);
  assert.equal(model.hero.done, 0);
  assert.equal(model.hero.total, 4);
  assert.equal(model.hero.levelNumber, "00");
  assert.deepEqual(model.hero.next, { title: "what-is-a-bit", href: "/lessons/what-is-a-bit" });
  assert.deepEqual(model.slipping, []);
  assert.deepEqual(model.milestones, []);
  assert.equal(model.momentum.hasData, false);
  // Foundations cards are always unlocked, so level 00 has cards but nothing remembered yet.
  assert.equal(model.levels[0].rememberedPct, 0);
  assert.equal(model.levels[1].rememberedPct, null);
  assert.ok(model.concepts[1].tiles.every((t) => t.shade === 0));
});

test("hero tracks the first unfinished lesson and finished topics become milestones", () => {
  const model = buildProgressV2Model(
    input({
      completions: [
        { key: `${L00}/what-is-a-bit`, completedAt: daysAgo(20) },
        { key: `${L00}/binary-and-number-bases`, completedAt: daysAgo(10) },
      ],
    }),
  );
  assert.equal(model.hero.done, 2);
  assert.equal(model.hero.levelName, "Machine & Memory");
  assert.equal(model.hero.next?.title, "inside-the-cpu");
  assert.deepEqual(model.hero.track[0].lessons.map((l) => l.done), [true, true]);
  assert.deepEqual(
    model.milestones.map((m) => m.label),
    ["Finished Bits & Logic", "First lesson done — what-is-a-bit"],
  );
});

test("all lessons done: no next lesson", () => {
  const model = buildProgressV2Model(
    input({ completions: LESSONS.map((l) => ({ key: l.key, completedAt: daysAgo(3) })) }),
  );
  assert.equal(model.hero.allDone, true);
  assert.equal(model.hero.next, null);
});

test("unlocked cards nobody has practiced leave the tile unshaded", () => {
  const bit = ids("what-is-a-bit");
  const model = buildProgressV2Model(input({ cards: bit.map((id) => createNewCard(id, NOW)) }));
  const tile = model.concepts[0].tiles[0];
  assert.equal(tile.shade, 0);
  assert.match(tile.label, /not practiced yet/);
});

test("remembered share and concept shade come from card strength", () => {
  const bit = ids("what-is-a-bit");
  const model = buildProgressV2Model(input({ cards: bit.map((id) => solid(id)) }));
  const tile = model.concepts[0].tiles[0];
  assert.equal(tile.shade, 4);
  assert.match(tile.label, /100% remembered/);
  const total = model.levels[0].cardCount;
  assert.equal(model.levels[0].rememberedPct, Math.round((bit.length / total) * 100));
});

test("slipping lists overdue and weak lessons, worst first, with a practice link", () => {
  const bit = ids("what-is-a-bit");
  const binary = ids("binary-and-number-bases");
  const model = buildProgressV2Model(
    input({
      cards: [
        ...bit.slice(0, 2).map((id) => solid(id, { dueAt: daysAgo(3) })),
        ...binary.map((id) => solid(id)),
      ],
      history: [session("s1", daysAgo(2), binary.slice(0, 4), binary.slice(0, 3))],
    }),
  );
  assert.deepEqual(model.slipping.map((s) => s.title), ["binary-and-number-bases", "what-is-a-bit"]);
  assert.equal(model.slipping[0].reason, "25% hit rate");
  assert.equal(model.slipping[1].reason, "2 overdue");
  assert.ok(model.slipping[1].href.includes("cards="));
});

test("this week and momentum count lessons, cards and accuracy per Monday week", () => {
  const bit = ids("what-is-a-bit");
  const model = buildProgressV2Model(
    input({
      completions: [{ key: `${L00}/what-is-a-bit`, completedAt: daysAgo(1) }],
      history: [
        session("now", daysAgo(1), bit.slice(0, 4), bit.slice(0, 1)), // this week: 3/4
        session("last", daysAgo(8), bit.slice(0, 4), bit.slice(0, 2)), // last week: 2/4
      ],
      serverStreak: 5, // ignored: the streak comes from finished lessons
    }),
  );
  assert.deepEqual(model.week, {
    lessonsDone: 1,
    cardsAnswered: 4,
    accuracy: 75,
    accuracyDelta: 25,
    streak: 1, // yesterday's lesson; none yet today
  });
  const last = model.momentum.weeks[model.momentum.weeks.length - 1];
  assert.equal(model.momentum.weeks.length, 12);
  assert.equal(last.isThisWeek, true);
  assert.equal(last.cards, 4);
  assert.equal(model.momentum.firstAccuracy, 50);
  assert.equal(model.momentum.lastAccuracy, 75);
  assert.ok(model.milestones.some((m) => m.label === "First practice session"));
});

test("completions for lessons no longer in the curriculum are ignored in counts", () => {
  const model = buildProgressV2Model(
    input({
      completions: [
        { key: `${L00}/what-is-a-bit`, completedAt: daysAgo(2) },
        { key: `${L00}/retired-lesson`, completedAt: daysAgo(2) },
      ],
    }),
  );
  assert.equal(model.hero.done, 1);
});
