"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { YourDayCard } from "@/components/practice/coach-home/your-day-card";
import { savePracticeDailyGoalAction } from "@/lib/practice/actions";
import { readNewDayMeta, syncLocalCards } from "@/lib/practice/cards";
import { buildCoachHomeModel, type CoachHomeModel } from "@/lib/practice/coach-home-model";
import { resolveDailyGoal, writeDailyGoal, type DailyGoal } from "@/lib/practice/daily-goal";
import { mergeSessionHistory, readLocalHistory, type PracticeSessionRecord } from "@/lib/practice/history";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";
import { RevisitCard } from "./revisit-card";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";

export type PracticeTodayProps = {
  userId: string | null;
  completedKeys: string[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
  initialGoal: DailyGoal | null;
};

const CARD = "rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5";

/** Today's Practice, worked out in the browser like the Practice page (guests keep their reviews here). */
export function usePracticeToday({
  userId,
  completedKeys,
  initialCards,
  initialHistory,
  initialGoal,
}: PracticeTodayProps) {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const unlockedIds = useMemo(() => unlockedQuestions(completed).map((q) => q.id), [completed]);
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [model, setModel] = useState<CoachHomeModel | null>(null);

  useEffect(() => {
    let cancelled = false;
    const resolved = goal ?? resolveDailyGoal(userId, initialGoal);
    const next = buildCoachHomeModel({
      cards: syncLocalCards(userId, initialCards, unlockedIds),
      history: mergeSessionHistory(readLocalHistory(userId), initialHistory),
      meta: readNewDayMeta(userId),
      completedKeys: completed,
      goal: resolved,
      now: new Date(),
    });
    queueMicrotask(() => {
      if (!cancelled) setModel(next);
    });
    return () => {
      cancelled = true;
    };
  }, [completed, goal, initialCards, initialGoal, initialHistory, unlockedIds, userId]);

  function changeGoal(next: DailyGoal) {
    writeDailyGoal(userId, next);
    if (userId) void savePracticeDailyGoalAction(next);
    setGoal(next);
  }

  return { model, changeGoal };
}

export function YourDay({
  model,
  onGoalChange,
}: {
  model: CoachHomeModel | null;
  onGoalChange: (g: DailyGoal) => void;
}) {
  if (!model) return <div className={`${CARD} min-h-[260px]`} aria-busy="true" />;
  return <YourDayCard day={model.day} onGoalChange={onGoalChange} />;
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

/** The top of the dashboard: the next lesson beside your day, then Practice and what to revisit. */
export function TodayGrid({ next, practice }: { next: React.ReactNode; practice: PracticeTodayProps }) {
  const { model, changeGoal } = usePracticeToday(practice);
  return (
    <>
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]">
        {next}
        <YourDay model={model} onGoalChange={changeGoal} />
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2">
        <PracticeDueCard model={model} />
        <RevisitCard />
      </div>
    </>
  );
}
