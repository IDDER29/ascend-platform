import Link from "next/link";
import type { BadgeView } from "@/lib/achievements/achievements-model";
import { badgeAnchor, Medallion } from "./medallion";
import { ProgressBar } from "./progress-bar";

/** The few badges you're nearest, each with exactly the next condition to meet. */
export function Closest({ badges }: { badges: BadgeView[] }) {
  if (badges.length === 0) return null;
  return (
    <section aria-labelledby="closest-title" className="flex min-w-0 flex-col gap-3">
      <h2 id="closest-title" className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">
        Closest
      </h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
        {badges.map((b, i) => {
          const step = b.criteria.find((c) => !c.done)!;
          return (
            <li key={b.id} className="flex min-w-0 flex-col gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5">
              <a href={`#${badgeAnchor(b.id)}`} className="flex items-center gap-3 text-[var(--coach-ink)] no-underline hover:underline">
                <Medallion glyph={b.glyph} earned={false} size="sm" />
                <span className="text-[16px] font-semibold">{b.label}</span>
              </a>
              <div className="flex flex-col gap-1.5">
                <span className="text-[13.5px] leading-snug text-[var(--coach-ink-secondary)]">
                  Next: {step.text.charAt(0).toLowerCase() + step.text.slice(1)}
                </span>
                {step.progress ? (
                  <>
                    <ProgressBar done={step.progress.done} total={step.progress.total} />
                    <span className="text-[12.5px] font-semibold text-[var(--coach-blue)]">
                      {step.progress.done} of {step.progress.total}
                    </span>
                  </>
                ) : null}
              </div>
              {b.action ? (
                <Link
                  href={b.action.href}
                  className={`mt-auto inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-center text-[13.5px] font-bold no-underline ${
                    i === 0
                      ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)]"
                      : "bg-[var(--coach-solid-btn-bg)] text-[var(--coach-solid-btn-ink)] shadow-[0_3px_0_var(--coach-solid-btn-shadow)]"
                  }`}
                >
                  {b.action.label}
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
