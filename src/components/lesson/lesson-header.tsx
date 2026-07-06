"use client";

import { useState } from "react";
import { Bookmark, Share2, Check } from "lucide-react";
import type { LessonFrontmatter } from "@/lib/content/schema";
import { LEVELS } from "@/lib/content/schema";
import { BOOKMARKS } from "@/lib/bookmarks-data";

export function LessonHeader({ meta }: { meta: LessonFrontmatter }) {
  const level = LEVELS[meta.level];
  const href = `/curriculum/${meta.level}/${meta.slug}`;
  const [bookmarked, setBookmarked] = useState(() => BOOKMARKS.some((b) => b.href === href));
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — silently no-op, nothing to fall back to
    }
  }

  return (
    <div className="animate-rise mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBEBFA] px-3 py-1.5 font-mono text-[11px] text-[#C13AE0]">
          CONCEPT {String(meta.order).padStart(2, "0")}
        </span>
        <span className="font-mono text-[12.5px] text-ink-faint">
          {meta.timeMin} min read · +50 XP
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs font-semibold text-ink-faint sm:inline">
          {level.name}
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setBookmarked((v) => !v)}
            title={bookmarked ? "Remove bookmark" : "Bookmark this lesson"}
            className={`flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border transition-colors ${
              bookmarked
                ? "border-[#E4DBFB] bg-xp-bg text-brand-violet"
                : "border-card-border-soft text-ink-secondary hover:bg-[#F3F1FA]"
            }`}
          >
            <Bookmark size={15} strokeWidth={2.2} fill={bookmarked ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            title="Copy link to this lesson"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-card-border-soft text-ink-secondary transition-colors hover:bg-[#F3F1FA]"
          >
            {copied ? (
              <Check size={15} strokeWidth={2.4} className="text-[#12A472]" />
            ) : (
              <Share2 size={15} strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
