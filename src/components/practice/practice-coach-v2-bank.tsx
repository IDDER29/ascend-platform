"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BankFilters,
  EMPTY_BANK_FILTERS,
} from "@/components/practice/coach-bank/bank-filters";
import { BankHeader } from "@/components/practice/coach-bank/bank-header";
import { BankTable } from "@/components/practice/coach-bank/bank-table";
import { SelectionBar } from "@/components/practice/coach-bank/selection-bar";
import { syncLocalCards } from "@/lib/practice/cards";
import {
  buildCoachBankModel,
  filterBankRows,
  type BankFilters as Filters,
  type CoachBankModel,
} from "@/lib/practice/coach-bank-model";
import { COACH_V2_MAX_SIZE } from "@/lib/practice/coach-v2-flow";
import {
  mergeSessionHistory,
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";

type PracticeCoachV2BankProps = {
  userId: string | null;
  completedKeys: string[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
  reviewHrefs: Record<string, string>;
};

function BankSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading card bank" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="h-4 w-32 rounded bg-[var(--coach-divider)]" />
        <span className="h-8 w-48 rounded-lg bg-[var(--coach-divider)]" />
        <span className="h-5 w-full max-w-[460px] rounded bg-[var(--coach-divider)]" />
      </div>
      <span className="h-11 rounded-xl bg-[var(--coach-divider)]" />
      <div className="h-[420px] rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]" />
    </div>
  );
}

export function PracticeCoachV2Bank({
  userId,
  completedKeys,
  initialCards,
  initialHistory,
  reviewHrefs,
}: PracticeCoachV2BankProps) {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const [model, setModel] = useState<CoachBankModel | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_BANK_FILTERS);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const unlockedIds = unlockedQuestions(completed).map((question) => question.id);
    const next = buildCoachBankModel({
      cards: syncLocalCards(userId, initialCards, unlockedIds),
      history: mergeSessionHistory(readLocalHistory(userId), initialHistory),
      completedKeys: completed,
      now: new Date(),
    });
    queueMicrotask(() => {
      if (!cancelled) setModel(next);
    });
    return () => {
      cancelled = true;
    };
  }, [completed, initialCards, initialHistory, userId]);

  const rows = useMemo(
    () => (model ? filterBankRows(model.rows, filters) : []),
    [filters, model],
  );
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const full = selected.length >= COACH_V2_MAX_SIZE;

  if (!model) return <BankSkeleton />;

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((picked) => picked !== id)
        : current.length < COACH_V2_MAX_SIZE
          ? [...current, id]
          : current,
    );

  const toggleShown = () => {
    const shownIds = rows.map((row) => row.id);
    const anyShown = shownIds.some((id) => selectedSet.has(id));
    setSelected((current) => {
      if (anyShown) return current.filter((id) => !shownIds.includes(id));
      const room = COACH_V2_MAX_SIZE - current.length;
      return [...current, ...shownIds.filter((id) => !current.includes(id)).slice(0, room)];
    });
  };

  const sessionHref = `/practicev2/session?scope=all&cards=${selected.join(",")}`;

  return (
    <div className="flex flex-col gap-6">
      <BankHeader total={model.total} dueToday={model.dueToday} />
      <BankFilters model={model} filters={filters} onChange={setFilters} />
      <BankTable
        rows={rows}
        selected={selectedSet}
        full={full}
        reviewHrefs={reviewHrefs}
        onToggle={toggle}
        onToggleAll={toggleShown}
        onClearFilters={() => setFilters(EMPTY_BANK_FILTERS)}
      />
      {selected.length > 0 ? (
        <SelectionBar
          count={selected.length}
          href={sessionHref}
          full={full}
          max={COACH_V2_MAX_SIZE}
          onClear={() => setSelected([])}
        />
      ) : null}
    </div>
  );
}
