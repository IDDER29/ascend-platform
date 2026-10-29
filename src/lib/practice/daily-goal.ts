export const DAILY_GOALS = [
  { value: 10, label: "Casual" },
  { value: 20, label: "Regular" },
  { value: 40, label: "Serious" },
] as const;

export type DailyGoal = (typeof DAILY_GOALS)[number]["value"];

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
export function resolveDailyGoal(
  userId: string | null,
  serverGoal: DailyGoal | null,
): DailyGoal {
  if (userId && serverGoal !== null) {
    writeDailyGoal(userId, serverGoal);
    return serverGoal;
  }
  return readDailyGoal(userId);
}
