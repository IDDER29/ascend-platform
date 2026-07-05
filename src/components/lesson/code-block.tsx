"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

function decodeEntities(s: string) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export function CodeBlock({
  lang,
  linesJson,
  runnable,
  expectedOutput,
}: {
  lang: string;
  linesJson: string;
  runnable?: boolean;
  expectedOutput?: string;
}) {
  const [ran, setRan] = useState(false);
  const lines: string[] = JSON.parse(linesJson);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[#E7E3F2] shadow-[0_12px_30px_rgba(28,18,64,0.08)] not-prose">
      {runnable && (
        <div className="flex items-center gap-2.5 border-b border-divider bg-[#FBFAFE] px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
            {lang}
          </span>
          <button
            onClick={() => setRan(true)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[#12B981] px-4 py-2 text-[12.5px] font-extrabold text-[#06231A] shadow-[0_8px_16px_rgba(18,185,129,0.28)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#06231A">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
            Run
          </button>
        </div>
      )}
      <div className="bg-[#181428] py-4 pr-1.5 font-mono text-[13px] leading-[1.95] text-[#D8D4E6]">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3.5 px-1.5">
            <span className="w-8 flex-none select-none text-right text-[#4E4869]">
              {line.trim() ? i + 1 : ""}
            </span>
            <span className="whitespace-pre">{decodeEntities(line) || " "}</span>
          </div>
        ))}
      </div>
      {runnable && (
        <div
          className={cn(
            "border-t border-white/[0.07] bg-[#12101F] px-[18px] py-3 font-mono text-[12.5px] text-[#8FCF9A]",
          )}
        >
          <span className="text-[#5E5878]">output › </span>
          {ran && expectedOutput ? (
            <span className="whitespace-pre-wrap">{decodeEntities(expectedOutput)}</span>
          ) : (
            <span className="text-[#5E5878]">— press Run to compile and execute —</span>
          )}
        </div>
      )}
    </div>
  );
}
