"use client";

import Link from "next/link";
import { useState } from "react";
import type { DeckSummary } from "@/lib/practice/coach-custom-model";
import { COACH_V2_MAX_SIZE } from "@/lib/practice/coach-v2-flow";
import {
  DECK_NAME_MAX,
  type DeckFilter,
  type DeckFormat,
  type SavedDeck,
} from "@/lib/practice/deck-recipe";
import { SIGNIN_HREF } from "@/lib/routes";

const FILTERS: { value: DeckFilter; label: string }[] = [
  { value: "all", label: "All cards" },
  { value: "weak", label: "Weak only" },
  { value: "due", label: "Due only" },
];

function startLabel(summary: DeckSummary, lessonCount: number): string {
  if (lessonCount === 0) return "Pick at least one lesson";
  if (summary.total === 0) return "No cards match";
  if (summary.total > COACH_V2_MAX_SIZE) return `Start ${COACH_V2_MAX_SIZE} of ${summary.total}`;
  return `Start ${summary.total} ${summary.total === 1 ? "card" : "cards"}`;
}

export type DeckSaveState = { status: "idle" | "saving" | "saved" | "error"; message?: string };

export function DeckPanel({
  summary,
  filter,
  formats,
  startHref,
  isGuest,
  editingDeck,
  defaultName,
  saveState,
  onFilter,
  onToggleFormat,
  onSave,
  onNewDeck,
}: {
  summary: DeckSummary;
  filter: DeckFilter;
  formats: Set<DeckFormat>;
  startHref: string | null;
  isGuest: boolean;
  editingDeck: SavedDeck | null;
  defaultName: string;
  saveState: DeckSaveState;
  onFilter: (filter: DeckFilter) => void;
  onToggleFormat: (format: DeckFormat) => void;
  onSave: (name: string) => void;
  onNewDeck: () => void;
}) {
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState(editingDeck?.name ?? "");
  const lessonCount = summary.lessonTitles.length;
  const canSave = lessonCount > 0 && formats.size > 0;
  const label = startLabel(summary, lessonCount);

  function openNaming() {
    setName(editingDeck?.name ?? defaultName);
    setNaming(true);
  }

  return (
    <section
      aria-labelledby="deck-title"
      className="flex flex-col gap-5 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 lg:sticky lg:top-6"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="deck-title" className="m-0 text-base font-semibold">
            {editingDeck ? editingDeck.name : "Your deck"}
          </h2>
          {editingDeck ? (
            <button
              type="button"
              onClick={onNewDeck}
              className="shrink-0 text-[13px] font-semibold text-[var(--coach-ink-secondary)] underline decoration-[var(--coach-border-strong)] underline-offset-4"
            >
              New deck
            </button>
          ) : null}
        </div>
        <p className="m-0 font-display text-[34px] leading-tight font-extrabold tracking-[-0.03em]">
          {summary.total}
          <span className="ml-2 font-sans text-[15px] font-medium tracking-normal text-[var(--coach-ink-secondary)]">
            {summary.total === 1 ? "card" : "cards"}
          </span>
        </p>
        <p className="m-0 line-clamp-2 text-[13px] text-[var(--coach-ink-muted)]">
          {lessonCount === 0
            ? "No lessons picked yet"
            : `From ${lessonCount} ${lessonCount === 1 ? "lesson" : "lessons"} · ${summary.lessonTitles.join(", ")}`}
        </p>
      </div>

      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 p-0 text-[13px] font-semibold">Which cards</legend>
        <div role="radiogroup" aria-label="Which cards" className="grid grid-cols-3 gap-0.5 rounded-xl bg-[var(--coach-well)] p-1">
          {FILTERS.map((option) => {
            const active = filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onFilter(option.value)}
                className={`flex h-12 min-w-0 flex-col items-center justify-center rounded-lg px-1 text-[12.5px] font-semibold ${
                  active
                    ? "bg-[var(--coach-segment-active)] text-[var(--coach-ink)] shadow-[var(--coach-segment-shadow)]"
                    : "text-[var(--coach-ink-secondary)] hover:text-[var(--coach-ink)]"
                }`}
              >
                {option.label}
                <span className="font-mono text-[11px] font-medium text-[var(--coach-ink-muted)]">
                  {summary.counts[option.value]}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {summary.formats.length > 0 ? (
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 p-0 text-[13px] font-semibold">Formats</legend>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {summary.formats.map((format) => (
              <label key={format.value} className="flex h-9 cursor-pointer items-center gap-2 text-[13.5px]">
                <input
                  type="checkbox"
                  checked={formats.has(format.value)}
                  onChange={() => onToggleFormat(format.value)}
                  className="size-4 shrink-0 cursor-pointer accent-[var(--coach-blue)]"
                />
                <span className="min-w-0 truncate">{format.label}</span>
                <span className="ml-auto font-mono text-[11px] text-[var(--coach-ink-muted)]">{format.count}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-col gap-3">
        {startHref ? (
          <Link
            href={startHref}
            className="flex h-11 items-center justify-center gap-2.5 rounded-xl bg-[var(--coach-lime)] px-5 text-[14.5px] font-bold tracking-[0.02em] text-[var(--coach-lime-ink)] uppercase no-underline shadow-[0_4px_0_var(--coach-lime-shadow)]"
          >
            {label}
            <kbd className="hidden h-[22px] items-center rounded-md border border-b-2 border-[var(--coach-lime-shadow)] bg-[var(--coach-lime-soft)] px-1.5 font-mono text-[11px] font-medium tracking-normal normal-case sm:inline-flex">
              Enter
            </kbd>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="flex h-11 items-center justify-center rounded-xl bg-[var(--coach-divider)] px-5 text-[14px] font-semibold text-[var(--coach-ink-muted)]"
          >
            {label}
          </span>
        )}

        {isGuest ? (
          <Link
            href={SIGNIN_HREF}
            className="flex h-11 items-center justify-center rounded-xl border-2 border-[var(--coach-border-strong)] text-sm font-semibold text-[var(--coach-ink)] no-underline"
          >
            Sign in to save decks
          </Link>
        ) : naming ? (
          <form
            className="flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSave(name);
            }}
          >
            <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
              Deck name
              <input
                autoFocus
                value={name}
                maxLength={DECK_NAME_MAX}
                onChange={(event) => setName(event.target.value)}
                className="h-11 rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-3 text-sm font-normal text-[var(--coach-ink)] outline-none focus-visible:border-[var(--coach-focus)]"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!canSave || name.trim() === "" || saveState.status === "saving"}
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] text-sm font-semibold text-[var(--coach-hero-ink)] disabled:opacity-50"
              >
                {saveState.status === "saving" ? "Saving…" : editingDeck ? "Save changes" : "Save deck"}
              </button>
              <button
                type="button"
                onClick={() => setNaming(false)}
                className="h-11 rounded-xl px-3 text-sm font-semibold text-[var(--coach-ink-secondary)]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            disabled={!canSave}
            onClick={openNaming}
            className="flex h-11 items-center justify-center rounded-xl border-2 border-[var(--coach-border-strong)] text-sm font-semibold text-[var(--coach-ink)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {editingDeck ? "Save changes" : "Save as a deck"}
          </button>
        )}

        {saveState.message ? (
          <p
            role={saveState.status === "error" ? "alert" : "status"}
            className={`m-0 text-[13px] ${
              saveState.status === "error" ? "text-[var(--coach-tint-orange-ink)]" : "text-[var(--coach-success)]"
            }`}
          >
            {saveState.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
