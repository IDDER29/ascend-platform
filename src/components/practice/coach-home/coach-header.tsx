export function CoachHeader({ dateLabel }: { dateLabel: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-[var(--coach-ink-muted)]">
        {dateLabel}
      </span>
      <h1 className="m-0 font-display text-[40px] font-extrabold leading-none tracking-[-0.03em] sm:text-[56px]">
        Practice
      </h1>
      <p className="m-0 max-w-[640px] text-lg leading-[1.55] text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
        Mixed recall—choices, flashcards, cloze, and short answers—in one
        shuffled queue. Misses come back on a schedule.
      </p>
    </div>
  );
}
