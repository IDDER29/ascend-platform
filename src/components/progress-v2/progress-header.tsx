export function ProgressHeader({ dateLabel }: { dateLabel: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--coach-ink-muted)]">
        {dateLabel} · Last 12 weeks
      </span>
      <h1 className="m-0 font-display text-[28px] font-extrabold leading-tight tracking-[-0.032em] sm:text-[32px]">
        Progress
      </h1>
      <p className="m-0 max-w-[560px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
        What you&apos;ve learned, and how much of it is sticking.
      </p>
    </div>
  );
}
