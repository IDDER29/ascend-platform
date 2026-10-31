"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Check, FileText, Play, RotateCcw } from "lucide-react";
import { relatedResources, type LearnMoreResource } from "@/lib/content/related-resources";
import type { BookmarkLesson } from "@/lib/bookmarks/model";
import { saveBookmark, updateBookmark, useBookmarks } from "@/lib/bookmarks/use-bookmarks";
import type { KnowledgeCheckItem } from "@/lib/content/schema";

type Rating = "got" | "not";

const BTN =
  "inline-flex h-9 items-center gap-1.5 rounded-lg border-2 px-3 text-[13.5px] font-semibold transition-colors";

/**
 * The knowledge check as real recall: answer in your head, reveal, then say
 * honestly whether you had it. A "not yet" points back to the section that
 * covers it and can be saved as "Didn't get it".
 */
export function CheckYourself({
  items,
  lesson,
  resources,
}: {
  items: KnowledgeCheckItem[];
  lesson: BookmarkLesson;
  /** The lesson's own reading and viewing (real links), matched to each question. */
  resources: LearnMoreResource[];
}) {
  const [shown, setShown] = useState<Record<number, boolean>>({});
  // "Learn more" panels: open by choice, and on their own after a "Not yet".
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [rating, setRating] = useState<Record<number, Rating>>({});
  const storeKey = `ascend:check-yourself:${lesson.key}`;

  // Your answers are kept in this browser, so coming back shows where you left off.
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const saved = JSON.parse(window.localStorage.getItem(storeKey) ?? "null") as {
          shown?: Record<number, boolean>;
          rating?: Record<number, Rating>;
        } | null;
        if (saved) {
          setShown(saved.shown ?? {});
          setRating(saved.rating ?? {});
        }
      } catch {
        // Nothing saved, or storage blocked.
      }
    });
    return () => {
      cancelled = true;
    };
  }, [storeKey]);

  function save(nextShown: Record<number, boolean>, nextRating: Record<number, Rating>) {
    try {
      window.localStorage.setItem(storeKey, JSON.stringify({ shown: nextShown, rating: nextRating }));
    } catch {
      // Storage blocked: it just won't be remembered.
    }
  }

  function reveal(i: number) {
    const next = { ...shown, [i]: true };
    setShown(next);
    save(next, rating);
  }

  function rate(i: number, r: Rating) {
    const next = { ...rating, [i]: r };
    setRating(next);
    if (r === "not") setOpen((o) => ({ ...o, [i]: true }));
    save(shown, next);
  }

  function startOver() {
    setShown({});
    setRating({});
    save({}, {});
  }
  const bookmarks = useBookmarks();
  const rated = Object.values(rating);
  const got = rated.filter((r) => r === "got").length;
  const notYet = items.map((_, i) => i).filter((i) => rating[i] === "not");

  function flag(item: KnowledgeCheckItem) {
    const ref = `section:${lesson.key}#${item.jumpToId}`;
    saveBookmark(
      {
        ref,
        kind: "section",
        title: item.jumpToLabel,
        where: lesson.title,
        href: `${lesson.href}#${item.jumpToId}`,
        topic: lesson.topic,
        lessonKey: lesson.key,
      },
      "revisit",
    );
    updateBookmark(ref, { reason: "revisit", note: item.question });
  }

  return (
    <div className="flex flex-col gap-3">
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {items.map((item, i) => {
          const flagged = (bookmarks ?? []).some(
            (b) => b.ref === `section:${lesson.key}#${item.jumpToId}` && b.reason === "revisit",
          );
          return (
            <li
              key={i}
              className="flex flex-col gap-3 rounded-[18px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
            >
              <div className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--coach-tint-neutral-bg)] text-[13px] font-bold tabular-nums">
                  {i + 1}
                </span>
                <p className="m-0 text-[16px] font-semibold leading-snug [text-wrap:pretty]">{item.question}</p>
              </div>

              {!shown[i] ? (
                <button
                  type="button"
                  onClick={() => reveal(i)}
                  className="ml-10 w-fit rounded-xl border-2 border-dashed border-[var(--coach-border-strong)] px-4 py-2.5 text-[14px] font-semibold text-[var(--coach-ink-secondary)] hover:text-[var(--coach-ink)]"
                >
                  Answer it in your head, then show the answer
                </button>
              ) : (
                <div className="ml-10 flex flex-col gap-3">
                  <p className="m-0 rounded-xl bg-[var(--coach-well)] px-4 py-3 text-[14.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
                    {item.answer}
                  </p>
                  <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Did you have it?">
                    <span className="text-[13.5px] text-[var(--coach-ink-muted)]">Did you have it?</span>
                    <button
                      type="button"
                      aria-pressed={rating[i] === "got"}
                      onClick={() => rate(i, "got")}
                      className={`${BTN} ${
                        rating[i] === "got"
                          ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-surface)]"
                          : "border-[var(--coach-border)] hover:border-[var(--coach-border-strong)]"
                      }`}
                    >
                      <Check size={14} strokeWidth={3} aria-hidden /> Got it
                    </button>
                    <button
                      type="button"
                      aria-pressed={rating[i] === "not"}
                      onClick={() => rate(i, "not")}
                      className={`${BTN} ${
                        rating[i] === "not"
                          ? "border-[var(--coach-tint-orange-ink)] bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]"
                          : "border-[var(--coach-border)] hover:border-[var(--coach-border-strong)]"
                      }`}
                    >
                      <RotateCcw size={14} strokeWidth={2.5} aria-hidden /> Not yet
                    </button>
                  </div>
                  {rating[i] === "not" && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px]">
                      {flagged ? (
                        <span className="text-[var(--coach-ink-muted)]">Saved to Bookmarks as Didn&apos;t get it</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => flag(item)}
                          className="text-[var(--coach-ink-secondary)] underline underline-offset-2 hover:text-[var(--coach-ink)]"
                        >
                          Save it to come back to
                        </button>
                      )}
                    </div>
                  )}
                  <LearnMore
                    open={Boolean(open[i])}
                    onToggle={(v) => setOpen((o) => ({ ...o, [i]: v }))}
                    section={{ id: item.jumpToId, label: item.jumpToLabel }}
                    resources={relatedResources(item, resources)}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {rated.length === items.length && (
        <p
          role="status"
          className="m-0 rounded-[18px] bg-[var(--coach-tint-neutral-bg)] px-5 py-3.5 text-[14.5px] leading-relaxed"
        >
          {notYet.length === 0
            ? `You had all ${items.length}. That's this lesson down.`
            : `You had ${got} of ${items.length}. Re-read what you missed now, and it'll come back in Practice.`}{" "}
          <button
            type="button"
            onClick={startOver}
            className="text-[var(--coach-ink-muted)] underline underline-offset-2 hover:text-[var(--coach-ink)]"
          >
            Try them again
          </button>
        </p>
      )}
    </div>
  );
}

