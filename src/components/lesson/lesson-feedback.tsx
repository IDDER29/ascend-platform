"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { OutboundLink } from "@/components/ui/olink";

export function LessonFeedback({
  issueUrl = null,
}: {
  issueUrl?: string | null;
}) {
  const [choice, setChoice] = useState<"up" | "down" | null>(null);

  return (
    <div className="mt-5 flex flex-col items-center gap-2.5">
      <div className="flex items-center justify-center gap-3.5 text-[13.5px] text-ink-faint">
        Was this lesson helpful?
        <button
          type="button"
          onClick={() => setChoice("up")}
          title="Yes, this was helpful"
          className={`flex h-9 w-9 items-center justify-center rounded-[11px] border transition-colors ${
            choice === "up"
              ? "border-xp-border bg-xp-bg text-xp-text"
              : "border-card-border-soft text-xp-text hover:bg-xp-bg/60"
          }`}
        >
          <ThumbsUp size={16} strokeWidth={2.2} fill={choice === "up" ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={() => setChoice("down")}
          title="No, this needs work"
          className={`flex h-9 w-9 items-center justify-center rounded-[11px] border transition-colors ${
            choice === "down"
              ? "border-card-border bg-elevated text-ink-secondary"
              : "border-card-border-soft text-ink-fainter hover:bg-elevated"
          }`}
        >
          <ThumbsDown size={16} strokeWidth={2.2} fill={choice === "down" ? "currentColor" : "none"} />
        </button>
      </div>
      {choice === "up" ? (
        <div className="text-xs text-ink-fainter">Thanks, glad it landed.</div>
      ) : null}
      {choice === "down" ? (
        <div className="max-w-sm text-center text-xs leading-relaxed text-ink-fainter">
          {issueUrl ? (
            <>
              Thanks for the signal.{" "}
              <OutboundLink
                href={issueUrl}
                className="font-semibold text-ink-secondary hover:text-ink"
              >
                Report what felt off
              </OutboundLink>{" "}
              so we can fix it.
            </>
          ) : (
            "Thanks for the signal. We'll keep improving this lesson."
          )}
        </div>
      ) : null}
    </div>
  );
}
