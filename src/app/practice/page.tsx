"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flame, Trophy, Zap, Check, X, Heart, Clock } from "lucide-react";
import { IconSidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { POINTERS_DRILL } from "@/lib/practice-questions";

interface Answered {
  correct: boolean;
}

function useElapsed(running: boolean) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now() - ms;
    const id = setInterval(() => setMs(Date.now() - start), 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);
  return ms;
}

function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PracticePage() {
  const questions = POINTERS_DRILL;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [phase, setPhase] = useState<"quiz" | "complete">("quiz");
  const [misses, setMisses] = useState(0);

  const elapsed = useElapsed(phase === "quiz");
  const finalTime = useMemo(() => elapsed, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = questions[index];
  const correctCount = answered.filter((a) => a.correct).length;
  const xp = correctCount * 10 + Math.max(0, streak - 4) * 5; // small streak bonus, mirrors "2x XP" framing

  function pick(i: number) {
    if (checked) return;
    setSelected(i);
  }

  function checkAnswer() {
    if (selected === null || checked) return;
    const isCorrect = selected === q.correct;
    setChecked(true);
    setAnswered((prev) => [...prev, { correct: isCorrect }]);
    setStreak(isCorrect ? streak + 1 : 0);
    if (!isCorrect) setMisses((m) => m + 1);
  }

  function next() {
    if (index + 1 >= questions.length) {
      setPhase("complete");
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setChecked(false);
    setShowHint(false);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setAnswered([]);
    setStreak(0);
    setShowHint(false);
    setMisses(0);
    setPhase("quiz");
  }

  if (phase === "complete") {
    const total = questions.length;
    const accuracy = Math.round((correctCount / total) * 100);
    const earnedBadge = accuracy >= 90;
    const circumference = 327;
    const dashoffset = circumference - (accuracy / 100) * circumference;

    return (
      <div className="flex min-h-screen bg-radial-wash text-ink">
        <IconSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-[70px] items-center gap-5 border-b border-divider bg-white/85 px-7 backdrop-blur-[14px] backdrop-saturate-[1.4]">
            <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-semibold text-ink-secondary hover:bg-[#F3F1FB]">
              <X size={17} strokeWidth={2.3} />
              Close
            </Link>
            <div className="flex flex-1 items-center justify-center gap-1.5">
              {answered.map((a, i) => (
                <span
                  key={i}
                  className={`flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full ${
                    a.correct ? "bg-[#12B981]" : "bg-[#F87171]"
                  }`}
                >
                  {a.correct ? (
                    <Check size={10} className="text-white" strokeWidth={3.5} />
                  ) : (
                    <X size={10} className="text-white" strokeWidth={3.5} />
                  )}
                </span>
              ))}
            </div>
            <div className="ml-auto font-mono text-[12.5px] text-ink-faint">session complete</div>
          </header>
          <main className="flex-1 px-5 py-9 sm:px-10">
            <div className="mx-auto w-full max-w-[760px]">
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4.5 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-brand-gradient shadow-[0_16px_34px_rgba(123,77,255,0.35)]">
                  <Trophy size={40} className="text-white" strokeWidth={2.4} />
                </div>
                <h1 className="mb-2 font-display text-[28px] font-extrabold tracking-tight">
                  Pointers Drill complete!
                </h1>
                <p className="text-[14.5px] text-ink-secondary">
                  {correctCount} out of {total}
                  {accuracy >= 80 ? " — great work." : " — keep drilling, it sticks."}
                </p>
              </div>

              <Card hover={false} className="mb-5">
                <div className="flex flex-wrap items-center justify-center gap-5 p-7">
                  <div className="relative h-[120px] w-[120px] flex-none">
                    <svg viewBox="0 0 120 120" width="120" height="120" className="-rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#F0EEF7" strokeWidth="13" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="url(#completeRing)"
                        strokeWidth="13"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                      />
                      <defs>
                        <linearGradient id="completeRing" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#7B4DFF" />
                          <stop offset="1" stopColor="#C13AE0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-[26px] font-extrabold leading-none">
                        {accuracy}%
                      </span>
                      <span className="mt-0.5 text-[10.5px] text-ink-muted">accuracy</span>
                    </div>
                  </div>
                  <div className="flex min-w-[260px] flex-1 flex-wrap justify-center gap-3.5">
                    <div className="min-w-[100px] rounded-2xl border border-[#F0EEF6] bg-[#FBFAFE] px-5 py-4 text-center">
                      <div className="font-display text-xl font-extrabold text-streak-text">+{xp}</div>
                      <div className="mt-0.5 text-[11.5px] text-ink-muted">XP earned</div>
                    </div>
                    <div className="min-w-[100px] rounded-2xl border border-[#F0EEF6] bg-[#FBFAFE] px-5 py-4 text-center">
                      <div className="font-display text-xl font-extrabold text-brand-violet">
                        {formatTime(finalTime)}
                      </div>
                      <div className="mt-0.5 text-[11.5px] text-ink-muted">time taken</div>
                    </div>
                    <div className="min-w-[100px] rounded-2xl border border-[#F0EEF6] bg-[#FBFAFE] px-5 py-4 text-center">
                      <div className="font-display text-xl font-extrabold text-[#12A472]">12</div>
                      <div className="mt-0.5 text-[11.5px] text-ink-muted">day streak</div>
                    </div>
                  </div>
                </div>
              </Card>

              {earnedBadge && (
                <div className="mb-5 flex items-center gap-4 rounded-[20px] bg-gradient-to-br from-[#1B1730] to-[#2C2548] px-5 py-5 text-white">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-gradient-to-br from-[#F59E0B] to-[#FF6B4A] text-xl">
                    ★
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-bold">Badge earned — Sharp Shooter</div>
                    <div className="mt-0.5 text-xs text-[#B9B3D0]">
                      90%+ accuracy on a {total}-question drill. 3 more drills like this to master it.
                    </div>
                  </div>
                  <Link
                    href="/achievements"
                    className="flex-none whitespace-nowrap rounded-full bg-white/[0.12] px-4 py-2.5 text-[12.5px] font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    View badge
                  </Link>
                </div>
              )}

              <Card hover={false} className="mb-6">
                <div className="p-6">
                  <div className="mb-3 font-display text-[15.5px] font-extrabold">
                    Question review
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {answered.map((a, i) => {
                      const row = (
                        <>
                          <span
                            className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${
                              a.correct ? "bg-[#E7F8F0] text-[#12A472]" : "bg-[#FEECEC] text-[#F0562F]"
                            }`}
                          >
                            {a.correct ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                          </span>
                          <span className="flex-1 text-[13.5px] text-[#2A2540]">
                            Q{i + 1} · {questions[i].reviewLabel}
                          </span>
                          {a.correct ? (
                            <span className="font-mono text-xs text-ink-faint">+10</span>
                          ) : (
                            <span className="text-xs font-bold text-brand-violet">Review →</span>
                          )}
                        </>
                      );
                      return a.correct ? (
                        <div key={i} className="-mx-1 flex items-center gap-3 rounded-[11px] px-2 py-2.5">
                          {row}
                        </div>
                      ) : (
                        <Link
                          key={i}
                          href="/curriculum/level-02-the-c-language/what-a-pointer-really-is"
                          className="-mx-1 flex items-center gap-3 rounded-[11px] px-2 py-2.5 transition-colors hover:bg-[#FAF9FE]"
                        >
                          {row}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </Card>

              <div className="flex flex-wrap justify-center gap-3.5">
                <Button href="/dashboard" variant="secondary">
                  Back to dashboard
                </Button>
                <Button onClick={restart}>
                  Practice again
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <IconSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[70px] items-center gap-5 border-b border-divider bg-white/85 px-7 backdrop-blur-[14px] backdrop-saturate-[1.4]">
          <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-semibold text-ink-secondary hover:bg-[#F3F1FB]">
            <X size={17} strokeWidth={2.3} />
            Exit
          </Link>
          <div className="flex flex-1 items-center justify-center gap-1.5">
            {questions.map((_, i) => {
              const state =
                i < answered.length ? (answered[i].correct ? "correct" : "wrong") : i === index ? "current" : "pending";
              return (
                <span
                  key={i}
                  className={`flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full ${
                    state === "correct"
                      ? "bg-[#12B981]"
                      : state === "wrong"
                        ? "bg-[#F87171]"
                        : state === "current"
                          ? "border-2 border-brand-magenta bg-white shadow-[0_0_0_3px_rgba(193,58,224,0.16)]"
                          : "border border-[#E2DDEF] bg-[#EDEAF6]"
                  }`}
                >
                  {state === "correct" && <Check size={10} className="text-white" strokeWidth={3.5} />}
                  {state === "wrong" && <X size={10} className="text-white" strokeWidth={3.5} />}
                  {state === "current" && (
                    <span className="animate-pulse-live h-[7px] w-[7px] rounded-full bg-brand-magenta" />
                  )}
                </span>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-card-border-soft bg-[#F3F1FA] px-3 py-1.5">
              <Clock size={14} className="text-brand-violet" strokeWidth={2.3} />
              <span className="font-mono text-[13px] font-bold text-[#5A32D6]">{formatTime(elapsed)}</span>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  size={17}
                  className={i < 3 - misses ? "fill-[#FF5A6E] text-[#FF5A6E]" : "text-[#D3CDE4]"}
                  strokeWidth={2.2}
                />
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-9 sm:px-10">
          <div className="mx-auto flex w-full max-w-[1060px] flex-wrap items-start gap-6">
            <div className="min-w-0 flex-[100_1_520px]">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBEBFA] px-3 py-1.5 font-mono text-[11px] text-[#C13AE0]">
                  POINTERS DRILL
                </span>
                <span className="font-mono text-[12.5px] text-ink-faint">
                  Question {index + 1} of {questions.length}
                </span>
                {streak >= 2 && (
                  <span className="ml-auto flex items-center gap-1.5 text-[12.5px] font-bold text-streak-text">
                    <Zap size={14} className="fill-current" />
                    {streak} in a row
                  </span>
                )}
              </div>

              <Card hover={false}>
                <div className="p-7">
                  <h2 className="mb-5 font-display text-[24px] font-extrabold leading-snug tracking-tight">
                    {q.prompt}
                  </h2>

                  {q.code && (
                    <div className="mb-6 rounded-2xl bg-[#181428] px-5 py-4.5 font-mono text-[13.5px] leading-[1.95] text-[#D8D4E6]">
                      {q.code.map((line, i) => (
                        <div key={i} className="flex gap-3.5">
                          <span className="w-[18px] flex-none select-none text-right text-[#4E4869]">
                            {i + 1}
                          </span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {q.options.map((opt, i) => {
                      const isSelected = selected === i;
                      const isCorrectOpt = i === q.correct;
                      let stateClass =
                        "border-[#E9E5F4] bg-white hover:border-[#C9B8F5] hover:-translate-y-0.5";
                      let badgeClass = "bg-[#F2F0F8] text-ink-muted";
                      let indicator = (
                        <span className="h-[22px] w-[22px] flex-none rounded-full border-2 border-[#DCD7E8] bg-white" />
                      );

                      if (checked) {
                        if (isCorrectOpt) {
                          stateClass = "border-[#12B981] bg-[#F3FBF7]";
                          badgeClass = "bg-[#12B981] text-white";
                          indicator = (
                            <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#12B981]">
                              <Check size={12} className="text-white" strokeWidth={3} />
                            </span>
                          );
                        } else if (isSelected) {
                          stateClass = "border-[#F0562F] bg-[#FEF4F1]";
                          badgeClass = "bg-[#F0562F] text-white";
                          indicator = (
                            <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#F0562F]">
                              <X size={12} className="text-white" strokeWidth={3} />
                            </span>
                          );
                        }
                      } else if (isSelected) {
                        stateClass = "border-brand-magenta bg-[#FBF3FE]";
                        badgeClass = "bg-gradient-to-br from-[#C13AE0] to-[#FF6B4A] text-white";
                        indicator = (
                          <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2 border-brand-magenta bg-brand-magenta">
                            <Check size={12} className="text-white" strokeWidth={3} />
                          </span>
                        );
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => pick(i)}
                          disabled={checked}
                          className={`flex items-center gap-3.5 rounded-[14px] border-[1.5px] px-4.5 py-4 text-left transition-all duration-150 ${stateClass} ${checked ? "cursor-default" : "cursor-pointer"}`}
                        >
                          <span
                            className={`flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] font-mono text-[13px] font-extrabold ${badgeClass}`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1 text-[15px] font-medium text-[#2A2540]">{opt}</span>
                          {indicator}
                        </button>
                      );
                    })}
                  </div>

                  {showHint && (
                    <div className="mt-4 rounded-xl border border-[#EEECF6] bg-[#FBFAFE] px-4 py-3.5 text-sm leading-relaxed text-ink-secondary">
                      💡 {q.hint}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-[#F2F0F8] pt-5.5">
                    <button
                      onClick={() => setShowHint((v) => !v)}
                      className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-muted hover:text-ink-secondary"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                      Hint
                    </button>
                    {checked ? (
                      <Button onClick={next}>
                        {index + 1 >= questions.length ? "See results" : "Next question"}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Button>
                    ) : (
                      <Button onClick={checkAnswer} disabled={selected === null}>
                        Check answer
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex w-full min-w-[270px] max-w-[320px] flex-1 flex-col gap-5">
              <Card hover={false}>
                <div className="p-5.5">
                  <div className="mb-4 font-display text-base font-extrabold">This session</div>
                  <div className="mb-4.5 flex gap-2.5">
                    <div className="flex flex-1 flex-col items-center rounded-[14px] border border-[#F0EEF6] bg-[#FBFAFE] px-2 py-3.5 text-center">
                      <Flame size={17} className="mb-1.5 fill-[#FF6B4A] text-[#FF6B4A]" />
                      <div className="font-display text-lg font-extrabold leading-none">{streak}</div>
                      <div className="mt-1 text-[11px] text-ink-muted">streak</div>
                    </div>
                    <div className="flex flex-1 flex-col items-center rounded-[14px] border border-[#F0EEF6] bg-[#FBFAFE] px-2 py-3.5 text-center">
                      <Check size={17} className="mb-1.5 text-[#12A472]" strokeWidth={2.4} />
                      <div className="font-display text-lg font-extrabold leading-none">
                        {correctCount}/{answered.length}
                      </div>
                      <div className="mt-1 text-[11px] text-ink-muted">correct</div>
                    </div>
                    <div className="flex flex-1 flex-col items-center rounded-[14px] border border-[#F0EEF6] bg-[#FBFAFE] px-2 py-3.5 text-center">
                      <Zap size={17} className="mb-1.5 text-brand-violet" strokeWidth={2.4} />
                      <div className="font-display text-lg font-extrabold leading-none">+{xp}</div>
                      <div className="mt-1 text-[11px] text-ink-muted">XP</div>
                    </div>
                  </div>
                  <div className="mb-1.5 flex justify-between font-mono text-xs text-ink-muted">
                    <span>progress</span>
                    <span>
                      {index + (checked ? 1 : 0)} / {questions.length}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F0EEF7]">
                    <div
                      className="h-full rounded-full bg-brand-gradient-wash transition-all duration-500"
                      style={{ width: `${((index + (checked ? 1 : 0)) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>

              {streak >= 4 && (
                <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1B1730] to-[#2C2548] p-5 text-white">
                  <div className="pointer-events-none absolute -right-6 -top-[30px] h-[120px] w-[120px] rounded-full bg-[radial-gradient(circle,rgba(255,107,74,0.4),transparent_68%)] blur-[6px]" />
                  <div className="relative">
                    <div className="mb-2 font-mono text-[10.5px] tracking-[0.1em] text-[#FFB58A]">
                      ON FIRE
                    </div>
                    <div className="text-sm leading-relaxed text-[#E7E2F2]">
                      Answer <b className="text-white">1 more</b> in a row for a{" "}
                      <b className="text-[#FFD86B]">bonus XP</b> streak.
                    </div>
                  </div>
                </div>
              )}

              <Card hover={false}>
                <div className="p-5">
                  <p className="text-[13px] leading-relaxed text-ink-secondary">
                    Practice pulls from concepts you&apos;ve learned. Miss one and it&apos;ll
                    resurface later — <b className="text-[#2A2540]">spaced repetition</b> keeps
                    it stuck.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
