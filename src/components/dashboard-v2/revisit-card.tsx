"use client";

import Link from "next/link";
import { useBookmarks } from "@/lib/bookmarks/use-bookmarks";

const SHOWN = 3;

/** What the learner marked "Didn't get it" in Bookmarks, so it doesn't get buried. Hidden when there's none. */
export function RevisitCard() {
  const all = useBookmarks();
  const revisit = (all ?? [])
    .filter((b) => b.reason === "revisit")
    .sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt));
  if (revisit.length === 0) return null;

  return (
    <section
      aria-labelledby="revisit-title"
      className="flex flex-col gap-3 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="revisit-title" className="m-0 text-[16px] font-bold">
          To revisit
        </h2>
        <Link
          href="/bookmarks"
          className="text-[13px] text-[var(--coach-ink-muted)] underline-offset-2 hover:underline"
        >
          {revisit.length > SHOWN ? `All ${revisit.length}` : "Bookmarks"}
        </Link>
      </div>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {revisit.slice(0, SHOWN).map((b) => (
          <li key={b.ref}>
            <Link
              href={b.href ?? "/bookmarks"}
              className="-mx-2 flex flex-col rounded-xl px-2 py-1.5 no-underline hover:bg-[var(--coach-tint-neutral-bg)]"
            >
              <span className="text-[15px] font-semibold leading-snug text-[var(--coach-ink)]">{b.title}</span>
              <span className="truncate text-[12.5px] text-[var(--coach-ink-muted)]">
                {b.note ? `“${b.note}”` : `In ${b.where.replace(/^From /, "")}`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
