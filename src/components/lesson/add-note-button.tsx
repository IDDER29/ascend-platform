"use client";

import { useState } from "react";
import { PenLine, Info } from "lucide-react";

export function AddNoteButton() {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowNotice((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#DDD8EC] px-3 py-3 text-[13px] font-bold text-brand-violet transition-colors hover:bg-[#F6F4FB]"
      >
        <PenLine size={15} strokeWidth={2.2} />
        Add a note
      </button>
      {showNotice && (
        <div className="mt-2 flex items-start gap-2 rounded-xl border border-card-border-soft bg-[#F3F1FA] px-3 py-2.5 text-[12px] leading-relaxed text-ink-secondary">
          <Info size={14} className="mt-0.5 flex-none text-brand-violet" strokeWidth={2.2} />
          This is a demo preview — notes aren&apos;t saved yet.
        </div>
      )}
    </div>
  );
}
