"use client";

import { useEffect, useMemo, useState } from "react";
import { PracticeDays } from "@/components/practice/coach-home/practice-days";
import { syncLocalCards } from "@/lib/practice/cards";
import {
  mergeSessionHistory,
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";
import {
  buildProgressV2Model,
  type ProgressLesson,
  type ProgressV2Model,
} from "@/lib/progress/progress-v2-model";
import { ConceptMap } from "./concept-map";
import { HereHero } from "./here-hero";
import { LearnedRemembered } from "./learned-remembered";
import { MilestonesCard } from "./milestones-card";
import { MomentumCard } from "./momentum-card";
import { ProgressHeader } from "./progress-header";
import { SlippingCard } from "./slipping-card";
import { ThisWeekCard } from "./this-week-card";

export type ProgressV2LiveProps = {
  userId: string | null;
  lessons: ProgressLesson[];
  completions: { key: string; completedAt: string }[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
  serverStreak: number | null;
};

function ProgressSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading progress" className="flex flex-col gap-5">
      <div className="h-[92px] w-64 rounded-xl bg-[var(--coach-divider)]" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]">
        <div className="h-[260px] rounded-[20px] bg-[var(--coach-divider)]" />
        <div className="h-[260px] rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]" />
      </div>
      <div className="h-[300px] rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]" />
    </div>
  );
}

const TWO_COLUMNS =
  "grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]";

export function ProgressV2Live({
  userId,
  lessons,
  completions,
  initialCards,
  initialHistory,
  serverStreak,
}: ProgressV2LiveProps) {
  const completed = useMemo(() => new Set(completions.map((c) => c.key)), [completions]);
  const [model, setModel] = useState<ProgressV2Model | null>(null);

  useEffect(() => {
    let cancelled = false;
    const unlockedIds = unlockedQuestions(completed).map((question) => question.id);
    const next = buildProgressV2Model({
      lessons,
      completions,
      cards: syncLocalCards(userId, initialCards, unlockedIds),
      history: mergeSessionHistory(readLocalHistory(userId), initialHistory),
      serverStreak,
      now: new Date(),
    });
    queueMicrotask(() => {
      if (!cancelled) setModel(next);
    });
    return () => {
      cancelled = true;
    };
  }, [completed, completions, initialCards, initialHistory, lessons, serverStreak, userId]);

  if (!model) return <ProgressSkeleton />;

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-8">
      <ProgressHeader dateLabel={model.dateLabel} />

      <div className={`${TWO_COLUMNS} lg:items-stretch`}>
        <HereHero model={model} />
        <ThisWeekCard week={model.week} />
      </div>

      <LearnedRemembered levels={model.levels} />

      <div className={TWO_COLUMNS}>
        <div className="order-2 min-w-0 lg:order-1">
          <ConceptMap concepts={model.concepts} />
        </div>
        <div className="order-1 min-w-0 lg:order-2">
          <SlippingCard slipping={model.slipping} started={model.started} />
        </div>
      </div>

      <div className={TWO_COLUMNS}>
        <MomentumCard momentum={model.momentum} />
        <aside className="flex min-w-0 flex-col gap-5">
          <MilestonesCard milestones={model.milestones} />
          <PracticeDays days={model.days} />
        </aside>
      </div>
    </div>
  );
}
