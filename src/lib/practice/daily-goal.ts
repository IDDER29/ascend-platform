export const DAILY_GOALS = [
  { value: 10, label: "Casual" },
  { value: 20, label: "Regular" },
  { value: 40, label: "Serious" },
] as const;

export type DailyGoal = (typeof DAILY_GOALS)[number]["value"];

/**
 * The one daily goal, set once (onboarding or Settings). It sizes the day's
 * checklist on the dashboard — lessons, and a review for Regular and Serious —
 * and Practice's card target. Every goal includes a lesson, because the streak
 * counts lessons. Ids of the older "pace" setting map onto it.
 */
export const GOAL_PLANS: Record<
  DailyGoal,
  { label: string; lessons: number; review: boolean; plan: string; cards: string }
> = {
  10: { label: "Casual", lessons: 1, review: false, plan: "One lesson a day", cards: "about 10 cards" },
  20: { label: "Regular", lessons: 1, review: true, plan: "One lesson and a review", cards: "about 20 cards" },
  40: { label: "Serious", lessons: 2, review: true, plan: "Two lessons and a review", cards: "about 40 cards" },
};

const PACE_GOAL: Record<string, DailyGoal> = { casual: 10, regular: 20, intense: 40, serious: 40 };

/** The goal an older "pace" setting stands for. */
export function goalForPace(pace: string | null | undefined): DailyGoal | null {
  return pace ? (PACE_GOAL[pace] ?? null) : null;
}

export function paceForGoal(goal: DailyGoal): string {
  return goal === 10 ? "casual" : goal === 20 ? "regular" : "intense";
}

export const DEFAULT_DAILY_GOAL: DailyGoal = 20;

const PREFIX = "ascend_practice_daily_goal_v1";

export function dailyGoalKey(userId: string | null): string {
  return `${PREFIX}:${userId ?? "guest"}`;
}

export function isDailyGoal(value: unknown): value is DailyGoal {
  return DAILY_GOALS.some((goal) => goal.value === value);
}

export function readDailyGoal(userId: string | null): DailyGoal {
  if (typeof window === "undefined") return DEFAULT_DAILY_GOAL;
  try {
    const stored = Number(window.localStorage.getItem(dailyGoalKey(userId)));
    return isDailyGoal(stored) ? stored : DEFAULT_DAILY_GOAL;
  } catch {
    return DEFAULT_DAILY_GOAL;
  }
}

export function writeDailyGoal(userId: string | null, goal: DailyGoal): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(dailyGoalKey(userId), String(goal));
  } catch {
    // Ignore quota and private-mode storage errors.
  }
}

/**
 * Signed-in learners keep their goal on the server; the local copy is the
 * guest store and an offline fallback. A server value wins and is mirrored
 * locally so every Practice screen reads the same goal.
 */
export function resolveDailyGoal(userId: string | null, serverGoal: DailyGoal | null): DailyGoal {
  if (userId && serverGoal !== null) {
    writeDailyGoal(userId, serverGoal);
    return serverGoal;
  }
  return readDailyGoal(userId);
}
