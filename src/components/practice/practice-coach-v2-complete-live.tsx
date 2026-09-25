"use client";

import Link from "next/link";
import { Check, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { findCoachV2SessionRecord } from "@/lib/practice/coach-v2-flow";
import {
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";

const questionsById = new Map(
  PRACTICE_BANK.map((question) => [question.id, question] as const),
);

export type PracticeCoachV2CompleteLiveProps = {
  userId: string | null;
  reviewHrefs: Record<string, string>;
  initialHistory: PracticeSessionRecord[];
  sessionId: string | null;
};

function mergeHistory(
  local: PracticeSessionRecord[],
  server: PracticeSessionRecord[],
): PracticeSessionRecord[] {
  const byId = new Map<string, PracticeSessionRecord>();
  for (const session of [...local, ...server]) {
    byId.set(session.id, session);
  }
  return [...byId.values()]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 40);
}

export function PracticeCoachV2CompleteLive({
  userId,
  reviewHrefs,
  initialHistory,
  sessionId,
}: PracticeCoachV2CompleteLiveProps) {
  const [history, setHistory] = useState(initialHistory);
  const [historyReady, setHistoryReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const local = readLocalHistory(userId);
    queueMicrotask(() => {
      if (cancelled) return;
      setHistory((server) => mergeHistory(local, server));
      setHistoryReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const record = useMemo(
    () => findCoachV2SessionRecord(history, sessionId),
    [history, sessionId],
  );

  if (!historyReady) {
    return (
      <div
        className="min-h-[360px] rounded-3xl border border-card-border bg-elevated"
        aria-label="Loading session results"
      />
    );
  }

  if (!record) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-card-border bg-elevated p-8 text-center shadow-sm sm:p-12">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
          No session yet
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">
          Finish a review to see your results here.
        </p>
        <Button href="/practicev2" size="lg" className="mt-7">
          Back to Practice
        </Button>
      </section>
    );
  }

  const missSet = new Set(record.missIds);
  const missCount = record.missIds.length;
  const missedQuestions = record.missIds
    .map((id) => {
      const question = questionsById.get(id);
      const href = reviewHrefs[id];
      return question && href ? { id, label: question.reviewLabel, href } : null;
    })
    .filter((row): row is { id: string; label: string; href: string } =>
      Boolean(row),
    );

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div className="min-w-0">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-lg">
            <Check aria-hidden="true" className="size-12" strokeWidth={2.8} />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-violet">
              {record.scopeLabel}
            </p>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.032em] text-ink sm:text-5xl">
              Review complete
            </h1>
            <p className="mt-3 text-lg text-ink-secondary">
              <strong className="font-semibold text-ink">
                {record.correct} of {record.total} right.
              </strong>{" "}
              {missCount > 0
                ? `The ${missCount} you missed ${missCount === 1 ? "is" : "are"} already scheduled to come back.`
                : "You’re caught up for now."}
            </p>
          </div>
        </div>

        <section className="mt-10" aria-labelledby="results-title">
          <div className="flex items-end justify-between gap-4">
            <h2
              id="results-title"
              className="font-display text-xl font-extrabold text-ink"
            >
              Session results
            </h2>
            <span className="font-mono text-xs text-ink-fainter">
              {record.total} {record.total === 1 ? "question" : "questions"}
            </span>
          </div>
          <ol
            className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8"
            aria-label={`${record.correct} correct and ${missCount} missed`}
          >
            {record.questionIds.map((questionId, index) => {
              const missed = missSet.has(questionId);
              return (
                <li
                  key={`${questionId}-${index}`}
                  className={`flex h-14 items-center justify-center rounded-2xl border ${
                    missed
                      ? "border-streak-border bg-streak-bg text-streak-text"
                      : "border-xp-border bg-xp-bg text-xp-text"
                  }`}
                  title={`Question ${index + 1}: ${missed ? "missed" : "correct"}`}
                >
                  {missed ? (
                    <X aria-hidden="true" className="size-5" strokeWidth={2.5} />
                  ) : (
                    <Check
                      aria-hidden="true"
                      className="size-5"
                      strokeWidth={2.5}
                    />
                  )}
                  <span className="sr-only">
                    Question {index + 1}: {missed ? "missed" : "correct"}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <aside className="min-w-0">
        <section
          className="rounded-3xl border border-card-border bg-elevated p-6 shadow-sm"
          aria-labelledby="coming-back-title"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="coming-back-title"
              className="font-display text-xl font-extrabold text-ink"
            >
              Coming back
            </h2>
            <span className="font-mono text-xs text-ink-fainter">
              {missCount} {missCount === 1 ? "miss" : "misses"}
            </span>
          </div>

          {missedQuestions.length > 0 ? (
            <ul className="mt-4 divide-y divide-card-border">
              {missedQuestions.map((question) => (
                <li key={question.id} className="py-4 first:pt-2 last:pb-1">
                  <Link
                    href={question.href}
                    className="group flex min-w-0 items-start gap-3 rounded-lg text-[15px] font-semibold text-ink outline-none transition-colors hover:text-brand-violet focus-visible:ring-2 focus-visible:ring-brand-violet/40"
                  >
                    <RotateCcw
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-brand-violet"
                    />
                    <span className="min-w-0">{question.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-secondary">
              Nothing is waiting for another pass.
            </p>
          )}
        </section>

        <div className="mt-5 flex flex-col gap-3">
          <Button
            href={missCount > 0 ? "/practicev2/session?scope=due" : "/practicev2"}
            size="xl"
            className="w-full"
          >
            {missCount > 0
              ? `Fix ${missCount} ${missCount === 1 ? "miss" : "misses"} now`
              : "Continue Practice"}
          </Button>
          <Button
            href="/practicev2"
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Back to Practice
          </Button>
        </div>
      </aside>
    </div>
  );
}
