"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export function LessonFeedback() {
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
              ? "border-[#12B981] bg-[#E9F9F2] text-[#12B981]"
              : "border-card-border-soft text-[#12B981] hover:bg-[#F3F1FA]"
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
              ? "border-card-border bg-[#F3F1FA] text-ink-secondary"
              : "border-card-border-soft text-ink-fainter hover:bg-[#F3F1FA]"
          }`}
        >
          <ThumbsDown size={16} strokeWidth={2.2} fill={choice === "down" ? "currentColor" : "none"} />
        </button>
      </div>
      {choice && (
        <div className="text-xs text-ink-fainter">
          {choice === "up"
            ? "Thanks — glad it landed."
            : "Thanks for the signal — this is a demo build, so feedback isn't recorded yet."}
        </div>
      )}
    </div>
  );
}
