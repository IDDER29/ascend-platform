# Ascend brand icons

The mark is two chevrons climbing, **lime `#d7f26b` on an ink tile `#16181d`** (the Coach `--coach-mark-ink` / `--coach-mark-bg`). The chevrons are 55% of the tile, stroke 2.8 on a 24 grid, corners 10/32 of the tile. In the app it's `BrandMark` (`src/components/site/site-ui.tsx`); everywhere else it's generated from `src/lib/brand/ascend-icon.ts` (`ascendMarkSvg`, tested). Change the mark there and in these files together.

## In the page head (auto-wired)

| File | Output | Use |
|------|--------|-----|
| `public/favicon.svg` | SVG | Main tab icon. Ink tile; in a dark browser UI (`prefers-color-scheme: dark`) it flips to a lime tile with ink chevrons so it doesn't vanish. |
| `src/app/icon.tsx` | `/icon/32`, `/icon/192`, `/icon/512` (PNG) | 32: fallback tab icon. 192 / 512: the web app manifest. |
| `src/app/apple-icon.tsx` | `/apple-icon` 180×180 | iOS home screen: full-bleed ink (iOS rounds the corners), chevrons at 50% for the safe area. |
| `src/app/manifest.ts` | `/manifest.webmanifest` | "Add to Home Screen": opens on Today, standalone, Coach background. |
| `src/app/opengraph-image.tsx` | 1200×630 | Default link preview (Open Graph + X). |
| `src/app/(learner)/lessons/[publicSlug]/opengraph-image.tsx` | 1200×630 | A shared lesson: topic name + title + minutes. |
| `src/app/catalog/[slug]/opengraph-image.tsx` | 1200×630 | A shared path: title + pitch. |

Because `metadata.icons` is set in `src/app/layout.tsx`, Next doesn't add icon tags by itself: every icon is listed there. Share images all come from `shareImage()` in `src/lib/brand/share-image.tsx` (ink background, lime mark, title), so they look the same. They use the image renderer's built-in font (regular weight only).

Page titles are just the page's name ("Practice"); the root layout's template adds " — Ascend". The home page uses an absolute title. `viewport.themeColor` gives the phone's browser bar the Coach page colour in light (`#f6f4ee`) and dark (`#121416`).

## Static assets (`public/`)

| File | Use |
|------|-----|
| `favicon.svg` | The tab icon (above). |
| `mark.svg` | The mark alone, for README / press. |
| `logo.svg` | Mark + "Ascend" wordmark (Bricolage Grotesque, falling back to the system sans). |

## Rule

Don't re-add Vercel/Next starter artwork or the old green-to-gold Phosphor gradient.
