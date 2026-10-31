"use client";

import { useEffect, useState } from "react";
import { Choice } from "@/components/forms/coach-fields";
import { savePracticeDailyGoalAction } from "@/lib/practice/actions";
import { GOAL_PLANS, type DailyGoal, readDailyGoal, writeDailyGoal } from "@/lib/practice/daily-goal";
import { SaveStatus } from "./settings-card";

type Status = { kind: "idle" | "saving" | "saved" } | { kind: "error"; message: string };
const GOALS = Object.entries(GOAL_PLANS).map(([goal, plan]) => ({ goal: Number(goal) as DailyGoal, ...plan }));

/** The one daily goal, saved as soon as you pick it: in this browser, and on your account when signed in. */
export function GoalForm({ userId, initial }: { userId: string | null; initial: DailyGoal }) {
  const [goal, setGoal] = useState<DailyGoal>(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // A guest's goal lives in this browser only.
  useEffect(() => {
    if (userId) return;
    queueMicrotask(() => setGoal(readDailyGoal(null)));
  }, [userId]);

  async function pick(next: DailyGoal) {
    setGoal(next);
    writeDailyGoal(userId, next);
    if (!userId) return setStatus({ kind: "saved" });
    setStatus({ kind: "saving" });
    const result = await savePracticeDailyGoalAction(next);
    setStatus(result.ok ? { kind: "saved" } : { kind: "error", message: result.error });
  }

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="sr-only">Daily goal</legend>
      <div className="grid gap-3 lg:grid-cols-3">
        {GOALS.map((g) => (
          <Choice
            key={g.goal}
            name="goal"
            value={String(g.goal)}
            checked={goal === g.goal}
            onChange={() => pick(g.goal)}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-bold leading-tight">{g.label}</span>
              <span className="mt-1 block text-[14.5px] leading-snug text-[var(--coach-ink-secondary)]">{g.plan}</span>
              <span className="mt-2 block text-[13px] text-[var(--coach-ink-muted)]">
                {g.review ? `Reviews ${g.cards}` : "Reviews when you want"}
              </span>
            </span>
          </Choice>
        ))}
      </div>
      <div className="mt-3">
        <SaveStatus status={status} />
      </div>
    </fieldset>
  );
}
