"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Curriculum2LevelRegion } from "./types";

export function LevelRegion({
  region,
  focused,
  dimmed,
  isCurrentLevel,
  currentOrder,
  onFocus,
}: {
  region: Curriculum2LevelRegion;
  focused: boolean;
  dimmed: boolean;
  isCurrentLevel: boolean;
  currentOrder: number;
  onFocus: () => void;
}) {
  const indexLabel = region.id.replace("level-", "").slice(0, 2); // "00", "01", …

  return (
    <section
      className={cn(
        "min-w-0 rounded-2xl border border-card-border bg-paper/80 p-4 transition-all duration-300 ease-out dark:bg-elevated/80",
        focused && "z-10 scale-[1.02] shadow-[0_12px_32px_rgba(15,26,20,0.12)]",
        dimmed && "scale-[0.98] opacity-45",
        !focused && !dimmed && "hover:border-xp-border",
      )}
    >
      <button
        type="button"
        onClick={onFocus}
        className="flex w-full items-start gap-3 text-left"
        aria-expanded={focused}
      >
        <span
          className={cn(
            "flex h-10 w-10 flex-none items-center justify-center rounded-xl font-mono text-sm font-bold text-white",
            region.accentClass,
          )}
        >
          {indexLabel}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-display text-base font-extrabold text-ink">{region.name}</div>
          <div className="mt-0.5 text-[12.5px] text-ink-fainter">
            {region.short} · {region.done}/{region.totalConcepts} · {region.timeLabel}
          </div>
        </div>
        {isCurrentLevel && !focused ? (
          <span
            className="animate-here-breathe mt-1 h-2.5 w-2.5 flex-none rounded-full bg-brand-gradient"
            role="img"
            aria-label="You are here"
          />
        ) : null}
      </button>

      {focused ? (
        <ul className="mt-4 flex flex-col gap-1 border-t border-divider pt-3">
          {region.lessons.map((lesson) => {
            const here =
              isCurrentLevel && lesson.order === currentOrder;
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/curriculum/${lesson.level}/${lesson.slug}`}
                  aria-current={here ? "location" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] transition-colors hover:bg-xp-bg",
                    here && "bg-xp-bg font-bold text-xp-text",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 flex-none items-center justify-center rounded-lg font-mono text-[11px]",
                      here
                        ? "animate-here-breathe bg-brand-gradient text-white"
                        : "bg-elevated text-ink-faint",
                    )}
                  >
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-ink">{lesson.title}</span>
                  <span className="font-mono text-[11px] text-ink-fainter">{lesson.timeMin}m</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
