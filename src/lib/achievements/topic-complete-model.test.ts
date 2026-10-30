import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { ProfileLesson } from "@/lib/profile/profile-model";
import { buildAchievementsModel, type AchievementsInput } from "./achievements-model";
import { buildTopicComplete } from "./topic-complete-model";

const BITS = "level-00-bits-logic";
const MACHINE = "level-01-machine-memory";
const NOW = new Date(2026, 9, 30, 12, 0);

const LESSONS: ProfileLesson[] = [
  [BITS, "what-is-a-bit", "What is a bit?"],
  [BITS, "logic-gates", "Logic gates"],
  [MACHINE, "inside-the-cpu", "Inside the CPU"],
].map(([level, slug, title]) => ({ key: `${level}/${slug}`, level, slug, title, href: `/lessons/${slug}` }));

const at = (day: number) => new Date(2026, 9, day, 10).toISOString();

function topic(patch: Partial<AchievementsInput>, level: typeof BITS | typeof MACHINE = BITS) {
  const input: AchievementsInput = {
    lessons: LESSONS,
    completions: [],
    projectLinks: [],
    cards: [],
    history: [],
    now: NOW,
    ...patch,
  };
  return buildTopicComplete(input, buildAchievementsModel(input), level);
}

test("before the last lesson: what's left, nothing earned, continue where it's open", () => {
  const t = topic({ completions: [{ key: `${BITS}/what-is-a-bit`, completedAt: at(3) }] });
  assert.equal(t.finished, false);
  assert.deepEqual([t.done, t.total], [1, 2]);
  assert.deepEqual(
    t.remaining.map((l) => l.title),
    ["Logic gates"],
  );
  assert.deepEqual(t.earned, []);
  assert.deepEqual(t.next, { label: "Continue", title: "Logic gates", href: "/lessons/logic-gates" });
});

test("finished: dates, days taken, the clan, the badge and the headband it won", () => {
  const t = topic({
    completions: [
      { key: `${BITS}/what-is-a-bit`, completedAt: at(3) },
      { key: `${BITS}/logic-gates`, completedAt: at(9) },
    ],
  });
  assert.equal(t.finished, true);
  assert.equal(t.finishedAt, at(9));
  assert.equal(t.days, 7);
  assert.deepEqual(
    t.earned.map((b) => b.id),
    ["gate-clan", "gatekeeper", "headband"],
  );
  assert.equal(t.next.label, "Start Machine & Memory");
  assert.equal(t.next.href, "/lessons/inside-the-cpu");
});

test("the headband goes to the first topic finished, not later ones", () => {
  const t = topic(
    {
      completions: [
        { key: `${BITS}/what-is-a-bit`, completedAt: at(3) },
        { key: `${BITS}/logic-gates`, completedAt: at(9) },
        { key: `${MACHINE}/inside-the-cpu`, completedAt: at(20) },
      ],
    },
    MACHINE,
  );
  assert.deepEqual(
    t.earned.map((b) => b.id),
    ["core-clan", "machinist"],
  );
  assert.equal(t.next.label, "Open ShellForge"); // no later topic has lessons here
});

test("Practice scores count only this topic's cards", () => {
  const bits = PRACTICE_BANK.filter((q) => q.lessonLevel === BITS).map((q) => q.id);
  const other = PRACTICE_BANK.find((q) => q.lessonLevel !== BITS)!.id;
  const t = topic({
    history: [
      {
        id: "s",
        at: at(5),
        scopeType: "due",
        scopeLabel: "Due",
        pathSlug: null,
        correct: 3,
        total: 5,
        questionIds: [...bits.slice(0, 4), other],
        missIds: [bits[0], other],
      },
    ],
  });
  assert.equal(t.cards.total, bits.length);
  assert.equal(t.accuracy, 75);
});
test("names the clan the topic joins", () => {
  assert.equal(topic({}).clan, "Gate Clan");
});
