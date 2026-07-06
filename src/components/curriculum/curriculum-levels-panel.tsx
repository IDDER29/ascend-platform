"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronRight, Lock, Play } from "lucide-react";
import { cn } from "@/lib/cn";

interface LessonInfo {
  level: string;
  slug: string;
  title: string;
  order: number;
  timeMin: number;
}

interface LevelInfo {
  id: string;
  name: string;
  short: string;
  timeLabel: string;
  totalConcepts: number;
  done: number;
  accent: string;
}

const FILTER_DOT: Record<string, string> = {
  "level-00-bits-logic": "bg-[#12B981]",
  "level-01-machine-memory": "bg-[#7B4DFF]",
  "level-02-the-c-language": "bg-[#C13AE0]",
  "level-03-systems-software": "bg-[#8A8698]",
};

export function CurriculumLevelsPanel({
  levels,
  lessonsByLevel,
  currentLevel,
  currentOrder,
  totalLessons,
}: {
  levels: LevelInfo[];
  lessonsByLevel: Record<string, LessonInfo[]>;
  currentLevel: string;
  currentOrder: number;
  totalLessons: number;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ [currentLevel]: true });

  const visibleLevels = filter === "all" ? levels : levels.filter((l) => l.id === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-bold transition-colors",
              filter === "all" ? "bg-ink text-white" : "border border-card-border-soft bg-white text-ink-secondary hover:border-[#D8D2EC] hover:bg-[#FAF9FE]",
            )}
          >
            All
            <span className={cn("font-mono text-[11px] opacity-70", filter === "all" ? "text-white" : "text-ink-fainter")}>
              {totalLessons}
            </span>
          </button>
          {levels.map((l) => (
            <button
              key={l.id}
              onClick={() => setFilter(l.id)}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition-colors",
                filter === l.id ? "bg-ink text-white" : "border border-card-border-soft bg-white text-ink-secondary hover:border-[#D8D2EC] hover:bg-[#FAF9FE]",
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", FILTER_DOT[l.id])} />
              {l.name}
              <span className="font-mono text-[11px] text-ink-fainter">{l.totalConcepts}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {visibleLevels.map((level) => {
          const lessons = lessonsByLevel[level.id] ?? [];
          const pct = Math.round((level.done / level.totalConcepts) * 100);
          const isCompleted = level.done === level.totalConcepts;
          const isCurrent = level.id === currentLevel;
          const isLocked = level.done === 0 && !isCurrent;
          const isOpen = !!expanded[level.id];
          const xpEarned = level.done * 50;

          return (
            <div
              key={level.id}
              className={cn(
                "overflow-hidden rounded-[20px] border bg-white shadow-card-rest transition-shadow",
                isCurrent ? "border-[#F1D6EC] shadow-[0_18px_44px_rgba(193,58,224,0.1)]" : "border-card-border",
              )}
            >
              <button
                type="button"
                disabled={isLocked}
                onClick={() => setExpanded((e) => ({ ...e, [level.id]: !e[level.id] }))}
                className={cn(
                  "flex w-full items-center gap-4 px-5.5 py-5 text-left transition-colors",
                  isLocked ? "cursor-default opacity-[0.68]" : "hover:bg-[#FBFAFE]",
                )}
              >
                <div
                  className={cn(
                    "flex h-[50px] w-[50px] flex-none items-center justify-center rounded-2xl font-display text-lg font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.1)]",
                    level.accent,
                  )}
                >
                  {isCompleted ? <Check size={22} strokeWidth={2.6} /> : level.id.slice(6, 8)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10.5px] font-bold tracking-[0.04em] text-ink-fainter">
                    LEVEL {level.id.slice(6, 8)} · {level.timeLabel}
                  </div>
                  <div className="mt-0.5 font-display text-[19px] font-bold leading-tight">
                    {level.name} <span className="text-[13px] font-medium text-ink-muted">· {level.short}</span>
                  </div>
                  {isLocked ? (
                    <div className="mt-1.5 text-[12.5px] text-ink-fainter">
                      Unlocks when you finish {levels.find((l) => l.id === currentLevel)?.name}
                    </div>
                  ) : (
                    <div className="mt-2.5 flex max-w-[320px] items-center gap-2.5">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F0EEF7]">
                        <div className={cn("h-full rounded-full", level.accent)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="font-mono text-[11px] text-ink-faint">
                        {level.done}/{level.totalConcepts}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-none flex-col items-end gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-extrabold",
                      isCompleted
                        ? "bg-[#E7F8F0] text-[#12B981]"
                        : isCurrent
                          ? "bg-[#FFF1EC] text-[#F0562F]"
                          : "bg-[#F3F1F8] text-[#9A96A8]",
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <Check size={13} strokeWidth={2.6} /> Completed
                      </>
                    ) : isCurrent ? (
                      <>
                        <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#F0562F]" /> In progress
                      </>
                    ) : (
                      <>
                        <Lock size={13} strokeWidth={2.2} /> Locked
                      </>
                    )}
                  </span>
                  {!isLocked && (isOpen ? <ChevronDown size={18} className="text-ink-fainter" /> : <ChevronRight size={18} className="text-ink-fainter" />)}
                </div>
              </button>

              {isOpen && !isLocked && (
                <div>
                  {lessons.map((lesson) => {
                    const isDone = lesson.level !== currentLevel ? isCompleted : lesson.order < currentOrder;
                    const isLessonCurrent = lesson.level === currentLevel && lesson.order === currentOrder;
                    const isNextUp = lesson.level === currentLevel && lesson.order === currentOrder + 1;
                    const isLessonLocked = !isDone && !isLessonCurrent && !isNextUp;

                    return (
                      <div
                        key={lesson.slug}
                        className={cn(
                          "flex items-center gap-3.5 border-t border-[#F4F2FA] px-5.5 py-3.5",
                          isLessonCurrent && "bg-gradient-to-r from-[#FBF3FE] to-white",
                        )}
                        style={isLessonCurrent ? { boxShadow: "inset 3px 0 0 #C13AE0" } : undefined}
                      >
                        <span
                          className={cn(
                            "flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full",
                            isDone
                              ? `${level.accent} text-white`
                              : isLessonCurrent
                                ? "border-2 border-[#C13AE0] bg-white shadow-[0_0_0_4px_rgba(193,58,224,0.13)]"
                                : isNextUp
                                  ? "border-2 border-[#D8D3E6] bg-white"
                                  : "border border-[#E7E4F0] bg-[#F1EFF6] text-ink-fainter",
                          )}
                        >
                          {isDone ? (
                            <Check size={13} strokeWidth={2.6} />
                          ) : isLessonCurrent ? (
                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#C13AE0]" />
                          ) : isNextUp ? null : (
                            <Lock size={13} strokeWidth={2.2} />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className={cn("text-[14.5px]", isLessonLocked ? "font-medium text-[#A29EAF]" : "font-semibold text-[#2A2540]", isLessonCurrent && "font-bold")}>
                            {lesson.title}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-fainter">
                            <span className="font-bold capitalize">lesson</span>
                            <span>·</span>
                            <span className="font-mono">{lesson.timeMin} min</span>
                            {isLessonCurrent && (
                              <>
                                <span>·</span>
                                <span className="font-bold text-[#C13AE0]">in progress</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className={cn("whitespace-nowrap font-mono text-[11.5px]", isLessonLocked ? "text-[#C6C1D4]" : "text-ink-fainter")}>
                          +50 XP
                        </span>
                        {isLessonCurrent ? (
                          <Link
                            href={`/curriculum/${lesson.level}/${lesson.slug}`}
                            className="flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#C13AE0] to-[#FF6B4A] px-4.5 py-2.5 text-[12.5px] font-bold text-white shadow-[0_8px_18px_rgba(193,58,224,0.27)] transition-transform hover:-translate-y-0.5"
                          >
                            Continue
                            <Play size={11} className="fill-current" />
                          </Link>
                        ) : isNextUp ? (
                          <Link
                            href={`/curriculum/${lesson.level}/${lesson.slug}`}
                            className="flex-none whitespace-nowrap rounded-full border-[1.5px] border-[#C13AE0] px-4 py-2 text-[12.5px] font-bold text-[#C13AE0] transition-colors hover:bg-[#FBEBFA]"
                          >
                            Start
                          </Link>
                        ) : isDone ? (
                          <Link
                            href={`/curriculum/${lesson.level}/${lesson.slug}`}
                            className="flex-none whitespace-nowrap rounded-full border border-card-border-soft px-4 py-2 text-[12.5px] font-semibold text-ink-secondary transition-colors hover:border-[#D8D2EC] hover:bg-[#FAF9FE]"
                          >
                            Review
                          </Link>
                        ) : (
                          <span className="flex-none whitespace-nowrap text-xs font-semibold text-[#B7B3C4]">Locked</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {isCompleted && (
                <div className="flex items-center justify-between border-t border-[#F4F2FA] px-5.5 py-3">
                  <span className="text-[13px] text-ink-fainter">
                    <b className={cn("font-bold", level.id === "level-00-bits-logic" ? "text-[#12B981]" : "text-[#7B4DFF]")}>
                      +{xpEarned} XP earned
                    </b>{" "}
                    · {level.done} concepts mastered
                  </span>
                  <Link href={`/curriculum/${level.id}/${lessons[0]?.slug}`} className="text-[12.5px] font-bold text-brand-violet hover:text-[#5A32D6]">
                    Review level →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