/** Reading and viewing to go deeper on one question: the section in this lesson, then outside resources. */
function LearnMore({
  open,
  onToggle,
  section,
  resources,
}: {
  open: boolean;
  onToggle: (open: boolean) => void;
  section: { id: string; label: string };
  resources: LearnMoreResource[];
}) {
  return (
    <details
      open={open}
      onToggle={(e) => onToggle((e.currentTarget as HTMLDetailsElement).open)}
      className="group rounded-xl border-2 border-[var(--coach-border)]"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 text-[13.5px] font-semibold [&::-webkit-details-marker]:hidden">
        <BookOpen size={15} strokeWidth={2.2} aria-hidden className="text-[var(--coach-ink-muted)]" />
        Learn more about this
        <span aria-hidden className="ml-auto text-[var(--coach-ink-muted)] transition-transform group-open:rotate-90">
          ›
        </span>
      </summary>
      <ul className="m-0 flex list-none flex-col gap-1 px-2 pb-2.5 pt-0">
        <li>
          <a
            href={`#${section.id}`}
            className="flex items-center gap-3 rounded-lg px-1.5 py-2 text-[var(--coach-ink)] no-underline hover:bg-[var(--coach-tint-neutral-bg)]"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--coach-tint-neutral-bg)]">
              <BookOpen size={15} strokeWidth={2.2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold leading-snug">Re-read “{section.label}”</span>
              <span className="block text-[12.5px] text-[var(--coach-ink-muted)]">In this lesson</span>
            </span>
          </a>
        </li>
        {resources.map((r) => {
          const Icon = r.type === "video" ? Play : FileText;
          return (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg px-1.5 py-2 text-[var(--coach-ink)] no-underline hover:bg-[var(--coach-tint-neutral-bg)]"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]">
                  <Icon size={14} strokeWidth={2.2} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-snug">{r.title}</span>
                  <span className="block text-[12.5px] text-[var(--coach-ink-muted)]">
                    {r.type === "video" ? "Watch" : "Read"}
                    {r.meta ? ` · ${r.meta}` : ""}
                  </span>
                </span>
                <ArrowUpRight size={15} aria-hidden className="shrink-0 text-[var(--coach-ink-muted)]" />
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
