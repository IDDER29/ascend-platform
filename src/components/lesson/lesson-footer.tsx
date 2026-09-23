"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { markLessonCompleteAction } from "@/lib/progress/actions";

export function LessonFooter({
  title,
  level,
  slug,
  next,
  initiallyComplete = false,
  signedIn = false,
  streakDays = null,
}: {
  title: string;
  level: string;
  slug: string;
  next: { href: string; title: string } | null;
  initiallyComplete?: boolean;
  signedIn?: boolean;
  streakDays?: number | null;
}) {
  const [complete, setComplete] = useState(initiallyComplete);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onMarkComplete() {
    if (!signedIn) {
      setError("Sign in to save progress across sessions.");
      return;
    }
    startTransition(async () => {
      const result = await markLessonCompleteAction(level, slug);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setComplete(true);
      setError(null);
    });
  }

  return (
    <div className="relative mt-9 overflow-hidden rounded-[20px] bg-brand-gradient px-8 py-8 text-white shadow-[0_18px_40px_rgba(13,159,110,0.22)]">
      <div className="animate-blob absolute -right-5 -top-12 h-[210px] w-[210px] rounded-full bg-white/[0.13] blur-[6px]" />
      <div className="relative flex flex-wrap items-center gap-5">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-white/30 bg-white/20">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="mb-1 font-display text-xl font-extrabold">
            You&apos;ve got {title.toLowerCase()} down.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm opacity-90">
            {complete ? (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-mono font-bold">Saved</span>
            ) : signedIn ? (
              <button
                type="button"
                onClick={onMarkComplete}
                disabled={pending}
                className="rounded-full bg-white/25 px-2.5 py-0.5 font-mono text-[12.5px] font-bold hover:bg-white/35 disabled:opacity-60"
              >
                {pending ? "Saving…" : "Mark complete"}
              </button>
            ) : (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[12.5px] font-semibold">
                Sign in to save progress
              </span>
            )}
            {streakDays != null && streakDays > 0 ? (
              <span>Streak · {streakDays} day{streakDays === 1 ? "" : "s"}</span>
            ) : null}
          </div>
          {error ? <p className="mt-2 text-[13px] text-white/90">{error}</p> : null}
        </div>
        {next ? (
          <Button href={next.href} variant="invert" className="whitespace-nowrap">
            {next.title === "Finish level" || next.title.startsWith("Shellforge")
              ? next.title
              : `Next: ${next.title}`}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        ) : (
          <Button href="/projects/shellforge" variant="invert" className="whitespace-nowrap">
            Continue to Shellforge
          </Button>
        )}
      </div>
    </div>
  );
}
