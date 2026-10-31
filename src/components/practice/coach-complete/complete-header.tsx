export function CompleteHeader({ summary }: { summary: string }) {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <div aria-hidden="true" className="relative size-14 shrink-0 sm:size-16">
        <div className="absolute inset-0 -rotate-8 rounded-[18px] bg-[var(--coach-blue)]" />
        <div className="absolute inset-0 flex items-center justify-center rounded-[18px] bg-[var(--coach-mark-bg)] text-[var(--coach-mark-ink)]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l5 5 9-10" />
          </svg>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="m-0 font-display text-[28px] font-extrabold leading-tight tracking-[-0.032em] sm:text-[32px]">
          Review complete
        </h1>
        <p className="m-0 max-w-[560px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
          {summary}
        </p>
      </div>
    </div>
  );
}
