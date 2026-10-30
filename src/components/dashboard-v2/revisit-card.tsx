"use client";

import Link from "next/link";
import { updateBookmark, useBookmarks } from "@/lib/bookmarks/use-bookmarks";
import { buildRevisit, type RevisitItem } from "@/lib/dashboard/revisit-model";
import type { PracticeSessionRecord } from "@/lib/practice/history";

const CARD = "flex flex-col gap-3 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5";
const PRIMARY =
  "inline-flex h-8 items-center rounded-lg bg-[var(--coach-solid-btn-bg)] px-3 text-[13px] font-bold text-[var(--coach-solid-btn-ink)] no-underline";
const SECONDARY =
  "inline-flex h-8 items-center rounded-lg border-2 border-[var(--coach-border)] px-3 text-[13px] font-semibold text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)]";

function Item({ item }: { item: RevisitItem }) {
  return (
    <li className="flex flex-col gap-1.5 border-t-2 border-[var(--coach-divider)] pt-3 first:border-t-0 first:pt-0">
      <span className="text-[12.5px] text-[var(--coach-ink-muted)]">{item.context}</span>
      <span className="text-[15px] font-semibold leading-snug [text-wrap:pretty]">{item.title}</span>
      {item.source === "flag" && item.note && (
        <span className="text-[13.5px] leading-snug text-[var(--coach-ink-secondary)]">“{item.note}”</span>
      )}
      <span className="mt-0.5 flex flex-wrap gap-2">
        {item.source === "flag" ? (
          <>
            {item.href && (
              <Link href={item.href} className={PRIMARY}>
                {item.openLabel}
              </Link>
            )}
            <button
              type="button"
              onClick={() => updateBookmark(item.ref, { reason: "reference" })}
              className={SECONDARY}
            >
              I get it now
            </button>
          </>
        ) : (
          <>
            <Link href={item.practiceHref} className={PRIMARY}>
              Practice its cards
            </Link>
            <Link href={item.lessonHref} className={SECONDARY}>
              Reread the lesson
            </Link>
          </>
        )}
      </span>
    </li>
  );
}

/**
 * What didn't click: things saved as "Didn't get it" in Bookmarks, then lessons Practice
 * shows you keep missing lately. "I get it now" keeps a bookmark as a reference.
 */
export function RevisitCard({
  history,
  lessons,
}: {
  /** Null until the browser's Practice history is read. */
  history: PracticeSessionRecord[] | null;
  lessons: { key: string; title: string; href: string }[];
}) {
  const bookmarks = useBookmarks();
  if (bookmarks === null || history === null) return <div className={`${CARD} min-h-[148px]`} aria-busy="true" />;

  const { items, total } = buildRevisit({ flagged: bookmarks, history, lessons, now: new Date() });

  return (
    <section aria-labelledby="revisit-title" className={CARD}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="revisit-title" className="m-0 text-[16px] font-bold">
          To revisit
        </h2>
        {total > items.length ? (
          <span className="text-[13px] text-[var(--coach-ink-muted)]">
            {items.length} of {total}
          </span>
        ) : null}
      </div>
      {items.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {items.map((item) => (
            <Item key={item.ref} item={item} />
          ))}
        </ul>
      ) : (
        <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
          Nothing to revisit. When something doesn&apos;t click, save it with{" "}
          <span className="font-semibold text-[var(--coach-ink)]">Didn&apos;t get it</span>, and lessons you keep
          missing in Practice show up here too.
        </p>
      )}
      <Link
        href="/bookmarks"
        className="mt-auto text-[13px] text-[var(--coach-ink-muted)] underline-offset-2 hover:underline"
      >
        All your bookmarks
      </Link>
    </section>
  );
}
