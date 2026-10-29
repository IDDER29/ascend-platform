"use client";

import { useEffect, useMemo, useState } from "react";
import { CoachBreadcrumb } from "@/components/practice/coach-breadcrumb";
import { DeckPanel, type DeckSaveState } from "@/components/practice/coach-custom/deck-panel";
import { LessonPicker } from "@/components/practice/coach-custom/lesson-picker";
import { SavedDecks } from "@/components/practice/coach-custom/saved-decks";
import { useEnterShortcut } from "@/components/practice/use-enter-shortcut";
import { deletePracticeDeckAction, savePracticeDeckAction } from "@/lib/practice/actions";
import { syncLocalCards } from "@/lib/practice/cards";
import { buildCoachBankModel, type BankRow } from "@/lib/practice/coach-bank-model";
import {
  buildCustomLessons,
  deckSessionHref,
  defaultDeckName,
  quickPickKeys,
  savedDeckItems,
  summarizeDeck,
  type QuickPick,
} from "@/lib/practice/coach-custom-model";
import {
  DECK_FORMATS,
  type DeckFilter,
  type DeckFormat,
  type SavedDeck,
} from "@/lib/practice/deck-recipe";
import {
  mergeSessionHistory,
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";

type PracticeCoachV2CustomProps = {
  userId: string | null;
  completedKeys: string[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
  initialDecks: SavedDeck[];
  initialLessonKeys?: string[];
};

const IDLE: DeckSaveState = { status: "idle" };

function CustomSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading lessons"
      className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]"
    >
      <div className="h-[520px] rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]" />
      <div className="h-[420px] rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]" />
    </div>
  );
}

export function PracticeCoachV2Custom({
  userId,
  completedKeys,
  initialCards,
  initialHistory,
  initialDecks,
  initialLessonKeys = [],
}: PracticeCoachV2CustomProps) {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const [rows, setRows] = useState<BankRow[] | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(initialLessonKeys);
  const [filter, setFilter] = useState<DeckFilter>("all");
  const [formats, setFormats] = useState<DeckFormat[]>(DECK_FORMATS);
  const [decks, setDecks] = useState<SavedDeck[]>(initialDecks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<DeckSaveState>(IDLE);
  const [saveVersion, setSaveVersion] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const unlockedIds = unlockedQuestions(completed).map((question) => question.id);
    const next = buildCoachBankModel({
      cards: syncLocalCards(userId, initialCards, unlockedIds),
      history: mergeSessionHistory(readLocalHistory(userId), initialHistory),
      completedKeys: completed,
      now: new Date(),
    }).rows;
    queueMicrotask(() => {
      if (!cancelled) setRows(next);
    });
    return () => {
      cancelled = true;
    };
  }, [completed, initialCards, initialHistory, userId]);

  const paths = useMemo(() => (rows ? buildCustomLessons(rows) : []), [rows]);
  const quickPickCounts = useMemo(
    () => ({
      "needs-work": quickPickKeys(paths, "needs-work").length,
      due: quickPickKeys(paths, "due").length,
      "not-started": quickPickKeys(paths, "not-started").length,
    }),
    [paths],
  );
  const summary = useMemo(
    () => summarizeDeck(rows ?? [], { lessonKeys: selectedKeys, filter, formats }),
    [filter, formats, rows, selectedKeys],
  );
  const deckItems = useMemo(() => savedDeckItems(rows ?? [], decks), [decks, rows]);
  const editingDeck = decks.find((deck) => deck.id === editingId) ?? null;
  const startHref =
    summary.total > 0
      ? deckSessionHref(summary.pickedIds, editingDeck?.name ?? "Custom deck")
      : null;

  useEnterShortcut(startHref);

  if (!rows) {
    return (
      <div className="flex flex-col gap-8">
        <CustomHeader />
        <CustomSkeleton />
      </div>
    );
  }

  const selected = new Set(selectedKeys);

  function toggleLesson(key: string) {
    setSelectedKeys((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
    );
  }

  function setMany(keys: string[], on: boolean) {
    setSelectedKeys((current) =>
      on
        ? [...current, ...keys.filter((key) => !current.includes(key))]
        : current.filter((key) => !keys.includes(key)),
    );
  }

  function quickPick(pick: QuickPick) {
    setSelectedKeys(quickPickKeys(paths, pick));
  }

  function toggleFormat(format: DeckFormat) {
    setFormats((current) =>
      current.includes(format) ? current.filter((f) => f !== format) : [...current, format],
    );
  }

  function loadDeck(deck: SavedDeck | null) {
    setEditingId(deck?.id ?? null);
    setSelectedKeys(deck?.lessonKeys ?? []);
    setFilter(deck?.filter ?? "all");
    setFormats(deck?.formats ?? DECK_FORMATS);
    setSaveState(IDLE);
  }

  async function saveDeck(name: string) {
    setSaveState({ status: "saving" });
    const result = await savePracticeDeckAction({
      id: editingId ?? undefined,
      name,
      lessonKeys: selectedKeys,
      filter,
      formats,
    });
    if (!result.ok) {
      setSaveState({ status: "error", message: result.error });
      return;
    }
    setDecks((current) => [result.deck, ...current.filter((deck) => deck.id !== result.deck.id)]);
    setEditingId(result.deck.id);
    setSaveVersion((v) => v + 1);
    setSaveState({ status: "saved", message: `Saved “${result.deck.name}”.` });
  }

  async function deleteDeck(deck: SavedDeck) {
    setDeletingId(deck.id);
    const result = await deletePracticeDeckAction(deck.id);
    setDeletingId(null);
    if (!result.ok) {
      setSaveState({ status: "error", message: result.error });
      return;
    }
    setDecks((current) => current.filter((d) => d.id !== deck.id));
    if (deck.id === editingId) loadDeck(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <CustomHeader />
      {deckItems.length > 0 ? (
        <SavedDecks
          items={deckItems}
          editingId={editingId}
          deletingId={deletingId}
          onEdit={loadDeck}
          onDelete={deleteDeck}
        />
      ) : null}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <LessonPicker
          paths={paths}
          selected={selected}
          quickPickCounts={quickPickCounts}
          onToggle={toggleLesson}
          onSetMany={setMany}
          onQuickPick={quickPick}
        />
        <DeckPanel
          key={`${editingId ?? "new"}-${saveVersion}`}
          summary={summary}
          filter={filter}
          formats={new Set(formats)}
          startHref={startHref}
          isGuest={userId === null}
          editingDeck={editingDeck}
          defaultName={defaultDeckName(summary.lessonTitles)}
          saveState={saveState}
          onFilter={setFilter}
          onToggleFormat={toggleFormat}
          onSave={saveDeck}
          onNewDeck={() => loadDeck(null)}
        />
      </div>
    </div>
  );
}

function CustomHeader() {
  return (
    <div className="flex flex-col gap-3">
      <CoachBreadcrumb current="Custom deck" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="m-0 font-display text-[28px] leading-tight font-extrabold tracking-[-0.032em] sm:text-[32px]">
          Build a custom deck
        </h1>
        <p className="m-0 max-w-[560px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
          Pick the lessons you want to drill. Answers still count toward your schedule and daily goal.
        </p>
      </div>
    </div>
  );
}
