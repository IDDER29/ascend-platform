# Phosphor Theme — Doctrine & Global Style System

**Status:** source of truth for Ascend marketing + product surfaces  
**Code:** `src/app/globals.css` (tokens + utilities) · `src/components/homepage/landing-styles.ts` (TS exports)  
**Rule:** `.cursor/rules/phosphor-theme.mdc`  
**Runbook (issues we hit + how we fixed them):** `docs/design/PHOSPHOR-LESSONS-AND-RUNBOOK.md` — **look here first** when a similar bug or visual regression shows up.

---

## 1. What Phosphor is

Phosphor is Ascend’s production visual language: a **quiet night-study desk**, not a neon SaaS dashboard.

| Axis | Choice | Why |
|------|--------|-----|
| Brand | Green → teal → soft gold | Systems / “phosphor” glow; **no purple** |
| Light | Soft mint-gray paper (`#f2f4f1`) | Eye comfort for long reading |
| Dark | Lifted charcoal (`#121816`), soft ink | Night study — not pure black, not purple-on-black |
| Type | Bricolage (display) · Hanken (body) · IBM Plex Mono (labels) | Technical but human |
| Motion | Few, intentional (`rise`, crystal sheen, CTA blobs) | Presence without noise |

Legacy token names `--brand-violet` / `--brand-magenta` still exist for compatibility; **values are green/teal**. Prefer semantic usage (`bg-brand-gradient`, `text-brand-violet`) over inventing new brand hexes in components.

---

## 2. Typography scale (learning + hub)

Ascend is a **teaching** product. Most time is spent reading. Prefer calm sameness over expressive one-offs. Landing may be slightly more expressive; curriculum / paths / lessons must feel like a quiet book.

### Faces (three roles only)

| Role | Face | Use |
|------|------|-----|
| Display | Bricolage (`font-display`) | Page / course / section titles |
| Body | Hanken (`font-sans`) | Descriptions, lesson prose, card copy |
| Labels | IBM Plex Mono (`font-mono`) | Breadcrumbs, meta, status, “Course · N lessons” |

Do **not** add a fourth family. Do **not** put display or mono on long paragraphs.

### Size ladder (reuse these)

| Step | Size | Typical use |
|------|------|-------------|
| Label | `11px` mono · `tracking-[0.1em]`–`[0.12em]` · uppercase when meta | Breadcrumb accents, Course · N, Open/Soon, times |
| Small UI | `12px`–`12.5px` | Secondary asides, % captions |
| Row / compact | `13.5px` bold | Lesson rows, “Up next” titles |
| Body | `15px` · `leading-relaxed` | Path/course descriptions, card body, `PageHeader` description |
| Card title | `16px`–`17px` display extrabold | “Your progress”, “Up next”, rail headings |
| Section | `14px` display extrabold (in-outline) · `20px`–`22px` display (page section) | Outline group titles · “Course outline” |
| Page title | `28px` → `sm:32px` display · `tracking-[-0.032em]` | Hub / course H1 (`PageHeader`) |
| Feature lesson | `20px` → `sm:22px` display | Start/Continue band lesson title |

**Measure:** body ~`60–72ch` (or parent max-width that yields that). Avoid &lt;14px body and &gt;80ch lines on learning pages.

### Contrast

| Text | Token |
|------|--------|
| Titles | `text-ink` |
| Body | `text-ink-secondary` |
| Meta / labels | `text-ink-fainter` |
| Accent links / live actions | `text-brand-violet` (green) |

### Do / don’t

**Do**

- Pick from the ladder above; if a size appears twice, keep using it
- Match curriculum / Foundations / `PageHeader` when adding hub UI
- Keep lesson prose in the body face at 15px+ with relaxed leading

**Don’t**

- Invent a new px per card (“this one needs 18.5”)
- Use display weight for multi-line body
- Use mono for sentences
- Drop body below 14px to fit more content
- Reintroduce purple type accents

### Surfaces for reading

| Surface | Role |
|---------|------|
| Sidebar | `bg-bg` (chrome) |
| Hub main | `bg-paper` via `HUB_MAIN_CLASS` (reading stage) |
| Hub content column | AppShell learner hubs: **960px** max via `HUB_CONTENT_CLASS` (`page-header.tsx`); marketing/landing width stays `--layout-max` |
| Cards / outline lists | `bg-elevated` or bordered paper on the stage |

---

## 3. Problems we found (and fixed)

Short table below. **Full case studies** (wrong first instinct, what we missed, steps, prevention):  
→ [`PHOSPHOR-LESSONS-AND-RUNBOOK.md`](./PHOSPHOR-LESSONS-AND-RUNBOOK.md)

These are the lessons that shaped the token system. Do not reintroduce them.

| Problem | Root cause | Fix |
|---------|------------|-----|
| Dark mode looked “terrible” / broken | `@theme` baked literal RGB; utilities ignored `.dark` | Runtime tokens on `:root` / `.dark`; `@theme inline` only via `var()`; `@custom-variant dark` |
| Lesson mock stuck in light | Forced light surfaces on preview | Theme with page (`bg-elevated`, `text-ink`, etc.) |
| `#how` felt muddy / warm | Wrong band tone (`warm`) | Use `tint` (`--landing-tint`) |
| Break icon was solid yellow | One-off accent color | Same `bg-brand-gradient` as siblings + **crystal glaze** (`.icon-crystal`) |
| Glass felt flat | Blur without wash / rim | Wash blobs behind → frosted `.glass-surface` → crystal icon on top |
| Layouts broke on small screens | Fixed grids / missing `min-w-0` | Fluid `clamp`, `min-w-0`, responsive grids |
| Same styles retyped everywhere | Copy-pasted Tailwind stacks | **Tokens + shared utility classes** (this doc) |

