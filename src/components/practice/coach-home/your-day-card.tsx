import { DAILY_GOALS, type DailyGoal } from "@/lib/practice/daily-goal";
import type { CoachHomeModel } from "@/lib/practice/coach-home-model";

const RING_CIRCUMFERENCE = 264;

function StreakRow({ streak }: { streak: number }) {
  const active = streak > 0;
  return (
    <div className="flex items-center gap-3.5">
      <span
        className={`flex size-[52px] shrink-0 items-center justify-center rounded-[14px] ${
          active
            ? "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]"
            : "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-muted)]"
        }`}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3c1 3 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.3-3.8 2.5-5 0 2 1 3 2 3.2C11 8.5 10.5 6 12 3z" />
        </svg>
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-[26px] font-extrabold leading-none">
          {active ? `${streak} day streak` : "No streak yet"}
        </span>
        <span className="text-sm text-[var(--coach-ink-secondary)]">
          {active
            ? `Practice tomorrow to make it ${streak + 1}.`
            : "Finish a session to start one."}
        </span>
      </div>
    </div>
  );
}

function GoalRing({ answered, goal }: { answered: number; goal: DailyGoal }) {
  const fill = Math.min(1, answered / goal);
  const met = answered >= goal;
  const remaining = goal - answered;
  return (
    <div className="flex items-center gap-4">
      <svg
        width="84"
        height="84"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`Daily goal: ${answered} of ${goal} cards`}
        className="shrink-0"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="var(--coach-divider)"
          strokeWidth="10"
        />
        {answered > 0 ? (
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="var(--coach-blue)"
            strokeWidth="10"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            strokeDasharray={`${fill * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
          />
        ) : null}
        <text
          x="50"
          y="52"
          textAnchor="middle"
          fontFamily="var(--font-bricolage), sans-serif"
          fontWeight="800"
          fontSize="28"
          fill="var(--coach-ink)"
        >
          {answered}
        </text>
        <text
          x="50"
          y="70"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), monospace"
          fontSize="12"
          fill="var(--coach-ink-muted)"
        >
          /{goal}
        </text>
      </svg>
      <div className="flex flex-col gap-0.5">
        <span className="text-[17px] font-semibold">
          {met ? "Daily goal met" : `${remaining} to go`}
        </span>
        <span className="text-sm leading-[1.45] text-[var(--coach-ink-secondary)]">
          {met
            ? "Anything more today is a bonus."
            : `Answer ${remaining} more ${remaining === 1 ? "card" : "cards"} to hit today's goal.`}
        </span>
      </div>
    </div>
  );
}

export function YourDayCard({
  day,
  onGoalChange,
}: {
  day: CoachHomeModel["day"];
  onGoalChange: (goal: DailyGoal) => void;
}) {
  return (
    <section
      aria-labelledby="status-title"
      className="flex flex-col gap-[18px] rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6"
    >
      <h2
        id="status-title"
        className="m-0 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--coach-ink-muted)]"
      >
        Your day
      </h2>
      <StreakRow streak={day.streak} />
      <div className="h-px bg-[var(--coach-divider)]" />
      <GoalRing answered={day.answeredToday} goal={day.goal} />
      <div
        role="group"
        aria-label="Daily goal"
        className="grid grid-cols-3 gap-1 rounded-xl bg-[var(--coach-well)] p-1"
      >
        {DAILY_GOALS.map(({ value, label }) => {
          const active = value === day.goal;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => onGoalChange(value)}
              className={`h-11 cursor-pointer rounded-[9px] border-0 font-[inherit] text-[13px] ${
                active
                  ? "bg-[var(--coach-segment-active)] font-semibold text-[var(--coach-ink)] shadow-[var(--coach-segment-shadow)]"
                  : "bg-transparent text-[var(--coach-ink-secondary)]"
              }`}
            >
              {label} · {value}
            </button>
          );
        })}
      </div>
    </section>
  );
}
