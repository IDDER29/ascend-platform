/**
 * The one streak: consecutive days with a finished lesson. Reviews don't count
 * toward it. Today counts once a lesson is done; until then the streak runs to
 * yesterday, so it isn't lost before the day is over. Pure, local time.
 */

const DAY_MS = 86_400_000;

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function lessonDays(lessonDates: readonly string[]): Set<string> {
  const days = new Set<string>();
  for (const at of lessonDates) {
    const t = new Date(at);
    if (!Number.isNaN(t.getTime())) days.add(dayKey(t));
  }
  return days;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function lessonStreak(lessonDates: readonly string[], now: Date): number {
  const days = lessonDays(lessonDates);
  let cursor = startOfDay(now);
  if (!days.has(dayKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export type WeekDay = {
  /** "M", "T", … */
  letter: string;
  /** "Monday, October 26" — for screen readers and tooltips. */
  label: string;
  /** A lesson was finished that day. */
  learned: boolean;
  today: boolean;
  future: boolean;
};

const LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

/** This calendar week, Monday to Sunday, marking the days with a finished lesson. */
export function lessonWeek(lessonDates: readonly string[], now: Date): WeekDay[] {
  const days = lessonDays(lessonDates);
  const today = startOfDay(now);
  const monday = addDays(today, -((today.getDay() + 6) % 7));
  return LETTERS.map((letter, i) => {
    const d = addDays(monday, i);
    return {
      letter,
      label: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
      learned: days.has(dayKey(d)),
      today: d.getTime() === today.getTime(),
      future: d.getTime() - today.getTime() >= DAY_MS,
    };
  });
}
