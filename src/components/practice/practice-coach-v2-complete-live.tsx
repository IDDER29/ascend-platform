"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ComingBack } from "@/components/practice/coach-complete/coming-back";
import { CompleteActions } from "@/components/practice/coach-complete/complete-actions";
import { CompleteHeader } from "@/components/practice/coach-complete/complete-header";
import { CompleteSkeleton } from "@/components/practice/coach-complete/complete-skeleton";
import { ResultBar } from "@/components/practice/coach-complete/result-bar";
import { StatTiles } from "@/components/practice/coach-complete/stat-tiles";
import { StrengthCard } from "@/components/practice/coach-complete/strength-card";
import { useEnterShortcut } from "@/components/practice/use-enter-shortcut";
import { buildCoachCompleteModel } from "@/lib/practice/coach-complete-model";
import { findCoachV2SessionRecord } from "@/lib/practice/coach-v2-flow";
import { resolveDailyGoal, type DailyGoal } from "@/lib/practice/daily-goal";
import {
  mergeSessionHistory,
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";

export type PracticeCoachV2CompleteLiveProps = {
  userId: string | null;
  reviewHrefs: Record<string, string>;
  initialHistory: PracticeSessionRecord[];
  sessionId: string | null;
  initialGoal: DailyGoal | null;
};

type CompleteData = {
  history: PracticeSessionRecord[];
  goal: DailyGoal;
  now: Date;
};

function NoSession() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-8 text-center">
      <h1 className="m-0 font-display text-2xl font-extrabold tracking-[-0.02em]">
        No session yet
      </h1>
      <p className="m-0 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
        Finish a review to see your results here.
      </p>
      <Link
        href="/practicev2"
        className="mt-2 flex h-11 items-center justify-center rounded-xl border-2 border-[var(--coach-border-strong)] px-5 text-sm font-semibold text-[var(--coach-ink)] no-underline"
      >
        Back to practice
      </Link>
    </section>
  );
}

export function PracticeCoachV2CompleteLive({
  userId,
  reviewHrefs,
  initialHistory,
  sessionId,
  initialGoal,
}: PracticeCoachV2CompleteLiveProps) {
  const [data, setData] = useState<CompleteData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const next: CompleteData = {
      history: mergeSessionHistory(readLocalHistory(userId), initialHistory),
      goal: resolveDailyGoal(userId, initialGoal),
      now: new Date(),
    };
    queueMicrotask(() => {
      if (!cancelled) setData(next);
    });
    return () => {
      cancelled = true;
    };
  }, [initialGoal, initialHistory, userId]);

  const model = useMemo(() => {
    if (!data) return null;
    const record = findCoachV2SessionRecord(data.history, sessionId);
    if (!record) return null;
    return buildCoachCompleteModel({
      record,
      history: data.history,
      goal: data.goal,
      now: data.now,
    });
  }, [data, sessionId]);

  useEnterShortcut(model?.primary.href);

  if (!data) return <CompleteSkeleton />;
  if (!model) return <NoSession />;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-6">
        <CompleteHeader summary={model.summary} />
        <ResultBar results={model.results} />
        <StatTiles model={model} />
        <StrengthCard strength={model.strength} />
      </div>
      <aside className="flex min-w-0 flex-col gap-4">
        <ComingBack misses={model.misses} reviewHrefs={reviewHrefs} />
        <CompleteActions primary={model.primary} secondary={model.secondary} />
      </aside>
    </div>
  );
}
