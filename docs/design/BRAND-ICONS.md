# Ascend brand icons

**Replaces:** create-next-app leftovers (`vercel.svg`, `next.svg`, `globe.svg`, `file.svg`, `window.svg`) and the default Next `favicon.ico`.

## App icons (auto-wired by Next)

| File | Size | Use |
|------|------|-----|
| `src/app/icon.tsx` | 32×32 PNG | Browser tab / default favicon |
| `src/app/apple-icon.tsx` | 180×180 PNG | iOS home screen |

Both render the Phosphor brand gradient + double-chevron mark via `src/lib/brand/ascend-icon.ts`.

## Static assets (`public/`)

| File | Use |
|------|-----|
| `favicon.svg` | SVG favicon (metadata + sharp tabs) |
| `mark.svg` | Full-color mark on brand gradient |
| `mark-mono.svg` | Mark on light surface (green stroke) |
| `mark-on-dark.svg` | Mark on ink tile (white stroke) |
| `logo.svg` | Mark + “Ascend” wordmark |

## Rule

Do not re-add Vercel/Next starter artwork. If the mark changes, update `ascend-icon.ts` + these SVGs together (same chevron paths as header/footer `brand-mark`).
