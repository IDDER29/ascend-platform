"use client";

import { useEffect, useMemo, useState } from "react";
import { CoachBreadcrumb } from "@/components/practice/coach-breadcrumb";
import { PathFocus } from "@/components/practice/coach-path/path-focus";
import { PathHero } from "@/components/practice/coach-path/path-hero";
import { PathProgress } from "@/components/practice/coach-path/path-progress";
import { PathSection } from "@/components/practice/coach-path/path-section";
import { useEnterShortcut } from "@/components/practice/use-enter-shortcut";
import { readNewDayMeta, syncLocalCards } from "@/lib/practice/cards";
import { buildCoachPathModel } from "@/lib/practice/coach-path-model";
import {
  mergeSessionHistory,
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";

export type PracticeCoachV2PathLiveProps = {
  slug: string;
  title: string;
  userId: string | null;
  completedKeys: string[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
  lessonHrefs: Record<string, string>;
  lessonTitles: Record<string, string>;
};

function PathSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading path" className="flex flex-col gap-8">
      <div className="h-[88px] rounded-3xl bg-[var(--coach-divider)]" />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="h-[460px] rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]" />
        <div className="h-[360px] rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]" />
      </div>
    </div>
  );
}

export function PracticeCoachV2PathLive({
  slug,
  title,
  userId,
  completedKeys,
  initialCards,
  initialHistory,
  lessonHrefs,
  lessonTitles,
}: PracticeCoachV2PathLiveProps) {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const [model, setModel] = useState<ReturnType<typeof buildCoachPathModel>>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const unlockedIds = unlockedQuestions(completed).map((question) => question.id);
    const next = buildCoachPathModel({
      slug,
      cards: syncLocalCards(userId, initialCards, unlockedIds),
      history: mergeSessionHistory(readLocalHistory(userId), initialHistory),
      meta: readNewDayMeta(userId),
      completedKeys: completed,
      lessonHrefs,
      lessonTitles,
      now: new Date(),
    });
    queueMicrotask(() => {
      if (cancelled) return;
      setModel(next);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [completed, initialCards, initialHistory, lessonHrefs, lessonTitles, slug, userId]);

  useEnterShortcut(model?.dueHref ?? undefined);

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-8">
      <CoachBreadcrumb current={title} />
      {!ready || !model ? (
        <PathSkeleton />
      ) : (
        <>
          <PathHero model={model} />
          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="flex min-w-0 flex-col gap-7">
              {model.sections.map((section) => (
                <PathSection key={section.id} section={section} />
              ))}
            </div>
            <aside className="flex min-w-0 flex-col gap-6">
              <PathProgress model={model} />
              {model.focus ? <PathFocus focus={model.focus} /> : null}
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
