const PREFIX = "ascend_practice_misses_v1";

export function missQueueKey(userId: string | null): string {
  return `${PREFIX}:${userId ?? "guest"}`;
}

export function readMissIds(userId: string | null): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(missQueueKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function writeMissIds(userId: string | null, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(missQueueKey(userId), JSON.stringify(ids));
  } catch {
    // ignore quota / private mode
  }
}

export function enqueueMisses(
  userId: string | null,
  ids: string[],
): string[] {
  const next = [...readMissIds(userId)];
  for (const id of ids) {
    if (!next.includes(id)) next.push(id);
  }
  writeMissIds(userId, next);
  return next;
}

/** After correct answers, drop those ids from the queue. */
export function clearMissesResolved(
  userId: string | null,
  correctIds: string[],
): string[] {
  const drop = new Set(correctIds);
  const next = readMissIds(userId).filter((id) => !drop.has(id));
  writeMissIds(userId, next);
  return next;
}
