"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Code2, ExternalLink, Layers, Pilcrow, Search, SquareStack } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  buildBookmarksView,
  KINDS,
  REASONS,
  type Bookmark,
  type BookmarkKind,
  type BookmarkReason,
} from "@/lib/bookmarks/model";
import { updateBookmark, useBookmarks } from "@/lib/bookmarks/use-bookmarks";
import { deckSessionHref } from "@/lib/practice/coach-custom-model";
import { SaveButton } from "./save-button";

const KIND_ICON: Record<BookmarkKind, typeof BookOpen> = {
  lesson: BookOpen,
  section: Pilcrow,
  snippet: Code2,
  resource: ExternalLink,
  card: SquareStack,
};

const KIND_ONE: Record<BookmarkKind, string> = {
  lesson: "Lesson",
  section: "Section",
  snippet: "Snippet",
  resource: "Resource",
  card: "Card",
};

const CHIP =
  "inline-flex h-8 items-center gap-1.5 rounded-full border-2 px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--coach-focus)]";

function Chip({
  on,
  count,
  onClick,
  children,
}: {
  on: boolean;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        CHIP,
        on
          ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-surface)]"
          : "border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink-secondary)] hover:border-[var(--coach-border-strong)]",
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn("tabular-nums", on ? "opacity-70" : "text-[var(--coach-ink-muted)]")}>{count}</span>
      )}
    </button>
  );
}

function ItemLink({ b, className, children }: { b: Bookmark; className?: string; children: React.ReactNode }) {
  if (!b.href) return <span className={className}>{children}</span>;
  return b.kind === "resource" ? (
    <a href={b.href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={b.href} className={className}>
      {children}
    </Link>
  );
}

/** One saved thing on the shelf. */
function Row({ b }: { b: Bookmark }) {
  const Icon = KIND_ICON[b.kind];
  return (
    <li className="group relative flex gap-3.5 border-t-2 border-[var(--coach-divider)] py-3.5 first:border-t-0">
      <span
        className={cn(
          "mt-0.5 flex size-9 flex-none items-center justify-center rounded-xl",
          b.kind === "snippet"
            ? "bg-[var(--coach-code-bg)] text-[var(--coach-code-ink)]"
            : "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-secondary)]",
        )}
        title={KIND_ONE[b.kind]}
      >
        <Icon size={16} strokeWidth={2.2} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <ItemLink
          b={b}
          className="text-[15px] font-semibold leading-snug text-[var(--coach-ink)] underline-offset-2 hover:underline [text-wrap:pretty]"
        >
          {b.kind === "snippet" ? (
            <code className="font-[family-name:var(--font-plex-mono)] text-[13.5px]">{b.title}</code>
          ) : (
            b.title
          )}
        </ItemLink>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12.5px] text-[var(--coach-ink-muted)]">
          <span>{KIND_ONE[b.kind]}</span>
          {b.where && b.kind !== "lesson" && (
            <span className="min-w-0 truncate">in {b.where.replace(/^From /, "")}</span>
          )}
          {b.reason === "later" && (
            <span className="rounded-full bg-[var(--coach-tint-orange-bg)] px-2 py-px font-semibold text-[var(--coach-tint-orange-ink)]">
              Later
            </span>
          )}
        </div>
        {b.kind === "snippet" && b.preview && (
          <pre className="mt-2 max-h-[118px] overflow-hidden rounded-xl bg-[var(--coach-code-bg)] px-3.5 py-2.5 font-[family-name:var(--font-plex-mono)] text-[12px] leading-5 text-[var(--coach-code-ink)]">
            {b.preview}
          </pre>
        )}
        {b.note && (
          <p className="m-0 mt-1.5 border-l-2 border-[var(--coach-border-strong)] pl-2.5 text-[13.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
            {b.note}
          </p>
        )}
      </div>
      <SaveButton target={b} look="quiet" className="self-start" />
    </li>
  );
}

