import Link from "next/link";
import { deckCountLabel } from "@/components/practice/coach-custom/saved-decks";
import type { SavedDeckItem } from "@/lib/practice/coach-custom-model";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";

const MAX_SHOWN = 3;

export function YourDecks({ items }: { items: SavedDeckItem[] }) {
  return (
    <section
      aria-labelledby="your-decks-title"
      className="flex flex-col gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <div className="flex items-baseline justify-between">
        <h2 id="your-decks-title" className="m-0 text-base font-semibold">
          Your decks
        </h2>
        <Link
          href={PRACTICE_ROUTES.custom}
          className="text-[13px] font-semibold text-[var(--coach-ink)] no-underline"
        >
          {items.length > MAX_SHOWN ? `All ${items.length}` : "All decks"}
        </Link>
      </div>
      <ul className="m-0 flex list-none flex-col p-0">
        {items.slice(0, MAX_SHOWN).map(({ deck, summary, href }) => (
          <li
            key={deck.id}
            className="flex items-center gap-3 border-t border-[var(--coach-divider)] py-2.5 first:border-t-0 first:pt-0"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{deck.name}</span>
              <span className="text-[12px] text-[var(--coach-ink-muted)]">{deckCountLabel(summary)}</span>
            </span>
            {href ? (
              <Link
                href={href}
                aria-label={`Start ${deck.name}`}
                className="flex h-8 shrink-0 items-center rounded-lg bg-[var(--coach-lime)] px-3 text-[12.5px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)]"
              >
                Start
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
