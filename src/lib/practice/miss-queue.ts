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
