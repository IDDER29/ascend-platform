/**
 * Ribbon bars for the chest view: each badge gets an original, symmetric
 * stripe pattern (stable per badge id) drawn from its group's colours,
 * and a precedence order for wearing them.
 */
import type { AchievementGroup } from "./catalog";

export type Stripe = { color: string; width: number };

/** Highest honour first: worn top-left on the chest. */
export const PRECEDENCE: AchievementGroup[] = ["combination", "building", "remembering", "learning", "habits"];

const PALETTES: Record<AchievementGroup, string[]> = {
  combination: ["var(--coach-hero-ink)", "var(--coach-lime)", "var(--coach-blue)", "var(--coach-orange)"],
  building: ["var(--coach-lime)", "var(--coach-hero-bg)", "var(--coach-lime-shadow)", "var(--coach-hero-ink)"],
  remembering: ["var(--coach-scale-4)", "var(--coach-scale-1)", "var(--coach-blue)", "var(--coach-hero-ink)"],
  learning: ["var(--coach-blue)", "var(--coach-hero-ink)", "var(--coach-scale-2)", "var(--coach-scale-4)"],
  habits: ["var(--coach-orange)", "var(--coach-hero-ink)", "var(--coach-wrong-strong)", "var(--coach-hero-bg)"],
};

function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Stripes left to right, widths in percent summing to 100. The left half
 * is three bands picked from the group palette; the right half mirrors it,
 * so every ribbon reads as one balanced design.
 */
export function ribbonStripes(id: string, group: AchievementGroup): Stripe[] {
  const palette = PALETTES[group];
  let h = hash(id);
  const next = (n: number) => {
    const v = h % n;
    h = (Math.floor(h / n) ^ hash(`${id}:${v}`)) >>> 0;
    return v;
  };
  // Three bands for the half: an edge, a middle and a centre band (widths sum to 50).
  const edge = 6 + next(10);
  const middle = 8 + next(14);
  const centre = 50 - edge - middle;
  const first = next(palette.length);
  const colors = [palette[first], palette[(first + 1 + next(palette.length - 1)) % palette.length]];
  colors.push(palette.find((c) => !colors.includes(c))!);
  const half: Stripe[] = [
    { color: colors[0], width: edge },
    { color: colors[1], width: middle },
    { color: colors[2], width: centre },
  ];
  // Mirror: the centre band is shared, so it appears once at double width.
  return [
    half[0],
    half[1],
    { color: half[2].color, width: half[2].width * 2 },
    half[1],
    half[0],
  ];
}

/** CSS for a ribbon: hard-edged vertical stripes. */
export function ribbonBackground(stripes: Stripe[]): string {
  let at = 0;
  const stops = stripes.flatMap((s) => {
    const from = at;
    at += s.width;
    return [`${s.color} ${from}%`, `${s.color} ${at}%`];
  });
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}

/** Wear order: by group precedence, then catalog order within a group. */
export function byPrecedence<T extends { group: AchievementGroup }>(items: T[]): T[] {
  return [...items]
    .map((item, i) => ({ item, i }))
    .sort((a, b) => PRECEDENCE.indexOf(a.item.group) - PRECEDENCE.indexOf(b.item.group) || a.i - b.i)
    .map(({ item }) => item);
}

/**
 * Rack rows of `perRow`, highest first. As on a uniform, the top row holds
 * the remainder (and is centred by the caller) so the rows below are full.
 */
export function rackRows<T>(items: T[], perRow = 3): T[][] {
  if (items.length === 0) return [];
  const top = items.length % perRow || perRow;
  const rows: T[][] = [items.slice(0, top)];
  for (let i = top; i < items.length; i += perRow) rows.push(items.slice(i, i + perRow));
  return rows;
}