---

## 4. Architecture — change once, apply everywhere

```
:root / .dark          →  raw design tokens (hex, shadows, glass)
        ↓
@theme inline          →  Tailwind color/shadow utilities (bg-bg, text-ink, …)
        ↓
globals.css utilities  →  .bg-brand-gradient, .glass-surface, .icon-crystal, .brand-mark, …
        ↓
landing-styles.ts      →  named exports for React (landingH2Class, …)
        ↓
components             →  compose layout with Tailwind; never hardcode brand hex
```

**Rule:** If a visual formula appears twice, it belongs in a token or a utility — not a third paste.

### Where to edit

| Want to change… | Edit |
|-----------------|------|
| Brand greens / gold | `:root` `--brand-violet`, `--brand-magenta`, `--brand-orange` (and `.theme-phosphor`) |
| Light / dark surfaces | `:root` / `.dark` `--surface-*`, `--ink-*` |
| Glass look | `--glass-*`, `--glass-wash-*` |
| Crystal icon look | `--crystal-shadow`, `--crystal-rim` (+ `.icon-crystal` layers) |
| Brand mark sheen | `--brand-glow`, `--brand-sheen` |
| Page max width | `--layout-max` |
| Icon / glass radii | `--radius-icon`, `--radius-glass`, `--radius-cta` |
| Focus / selection | `--focus-ring` |

Dark overrides live in `.dark { … }` for the same names. Light and dark stay in sync by sharing names, not by duplicating component classes.

---

## 5. Shared primitives (use these)

### CSS utilities (`globals.css`)

| Class | Role |
|-------|------|
| `.bg-brand-gradient` | Default brand fill (icons, buttons, panels) |
| `.icon-tile` | Standard step/feature icon size + radius |
| `.icon-crystal` | Break (special) — same gradient + crystal glaze |
| `.glass-surface` | Frosted glass panel |
| `.glass-wash` | Soft color wash behind glass |
| `.brand-mark` / `.brand-mark--sm` | Nav / footer Ascend mark |
| `.landing-eyebrow` / `.landing-h2` / `.landing-lead` | Section type rhythm |
| `.cta-panel` | Final CTA gradient block |
| `.bg-landing-tint` / `.bg-landing-warm` | Section bands |

### TS exports (`landing-styles.ts`)

Prefer importing:

- `landingEyebrowClass`, `landingH2Class`, `landingLeadClass`
- `landingIconTileClass`, `landingIconCrystalClass`
- `glassSurfaceClass`, `glassWashClass`
- `brandMarkClass`, `brandMarkSmClass`
- `ctaPanelClass`
- `landingCardClass`, `landingCardOnTintClass`

### Section shells

- `SectionBand` — tones: `wash` | `paper` | `tint` | `warm` | `ink`
- `SectionHeading` — centered eyebrow + title + subtitle

---

## 6. Break (signature) — do / don’t

**Do**

- Same green→gold gradient as Learn / Build / Debug / Explain
- Crystal glaze only on Break (`.icon-crystal`)
- Frosted island: wash → `.glass-surface` → content
- Badge “The difference” as the verbal callout

**Don’t**

- Solid yellow / one-off gold tile for Break
- Crystal glaze on every icon (Break must stay special)
- Cards-in-hero or purple glow defaults

---

## 7. Dark mode contract

1. Toggle sets `document.documentElement.classList` + `localStorage['ascend-theme']`.
2. Never put literal hex into `@theme` for surfaces that must flip — use `var(--…)`.
3. Prefer semantic utilities: `bg-bg`, `bg-paper`, `bg-elevated`, `text-ink`, `border-card-border`.
4. Avoid `bg-white` / `text-black` on themed surfaces.

---

## 8. Checklist for new UI

- [ ] Colors from tokens / utilities, not new hex
- [ ] Type from §2 ladder (faces + sizes); no one-off px
- [ ] Icons: `landingIconTileClass` (or crystal only if intentionally special)
- [ ] Section titles: `landingEyebrowClass` + `landingH2Class` + `landingLeadClass` (marketing) or §2 page/section steps (hub)
- [ ] Width: `max-w-[var(--layout-max)]` (or `SectionBand`)
- [ ] Body measure ~60–72ch on learning surfaces
- [ ] `min-w-0` on flex/grid children
- [ ] Works in light **and** dark
- [ ] Respects `prefers-reduced-motion` for glass blur / sheen

---

## 9. Related files

| Path | Role |
|------|------|
| `src/app/globals.css` | Tokens, dark overrides, utilities |
| `src/components/homepage/landing-styles.ts` | Named class exports |
| `src/components/homepage/theme-toggle.tsx` | Light/dark persistence |
| `src/lib/landing-themes.ts` | Theme preview class names |
| `.cursor/rules/phosphor-theme.mdc` | Agent enforcement |
