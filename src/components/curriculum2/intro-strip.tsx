import { Button } from "@/components/ui/button";
import type { Curriculum2IntroProps } from "./types";

export function IntroStrip({
  continueHref,
  continueTitle,
  contextLine,
  ctaLabel,
  pathPct,
  streakCurrent,
}: Curriculum2IntroProps) {
  const metaParts: string[] = [];
  if (pathPct !== null) metaParts.push(`${pathPct}% of path`);
  if (streakCurrent !== null && streakCurrent > 0) {
    metaParts.push(`${streakCurrent} day streak`);
  }

  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[28px] font-extrabold tracking-[-0.032em] text-ink sm:text-[32px]">
          The path to the machine
        </h1>
        <p className="mt-1.5 max-w-[560px] text-[15px] leading-relaxed text-ink-secondary">
          {contextLine}
        </p>
        {metaParts.length > 0 ? (
          <p className="mt-2 font-mono text-[11px] tracking-wide text-ink-fainter">
            {metaParts.join(" · ")}
          </p>
        ) : null}
      </div>
      <div className="flex w-full flex-col items-stretch gap-1 sm:w-auto sm:items-end">
        <Button href={continueHref} variant="primary" size="md" className="w-full sm:w-auto">
          {ctaLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
        <span className="truncate text-center text-[12px] text-ink-fainter sm:text-right">
          {continueTitle}
        </span>
      </div>
    </header>
  );
}
