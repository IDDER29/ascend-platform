import Link from "next/link";
import type { CoachCompleteMiss } from "@/lib/practice/coach-complete-model";

function MissRow({ miss, href }: { miss: CoachCompleteMiss; href?: string }) {
  return (
    <li className="flex items-start justify-between gap-3 border-t border-[var(--coach-divider)] py-3">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-mono text-sm">{miss.label}</span>
        {miss.answer || (href && miss.lessonTitle) ? (
          <span className="text-xs leading-normal text-[var(--coach-ink-secondary)]">
            {miss.answer ? (
              <>
                Answer:{" "}
                <span className="font-semibold text-[var(--coach-ink)]">
                  {miss.answer}
                </span>
              </>
            ) : null}
            {miss.answer && href && miss.lessonTitle ? " · " : null}
            {href && miss.lessonTitle ? (
              <Link
                href={href}
                className="text-[var(--coach-ink-secondary)] underline underline-offset-2"
              >
                {miss.lessonTitle}
              </Link>
            ) : null}
          </span>
        ) : null}
      </div>
      <span className="shrink-0 rounded-full bg-[var(--coach-tint-orange-bg)] px-2 py-0.5 text-[11px] font-semibold text-[var(--coach-tint-orange-strong)]">
        Missed
      </span>
    </li>
  );
}

export function ComingBack({
  misses,
  reviewHrefs,
}: {
  misses: CoachCompleteMiss[];
  reviewHrefs: Record<string, string>;
}) {
  return (
    <section
      aria-labelledby="missed-title"
      className="flex flex-col gap-2 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <div className="flex items-baseline justify-between">
        <h2 id="missed-title" className="m-0 text-base font-semibold">
          Coming back
        </h2>
        <span className="text-xs text-[var(--coach-ink-muted)]">
          {misses.length} {misses.length === 1 ? "card" : "cards"}
        </span>
      </div>
      {misses.length === 0 ? (
        <p className="m-0 border-t border-[var(--coach-divider)] pt-3 text-sm text-[var(--coach-ink-secondary)]">
          Nothing to fix: every card was right.
        </p>
      ) : (
        <ul className="m-0 list-none p-0">
          {misses.map((miss) => (
            <MissRow key={miss.id} miss={miss} href={reviewHrefs[miss.id]} />
          ))}
        </ul>
      )}
    </section>
  );
}
