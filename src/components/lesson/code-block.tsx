"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { decodeEntities } from "@/lib/content/entities";
import { SaveButton } from "@/components/bookmarks/save-button";
import { useSnippetTarget } from "@/components/bookmarks/lesson-bookmarks";

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
  const snippet = useSnippetTarget(lines.map(decodeEntities), lang);
  const save = snippet && (
    <SaveButton
      target={snippet}
      look={runnable ? "bar" : "onDark"}
      label="Save"
    />
  );

  return (
    <div
      id={snippet ? snippet.href!.split("#")[1] : undefined}
      className="my-6 scroll-mt-[88px] overflow-hidden rounded-2xl border border-card-border bg-paper shadow-[var(--shadow-card-rest)] not-prose dark:bg-elevated"
    >
      {runnable && (
        <div className="flex items-center gap-2.5 border-b border-divider bg-elevated/50 px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
            {lang}
          </span>
          <span className="ml-auto">{save}</span>
          <button
            onClick={() => setRan(true)}
            className=" inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient px-4 py-2 text-[12.5px] font-extrabold text-white shadow-[0_6px_16px_rgba(13,159,110,0.22)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
            Run
          </button>
        </div>
      )}
      <div className="relative bg-[#181428] py-4 pr-1.5 font-mono text-[13px] leading-[1.95] text-[#D8D4E6]">
        {!runnable && save && (
          <div className="absolute right-2 top-2">{save}</div>
        )}
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3.5 px-1.5">
            <span className="w-8 flex-none select-none text-right text-[#4E4869]">
              {line.trim() ? i + 1 : ""}
            </span>
            <span className="whitespace-pre">
              {decodeEntities(line) || " "}
            </span>
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
            <span className="whitespace-pre-wrap">
              {decodeEntities(expectedOutput)}
            </span>
          ) : (
            <span className="text-[#5E5878]">
              — press Run to compile and execute —
            </span>
          )}
        </div>
      )}
    </div>
  );
}
