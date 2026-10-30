import Link from "next/link";
import type { ReviewOption } from "@/lib/dashboard/review-options";

const CARD = "flex flex-col gap-3 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5";

/** The review options worth doing now, each with how much is waiting. */
export function ReviewOptionsCard({ options }: { options: ReviewOption[] | null }) {
  if (!options) return <div className={`${CARD} min-h-[148px]`} aria-busy="true" />;
  return (
    <section aria-labelledby="ways-title" className={CARD}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="ways-title" className="m-0 text-[16px] font-bold">
          Ways to review
        </h2>
        <span className="text-[12.5px] text-[var(--coach-ink-muted)]">Every one counts toward your goal</span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {options.map((o) => (
          <li key={o.id}>
            <Link
              href={o.href}
              className="flex items-start justify-between gap-3 rounded-2xl border-2 border-[var(--coach-border)] px-4 py-3 text-[var(--coach-ink)] no-underline transition-colors hover:border-[var(--coach-border-strong)]"
            >
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold leading-snug">{o.title}</span>
                <span className="block text-[13px] leading-snug text-[var(--coach-ink-muted)]">{o.detail}</span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-semibold tabular-nums ${
                  o.waiting
                    ? "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]"
                    : "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-muted)]"
                }`}
              >
                {o.badge}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
