"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { readNewDayMeta, syncLocalCards } from "@/lib/practice/cards";
import { buildCoachHomeModel, type CoachHomeModel } from "@/lib/practice/coach-home-model";
import { resolveDailyGoal, type DailyGoal } from "@/lib/practice/daily-goal";
import { mergeSessionHistory, readLocalHistory, type PracticeSessionRecord } from "@/lib/practice/history";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";
import { RevisitCard } from "./revisit-card";
import { TodayCard } from "./today-card";

export type PracticeTodayProps = {
  userId: string | null;
  completedKeys: string[];
  /** When each lesson was finished: lessons count toward the streak. */
  completionDates: string[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
  initialGoal: DailyGoal | null;
};

const CARD = "rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5";

/** Today's Practice, worked out in the browser like the Practice page (guests keep their reviews here). */
function usePracticeToday({
  userId,
  completedKeys,
  completionDates,
  initialCards,
  initialHistory,
  initialGoal,
}: PracticeTodayProps): CoachHomeModel | null {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const unlockedIds = useMemo(() => unlockedQuestions(completed).map((q) => q.id), [completed]);
  const [model, setModel] = useState<CoachHomeModel | null>(null);

  useEffect(() => {
    let cancelled = false;
    const next = buildCoachHomeModel({
      cards: syncLocalCards(userId, initialCards, unlockedIds),
      history: mergeSessionHistory(readLocalHistory(userId), initialHistory),
      meta: readNewDayMeta(userId),
      completedKeys: completed,
      goal: resolveDailyGoal(userId, initialGoal),
      now: new Date(),
      lessonDates: completionDates,
    });
    queueMicrotask(() => {
      if (!cancelled) setModel(next);
    });
    return () => {
      cancelled = true;
    };
  }, [completed, completionDates, initialCards, initialGoal, initialHistory, unlockedIds, userId]);

  return model;
}

/** Cards due now, one press from a review. */
export function PracticeDueCard({ model }: { model: CoachHomeModel | null }) {
  if (!model) return <div className={`${CARD} min-h-[148px]`} aria-busy="true" />;
  const { hero } = model;
  const due = hero.action.mode === "due";
  const locked = hero.action.mode === "continue";
  return (
    <section aria-labelledby="practice-title" className={`${CARD} flex flex-col gap-3`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="practice-title" className="m-0 text-[16px] font-bold">
          Practice
        </h2>
        <Link
          href={PRACTICE_ROUTES.home}
          className="text-[13px] text-[var(--coach-ink-muted)] underline-offset-2 hover:underline"
        >
          Open Practice
        </Link>
      </div>
      <p className="m-0 font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
        {due ? `${hero.dueNow} ${hero.dueNow === 1 ? "card" : "cards"} due` : locked ? "No cards yet" : "All caught up"}
      </p>
      <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
        {due
          ? hero.dueNow > hero.sessionSize
            ? `One review takes ${hero.sessionSize}. The other ${hero.dueNow - hero.sessionSize} wait for the next.`
            : "One review clears them."
          : locked
            ? "Finish a lesson and its cards show up here for review."
            : hero.nextReviewLabel
              ? `Next card comes due ${hero.nextReviewLabel}.`
              : "Nothing due right now."}
      </p>
      {!locked && (
        <Link
          href={hero.action.href}
          className={`mt-1 inline-flex h-11 w-fit items-center rounded-xl px-5 text-[14.5px] font-bold no-underline ${
            due
              ? "bg-[var(--coach-solid-btn-bg)] text-[var(--coach-solid-btn-ink)] shadow-[0_4px_0_var(--coach-solid-btn-shadow)]"
              : "border-2 border-[var(--coach-border)] text-[var(--coach-ink)] hover:border-[var(--coach-border-strong)]"
          }`}
        >
          {due ? `Review ${hero.sessionSize}` : "Free study"}
        </Link>
      )}
    </section>
  );
}

/** The top of the dashboard: the next lesson beside today's checklist, then Practice and what to revisit. */
export function TodayGrid({
  next,
  practice,
  lessonsDone,
  nextLessons,
}: {
  next: ReactNode;
  practice: PracticeTodayProps;
  lessonsDone: { title: string; at: string }[];
  nextLessons: { title: string; href: string }[];
}) {
  const model = usePracticeToday(practice);
  return (
    <>
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,310px)]">
        {next}
        <TodayCard model={model} lessonsDone={lessonsDone} nextLessons={nextLessons} />
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2">
        <PracticeDueCard model={model} />
        <RevisitCard />
      </div>
    </>
  );
}
