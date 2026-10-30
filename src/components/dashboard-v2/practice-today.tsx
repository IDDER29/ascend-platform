"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { readNewDayMeta, syncLocalCards } from "@/lib/practice/cards";
import { practiceCardView } from "@/lib/dashboard/practice-card-model";
import { buildCoachHomeModel, type CoachHomeModel } from "@/lib/practice/coach-home-model";
import { deckMemory } from "@/lib/practice/deck-memory";
import { resolveDailyGoal, type DailyGoal } from "@/lib/practice/daily-goal";
import { mergeSessionHistory, readLocalHistory, type PracticeSessionRecord } from "@/lib/practice/history";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";
import { MemoryCurveChart } from "./memory-curve-chart";
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
}: PracticeTodayProps): {
  model: CoachHomeModel | null;
  history: PracticeSessionRecord[] | null;
  cards: PracticeCard[];
} {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const unlockedIds = useMemo(() => unlockedQuestions(completed).map((q) => q.id), [completed]);
  const [state, setState] = useState<{
    model: CoachHomeModel;
    history: PracticeSessionRecord[];
    cards: PracticeCard[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const history = mergeSessionHistory(readLocalHistory(userId), initialHistory);
    const cards = syncLocalCards(userId, initialCards, unlockedIds);
    const next = buildCoachHomeModel({
      cards,
      history,
      meta: readNewDayMeta(userId),
      completedKeys: completed,
      goal: resolveDailyGoal(userId, initialGoal),
      now: new Date(),
      lessonDates: completionDates,
    });
    queueMicrotask(() => {
      if (!cancelled) setState({ model: next, history, cards });
    });
    return () => {
      cancelled = true;
    };
  }, [completed, completionDates, initialCards, initialGoal, initialHistory, unlockedIds, userId]);

  return { model: state?.model ?? null, history: state?.history ?? null, cards: state?.cards ?? [] };
}

/** How much of your cards you'd recall, today and over the next weeks. Hidden until a card has been reviewed. */
function YourMemory({ history }: { history: PracticeSessionRecord[] | null }) {
  const memory = history ? deckMemory(history, new Date()) : null;
  if (!memory) return null;
  const now = Math.round(memory.now * 100);
  const nextDue = memory.nextDue
    ? new Date(memory.nextDue.at).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    : null;
  return (
    <div className="flex flex-col gap-3 border-t-2 border-[var(--coach-divider)] pt-4">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-[15px] font-bold">{memory.reviewToday ? "Review today" : "No review needed today"}</p>
        <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
          You still remember about <span className="font-semibold text-[var(--coach-ink)]">{now}%</span> of your{" "}
          {memory.cards} {memory.cards === 1 ? "card" : "cards"}.{" "}
          {memory.reviewToday ? (
            <>
              {memory.dueNow} {memory.dueNow === 1 ? "has" : "have"} dropped below 90%; reviewing today brings you back
              to about{" "}
              <span className="font-semibold text-[var(--coach-ink)]">{Math.round(memory.afterReview * 100)}%</span>.
            </>
          ) : (
            <>Everything is above 90%{nextDue ? `; the next card comes due ${nextDue}` : ""}.</>
          )}
        </p>
      </div>
      <MemoryCurveChart memory={memory} />
      <p className="m-0 text-[12px] leading-snug text-[var(--coach-ink-muted)]">
        An estimate from your reviews, not a test.{" "}
        <Link href={PRACTICE_ROUTES.bank} className="underline underline-offset-2">
          See each card&apos;s own curve
        </Link>
      </p>
    </div>
  );
}

/** Is there a review to do, how long it takes, what's waiting, and what's coming this week. */
function PracticeDueCard({
  model,
  history,
}: {
  model: CoachHomeModel | null;
  history: PracticeSessionRecord[] | null;
}) {
  if (!model) return <div className={`${CARD} min-h-[148px]`} aria-busy="true" />;
  const v = practiceCardView(model, model.sessions.rows.length > 0);
  return (
    <section aria-labelledby="practice-title" className={`${CARD} flex flex-col gap-4`}>
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

      <div className="flex flex-col gap-1">
        <p className="m-0 font-display text-[24px] font-extrabold leading-tight tracking-[-0.02em]">{v.headline}</p>
        {v.size && <p className="m-0 text-[15px] font-semibold text-[var(--coach-ink)]">{v.size}</p>}
        {v.detail && <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">{v.detail}</p>}
      </div>

      {v.primary && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href={v.primary.href}
            className={`inline-flex h-11 items-center rounded-xl px-5 text-[14.5px] font-bold no-underline ${
              v.state === "due"
                ? "bg-[var(--coach-solid-btn-bg)] text-[var(--coach-solid-btn-ink)] shadow-[0_4px_0_var(--coach-solid-btn-shadow)]"
                : "border-2 border-[var(--coach-border)] text-[var(--coach-ink)] hover:border-[var(--coach-border-strong)]"
            }`}
          >
            {v.primary.label}
          </Link>
          {v.last && <span className="text-[13px] text-[var(--coach-ink-muted)]">{v.last}</span>}
        </div>
      )}

      {v.state !== "locked" && <YourMemory history={history} />}
    </section>
  );
}

/** The top of the dashboard: the next lesson beside today's checklist, then Practice and what to revisit. */
export function TodayGrid({
  next,
  practice,
  lessonsDone,
  nextLessons,
  lessons,
}: {
  next: ReactNode;
  practice: PracticeTodayProps;
  lessonsDone: { title: string; at: string }[];
  nextLessons: { title: string; href: string }[];
  /** Every lesson, for naming the ones Practice shows you missing. */
  lessons: { key: string; title: string; href: string }[];
}) {
  const { model, history } = usePracticeToday(practice);
  return (
    <>
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,310px)]">
        {next}
        <TodayCard model={model} lessonsDone={lessonsDone} nextLessons={nextLessons} />
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2">
        <PracticeDueCard model={model} history={history} />
        <RevisitCard history={history} lessons={lessons} />
      </div>
    </>
  );
}
