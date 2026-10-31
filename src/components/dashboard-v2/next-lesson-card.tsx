import Link from "next/link";
import type { NextStep } from "@/lib/dashboard/today-model";

const BUTTON: Record<NextStep["kind"], string> = {
  start: "Start lesson",
  continue: "Continue lesson",
  capstone: "Open ShellForge",
};

/** The one thing to do next: the next open lesson, or the capstone once every lesson is done. */
export function NextLessonCard({ next }: { next: NextStep }) {
  const step = next.topicStep;
  return (
    <section
      aria-labelledby="next-title"
      className="flex min-w-0 flex-col gap-4 rounded-[20px] bg-[var(--coach-hero-bg)] px-6 py-6 text-[var(--coach-hero-ink)] sm:px-8 sm:py-7"
    >
      <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--coach-hero-muted)]">
        <span className="rounded-full bg-[var(--coach-lime)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--coach-lime-ink)]">
          {next.kind === "capstone" ? "Capstone" : "Next lesson"}
        </span>
        {next.path && <span className="font-semibold text-[var(--coach-hero-ink)]">{next.path}</span>}
        {step && next.topic && (
          <span>
            {next.topic}, lesson {step.index} of {step.total}
          </span>
        )}
        {next.timeMin && <span>{next.timeMin} min</span>}
      </p>

      <div className="flex flex-col gap-2">
        <h2
          id="next-title"
          className="m-0 font-display text-[28px] font-extrabold leading-[1.1] tracking-[-0.025em] [text-wrap:balance] sm:text-[32px]"
        >
          {next.title}
        </h2>
        {next.blurb && (
          <p className="m-0 max-w-[58ch] text-[15px] leading-relaxed text-[var(--coach-hero-muted)] [text-wrap:pretty]">
            {next.blurb}
          </p>
        )}
      </div>

      {step && (
        <div
          role="img"
          aria-label={`${step.done} of ${step.total} lessons done in ${next.topic}`}
          className="flex max-w-[420px] gap-1.5"
        >
          {Array.from({ length: step.total }, (_, i) => (
            <span
              key={i}
              className={`h-2 grow rounded-full ${
                i < step.done
                  ? "bg-[var(--coach-lime)]"
                  : i === step.index - 1
                    ? "bg-[var(--coach-hero-ink)]"
                    : "bg-[var(--coach-hero-track)]"
              }`}
            />
          ))}
        </div>
      )}

      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Link
          href={next.href}
          className="flex h-12 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-lime)] px-6 text-[15px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_4px_0_var(--coach-lime-shadow)] transition-transform active:translate-y-0.5 active:shadow-none"
        >
          {BUTTON[next.kind]}
        </Link>
        {next.then.length > 0 && (
          <div className="min-w-0 text-[13px] leading-relaxed text-[var(--coach-hero-muted)]">
            <span>Then </span>
            {next.then.map((l, i) => (
              <span key={l.href}>
                <Link href={l.href} className="text-[var(--coach-hero-ink)] underline-offset-2 hover:underline">
                  {l.title}
                </Link>
                {i < next.then.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
