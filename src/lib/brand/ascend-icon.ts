/**
 * Ascend's mark, for everything outside the React tree: generated icons and share images (ImageResponse),
 * the favicon and the SVG files in public/. It matches `BrandMark` (src/components/site/site-ui.tsx):
 * two chevrons climbing, lime on an ink tile, the chevrons 55% of the tile, stroke 2.8 on a 24 grid.
 */
export const ASCEND_BRAND = {
  /** --coach-mark-bg / --coach-ink */
  ink: "#16181d",
  /** --coach-mark-ink / --coach-lime */
  lime: "#d7f26b",
  /** Coach page backgrounds, light and dark (theme-color, manifest). */
  bg: "#f6f4ee",
  bgDark: "#121416",
  /** Muted text on the ink tile (share images). */
  muted: "#b9bcc4",
} as const;

const CHEVRONS = '<path d="m6 15 6-6 6 6"/><path d="m6 9 6-6 6 6" opacity=".55"/>';

/** The two chevrons alone, as SVG (viewBox 0 0 24 24). */
export function ascendChevronSvg(stroke: string = ASCEND_BRAND.lime, size = 24): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${CHEVRONS}</svg>`;
}

export function ascendChevronDataUri(stroke: string = ASCEND_BRAND.lime, size = 24): string {
  return `data:image/svg+xml,${encodeURIComponent(ascendChevronSvg(stroke, size))}`;
}

/**
 * The whole mark as SVG: a tile with the chevrons centred at 55% of its width.
 * `radius` is a share of the tile (0.3125 = the 10/32 corners of BrandMark); 0 for full-bleed icons.
 */
export function ascendMarkSvg({
  size = 32,
  tile = ASCEND_BRAND.ink,
  chevron = ASCEND_BRAND.lime,
  radius = 0.3125,
  scale = 0.55,
}: { size?: number; tile?: string; chevron?: string; radius?: number; scale?: number } = {}): string {
  const round = (n: number) => Math.round(n * 1000) / 1000;
  const inner = size * scale;
  const offset = round((size - inner) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${round(size * radius)}" fill="${tile}"/><g transform="translate(${offset} ${offset}) scale(${round(inner / 24)})" fill="none" stroke="${chevron}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${CHEVRONS}</g></svg>`;
}

export function ascendMarkDataUri(options?: Parameters<typeof ascendMarkSvg>[0]): string {
  return `data:image/svg+xml,${encodeURIComponent(ascendMarkSvg(options))}`;
}
