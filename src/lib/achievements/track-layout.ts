/** Where an unearned badge sits on its lane: 0–100 across, and which of two rows. */
export type TrackSpot = { id: string; pos: number; row: 0 | 1 };

/** Keep medallions off the very edges of the lane. */
const EDGE = 4;

/**
 * Place badges by how close they are (ratio 0–1). A badge too close to the
 * previous one in a row (less than `minGap`, percent of the lane) tries the
 * other row; if both are crowded it takes the row that needs the smaller
 * nudge and moves just far enough right to stay readable.
 */
export function placeOnTrack(badges: { id: string; ratio: number }[], minGap = 9): TrackSpot[] {
  const sorted = [...badges].sort((a, b) => a.ratio - b.ratio);
  const last: [number, number] = [-Infinity, -Infinity];
  return sorted.map(({ id, ratio }) => {
    const ideal = EDGE + Math.max(0, Math.min(1, ratio)) * (100 - 2 * EDGE);
    const need0 = Math.max(ideal, last[0] + minGap);
    const need1 = Math.max(ideal, last[1] + minGap);
    const row: 0 | 1 = need0 <= need1 ? 0 : 1;
    const pos = Math.min(100 - EDGE, row === 0 ? need0 : need1);
    last[row] = pos;
    return { id, pos, row };
  });
}
