"use client";

import { useEffect, useMemo, useState } from "react";
import { CardStrength } from "@/components/practice/coach-home/card-strength";
import { MemoryCard } from "@/components/practice/coach-home/memory-card";
import { CoachHeader } from "@/components/practice/coach-home/coach-header";
import { CoachHomeSkeleton } from "@/components/practice/coach-home/coach-home-skeleton";
import { DueHero } from "@/components/practice/coach-home/due-hero";
import { PathCard } from "@/components/practice/coach-home/path-card";
import { ModeGrid } from "@/components/practice/coach-home/mode-grid";
import { PracticeDays } from "@/components/practice/coach-home/practice-days";
import { TodaysSessions } from "@/components/practice/coach-home/todays-sessions";
import { YourDayCard } from "@/components/practice/coach-home/your-day-card";
import { useEnterShortcut } from "@/components/practice/use-enter-shortcut";
import {
  readNewDayMeta,
  syncLocalCards,
  type NewDayMeta,
} from "@/lib/practice/cards";
import { YourDecks } from "@/components/practice/coach-home/your-decks";
import { buildCoachBankModel } from "@/lib/practice/coach-bank-model";
import { deckSessionHref, savedDeckItems } from "@/lib/practice/coach-custom-model";
import { shakyCards } from "@/lib/practice/shaky";
import { buildCoachHomeModel } from "@/lib/practice/coach-home-model";
import type { SavedDeck } from "@/lib/practice/deck-recipe";
import { resolveDailyGoal, type DailyGoal } from "@/lib/practice/daily-goal";
import {
  mergeSessionHistory,
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";

export type PracticeCoachV2HomeLiveProps = {
  userId: string | null;
  completedKeys: string[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
  initialDecks: SavedDeck[];
  initialGoal: DailyGoal | null;
  /** When each lesson was finished: lessons count toward the streak. */
  completionDates?: string[];
};

type HomeData = {
  cards: PracticeCard[];
  history: PracticeSessionRecord[];
  meta: NewDayMeta;
  goal: DailyGoal;
  now: Date;
};

export function PracticeCoachV2HomeLive({
  userId,
  completedKeys,
  initialCards,
  initialHistory,
  initialDecks,
  initialGoal,
  completionDates,
}: PracticeCoachV2HomeLiveProps) {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const unlockedIds = useMemo(
    () => unlockedQuestions(completed).map((question) => question.id),
    [completed],
  );

  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const next: HomeData = {
      cards: syncLocalCards(userId, initialCards, unlockedIds),
      history: mergeSessionHistory(readLocalHistory(userId), initialHistory),
      meta: readNewDayMeta(userId),
      goal: resolveDailyGoal(userId, initialGoal),
      now: new Date(),
    };
    queueMicrotask(() => {
      if (!cancelled) setData(next);
    });
    return () => {
      cancelled = true;
    };
  }, [initialCards, initialGoal, initialHistory, unlockedIds, userId]);

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
            lessonDates: completionDates,
          })
        : null,
    [completed, completionDates, data],
  );

  const deckItems = useMemo(() => {
    if (!data || initialDecks.length === 0) return [];
    const rows = buildCoachBankModel({
      cards: data.cards,
      history: data.history,
      completedKeys: completed,
      now: data.now,
    }).rows;
    return savedDeckItems(rows, initialDecks);
  }, [completed, data, initialDecks]);

  // Right but slow, or right just after a miss: their own mode once there are some.
  const shaky = useMemo(() => {
    if (!data) return null;
    const ids = shakyCards(data.history).map((c) => c.id);
    return ids.length > 0
      ? { count: ids.length, href: deckSessionHref(ids.slice(0, 30), "Right, but shaky") }
      : null;
  }, [data]);

  useEnterShortcut(model?.hero.action.href);


  if (!model) return <CoachHomeSkeleton />;

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-8">
      <CoachHeader />

      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]">
        <DueHero hero={model.hero} />
        <YourDayCard day={model.day} />
      </div>

      <ModeGrid modes={model.modes} shaky={shaky} />

      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]">
        <div className="flex min-w-0 flex-col gap-5">
          {model.paths.map((path) => (
            <PathCard key={path.slug} path={path} />
          ))}
          <TodaysSessions sessions={model.sessions} isGuest={userId === null} />
        </div>
        <aside className="flex min-w-0 flex-col gap-5">
          {data ? <MemoryCard history={data.history} /> : null}
          <CardStrength strength={model.strength} />
          {deckItems.length > 0 ? <YourDecks items={deckItems} /> : null}
          <PracticeDays days={model.days} />
        </aside>
      </div>
    </div>
  );
}
