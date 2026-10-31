import type {
  CoachHomeModel,
  PracticeDayCell,
} from "@/lib/practice/coach-home-model";

const SCALE = [
  "bg-[var(--coach-scale-empty)]",
  "bg-[var(--coach-scale-1)]",
  "bg-[var(--coach-scale-2)]",
  "bg-[var(--coach-scale-3)]",
  "bg-[var(--coach-scale-4)]",
] as const;

const WEEKDAY_LABELS = ["M", "", "W", "", "F", "", ""];

function cellTitle(cell: PracticeDayCell): string {
  const date = new Date(`${cell.date}T00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const sessions = `${cell.count} ${cell.count === 1 ? "session" : "sessions"}`;
  return `${cell.today ? "Today" : date} · ${sessions}`;
}

function Cell({ cell }: { cell: PracticeDayCell }) {
  if (cell.future) {
    return (
      <span className="rounded border border-dashed border-[var(--coach-border-strong)]" />
    );
  }
  return (
    <span
      title={cellTitle(cell)}
      className={`rounded ${SCALE[cell.level]} ${
        cell.today
          ? "shadow-[0_0_0_2px_var(--coach-surface),0_0_0_4px_var(--coach-scale-4)]"
          : ""
      }`}
    />
  );
}

function footerLabel(days: CoachHomeModel["days"]): string {
  if (days.practicedDays === 0) return "No practice days yet";
  const word = days.practicedDays === 1 ? "day" : "days";
  return `${days.practicedDays} ${word} practiced${days.practicedToday ? " · today" : ""}`;
}

export function PracticeDays({ days }: { days: CoachHomeModel["days"] }) {
  const { monthLabels } = days;

  return (
    <section
      aria-labelledby="days-title"
      className="flex flex-col gap-3.5 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <div className="flex items-baseline justify-between">
        <h2 id="days-title" className="m-0 text-base font-semibold">
          Practice days
        </h2>
        <span className="text-xs text-[var(--coach-ink-muted)]">Last 12 weeks</span>
      </div>
      <div
        role="img"
        aria-label={`Practiced on ${days.practicedDays} ${
          days.practicedDays === 1 ? "day" : "days"
        } in the last 12 weeks`}
        className="flex flex-col gap-1.5"
      >
        <div className="grid grid-cols-[18px_repeat(12,14px)] gap-x-1 text-[10px] text-[var(--coach-ink-muted)]">
          {monthLabels.map((month, i) => {
            const next = monthLabels[i + 1]?.column ?? 12;
            return (
              <span
                key={`${month.label}-${month.column}`}
                style={{
                  gridColumn: `${month.column + 2} / span ${Math.min(3, next - month.column)}`,
                }}
              >
                {month.label}
              </span>
            );
          })}
        </div>
        <div className="flex gap-1">
          <div className="grid w-[18px] grid-rows-[repeat(7,14px)] gap-y-1 text-[10px] text-[var(--coach-ink-muted)]">
            {WEEKDAY_LABELS.map((label, i) => (
              <span key={i} className="leading-[14px]">
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-[repeat(7,14px)] auto-cols-[14px] gap-1">
            {days.cells.map((cell) => (
              <Cell key={cell.date} cell={cell} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--coach-ink-secondary)]">
        <span>{footerLabel(days)}</span>
        <span className="flex items-center gap-1">
          Less
          {SCALE.map((color) => (
            <span key={color} className={`size-2.5 rounded-[3px] ${color}`} />
          ))}
          More
        </span>
      </div>
    </section>
  );
}
