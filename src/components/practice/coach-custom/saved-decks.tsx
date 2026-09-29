"use client";

import Link from "next/link";
import { useState } from "react";
import type { DeckSummary, SavedDeckItem } from "@/lib/practice/coach-custom-model";
import type { SavedDeck } from "@/lib/practice/deck-recipe";

export function deckCountLabel(summary: DeckSummary): string {
  if (summary.total === 0) return "No cards right now";
  const cards = `${summary.total} ${summary.total === 1 ? "card" : "cards"}`;
  return summary.counts.due > 0 ? `${cards} · ${summary.counts.due} due` : cards;
}

export function SavedDecks({
  items,
  editingId,
  deletingId,
  onEdit,
  onDelete,
}: {
  items: SavedDeckItem[];
  editingId: string | null;
  deletingId: string | null;
  onEdit: (deck: SavedDeck) => void;
  onDelete: (deck: SavedDeck) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <section aria-labelledby="saved-decks-title" className="flex flex-col gap-3">
      <h2 id="saved-decks-title" className="m-0 text-base font-semibold">
        Saved decks
      </h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ deck, summary, href }) => {
          const editing = deck.id === editingId;
          const confirming = deck.id === confirmId;
          return (
            <li
              key={deck.id}
              className={`flex min-w-0 flex-col gap-3 rounded-2xl border-2 bg-[var(--coach-surface)] p-4 ${
                editing ? "border-[var(--coach-blue)]" : "border-[var(--coach-border)]"
              }`}
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-[15px] font-semibold">{deck.name}</span>
                <span className="text-[12.5px] text-[var(--coach-ink-muted)]">{deckCountLabel(summary)}</span>
              </div>
              {confirming ? (
                <div className="flex items-center gap-2">
                  <span className="mr-auto text-[13px] text-[var(--coach-ink-secondary)]">Delete this deck?</span>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="h-9 rounded-lg px-2.5 text-[13px] font-semibold text-[var(--coach-ink-secondary)]"
                  >
                    Keep
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === deck.id}
                    onClick={() => onDelete(deck)}
                    className="h-9 rounded-lg bg-[var(--coach-tint-orange-bg)] px-3 text-[13px] font-semibold text-[var(--coach-tint-orange-strong)] disabled:opacity-50"
                  >
                    {deletingId === deck.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {href ? (
                    <Link
                      href={href}
                      className="flex h-9 items-center rounded-lg bg-[var(--coach-lime)] px-3.5 text-[13px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)]"
                    >
                      Start
                    </Link>
                  ) : (
                    <span className="flex h-9 items-center rounded-lg bg-[var(--coach-divider)] px-3.5 text-[13px] font-semibold text-[var(--coach-ink-muted)]">
                      Start
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onEdit(deck)}
                    aria-pressed={editing}
                    className="h-9 rounded-lg px-2.5 text-[13px] font-semibold text-[var(--coach-ink)]"
                  >
                    {editing ? "Editing" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(deck.id)}
                    className="ml-auto h-9 rounded-lg px-2.5 text-[13px] font-semibold text-[var(--coach-ink-muted)] hover:text-[var(--coach-tint-orange-ink)]"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
