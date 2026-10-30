/**
 * DEVELOPMENT PREVIEW ONLY. A made-up learner shown at /profile to signed-out
 * visitors while the app is in development, so the page can be reviewed
 * without an account. Built purely in memory — nothing is read or written.
 *
 * Before launch: set SHOW_SAMPLE_PROFILE_TO_GUESTS to false (guests then get
 * the "Sign in to get a profile" prompt again) and delete this file.
 */
import type { ProfileInput, ProfileLesson } from "./profile-model";

export const SHOW_SAMPLE_PROFILE_TO_GUESTS = true;

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(now: Date, days: number): string {
  return new Date(now.getTime() - days * DAY_MS).toISOString();
}

/** A learner partway through Level 01 who shipped the half adder. */
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
      name: "Sample Learner",
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
