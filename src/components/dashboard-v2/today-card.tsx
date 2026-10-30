"use client";

import Link from "next/link";
import { Check, Flame } from "lucide-react";
import { GoalLink } from "@/components/practice/coach-home/your-day-card";
import { buildDayPlan } from "@/lib/dashboard/day-plan";
import type { CoachHomeModel } from "@/lib/practice/coach-home-model";
import { localDayKey } from "@/lib/practice/sm2";

const CARD = "flex flex-col gap-4 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5";

/**
 * Today's checklist, sized by the daily goal (set once, in onboarding or Settings),
 * ticked by what really happened today, with the one streak under it.
 */
export function TodayCard({
  model,
  lessonsDone,
  nextLessons,
}: {
  model: CoachHomeModel | null;
  lessonsDone: { title: string; at: string }[];
  nextLessons: { title: string; href: string }[];
}) {
  if (!model) return <div className={`${CARD} min-h-[240px]`} aria-busy="true" />;

  const todayKey = localDayKey(new Date());
  const lessonsToday = lessonsDone.filter((l) => localDayKey(new Date(l.at)) === todayKey);
  const reviewedToday = model.sessions.rows.length > 0;
  const plan = buildDayPlan({
    goal: model.day.goal,
    dueNow: model.hero.dueNow,
    reviewHref: model.hero.action.href,
    reviewedToday,
    lessonsToday,
    nextLessons,
  });
  const activeToday = reviewedToday || lessonsToday.length > 0;
  const streak = model.day.streak;

  return (
    <section aria-labelledby="today-title" className={CARD}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="today-title" className="m-0 text-[16px] font-bold">
          {plan.done ? "Done for today" : "Today"}
        </h2>
        <GoalLink goal={plan.goal} />
      </div>

      {plan.items.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {plan.items.map((item) => {
            const body = (
              <>
                <span
                  aria-hidden
                  className={`mt-px flex size-5 shrink-0 items-center justify-center rounded-md border-2 ${
                    item.done
                      ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-surface)]"
                      : "border-[var(--coach-border-strong)]"
                  }`}
                >
                  {item.done && <Check size={13} strokeWidth={3} />}
                </span>
                <span
                  className={`text-[14.5px] leading-snug [text-wrap:pretty] ${
                    item.done ? "text-[var(--coach-ink-muted)]" : "font-semibold text-[var(--coach-ink)]"
                  }`}
                >
                  <span className="sr-only">{item.done ? "Done: " : "To do: "}</span>
                  {item.text}
                </span>
              </>
            );
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="-mx-2 flex items-start gap-3 rounded-xl px-2 py-1.5 no-underline hover:bg-[var(--coach-tint-neutral-bg)]"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="-mx-2 flex items-start gap-3 px-2 py-1.5">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
          Nothing due and every lesson done. Work on ShellForge whenever you like.
        </p>
      )}

      <div className="mt-auto flex items-center gap-3 border-t-2 border-[var(--coach-divider)] pt-3.5">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
            activeToday
              ? "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]"
              : "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-muted)]"
          }`}
        >
          <Flame size={18} strokeWidth={2.2} aria-hidden />
        </span>
        <span className="flex flex-col">
          <span className="text-[15px] font-bold leading-tight">
            {streak > 0 ? `${streak}-day streak` : "No streak yet"}
          </span>
          <span className="text-[12.5px] leading-snug text-[var(--coach-ink-muted)]">
            {activeToday
              ? "Today counts. See you tomorrow."
              : streak > 0
                ? "A lesson or a review today keeps it going."
                : "A lesson or a review starts one."}
          </span>
        </span>
      </div>
    </section>
  );
}
