"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Play, Bell, GraduationCap, Code2, Clock, Compass } from "lucide-react";
import { cn } from "@/lib/cn";
import { savePracticeDailyGoalAction } from "@/lib/practice/actions";
import { writeDailyGoal } from "@/lib/practice/daily-goal";

const TOTAL_STEPS = 4;
const STEP_LABELS = ["Welcome", "Your goal", "Your pace", "First lesson"];

const FIRST_LESSON = {
  href: "/curriculum/level-00-bits-logic/what-is-a-bit",
  title: "What is a bit?",
  timeMin: 4,
};

const GOALS = [
  {
    id: "fundamentals",
    icon: GraduationCap,
    iconBg: "bg-xp-bg",
    iconFg: "text-brand-violet",
    title: "Understand the fundamentals",
    subtitle: "I want to finally get how computers actually work, bottom-up.",
  },
  {
    id: "c-systems",
    icon: Code2,
    iconBg: "bg-xp-bg",
    iconFg: "text-brand-violet",
    title: "Get stronger at C & systems",
    subtitle: "I can code, but pointers, memory and the OS still feel fuzzy.",
  },
  {
    id: "exam-prep",
    icon: Clock,
    iconBg: "bg-[#FFF1EC]",
    iconFg: "text-[#FF6B4A]",
    title: "Prep for an exam or interview",
    subtitle: "I need to be solid on CS foundations, fast.",
  },
  {
    id: "curious",
    icon: Compass,
    iconBg: "bg-[#E7F8F0]",
    iconFg: "text-[#12A472]",
    title: "Just curious",
    subtitle: "No big goal — I want to explore and learn something real.",
  },
] as const;

