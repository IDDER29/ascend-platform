"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Bookmark as BookmarkIcon, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { REASONS, type BookmarkTarget } from "@/lib/bookmarks/model";
import { removeBookmark, saveBookmark, updateBookmark, useBookmark } from "@/lib/bookmarks/use-bookmarks";

const LOOK = {
  /** A square button, like the lesson header's share button. */
  square: "h-[34px] w-[34px] justify-center rounded-[10px] border border-card-border text-ink-secondary hover:bg-xp-bg",
  /** Small, beside a heading or on a resource. */
  quiet: "h-7 w-7 justify-center rounded-lg text-ink-faint hover:bg-xp-bg hover:text-ink",
  /** In a light toolbar, with a label. */
  bar: "h-8 gap-1.5 rounded-lg px-2.5 text-[12px] font-semibold text-ink-secondary hover:bg-xp-bg hover:text-ink",
  /** On a dark code block. */
  onDark: "h-7 gap-1.5 rounded-lg px-2 text-[11.5px] font-semibold text-[#9C97B2] hover:bg-white/10 hover:text-white",
  /** Practice card row, in Coach colours. */
  coach:
    "h-8 gap-1.5 rounded-full border border-[var(--coach-border)] px-3 text-[12.5px] font-semibold text-[var(--coach-ink-secondary)] hover:bg-[var(--coach-tint-blue-bg)]",
};

/**
 * Save this thing to Bookmarks. The first press saves it as "Later" and
 * opens a small panel to say why it was saved and add a note.
 */
export function SaveButton({
  target,
  look = "quiet",
  label,
  className,
}: {
  target: BookmarkTarget;
  look?: keyof typeof LOOK;
  /** Shown as text beside the icon (onDark and coach looks). */
  label?: string;
  className?: string;
}) {
  const saved = useBookmark(target.ref);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const Icon = saved ? BookmarkCheck : BookmarkIcon;
  const name = saved ? `Saved — change why you saved ${target.title}` : `Save ${target.title} to Bookmarks`;

  return (
    <span
      ref={wrap}
      className={cn("relative inline-flex", className)}
      // Keys used in the panel stay in the panel (Practice binds Enter, Escape, S and digits).
      onKeyDown={(e) => {
        if (!open) return;
        e.stopPropagation();
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={name}
        title={saved ? "Saved to Bookmarks" : "Save to Bookmarks"}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => {
          if (!saved) saveBookmark(target);
          setOpen((o) => !o || !saved);
        }}
        className={cn(
          "inline-flex flex-none items-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-violet",
          LOOK[look],
          saved && look !== "onDark" && "text-brand-violet",
          saved && look === "onDark" && "text-[#6BE3A3]",
        )}
      >
        <Icon size={look === "square" ? 15 : 14} strokeWidth={2.2} fill={saved ? "currentColor" : "none"} />
        {label && <span>{saved ? "Saved" : label}</span>}
      </button>

      {open && saved && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Why you saved it"
          className="absolute right-0 top-[calc(100%+6px)] z-40 w-[264px] rounded-2xl border border-card-border bg-paper p-3.5 text-left font-sans text-ink shadow-[0_18px_40px_-12px_rgba(0,0,0,0.28)] dark:bg-elevated"
        >
          <div className="mb-2 text-[12.5px] font-bold">Saved. Why keep it?</div>
          <div role="radiogroup" aria-label="Reason" className="mb-3 flex flex-col gap-1">
            {REASONS.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={saved.reason === r.id}
                onClick={() => updateBookmark(target.ref, { reason: r.id })}
                className={cn(
                  "flex items-baseline justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
                  saved.reason === r.id
                    ? "border-brand-violet bg-xp-bg font-bold text-ink"
                    : "border-transparent text-ink-secondary hover:bg-xp-bg/60",
                )}
              >
                {r.label}
                <span className="text-[11px] font-normal text-ink-faint">{r.hint}</span>
              </button>
            ))}
          </div>
          <label className="mb-1 block text-[11.5px] font-semibold text-ink-faint" htmlFor={`${panelId}-note`}>
            Note (optional)
          </label>
          <textarea
            id={`${panelId}-note`}
            rows={2}
            defaultValue={saved.note}
            onChange={(e) => updateBookmark(target.ref, { note: e.target.value })}
            placeholder="What to look at next time"
            className="mb-3 w-full resize-none rounded-lg border border-card-border bg-transparent px-2.5 py-1.5 text-[12.5px] text-ink placeholder:text-ink-fainter focus:border-brand-violet focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                removeBookmark(target.ref);
                setOpen(false);
              }}
              className="text-[12px] font-semibold text-ink-faint underline-offset-2 hover:text-ink hover:underline"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-ink px-3 py-1.5 text-[12px] font-bold text-paper"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
