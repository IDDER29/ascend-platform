"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SaveButton } from "@/components/bookmarks/save-button";
import { cardTarget } from "@/lib/bookmarks/model";
import { cardMemory, type CardMemory } from "@/lib/practice/card-memory";
import { deckSessionHref } from "@/lib/practice/coach-custom-model";
import { mergeSessionHistory, readLocalHistory, type PracticeSessionRecord } from "@/lib/practice/history";
import type { PracticeItem } from "@/lib/practice/types";
import { CardMemoryChart } from "./card-memory-chart";

const CARD = "rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6";

function holds(stability: number): string {
  if (stability < 1) return "less than a day";
  return stability === 1 ? "1 day" : `${stability} days`;
}

function date(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** One card: the question, its answer behind a reveal, and its memory over time. */
export function CardMemoryLive({
  question,
  prompt,
  answer,
  kindLabel,
  lesson,
  unlocked,
  userId,
  initialHistory,
}: {
  question: PracticeItem;
  prompt: string;
  answer: string;
  kindLabel: string;
  lesson: { title: string; href: string };
  unlocked: boolean;
  userId: string | null;
  initialHistory: PracticeSessionRecord[];
}) {
  const [memory, setMemory] = useState<CardMemory | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const next = cardMemory(question.id, mergeSessionHistory(readLocalHistory(userId), initialHistory), new Date());
    queueMicrotask(() => {
      if (!cancelled) setMemory(next);
    });
    return () => {
      cancelled = true;
    };
  }, [initialHistory, question.id, userId]);

  const reviews = memory?.reviews ?? [];
  const last = reviews[reviews.length - 1];
  const right = reviews.filter((r) => r.correct).length;

  return (
    <div className="flex flex-col gap-6">
      <section className={`${CARD} flex flex-col gap-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 flex flex-wrap items-center gap-2 text-[13px] text-[var(--coach-ink-muted)]">
            <span className="rounded-full bg-[var(--coach-tint-blue-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--coach-tint-blue-ink)]">
              {kindLabel}
            </span>
            {question.reviewLabel}
          </p>
          <SaveButton target={cardTarget(question)} look="coach" label="Save card" />
        </div>
        <h1 className="m-0 font-display text-[24px] font-bold leading-[1.25] tracking-[-0.01em] [text-wrap:pretty] sm:text-[28px]">
          {prompt}
        </h1>
        {shown ? (
          <p className="m-0 rounded-xl bg-[var(--coach-well)] px-4 py-3 text-[15px] leading-relaxed">
            <span className="font-semibold">Answer: </span>
            {answer}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setShown(true)}
            className="w-fit rounded-xl border-2 border-dashed border-[var(--coach-border-strong)] px-4 py-2.5 text-[14px] font-semibold text-[var(--coach-ink-secondary)]"
          >
            Try to recall it, then show the answer
          </button>
        )}
        <div className="flex flex-wrap gap-2.5">
          {unlocked && (
            <Link
              href={deckSessionHref([question.id], "This card")}
              className="inline-flex h-11 items-center rounded-xl bg-[var(--coach-solid-btn-bg)] px-5 text-[14.5px] font-bold text-[var(--coach-solid-btn-ink)] no-underline"
            >
              Review this card
            </Link>
          )}
          <Link
            href={lesson.href}
            className="inline-flex h-11 items-center rounded-xl border-2 border-[var(--coach-border)] px-5 text-[14.5px] font-semibold text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)]"
          >
            {unlocked ? "Reread the lesson" : `Finish ${lesson.title} to unlock it`}
          </Link>
        </div>
      </section>

      <section aria-labelledby="memory-title" className={`${CARD} flex flex-col gap-4`}>
        <div className="flex flex-col gap-1">
          <h2 id="memory-title" className="m-0 text-[18px] font-bold">
            Your memory of this card
          </h2>
          {memory === null ? null : reviews.length === 0 ? (
            <p className="m-0 text-[14.5px] text-[var(--coach-ink-secondary)]">
              You haven&apos;t reviewed it yet. Its curve starts with your first review.
            </p>
          ) : (
            <p className="m-0 text-[14.5px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
              Reviewed {reviews.length} {reviews.length === 1 ? "time" : "times"}, right {right}. It now holds for{" "}
              <span className="font-semibold text-[var(--coach-ink)]">{holds(last.stability)}</span>
              {memory.now !== null && (
                <>
                  , and you&apos;d recall it about{" "}
                  <span className="font-semibold text-[var(--coach-ink)]">{Math.round(memory.now * 100)}%</span> today
                </>
              )}
              .{memory.due && ` Next review ${memory.due.day <= memory.today ? "is due now" : date(memory.due.at)}.`}
            </p>
          )}
        </div>

        {memory && reviews.length > 0 && <CardMemoryChart memory={memory} />}

        <p className="m-0 text-[13px] leading-relaxed text-[var(--coach-ink-muted)]">
          Each right answer makes the memory last longer, so reviews can get further apart; a miss makes it fragile
          again. Estimated from your reviews, not measured.{" "}
          <Link href="/dashboardv2" className="underline underline-offset-2">
            Your whole deck
          </Link>
        </p>

        {reviews.length > 0 && (
          <ol aria-label="Reviews" className="m-0 flex list-none flex-col gap-0 p-0">
            {[...reviews].reverse().map((r, i) => (
              <li
                key={r.at}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 border-t-2 border-[var(--coach-divider)] py-2.5 text-[14px] first:border-t-0"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className={`size-2.5 ${r.correct ? "rounded-full bg-[var(--coach-chart-kept)]" : "bg-[var(--coach-chart-stopped)]"}`}
                  />
                  <span className="font-semibold">{r.correct ? "Right" : "Missed"}</span>
                  <span className="whitespace-nowrap text-[var(--coach-ink-muted)]">{date(r.at)}</span>
                  {i === reviews.length - 1 && <span className="text-[var(--coach-ink-muted)]">· first time</span>}
                </span>
                <span className="text-[13px] text-[var(--coach-ink-secondary)]">
                  Then held for {holds(r.stability)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
