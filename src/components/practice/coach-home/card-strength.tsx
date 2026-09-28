import Link from "next/link";
import type { CoachHomeModel } from "@/lib/practice/coach-home-model";

const BAR_MAX_PX = 72;

const LEVELS = [
  { key: "new", label: "New", color: "bg-[var(--coach-scale-1)]" },
  { key: "learning", label: "Learning", color: "bg-[var(--coach-scale-2)]" },
  { key: "solid", label: "Solid", color: "bg-[var(--coach-scale-3)]" },
  { key: "mastered", label: "Mastered", color: "bg-[var(--coach-scale-4)]" },
] as const;

function cards(n: number): string {
  return `${n} ${n === 1 ? "card" : "cards"}`;
}

function DueThisWeek({ week }: { week: CoachHomeModel["week"] }) {
  const total = week.reduce((sum, day) => sum + day.count, 0);
  const max = Math.max(0, ...week.map((day) => day.count));
  const summary = week.map((day) => `${day.label} ${day.count}`).join(", ");

  return (
    <>
      <div className="flex items-baseline justify-between">
        <h3 className="m-0 text-[15px] font-semibold">Due this week</h3>
        <span className="text-[13px] text-[var(--coach-ink-muted)]">{cards(total)}</span>
      </div>
      <div role="img" aria-label={`Cards due: ${summary}`} className="flex flex-col gap-1.5">
        <div className="grid h-[92px] grid-cols-7 items-end gap-2 border-b border-[var(--coach-border)]">
          {week.map((day) => (
            <span key={day.label} title={day.title} className="flex flex-col items-center gap-1">
              {day.count > 0 ? (
                <>
                  <span className="font-mono text-xs">{day.count}</span>
                  <span
                    className={`w-6 rounded-t ${
                      day.isToday ? "bg-[var(--coach-scale-4)]" : "bg-[var(--coach-scale-2)]"
                    }`}
                    style={{ height: Math.max(4, Math.round((day.count / max) * BAR_MAX_PX)) }}
                  />
                </>
              ) : null}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-[var(--coach-ink-muted)]">
          {week.map((day) => (
            <span
              key={day.label}
              className={day.isToday ? "font-semibold text-[var(--coach-ink)]" : undefined}
            >
              {day.label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export function CardStrength({
  strength,
  week,
}: {
  strength: CoachHomeModel["strength"];
  week: CoachHomeModel["week"];
}) {
  const label = LEVELS.map((l) => `${l.label} ${strength[l.key]}`).join(", ");

  return (
    <section
      aria-labelledby="memory-title"
      className="flex flex-col gap-[18px] rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6"
    >
      <div className="flex items-baseline justify-between">
        <h2 id="memory-title" className="m-0 text-lg font-semibold">
          Card strength
        </h2>
        <span className="text-[13px] text-[var(--coach-ink-muted)]">
          {strength.total} in your bank
        </span>
      </div>
      <div
        role="img"
        aria-label={label}
        className="flex h-4 gap-0.5 overflow-hidden rounded bg-[var(--coach-scale-empty)]"
      >
        {LEVELS.filter((l) => strength[l.key] > 0).map((l) => (
          <span
            key={l.key}
            title={`${l.label} · ${cards(strength[l.key])}`}
            className={l.color}
            style={{ flex: `${strength[l.key]} 1 0` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
        {LEVELS.map((l) => (
          <span key={l.key} className="flex items-center gap-2">
            <span className={`size-2.5 rounded-[3px] ${l.color}`} />
            {l.label}
            <strong className="ml-auto font-mono font-medium">{strength[l.key]}</strong>
          </span>
        ))}
      </div>
      <div className="h-px bg-[var(--coach-divider)]" />
      <DueThisWeek week={week} />
      <Link
        href="/practicev2/bank"
        className="flex h-11 items-center gap-1.5 text-sm font-semibold text-[var(--coach-ink)] no-underline"
      >
        {strength.total > 0 ? `Browse all ${strength.total} cards` : "Browse the card bank"}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}
