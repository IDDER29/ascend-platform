"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { readNewDayMeta, syncLocalCards } from "@/lib/practice/cards";
import { practiceCardView } from "@/lib/dashboard/practice-card-model";
import { buildCoachHomeModel, type CoachHomeModel, type DueWeekDay } from "@/lib/practice/coach-home-model";
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
}: PracticeTodayProps): { model: CoachHomeModel | null; history: PracticeSessionRecord[] | null } {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const unlockedIds = useMemo(() => unlockedQuestions(completed).map((q) => q.id), [completed]);
  const [state, setState] = useState<{ model: CoachHomeModel; history: PracticeSessionRecord[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const history = mergeSessionHistory(readLocalHistory(userId), initialHistory);
    const next = buildCoachHomeModel({
      cards: syncLocalCards(userId, initialCards, unlockedIds),
      history,
      meta: readNewDayMeta(userId),
      completedKeys: completed,
      goal: resolveDailyGoal(userId, initialGoal),
      now: new Date(),
      lessonDates: completionDates,
    });
    queueMicrotask(() => {
      if (!cancelled) setState({ model: next, history });
    });
    return () => {
      cancelled = true;
    };
  }, [completed, completionDates, initialCards, initialGoal, initialHistory, unlockedIds, userId]);

  return { model: state?.model ?? null, history: state?.history ?? null };
}

/** Today and the next six days: how many cards come due each day. */
function ComingUp({ week }: { week: DueWeekDay[] }) {
  const max = Math.max(1, ...week.map((d) => d.count));
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12.5px] text-[var(--coach-ink-muted)]">Coming up</span>
      <ol aria-label="Cards due, today and the next six days" className="m-0 grid list-none grid-cols-7 gap-1.5 p-0">
        {week.map((d) => (
          <li key={d.label} title={d.title} className="flex flex-col items-center gap-1">
            <span className="text-[11px] tabular-nums text-[var(--coach-ink-muted)]">{d.count > 0 ? d.count : ""}</span>
            <span className="flex h-10 w-full items-end">
              <span
                className={`w-full rounded-md ${
                  d.isToday
                    ? "bg-[var(--coach-ink)]"
                    : d.count > 0
                      ? "bg-[var(--coach-blue)]"
                      : "bg-[var(--coach-scale-empty)]"
                }`}
                style={{ height: d.count > 0 ? `${Math.max(14, Math.round((d.count / max) * 100))}%` : "4px" }}
              />
            </span>
            <span
              className={`text-[11px] ${d.isToday ? "font-bold text-[var(--coach-ink)]" : "text-[var(--coach-ink-muted)]"}`}
            >
              {d.label}
            </span>
            <span className="sr-only">{d.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Is there a review to do, how long it takes, what's waiting, and what's coming this week. */
function PracticeDueCard({ model }: { model: CoachHomeModel | null }) {
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

      {v.week && <ComingUp week={v.week} />}
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
        <PracticeDueCard model={model} />
        <RevisitCard history={history} lessons={lessons} />
      </div>
    </>
  );
}
