import Link from "next/link";
import { LessonMemory } from "@/components/paths-v2/lesson-memory";
import { practiceCardHref } from "@/lib/practice/routes";

/** This lesson's Practice cards: reviewing them over the next days is what makes it stick. */
export function LockItIn({
  lessonKey,
  cardIds,
  canReview,
  reviewHref,
}: {
  lessonKey: string;
  cardIds: string[];
  /** Its cards are unlocked (the lesson is done, or it's always open). */
  canReview: boolean;
  reviewHref: string;
}) {
  if (cardIds.length === 0) return null;
  const n = cardIds.length;
  return (
    <section
      aria-labelledby="lock-title"
      className="flex flex-col gap-3 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="lock-title" className="m-0 text-[18px] font-bold">
          Lock it in
        </h2>
        <LessonMemory lessonKey={lessonKey} />
      </div>
      <p className="m-0 text-[14.5px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
        {canReview
          ? `This lesson has ${n} Practice ${n === 1 ? "card" : "cards"}. Recalling them over the next days, not rereading, is what makes it stick; Practice brings each one back just before you'd forget it.`
          : `This lesson has ${n} Practice ${n === 1 ? "card" : "cards"}. Mark the lesson done and they join your reviews, coming back just before you'd forget them.`}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {canReview && (
          <Link
            href={reviewHref}
            className="inline-flex h-10 items-center rounded-xl bg-[var(--coach-solid-btn-bg)] px-4 text-[14px] font-bold text-[var(--coach-solid-btn-ink)] no-underline"
          >
            Review its {n} {n === 1 ? "card" : "cards"}
          </Link>
        )}
        <Link
          href={practiceCardHref(cardIds[0])}
          className="text-[13.5px] text-[var(--coach-ink-muted)] underline underline-offset-2 hover:text-[var(--coach-ink)]"
        >
          See a card&apos;s memory curve
        </Link>
      </div>
    </section>
  );
}
