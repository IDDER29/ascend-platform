"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const LINES: { n: number; tokens: { text: string; cls?: string }[] }[] = [
  {
    n: 1,
    tokens: [
      { text: "int", cls: "text-[#9B7BFF]" },
      { text: "  x = " },
      { text: "42", cls: "text-[#FFC06B]" },
      { text: ";" },
    ],
  },
  {
    n: 2,
    tokens: [
      { text: "int", cls: "text-[#9B7BFF]" },
      { text: " *p = &x;" },
    ],
  },
  {
    n: 3,
    tokens: [{ text: "*p = " }, { text: "7", cls: "text-[#FFC06B]" }, { text: ";" }],
  },
  {
    n: 4,
    tokens: [
      { text: "printf", cls: "text-[#6BE3A3]" },
      { text: "(" },
      { text: '"x = %d"', cls: "text-[#8FCF9A]" },
      { text: ", x);" },
    ],
  },
];

export function CodeLab() {
  const [ran, setRan] = useState(false);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[#E7E3F2] shadow-[0_12px_30px_rgba(28,18,64,0.08)]">
      <div className="flex items-center gap-2.5 border-b border-divider bg-[#FBFAFE] px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-violet text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </span>
        <span className="text-[13.5px] font-bold">Try it yourself</span>
        <span className="text-xs text-ink-faint">— edit line 3, then run</span>
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

      <div className="bg-[#181428] py-4 pr-1.5 font-mono text-[13px] leading-[1.95] text-[#D8D4E6]">
        {LINES.map((line) => (
          <div key={line.n} className="flex gap-3.5 px-1.5">
            <span className="w-8 flex-none select-none text-right text-[#4E4869]">
              {line.n}
            </span>
            <span>
              {line.tokens.map((t, i) => (
                <span key={i} className={t.cls}>
                  {t.text}
                </span>
              ))}
              {line.n === 3 && (
                <span className="ml-0.5 inline-block h-[15px] w-2 translate-y-0.5 animate-[blink_1.1s_steps(1)_infinite] bg-[#C13AE0]" />
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.07] bg-[#12101F] py-3 pl-[54px] pr-4 font-mono text-[12.5px] text-[#8FCF9A]">
        <span className="text-[#5E5878]">output › </span>
        {ran ? (
          <>
            x = 7
            <span className="text-[#5E5878]"> compiled &amp; ran in 0.04s ✓</span>
          </>
        ) : (
          <span className="text-[#5E5878]">— press Run to compile and execute —</span>
        )}
      </div>

      <div
        className={cn(
          "grid overflow-hidden bg-white transition-all duration-300 ease-out",
          ran ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <div className="px-[18px] py-4">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-fainter">
              Memory · after line 3 runs
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex flex-1 items-center gap-2.5 rounded-[10px] border-[1.5px] border-[#C9B8F5] bg-xp-bg px-3.5 py-2.5">
                  <span className="font-mono text-[12.5px] font-bold text-brand-violet">
                    int *p
                  </span>
                  <span className="ml-auto font-mono text-xs text-[#5A32D6]">
                    0x7ffe…a4c
                  </span>
                </div>
                <span className="w-[82px] flex-none text-[11.5px] font-bold text-brand-violet">
                  holds x&apos;s addr
                </span>
              </div>
              <div className="flex items-center gap-2.5 pl-5">
                <span className="text-[15px] text-brand-violet">↳</span>
                <div className="flex flex-1 items-center gap-2.5 rounded-[10px] border-[1.5px] border-[#A6E6CC] bg-[#E9F9F2] px-3.5 py-2.5">
                  <span className="font-mono text-[12.5px] font-bold text-[#0E9E6E]">
                    int x
                  </span>
                  <span className="ml-auto flex items-center gap-2">
                    <span className="font-mono text-xs text-ink-fainter line-through">
                      42
                    </span>
                    <span className="font-mono text-[13px] font-bold text-[#0E9E6E]">
                      7
                    </span>
                  </span>
                </div>
                <span className="w-[82px] flex-none text-[11.5px] text-ink-muted">
                  changed!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
