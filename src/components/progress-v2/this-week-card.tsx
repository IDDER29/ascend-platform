import type { ProgressV2Model } from "@/lib/progress/progress-v2-model";

function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[14px] text-[var(--coach-ink-secondary)]">{label}</span>
      <span className="flex items-baseline gap-1.5">
        {note ? <span className="font-mono text-xs text-[var(--coach-ink-muted)]">{note}</span> : null}
        <strong className="font-display text-xl font-extrabold">{value}</strong>
      </span>
    </div>
  );
}

function deltaNote(delta: number | null): string | undefined {
  if (delta === null || delta === 0) return undefined;
  return `${delta > 0 ? "↑" : "↓"}${Math.abs(delta)} vs last week`;
}

export function ThisWeekCard({ week }: { week: ProgressV2Model["week"] }) {
  const quiet = week.lessonsDone === 0 && week.cardsAnswered === 0;
  return (
    <section
      aria-labelledby="week-title"
      className="flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <h2 id="week-title" className="m-0 text-[16px] font-bold">
        This week
      </h2>
      {quiet ? (
        <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
          Nothing yet this week. One lesson or one review session gets it going.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          <Stat label="Lessons done" value={String(week.lessonsDone)} />
          <Stat label="Cards answered" value={String(week.cardsAnswered)} />
          <Stat
            label="Accuracy"
            value={week.accuracy === null ? "None" : `${week.accuracy}%`}
            note={deltaNote(week.accuracyDelta)}
          />
        </div>
      )}
      <div className="h-px bg-[var(--coach-divider)]" />
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            week.streak > 0
              ? "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]"
              : "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-muted)]"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3c1 3 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.3-3.8 2.5-5 0 2 1 3 2 3.2C11 8.5 10.5 6 12 3z" />
          </svg>
        </span>
        <span className="font-display text-lg font-extrabold">
          {week.streak}-day streak
        </span>
      </div>
    </section>
  );
}
