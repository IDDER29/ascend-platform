import type { ReactNode } from "react";
import type { CoachCompleteModel } from "@/lib/practice/coach-complete-model";

function Tile({
  label,
  value,
  note,
  warm = false,
}: {
  label: string;
  value: ReactNode;
  note: string;
  warm?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-1 rounded-2xl border-2 p-3 sm:p-4 ${
        warm
          ? "border-[var(--coach-wrong-border)] bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-strong)]"
          : "border-[var(--coach-border)] bg-[var(--coach-surface)]"
      }`}
    >
      <span
        className={`text-xs ${warm ? "" : "text-[var(--coach-ink-secondary)]"}`}
      >
        {label}
      </span>
      <span className="whitespace-nowrap font-display text-[22px] font-extrabold leading-[1.1] sm:text-[26px]">
        {value}
      </span>
      <span
        className={`text-[11px] leading-snug sm:text-xs ${warm ? "" : "text-[var(--coach-ink-secondary)]"}`}
      >
        {note}
      </span>
    </div>
  );
}

export function StatTiles({ model }: { model: CoachCompleteModel }) {
  const { accuracy, goal, streak } = model;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <Tile
        label="Accuracy"
        value={`${accuracy.percent}%`}
        note={
          accuracy.lastPercent === null
            ? "First session"
            : `Last time ${accuracy.lastPercent}%`
        }
      />
      <Tile
        label="Daily goal"
        value={
          <>
            {goal.answeredToday}
            <span className="text-sm font-bold text-[var(--coach-ink-muted)]">
              /{goal.goal}
            </span>
          </>
        }
        note={goal.met ? "Goal met" : `${goal.remaining} to go`}
      />
      <Tile
        label="Streak"
        value={`${streak} ${streak === 1 ? "day" : "days"}`}
        note={streak > 0 ? "Safe for today" : "Practice to start one"}
        warm={streak > 0}
      />
    </div>
  );
}
