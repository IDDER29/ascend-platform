import Link from "next/link";
import { MemoryCurveChart } from "@/components/dashboard-v2/memory-curve-chart";
import { deckMemory } from "@/lib/practice/deck-memory";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";

/** Your memory of the cards you've reviewed: since your last review, today, and review-today vs skip. */
export function MemoryCard({ history }: { history: PracticeSessionRecord[] }) {
  const memory = deckMemory(history, new Date());
  if (!memory) return null;
  return (
    <section
      aria-labelledby="memory-curve-title"
      className="flex flex-col gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="memory-curve-title" className="m-0 text-base font-semibold">
          Your memory
        </h2>
        <span className="text-xs text-[var(--coach-ink-muted)]">
          {memory.cards} {memory.cards === 1 ? "card" : "cards"}
        </span>
      </div>
      <p className="m-0 text-[13.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
        About <span className="font-semibold text-[var(--coach-ink)]">{Math.round(memory.now * 100)}%</span> now
        {memory.reviewToday
          ? `; reviewing today brings it to about ${Math.round(memory.afterReview * 100)}%.`
          : " — nothing below 90%."}
      </p>
      <MemoryCurveChart memory={memory} />
      <Link
        href={PRACTICE_ROUTES.bank}
        className="text-[12.5px] text-[var(--coach-ink-muted)] underline underline-offset-2 hover:text-[var(--coach-ink)]"
      >
        Each card&apos;s own curve
      </Link>
    </section>
  );
}
