/**
 * Today's checklist, sized by the one daily goal: a review when cards are due,
 * plus lessons (none for Casual, one for Regular, two for Serious). Each item
 * is ticked by what really happened today. A day with nothing due and no
 * lessons in the goal still asks for one lesson, so there's always a next step.
 */
import { GOAL_PLANS, type DailyGoal } from "@/lib/practice/daily-goal";

export type DayItem = { id: string; text: string; done: boolean; href: string | null };

export type DayPlan = {
  goal: DailyGoal;
  items: DayItem[];
  done: boolean;
  remaining: number;
};

export type DayPlanInput = {
  goal: DailyGoal;
  /** Cards due now. */
  dueNow: number;
  reviewHref: string;
  /** A review session was finished today. */
  reviewedToday: boolean;
  /** Lessons finished today, oldest first. */
  lessonsToday: { title: string }[];
  /** The next open lessons, in order. */
  nextLessons: { title: string; href: string }[];
};

export function buildDayPlan(input: DayPlanInput): DayPlan {
  const items: DayItem[] = [];
  if (input.reviewedToday) {
    items.push({ id: "review", text: "Reviewed your cards", done: true, href: null });
  } else if (input.dueNow > 0) {
    items.push({ id: "review", text: `Review your due cards (${input.dueNow})`, done: false, href: input.reviewHref });
  }

  const wanted = Math.max(GOAL_PLANS[input.goal].lessons, items.length === 0 ? 1 : 0);
  for (let i = 0; i < wanted; i++) {
    const finished = input.lessonsToday[i];
    if (finished) {
      items.push({ id: `lesson-${i}`, text: `Finished ${finished.title}`, done: true, href: null });
      continue;
    }
    const next = input.nextLessons[i - input.lessonsToday.length];
    if (!next) break;
    items.push({
      id: `lesson-${i}`,
      text: `${i === 0 ? "One lesson" : "Another lesson"}: ${next.title}`,
      done: false,
      href: next.href,
    });
  }

  const remaining = items.filter((item) => !item.done).length;
  return { goal: input.goal, items, done: items.length > 0 && remaining === 0, remaining };
}
