import type { CoachCompleteModel } from "@/lib/practice/coach-complete-model";

function cards(n: number): string {
  return `${n} ${n === 1 ? "card" : "cards"}`;
}

export function StrengthCard({
  strength,
}: {
  strength: CoachCompleteModel["strength"];
}) {
  return (
    <section
      aria-labelledby="moved-title"
      className="flex flex-col gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <h2 id="moved-title" className="m-0 text-base font-semibold">
        Card strength after this review
      </h2>
      <div className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2.5 rounded-xl bg-[var(--coach-tint-blue-bg)] p-3 text-[var(--coach-ink)]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--coach-tint-blue-ink)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <span>
            <strong className="font-semibold">{cards(strength.movedUp)}</strong> moved up
          </span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-[var(--coach-tint-orange-bg)] p-3 text-[var(--coach-ink)]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--coach-tint-orange-strong)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>
            <strong className="font-semibold">{cards(strength.backToLearning)}</strong>{" "}
            back to Learning
          </span>
        </div>
      </div>
    </section>
  );
}
