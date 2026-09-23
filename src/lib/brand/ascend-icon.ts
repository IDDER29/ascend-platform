/**
 * Shared Ascend mark for generated app icons (ImageResponse / OG).
 * Colors match Phosphor brand gradient (globals.css).
 */
export const ASCEND_BRAND = {
  violet: "#0d9f6e",
  magenta: "#1a9b8e",
  orange: "#d4a017",
  gradient: "linear-gradient(135deg, #0d9f6e 0%, #1a9b8e 58%, #d4a017 100%)",
} as const;

/** Double-chevron mark as SVG string (viewBox 0 0 24 24). */
export function ascendChevronSvg(stroke = "#fff", size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/><path d="m6 9 6-6 6 6" opacity=".55"/></svg>`;
}

export function ascendChevronDataUri(stroke = "#fff", size = 24) {
  return `data:image/svg+xml,${encodeURIComponent(ascendChevronSvg(stroke, size))}`;
}
