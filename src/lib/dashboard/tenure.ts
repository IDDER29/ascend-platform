/** Calendar days since `from` (inclusive of today as day 1 when same day). */
export function daysOnSince(from: Date, now: Date = new Date()): number {
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.max(0, Math.round((end - start) / 86_400_000));
  return diff + 1; // day 1 = created / entered today
}

/** Short tenure copy: “Started today” · “Day 2” · “12 days”. */
export function formatTenureDays(days: number): string {
  if (days <= 1) return "Started today";
  if (days === 2) return "Day 2";
  return `${days} days`;
}

export function formatAccountTenure(days: number): string {
  if (days <= 1) return "Day 1 on Ascend";
  return `Day ${days} on Ascend`;
}

export function formatPathTenure(days: number): string {
  if (days <= 1) return "Started today";
  if (days === 2) return "2 days on path";
  return `${days} days on path`;
}
