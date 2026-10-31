"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import type { SampleCard } from "@/lib/site/site-data";

/** One real Practice card to answer right on the page, with the lesson it comes from. */
export function TryCard({ card }: { card: SampleCard }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const right = picked === card.correct;

  return (
    <div className="rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-7">
      <p className="m-0 text-[13px] font-semibold text-[var(--coach-ink-muted)]">Practice card · {card.reviewLabel}</p>
      <p className="m-0 mt-2 text-[19px] font-bold leading-snug [text-wrap:balance]" id="try-prompt">
        {card.prompt}
      </p>
      {card.code && (
        <pre className="m-0 mt-4 overflow-x-auto rounded-xl bg-[var(--coach-code-bg)] px-4 py-3 font-mono text-[13.5px] leading-relaxed text-[var(--coach-code-ink)]">
          <code>{card.code.join("\n")}</code>
        </pre>
      )}

      <ul role="list" aria-labelledby="try-prompt" className="m-0 mt-4 grid list-none gap-2 p-0 sm:grid-cols-2">
        {card.options.map((option, i) => {
          const isRight = i === card.correct;
          const look = !answered
            ? "border-[var(--coach-border)] hover:border-[var(--coach-border-strong)]"
            : isRight
              ? "border-[var(--coach-correct-border)] bg-[var(--coach-correct-bg)] text-[var(--coach-correct-ink)]"
              : i === picked
                ? "border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-bg)] text-[var(--coach-wrong-ink)]"
                : "border-[var(--coach-border)] opacity-60";
          return (
            <li key={option}>
              <button
                type="button"
                disabled={answered}
                onClick={() => setPicked(i)}
                className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-2.5 text-left font-mono text-[14px] ${look}`}
              >
                <span>{option}</span>
                {answered && isRight && <Check size={18} strokeWidth={2.6} aria-label="Right answer" />}
                {answered && i === picked && !isRight && <X size={18} strokeWidth={2.6} aria-label="Your answer" />}
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite">
        {answered && (
          <div className="mt-5 flex flex-col gap-3 border-t-2 border-[var(--coach-divider)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
              <span className="font-bold text-[var(--coach-ink)]">{right ? "Right." : "Not quite."}</span> {card.hint}
            </p>
            <div className="flex shrink-0 gap-2">
              {!right && (
                <button
                  type="button"
                  onClick={() => setPicked(null)}
                  className="inline-flex h-10 items-center rounded-full border-2 border-[var(--coach-border)] px-4 text-[14px] font-semibold"
                >
                  Try again
                </button>
              )}
              <Link
                href={card.lessonHref}
                className="inline-flex h-10 items-center rounded-full bg-[var(--coach-solid-btn-bg)] px-4 text-[14px] font-bold text-[var(--coach-solid-btn-ink)] no-underline"
              >
                Read “{card.lessonTitle}”
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