/** The pace you pick here is your daily goal: it sizes the dashboard's checklist each day. */
const PACES = [
  { id: "casual", goal: 10, kbd: "5m", title: "Casual", subtitle: "One lesson a day." },
  { id: "regular", goal: 20, kbd: "15m", title: "Regular", subtitle: "One lesson and a review of your cards a day." },
  { id: "intense", goal: 40, kbd: "30m", title: "Serious", subtitle: "Two lessons and a review a day." },
] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [goalId, setGoalId] = useState<(typeof GOALS)[number]["id"]>("fundamentals");
  const [paceId, setPaceId] = useState<(typeof PACES)[number]["id"]>("regular");

  const goal = GOALS.find((g) => g.id === goalId)!;
  const pace = PACES.find((p) => p.id === paceId)!;

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-brand-gradient shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 15 6-6 6 6" />
              <path d="m6 9 6-6 6 6" opacity=".55" />
            </svg>
          </div>
          <span className="font-display text-[21px] font-extrabold tracking-tight">Ascend</span>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-ink-muted">
          Skip for now
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-5 pb-16 pt-6 sm:pt-11">
        <div className="w-full max-w-[680px]">
          {/* Step indicator */}
          <div className="mb-8 flex items-center gap-2.5">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const state = n < step ? "done" : n === step ? "active" : "pending";
              return (
                <div key={label} className="flex flex-1 items-center gap-2.5 last:flex-none">
                  <div className="flex flex-none items-center gap-2.5">
                    {state === "done" ? (
                      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-[#12B981]">
                        <Check size={13} strokeWidth={3.2} className="text-white" />
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full text-[13px] font-extrabold",
                          state === "active"
                            ? "bg-gradient-to-br from-brand-violet to-brand-violet text-white shadow-[0_6px_16px_rgba(13,159,110,0.4)]"
                            : "border-2 border-card-border bg-white text-ink-faint",
                        )}
                      >
                        {n}
                      </span>
                    )}
                    <span
                      className={cn(
                        "hidden whitespace-nowrap text-[13.5px] font-bold sm:inline",
                        state === "done" ? "text-[#12A472]" : state === "active" ? "text-brand-violet" : "text-ink-faint",
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  {n < TOTAL_STEPS && (
                    <div className={cn("h-0.5 min-w-[16px] flex-1 rounded-full", n < step ? "bg-[#12B981]" : "bg-card-border")} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-[24px] border border-divider bg-white p-7 shadow-[0_20px_50px_rgba(28,18,64,0.09)] sm:p-9">
            {step === 1 && (
              <div>
                <div className="mb-7 text-center">
                  <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-brand-gradient shadow-[0_16px_34px_rgba(13,159,110,0.35)]">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 15 6-6 6 6" />
                      <path d="m6 9 6-6 6 6" opacity=".55" />
                    </svg>
                  </div>
                  <h1 className="mb-2.5 font-display text-[27px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[30px]">
                    Welcome to Ascend.
                  </h1>
                  <p className="mx-auto max-w-[460px] text-[15px] leading-relaxed text-ink-secondary">
                    You&apos;re about to learn computer science the way it actually works — from a
                    single bit up to a working shell. Let&apos;s get you set up in under a minute.
                  </p>
                </div>
                <div className="mx-auto flex max-w-[380px] flex-col gap-2.5">
                  {[
                    "Tell us what brings you here",
                    "Set a pace that fits your life",
                    "Jump straight into your first lesson",
                  ].map((text, i) => (
                    <div key={text} className="flex items-center gap-3 text-sm text-ink-secondary">
                      <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-xp-bg text-[11px] font-extrabold text-brand-violet">
                        {i + 1}
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="mb-7 text-center">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-xp-bg px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.1em] text-brand-violet">
                    Step 2 of 4
                  </span>
                  <h1 className="mb-2.5 font-display text-[27px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[30px]">
                    What brings you to Ascend?
                  </h1>
                  <p className="text-[15px] leading-relaxed text-ink-secondary">
                    Pick what fits best — we&apos;ll tailor your path. You can change it anytime.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {GOALS.map((g) => {
                    const selected = g.id === goalId;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGoalId(g.id)}
                        className={cn(
                          "flex items-center gap-4 rounded-2xl border-[1.5px] p-4.5 text-left transition-all hover:-translate-y-0.5",
                          selected ? "border-brand-violet bg-xp-bg" : "border-card-border bg-white hover:border-xp-border",
                        )}
                      >
                        <span className={cn("flex h-12 w-12 flex-none items-center justify-center rounded-[13px]", g.iconBg, g.iconFg)}>
                          <g.icon size={21} strokeWidth={2.1} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[15.5px] font-bold text-ink">{g.title}</div>
                          <div className="mt-0.5 text-[13px] leading-snug text-ink-muted">{g.subtitle}</div>
                        </div>
                        <span
                          className={cn(
                            "flex h-6 w-6 flex-none items-center justify-center rounded-full border-2",
                            selected ? "border-brand-violet bg-brand-violet" : "border-card-border bg-white",
                          )}
                        >
                          {selected && <Check size={12} strokeWidth={3.2} className="text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="mb-7 text-center">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-xp-bg px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.1em] text-brand-violet">
                    Step 3 of 4
                  </span>
                  <h1 className="mb-2.5 font-display text-[27px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[30px]">
                    What pace fits your life?
                  </h1>
                  <p className="text-[15px] leading-relaxed text-ink-secondary">
                    This is your daily goal. A lesson a day keeps your streak. Change it anytime in Settings.
                  </p>
                </div>
                <div className="mb-5 flex flex-col gap-3">
                  {PACES.map((p) => {
                    const selected = p.id === paceId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPaceId(p.id)}
                        className={cn(
                          "flex items-center gap-4 rounded-2xl border-[1.5px] p-4.5 text-left transition-all hover:-translate-y-0.5",
                          selected ? "border-brand-violet bg-xp-bg" : "border-card-border bg-white hover:border-xp-border",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-12 w-12 flex-none items-center justify-center rounded-[13px] font-mono text-[13px] font-bold",
                            selected ? "bg-xp-bg text-brand-violet" : "bg-elevated text-ink-muted",
                          )}
                        >
                          {p.kbd}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[15.5px] font-bold text-ink">{p.title}</div>
                          <div className="mt-0.5 text-[13px] leading-snug text-ink-muted">{p.subtitle}</div>
                        </div>
                        <span
                          className={cn(
                            "flex h-6 w-6 flex-none items-center justify-center rounded-full border-2",
                            selected ? "border-brand-violet bg-brand-violet" : "border-card-border bg-white",
                          )}
                        >
                          {selected && <Check size={12} strokeWidth={3.2} className="text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between gap-3.5 rounded-2xl border border-divider bg-elevated px-4 py-3.5">
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-ink-secondary">
                    <Bell size={16} className="text-brand-violet" strokeWidth={2.2} />
                    Remind me daily at
                  </div>
                  <span className="rounded-full bg-xp-bg px-3 py-1.5 font-mono text-[13px] font-bold text-brand-violet">
                    8:00 PM
                  </span>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="mb-6 text-center">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E7F8F0] px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.1em] text-[#12A472]">
                    Step 4 of 4
                  </span>
                  <h1 className="mb-2.5 font-display text-[27px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[30px]">
                    You&apos;re all set.
                  </h1>
                  <p className="text-[15px] leading-relaxed text-ink-secondary">
                    Your path starts at the very bottom — bits and logic — and climbs from there.
                  </p>
                </div>
                <Link
                  href={FIRST_LESSON.href}
                  className="relative mb-5 block overflow-hidden rounded-[18px] bg-[#16181d] p-5 text-white"
                >
                  <div className="animate-blob pointer-events-none absolute -right-8 -top-10 h-[140px] w-[140px] rounded-full bg-[radial-gradient(circle,rgba(13,159,110,0.45),transparent_68%)] blur-[8px]" />
                  <div className="relative flex items-center gap-4">
                    <span className="flex h-[50px] w-[50px] flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#12B981] to-[#3BC6F0] font-display text-[17px] font-extrabold shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
                      00
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 font-mono text-[11px] text-ink-faint">
                        Bits &amp; Logic · first lesson
                      </div>
                      <div className="font-display text-[18px] font-extrabold">{FIRST_LESSON.title}</div>
                    </div>
                    <span className="flex-none font-mono text-xs text-ink-faint">{FIRST_LESSON.timeMin} min</span>
                  </div>
                </Link>
                <div className="mx-auto flex max-w-[420px] flex-col gap-2">
                  <div className="flex items-center gap-2.5 text-[13.5px] text-ink-secondary">
                    <Check size={15} strokeWidth={3} className="flex-none text-[#12A472]" />
                    Goal — <b className="text-ink">{goal.title}</b>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] text-ink-secondary">
                    <Check size={15} strokeWidth={3} className="flex-none text-[#12A472]" />
                    Pace — <b className="text-ink">{pace.title}, {pace.kbd.replace("m", " min")}/day</b> · reminders at 8:00 PM
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2 py-3 text-[14.5px] font-semibold text-ink-muted transition-transform hover:-translate-y-0.5",
                  step === 1 && "invisible",
                )}
              >
                <ChevronLeft size={16} strokeWidth={2.3} />
                Back
              </button>
              {step < TOTAL_STEPS ? (
                <button
                  onClick={() => {
                    if (step === 3) {
                      // Save the pace as the daily goal: in this browser, and on the account when signed in.
                      writeDailyGoal(null, pace.goal);
                      void savePracticeDailyGoalAction(pace.goal);
                    }
                    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
                  }}
                  className="inline-flex items-center gap-2 rounded-[13px] bg-brand-gradient px-8 py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(13,159,110,0.4)] transition-transform hover:-translate-y-0.5"
                >
                  Continue
                  <ChevronRight size={16} strokeWidth={2.4} />
                </button>
              ) : (
                <Link
                  href={FIRST_LESSON.href}
                  className="inline-flex items-center gap-2 rounded-[13px] bg-brand-gradient px-8 py-3.5 text-[15.5px] font-extrabold text-white shadow-[0_14px_30px_rgba(13,159,110,0.4)] transition-transform hover:-translate-y-0.5"
                >
                  Start learning
                  <Play size={15} className="fill-white" strokeWidth={0} />
                </Link>
              )}
            </div>
          </div>
          <div className="mt-5 text-center font-mono text-[13px] text-ink-faint">
            Takes 30 seconds · no account needed yet
          </div>
        </div>
      </main>
    </div>
  );
}