/** "Didn't get it": first on the page, each with a way back and a way out. */
function Revisit({ items }: { items: Bookmark[] }) {
  return (
    <section
      aria-labelledby="revisit-title"
      className="rounded-[24px] bg-[var(--coach-hero-bg)] p-5 text-[var(--coach-hero-ink)] sm:p-6"
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id="revisit-title" className="m-0 font-display text-[20px] font-extrabold tracking-[-0.02em]">
          To revisit
        </h2>
        <span className="text-[13px] text-[var(--coach-hero-muted)]">
          {items.length === 1 ? "1 thing" : `${items.length} things`} you didn&apos;t get yet
        </span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map((b) => (
          <li key={b.ref} className="rounded-2xl bg-[var(--coach-hero-card)] p-4 text-[var(--coach-hero-card-ink)]">
            <div className="text-[12.5px] text-[var(--coach-hero-card-muted)]">
              {KIND_ONE[b.kind]} in {b.where.replace(/^From /, "")}
            </div>
            <div className="mt-0.5 text-[16px] font-semibold leading-snug [text-wrap:pretty]">{b.title}</div>
            {b.note && (
              <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-[var(--coach-hero-card-muted)]">“{b.note}”</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {b.href && (
                <ItemLink
                  b={b}
                  className="inline-flex h-9 items-center rounded-full bg-[var(--coach-lime)] px-4 text-[13.5px] font-bold text-[var(--coach-lime-ink)]"
                >
                  {b.kind === "card" ? "Try the card again" : `Revisit ${KIND_ONE[b.kind].toLowerCase()}`}
                </ItemLink>
              )}
              <button
                type="button"
                onClick={() => updateBookmark(b.ref, { reason: "reference" })}
                className="inline-flex h-9 items-center rounded-full border-2 border-[var(--coach-hero-track)] px-4 text-[13.5px] font-semibold text-[var(--coach-hero-card-ink)] hover:border-[var(--coach-hero-card-muted)]"
              >
                I get it now
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-3 text-[12.5px] text-[var(--coach-hero-muted)]">
        “I get it now” keeps it on your shelf as a reference.
      </p>
    </section>
  );
}

const SIDE_CARD = "rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5";

function PracticeThem({ ids }: { ids: string[] }) {
  return (
    <section aria-labelledby="practice-title" className={SIDE_CARD}>
      <h2 id="practice-title" className="m-0 text-[16px] font-bold">
        Practice them
      </h2>
      {ids.length > 0 ? (
        <>
          <p className="m-0 mt-1 text-[13.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
            {ids.length === 1 ? "1 card" : `${ids.length} cards`} from what you saved: the cards themselves, and the
            cards of saved lessons, sections and snippets.
          </p>
          <Link
            href={deckSessionHref(ids.slice(0, 30), "Saved")}
            className="mt-3.5 inline-flex h-10 items-center rounded-full bg-[var(--coach-solid-btn-bg)] px-5 text-[14px] font-bold text-[var(--coach-solid-btn-ink)]"
          >
            Review {Math.min(ids.length, 30)} cards
          </Link>
        </>
      ) : (
        <p className="m-0 mt-1 text-[13.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
          Nothing to review yet. Save a Practice card, or a lesson that has cards.
        </p>
      )}
    </section>
  );
}

function ComeBackLater({ items }: { items: Bookmark[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="later-title" className={SIDE_CARD}>
      <h2 id="later-title" className="m-0 text-[16px] font-bold">
        Pick up where you left off
      </h2>
      <ul className="m-0 mt-2.5 flex list-none flex-col gap-1 p-0">
        {items.slice(0, 5).map((b) => (
          <li key={b.ref}>
            <ItemLink
              b={b}
              className="-mx-2 flex flex-col rounded-xl px-2 py-1.5 hover:bg-[var(--coach-tint-neutral-bg)]"
            >
              <span className="text-[14px] font-semibold leading-snug">{b.title}</span>
              <span className="text-[12.5px] text-[var(--coach-ink-muted)]">
                {b.kind === "lesson" ? "Whole lesson" : `Section in ${b.where}`}
              </span>
            </ItemLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HowToSave() {
  const ways: [typeof BookOpen, string, string][] = [
    [BookOpen, "A lesson", "The bookmark beside Share, at the top of every lesson."],
    [Pilcrow, "A section", "Hover a heading inside a lesson; the bookmark sits at its end."],
    [Code2, "A snippet", "Save on any code block."],
    [ExternalLink, "A resource", "The bookmark on each additional resource beside a lesson."],
    [SquareStack, "A card", "Save card, above any question in Practice."],
  ];
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-3 p-0 sm:grid-cols-2">
      {ways.map(([Icon, what, how]) => (
        <li key={what} className="flex gap-3">
          <span className="flex size-9 flex-none items-center justify-center rounded-xl bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-secondary)]">
            <Icon size={16} strokeWidth={2.2} aria-hidden />
          </span>
          <span className="text-[14px] leading-snug">
            <span className="font-semibold">{what}</span>
            <span className="block text-[13px] text-[var(--coach-ink-muted)]">{how}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function BookmarksPage() {
  const all = useBookmarks();
  const [query, setQuery] = useState("");
  const [reason, setReason] = useState<BookmarkReason | null>(null);
  const [kind, setKind] = useState<BookmarkKind | null>(null);
  const view = useMemo(() => buildBookmarksView(all ?? [], { query, reason, kind }), [all, query, reason, kind]);

  if (all === null) return <div className="h-[420px]" aria-busy="true" />;

  if (all.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <section className="rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6 sm:p-8">
          <h2 className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">Nothing saved yet</h2>
          <p className="m-0 mt-1.5 max-w-[560px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
            Keep what you want to find again. When you save, say why: to read later, to keep as a reference, or because
            it didn&apos;t click and you want to come back to it.
          </p>
          <div className="mt-6">
            <HowToSave />
          </div>
          <Link
            href="/paths"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-[var(--coach-solid-btn-bg)] px-5 text-[14px] font-bold text-[var(--coach-solid-btn-ink)]"
          >
            Browse paths
          </Link>
        </section>
      </div>
    );
  }

  const filtered = query.trim() !== "" || reason !== null || kind !== null;
  const nothingMatches = view.revisit.length === 0 && view.groups.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="relative block max-w-[460px]">
          <span className="sr-only">Search bookmarks</span>
          <Search
            size={16}
            strokeWidth={2.2}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--coach-ink-muted)]"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles and notes"
            className="h-11 w-full rounded-full border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] pl-10 pr-4 text-[14.5px] text-[var(--coach-ink)] placeholder:text-[var(--coach-ink-muted)] focus:border-[var(--coach-ink)] focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Why it was saved">
          <Chip on={reason === null} onClick={() => setReason(null)}>
            All
          </Chip>
          {REASONS.map((r) => (
            <Chip
              key={r.id}
              on={reason === r.id}
              count={view.counts.reason[r.id]}
              onClick={() => setReason(reason === r.id ? null : r.id)}
            >
              {r.label}
            </Chip>
          ))}
          <span className="mx-1 hidden h-5 w-0.5 rounded bg-[var(--coach-divider)] sm:block" aria-hidden />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Kind">
            {KINDS.filter((k) => view.counts.kind[k.id] > 0).map((k) => (
              <Chip
                key={k.id}
                on={kind === k.id}
                count={view.counts.kind[k.id]}
                onClick={() => setKind(kind === k.id ? null : k.id)}
              >
                {k.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          {view.revisit.length > 0 && <Revisit items={view.revisit} />}

          {nothingMatches && filtered && (
            <div className="rounded-[20px] border-2 border-dashed border-[var(--coach-border)] p-6 text-[14.5px] text-[var(--coach-ink-secondary)]">
              Nothing saved matches that.{" "}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setReason(null);
                  setKind(null);
                }}
                className="font-semibold text-[var(--coach-ink)] underline underline-offset-2"
              >
                Clear the filters
              </button>
            </div>
          )}

          {view.groups.map((g) => (
            <section
              key={g.id}
              aria-labelledby={`shelf-${g.id}`}
              className="rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-5 pb-2 pt-4"
            >
              <h2 id={`shelf-${g.id}`} className="m-0 flex items-baseline gap-2 text-[16px] font-bold">
                {g.id === "resources" ? (
                  <ExternalLink size={14} strokeWidth={2.4} aria-hidden />
                ) : (
                  <Layers size={14} strokeWidth={2.4} aria-hidden />
                )}
                {g.title}
                <span className="text-[13px] font-medium text-[var(--coach-ink-muted)]">{g.items.length}</span>
              </h2>
              <ul className="m-0 mt-1 list-none p-0">
                {g.items.map((b) => (
                  <Row key={b.ref} b={b} />
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <PracticeThem ids={view.practiceIds} />
          <ComeBackLater items={view.later} />
        </aside>
      </div>
    </div>
  );
}
