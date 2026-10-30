"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Check } from "lucide-react";
import { finishOnboardingAction } from "@/lib/onboarding/actions";
import { DEFAULT_DAILY_GOAL, GOAL_PLANS, type DailyGoal, writeDailyGoal } from "@/lib/practice/daily-goal";

export type StartOption = {
  slug: string;
  title: string;
  /** The path's icon, drawn on the server. */
  icon: React.ReactNode;
  /** Who should start here. */
  forWhom: string;
  firstLesson: { title: string; timeMin: number } | null;
};

const GOALS = Object.entries(GOAL_PLANS).map(([goal, plan]) => ({ goal: Number(goal) as DailyGoal, ...plan }));

/** A choice drawn as a card around a real radio button, so keyboards and screen readers get a radio group. */
function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`relative flex cursor-pointer gap-4 rounded-[20px] border-2 p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--coach-focus)] sm:p-5 ${
        checked
          ? "border-[var(--coach-ink)] bg-[var(--coach-surface)]"
          : "border-[var(--coach-border)] bg-[var(--coach-surface)] hover:border-[var(--coach-border-strong)]"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {children}
      <span
        aria-hidden
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
          checked
            ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-bg)]"
            : "border-[var(--coach-border-strong)]"
        }`}
      >
        {checked && <Check size={14} strokeWidth={3.2} />}
      </span>
    </label>
  );
}

function StartButton({ lesson }: { lesson: StartOption["firstLesson"] }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--coach-lime)] px-7 text-[16px] font-bold text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Setting things up…" : "Start my first lesson"}
      </button>
      {lesson && (
        <p className="m-0 text-[14.5px] text-[var(--coach-ink-secondary)]">
          “{lesson.title}”, {lesson.timeMin} min
        </p>
      )}
    </div>
  );
}

export function OnboardingForm({
  userId,
  starts,
  initialGoal,
}: {
  userId: string | null;
  starts: StartOption[];
  initialGoal: DailyGoal | null;
}) {
  const [path, setPath] = useState(starts[0]?.slug ?? "");
  const [goal, setGoal] = useState<DailyGoal>(initialGoal ?? DEFAULT_DAILY_GOAL);
  const chosen = starts.find((s) => s.slug === path) ?? null;

  return (
    <form
      action={finishOnboardingAction}
      // The goal also lives in this browser, as Practice and Today read it from there first.
      onSubmit={() => writeDailyGoal(userId, goal)}
      className="flex flex-col gap-10"
    >
      <fieldset className="m-0 border-0 p-0">
        <legend className="m-0 p-0 font-display text-[24px] font-extrabold leading-tight tracking-[-0.02em]">
          Where do you want to start?
        </legend>
        <p className="m-0 mt-1.5 text-[15px] text-[var(--coach-ink-secondary)]">
          You can join other paths later, from Paths.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {starts.map((s) => (
            <Choice key={s.slug} name="path" value={s.slug} checked={path === s.slug} onChange={() => setPath(s.slug)}>
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]"
              >
                {s.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-bold leading-tight">{s.title}</span>
                <span className="mt-1 block text-[14.5px] leading-snug text-[var(--coach-ink-secondary)]">
                  {s.forWhom}
                </span>
              </span>
            </Choice>
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className="m-0 p-0 font-display text-[24px] font-extrabold leading-tight tracking-[-0.02em]">
          How much each day?
        </legend>
        <p className="m-0 mt-1.5 text-[15px] text-[var(--coach-ink-secondary)]">
          Your Today page turns this into a short checklist. Change it any time in Settings.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {GOALS.map((g) => (
            <Choice
              key={g.goal}
              name="goal"
              value={String(g.goal)}
              checked={goal === g.goal}
              onChange={() => setGoal(g.goal)}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-bold leading-tight">{g.label}</span>
                <span className="mt-1 block text-[14.5px] leading-snug text-[var(--coach-ink-secondary)]">
                  {g.plan}
                </span>
                <span className="mt-2 block text-[13px] text-[var(--coach-ink-muted)]">
                  {g.review ? `Reviews ${g.cards}` : "Reviews when you want"}
                </span>
              </span>
            </Choice>
          ))}
        </div>
      </fieldset>

      <StartButton lesson={chosen?.firstLesson ?? null} />
    </form>
  );
}
