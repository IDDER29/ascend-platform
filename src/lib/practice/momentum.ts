import type { PracticeSessionRecord } from "./history";

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Local Monday 00:00 of the week containing `d`. */
function startOfLocalWeekMonday(d: Date): Date {
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? 6 : day - 1;
  const mon = startOfLocalDay(d);
  mon.setDate(mon.getDate() - diff);
  return mon;
}

export function cardsClearedToday(
  sessions: PracticeSessionRecord[],
  now = new Date(),
): number {
  const start = startOfLocalDay(now).getTime();
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  ).getTime();
  return sessions.reduce((sum, s) => {
    const t = new Date(s.at).getTime();
    if (Number.isNaN(t) || t < start || t >= end) return sum;
    return sum + s.total;
  }, 0);
}

export function sessionsThisWeek(
  sessions: PracticeSessionRecord[],
  now = new Date(),
): number {
  const start = startOfLocalWeekMonday(now).getTime();
  const end = now.getTime();
  const ids = new Set<string>();
  for (const s of sessions) {
    const t = new Date(s.at).getTime();
    if (Number.isNaN(t) || t < start || t > end) continue;
    ids.add(s.id);
  }
  return ids.size;
}

export type TrainingMomentum = {
  cardsClearedToday: number;
  sessionsThisWeek: number;
};

export function trainingMomentum(
  sessions: PracticeSessionRecord[],
  now = new Date(),
): TrainingMomentum {
  return {
    cardsClearedToday: cardsClearedToday(sessions, now),
    sessionsThisWeek: sessionsThisWeek(sessions, now),
  };
}
