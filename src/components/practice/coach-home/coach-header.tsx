export function CoachHeader({ dateLabel }: { dateLabel: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--coach-ink-muted)]">
        {dateLabel}
      </span>
      <h1 className="m-0 font-display text-[28px] font-extrabold leading-tight tracking-[-0.032em] sm:text-[32px]">
        Practice
      </h1>
      <p className="m-0 max-w-[560px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
        Mixed recall—choices, flashcards, cloze, and short answers—in one
        shuffled queue. Misses come back on a schedule.
      </p>
    </div>
  );
}
