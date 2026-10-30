/**
 * DEVELOPMENT PREVIEW ONLY. A made-up learner shown at /profile and
 * /achievements to signed-out visitors while the app is in development, so
 * the pages can be reviewed without an account. Built purely in memory —
 * nothing is read or written.
 *
 * Before launch: set SHOW_SAMPLE_PROFILE_TO_GUESTS to false (guests then get
 * the "Sign in to get a profile" prompt again) and delete this file.
 */
import type { AchievementsInput } from "@/lib/achievements/achievements-model";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import type { PracticeCard } from "@/lib/practice/sm2";
import type { ProfileInput, ProfileLesson } from "./profile-model";

export const SHOW_SAMPLE_PROFILE_TO_GUESTS = true;

export const SAMPLE_NAME = "Sample Learner";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(now: Date, days: number): string {
  return new Date(now.getTime() - days * DAY_MS).toISOString();
}

/** A learner partway through Machine & Memory who shipped the half adder. */
export function sampleProfileInput(lessons: ProfileLesson[], now: Date): Omit<ProfileInput, "viewer"> {
  const level00 = lessons.filter((l) => l.level === "level-00-bits-logic");
  const level01 = lessons.filter((l) => l.level === "level-01-machine-memory").slice(0, 2);
  const finished = [...level00, ...level01];
  // One lesson every few days, oldest first, ending three days ago.
  const completions = finished.map((l, i) => ({
    key: l.key,
    completedAt: daysAgo(now, 3 + (finished.length - 1 - i) * 4),
  }));
  const halfAdderDone = completions.find((c) => c.key.endsWith("/project-half-adder"));

  return {
    profile: {
      name: SAMPLE_NAME,
      username: "sample-learner",
      bio: "Learning how computers really work, one layer at a time.",
      joinedAt: daysAgo(now, 45),
    },
    isPublic: false,
    lessons,
    completions,
    projectLinks: halfAdderDone
      ? [{ projectId: "half-adder", repoUrl: "https://github.com/sample-learner/half-adder", addedAt: halfAdderDone.completedAt }]
      : [],
    ownProjects: [
      {
        id: "sample-own-1",
        title: "bitflip",
        description: "A tiny CLI that prints any number in binary, hex and two's complement.",
        url: "https://github.com/sample-learner/bitflip",
        tags: ["C", "CLI"],
        createdAt: daysAgo(now, 10),
      },
    ],
    links: [
      { id: "sample-link-1", url: "https://github.com/sample-learner", label: null },
      { id: "sample-link-2", url: "https://www.linkedin.com/in/sample-learner", label: null },
    ],
    badges: [],
    practice: { sessions: 12, firstAt: daysAgo(now, 30), tenthAt: daysAgo(now, 6) },
  };
}

/** The same sample learner for /achievements: Bits & Logic cards all solid, a week-long practice run. */
export function sampleAchievementsInput(lessons: ProfileLesson[], now: Date): AchievementsInput {
  const { completions, projectLinks } = sampleProfileInput(lessons, now);
  const level01Done = new Set(completions.map((c) => c.key));
  const cards: PracticeCard[] = PRACTICE_BANK.filter(
    (q) => q.lessonLevel === "level-00-bits-logic" || level01Done.has(`${q.lessonLevel}/${q.lessonSlug}`),
  ).map((q, i) => {
    const solid = q.lessonLevel === "level-00-bits-logic" || i % 3 === 0;
    return {
      questionId: q.id,
      state: solid ? "review" : "learning",
      reps: solid ? 3 : 1,
      ease: 2.5,
      intervalDays: solid ? 9 : 1,
      dueAt: daysAgo(now, -4),
      lapses: 0,
      updatedAt: daysAgo(now, 5),
    };
  });
  // A few early sessions, eight days in a row ending last week, then two recent ones.
  // The last five are strong 10-card sessions (C-rank tasks); the rest are everyday (D-rank).
  const days = [22, 21, 20, 19, 14, 13, 12, 11, 10, 9, 8, 7, 3, 1];
  // Sessions review the sample's own cards, so each skill gets a real accuracy score.
  const reviewIds = cards.map((c) => c.questionId);
  const history: PracticeSessionRecord[] = days.map((d, i) => {
    const strong = i >= days.length - 5;
    const size = strong ? 10 : 8;
    const questionIds = Array.from({ length: size }, (_, k) => reviewIds[(i * 7 + k) % reviewIds.length]);
    const missIds = questionIds.slice(0, size - (strong ? 9 : 7));
    return {
      id: `sample-session-${d}`,
      at: daysAgo(now, d),
      scopeType: "due",
      scopeLabel: "Due review",
      pathSlug: null,
      correct: strong ? 9 : 7,
      total: size,
      missIds,
      questionIds,
    };
  });
  return { lessons, completions, projectLinks, cards, history, now };
}
