"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CardStrength } from "@/components/practice/coach-home/card-strength";
import { CoachHeader } from "@/components/practice/coach-home/coach-header";
import { CoachHomeSkeleton } from "@/components/practice/coach-home/coach-home-skeleton";
import { DueHero } from "@/components/practice/coach-home/due-hero";
import { FoundationsPathCard } from "@/components/practice/coach-home/foundations-path-card";
import { ModeGrid } from "@/components/practice/coach-home/mode-grid";
import { PracticeDays } from "@/components/practice/coach-home/practice-days";
import { TodaysSessions } from "@/components/practice/coach-home/todays-sessions";
import { YourDayCard } from "@/components/practice/coach-home/your-day-card";
import {
  ensureUnlockedCards,
  migrateMissQueueOnce,
  readCards,
  readNewDayMeta,
  writeCards,
  type NewDayMeta,
} from "@/lib/practice/cards";
import { buildCoachHomeModel } from "@/lib/practice/coach-home-model";
import {
  readDailyGoal,
  writeDailyGoal,
  type DailyGoal,
} from "@/lib/practice/daily-goal";
import {
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";

const MAX_HISTORY = 40;

export type PracticeCoachV2HomeLiveProps = {
  userId: string | null;
  completedKeys: string[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
};

type HomeData = {
  cards: PracticeCard[];
  history: PracticeSessionRecord[];
  meta: NewDayMeta;
  goal: DailyGoal;
  now: Date;
};

function mergeHistory(
  local: PracticeSessionRecord[],
  server: PracticeSessionRecord[],
): PracticeSessionRecord[] {
  const byId = new Map<string, PracticeSessionRecord>();
  for (const session of [...local, ...server]) byId.set(session.id, session);
  return [...byId.values()]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, MAX_HISTORY);
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(target.tagName);
}

export function PracticeCoachV2HomeLive({
  userId,
  completedKeys,
  initialCards,
  initialHistory,
}: PracticeCoachV2HomeLiveProps) {
  const router = useRouter();
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const unlockedIds = useMemo(
    () => unlockedQuestions(completed).map((question) => question.id),
    [completed],
  );

  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (initialCards.length > 0) writeCards(userId, initialCards);
    migrateMissQueueOnce(userId);
    ensureUnlockedCards(userId, unlockedIds);

    const next: HomeData = {
      cards: readCards(userId),
      history: mergeHistory(readLocalHistory(userId), initialHistory),
      meta: readNewDayMeta(userId),
      goal: readDailyGoal(userId),
      now: new Date(),
    };
    queueMicrotask(() => {
      if (!cancelled) setData(next);
    });
    return () => {
      cancelled = true;
    };
  }, [initialCards, initialHistory, unlockedIds, userId]);

  const model = useMemo(
    () =>
      data
        ? buildCoachHomeModel({
            cards: data.cards,
            history: data.history,
            meta: data.meta,
            completedKeys: completed,
            goal: data.goal,
            now: data.now,
          })
        : null,
    [completed, data],
  );

  const primaryHref = model?.hero.action.href;
  useEffect(() => {
    if (!primaryHref) return;
    const href = primaryHref;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      router.push(href);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [primaryHref, router]);

  function changeGoal(goal: DailyGoal) {
    writeDailyGoal(userId, goal);
    setData((current) => (current ? { ...current, goal } : current));
  }

  if (!model) return <CoachHomeSkeleton />;

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-8">
      <CoachHeader dateLabel={model.dateLabel} />

      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]">
        <DueHero hero={model.hero} />
        <YourDayCard day={model.day} onGoalChange={changeGoal} />
      </div>

      <ModeGrid modes={model.modes} />

      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]">
        <div className="flex min-w-0 flex-col gap-5">
          <FoundationsPathCard path={model.path} />
          <TodaysSessions sessions={model.sessions} isGuest={userId === null} />
        </div>
        <aside className="flex min-w-0 flex-col gap-5">
          <CardStrength strength={model.strength} week={model.week} />
          <PracticeDays days={model.days} />
        </aside>
      </div>
    </div>
  );
}
