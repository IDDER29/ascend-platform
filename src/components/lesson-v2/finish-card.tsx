"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { markLessonCompleteAction } from "@/lib/progress/actions";
import { SIGNIN_HREF } from "@/lib/routes";

/** The end of a lesson: mark it done (it counts toward today's goal and your streak), then go on. */
export function FinishCard({
  level,
  slug,
  initiallyComplete,
  signedIn,
  next,
}: {
  level: string;
  slug: string;
  initiallyComplete: boolean;
  signedIn: boolean;
  next: { href: string; label: string; title: string };
}) {
  const [complete, setComplete] = useState(initiallyComplete);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function markComplete() {
    startTransition(async () => {
      const result = await markLessonCompleteAction(level, slug);
      if (!result.ok) return setError(result.error);
      setComplete(true);
      setError(null);
    });
  }

  return (
    <section
      aria-labelledby="finish-title"
      className="flex flex-col gap-4 rounded-[20px] bg-[var(--coach-hero-bg)] p-6 text-[var(--coach-hero-ink)] sm:flex-row sm:items-center sm:justify-between sm:p-7"
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
            complete
              ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]"
              : "border-2 border-[var(--coach-hero-track)]"
          }`}
        >
          <Check size={22} strokeWidth={3} className={complete ? "" : "opacity-40"} />
        </span>
        <div className="min-w-0">
          <h2 id="finish-title" className="m-0 text-[18px] font-bold">
            {complete ? "Lesson done" : "Done with this lesson?"}
          </h2>
          <p className="m-0 mt-0.5 text-[13.5px] text-[var(--coach-hero-muted)]">
            {complete
              ? "It counts toward today's goal and your streak, and its cards join your reviews."
              : signedIn
                ? "Mark it done: it counts toward today's goal and your streak."
                : "Sign in to keep your progress."}
          </p>
          {error && <p className="m-0 mt-1 text-[13px] text-[var(--coach-tint-orange-ink)]">{error}</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {!complete &&
          (signedIn ? (
            <button
              type="button"
              onClick={markComplete}
              disabled={pending}
              className="inline-flex h-11 cursor-pointer items-center rounded-xl border-2 border-[var(--coach-hero-track)] px-4 text-[14px] font-semibold text-[var(--coach-hero-ink)] disabled:opacity-60"
            >
              {pending ? "Saving…" : "Mark done"}
            </button>
          ) : (
            <Link
              href={SIGNIN_HREF}
              className="inline-flex h-11 items-center rounded-xl border-2 border-[var(--coach-hero-track)] px-4 text-[14px] font-semibold text-[var(--coach-hero-ink)] no-underline"
            >
              Sign in
            </Link>
          ))}
        <Link
          href={next.href}
          className="inline-flex h-11 max-w-full items-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14.5px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_4px_0_var(--coach-lime-shadow)]"
        >
          <span className="truncate">
            {next.label}: {next.title}
          </span>
        </Link>
      </div>
    </section>
  );
}
