import Link from "next/link";
import type { CoachPathModel } from "@/lib/practice/coach-path-model";

function count(n: number, word: string, plural = `${word}s`): string {
  return `${n} ${n === 1 ? word : plural}`;
}

export function PathHero({ model }: { model: CoachPathModel }) {
  return (
    <div className="flex flex-col items-stretch gap-6 xl:flex-row xl:items-end xl:justify-between xl:gap-8">
      <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-6">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-[18px] bg-[var(--coach-mark-bg)] font-display text-[34px] font-extrabold text-[var(--coach-mark-ink)] sm:size-[88px] sm:rounded-3xl sm:text-[44px]">
          {model.mark}
        </span>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="m-0 font-display text-4xl font-extrabold leading-none tracking-[-0.03em] sm:text-5xl">
              {model.title}
            </h1>
            {model.alwaysOpen ? (
              <span className="whitespace-nowrap rounded-full bg-[var(--coach-tint-blue-bg)] px-2.5 py-1 text-[13px] font-semibold text-[var(--coach-tint-blue-ink)]">
                Always open
              </span>
            ) : null}
          </div>
          {model.blurb ? (
            <p className="m-0 text-[17px] text-[var(--coach-ink-secondary)]">{model.blurb}</p>
          ) : null}
          <span className="font-mono text-[13px] text-[var(--coach-ink-muted)]">
            {count(model.sectionCount, "branch", "branches")} · {count(model.lessonCount, "lesson")} ·{" "}
            {count(model.cardCount, "card")}
            {model.alwaysOpen ? "" : ` · ${model.unlockedCount} unlocked`}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        <Link
          href={model.customHref}
          className="flex h-14 flex-auto items-center justify-center rounded-2xl border-2 border-[var(--coach-ink)] px-5 text-[15px] font-semibold text-[var(--coach-ink)] no-underline"
        >
          Build a custom deck
        </Link>
        {model.dueHref ? (
          <Link
            href={model.dueHref}
            className="flex h-14 flex-auto items-center justify-center rounded-2xl bg-[var(--coach-lime)] px-6 text-base font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_5px_0_var(--coach-lime-shadow)]"
          >
            Review {count(model.dueNow, "due card")}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
