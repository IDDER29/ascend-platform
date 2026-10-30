"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { SaveLessonButton } from "@/components/bookmarks/lesson-bookmarks";
import type { LessonFrontmatter } from "@/lib/content/schema";
import { LEVELS } from "@/lib/content/schema";

export function LessonHeader({ meta }: { meta: LessonFrontmatter }) {
  const level = LEVELS[meta.level];
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="animate-rise mb-4 flex items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-xp-bg px-3 py-1.5 font-mono text-[11px] text-xp-text">
          CONCEPT {String(meta.order).padStart(2, "0")}
        </span>
        <span className="font-mono text-[12.5px] text-ink-faint">
          {meta.timeMin} min read
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs font-semibold text-ink-faint sm:inline">
          {level.name}
        </span>
        <div className="flex gap-1.5">
          <SaveLessonButton />
          <button
            type="button"
            onClick={handleShare}
            title="Copy link to this lesson"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-card-border text-ink-secondary transition-colors hover:bg-xp-bg"
          >
            {copied ? (
              <Check size={15} strokeWidth={2.4} className="text-brand-violet" />
            ) : (
              <Share2 size={15} strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
