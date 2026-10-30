"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { setMemory } from "@/lib/practice/deck-memory";
import { mergeSessionHistory, readLocalHistory, type PracticeSessionRecord } from "@/lib/practice/history";
import { completionKey } from "@/lib/practice/session";

const HistoryContext = createContext<PracticeSessionRecord[] | null>(null);

/** Practice history for the lesson rows below: the account's, merged with this browser's. */
export function PracticeHistoryProvider({
  userId,
  initialHistory,
  children,
}: {
  userId: string | null;
  initialHistory: PracticeSessionRecord[];
  children: ReactNode;
}) {
  const [history, setHistory] = useState<PracticeSessionRecord[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    const merged = mergeSessionHistory(readLocalHistory(userId), initialHistory);
    queueMicrotask(() => {
      if (!cancelled) setHistory(merged);
    });
    return () => {
      cancelled = true;
    };
  }, [initialHistory, userId]);
  return <HistoryContext.Provider value={history}>{children}</HistoryContext.Provider>;
}

const cardsOf = (key: string) =>
  PRACTICE_BANK.filter((q) => completionKey(q.lessonLevel, q.lessonSlug) === key).map((q) => q.id);

/** How much of a lesson's Practice cards you'd recall now; nothing until one has been reviewed. */
export function LessonMemory({ lessonKey }: { lessonKey: string }) {
  const history = useContext(HistoryContext);
  if (!history) return null;
  const memory = setMemory(history, cardsOf(lessonKey), new Date());
  if (!memory) return null;
  const pct = Math.round(memory.now * 100);
  const holding = !memory.reviewToday;
  return (
    <span
      title={`You'd recall about ${pct}% of this lesson's Practice cards${holding ? "" : " — some are due"}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold tabular-nums ${
        holding
          ? "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]"
          : "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]"
      }`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {pct}%<span className="sr-only"> remembered</span>
    </span>
  );
}
