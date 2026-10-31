# Phosphor / Landing — Lessons, Thinking & Runbook

**Purpose:** First place to look when something on the marketing UI (or theme system) feels wrong again.  
**Audience:** Future us + agents.  
**Companion:** `docs/design/PHOSPHOR-THEME.md` (how the system is built) · this file (what broke, how we thought, how we fixed it) · `docs/design/AUTH-PATH-COPY-PLAYBOOK.md` (ladder vs levels + auth card copy).  
**Evidence:** `docs/orchestration/landing-review/shots/` · `docs/orchestration/landing-review/99-JUDGE-FINAL-REPORT.md`

---

## How to use this doc

1. Match the **symptom** in the index below.
2. Read that case: wrong first instinct → what we missed → root cause → fix → prevention.
3. Prefer the **same pattern** over inventing a new one-off.
4. If you invent a new fix, **add a case** at the bottom so the next pass starts here.

---

## Symptom index (look here first)

| If you see… | Go to |
|-------------|--------|
| Dark mode colors don’t change / look broken | [L1](#l1-dark-mode-tokens-dont-flip) |
| Dark mode is “harsh”, pure black, hard on eyes | [L2](#l2-dark-mode-harsh-not-premium) |
| One section stuck light while page is dark | [L3](#l3-forced-light-island) |
| Section background muddy / warm / wrong tint | [L4](#l4-wrong-section-band-tone) |
| Break (or any step) icon wrong color (yellow, purple, etc.) | [L5](#l5-break-icon-one-off-color) |
| Glass looks flat / fake / no depth | [L6](#l6-glass-without-layers) |
| Crystal / glass effect invisible in screenshots | [L7](#l7-crystal-too-subtle) |
| Screenshot “dark” looks light | [L8](#l8-screenshot-theme-wrong-key) |
| Layout overflows / crushes on mobile | [L9](#l9-responsive-rigidity) |
| Footer / nav uneven or cramped | [L10](#l10-footer--nav-width-rhythm) |
| Same Tailwind stack copied 8 times | [L11](#l11-no-global-primitives) |
| Purple accents reappear | [L12](#l12-purple-creep) |
| Hero / path connectors float over cards | [L13](#l13-connectors-over-content) |
| Lesson preview feels like a wireframe | [L14](#l14-skeleton-vs-real-preview) |
| Window chrome on wrong side / wrong OS cue | [L15](#l15-mac-chrome-details) |
| Landing feels like a card corridor / dashboard | [L16](#l16-card-corridor--stat-strip) |
| CTA destinations feel wrong (lesson vs map) | [L17](#l17-cta-path-vs-lesson) |
| Sidebar collapse flips between pages | [L18](#l18-sidebar-collapse-resets) |
| `bg-white` / hard hex ignores theme | [L19](#l19-hardcoded-surfaces) |
| Focus rings missing / buttons look disabled | [L20](#l20-button-focus--contrast) |
| Theme preview pages diverge from production | [L21](#l21-multi-theme-vs-locked-phosphor) |
| Motion / blur ignored for a11y | [L22](#l22-reduced-motion) |
| Auth / sign-in still purple or dishonest OAuth | [L23](#l23-auth-purple--oauth-honesty) |
| Auth path card / “steps” vs ladder vs levels copy fight | [L24](#l24-auth-path-two-vocabularies) |
| Fake search / dead ⌘K chrome in product | [L25](#l25-dead-search-chrome) |
| Topbar duplicates sidebar (Odin cargo-cult) | [L26](#l26-topbar-vs-sidebar) |
| Purple/`?` gradient avatar islands | [L27](#l27-placeholder-avatar) |
| Sidebar stuck white in dark mode | [L28](#l28-sidebar-forced-light) |
| Sticky `top-[72px]` ghosts after topbar removal | [L29](#l29-sticky-offset-ghosts) |

---

## Case studies

### L1 — Dark mode tokens don’t flip

**Symptom:** Toggle adds `.dark`, but `bg-bg` / `text-ink` stay light (or only some colors flip).

**Wrong first thought:** “Dark variant isn’t configured” → sprinkle `dark:bg-…` on every node.

**What we didn’t think of first:** Tailwind v4 `@theme` with **literal hex** bakes RGB into utilities at build time. `.dark { --surface-bg: … }` never reaches `.bg-bg`.

**Root cause:** Tokens must be runtime `var()` references.

**Steps that worked**
1. Put real values on `:root` and `.dark` (`--surface-bg`, `--ink`, …).
2. In `@theme inline`, only map `--color-bg: var(--surface-bg)` (never `#f2f4f1` inline).
3. Use `@custom-variant dark (&:where(.dark, .dark *));`.
4. Verify by toggling and screenshotting both themes.

**Solution:** Runtime tokens + `var()` in `@theme` + class-based dark.

**Prevention:** Never add a new surface color as a literal in `@theme`. Change `:root` / `.dark` only. See `PHOSPHOR-THEME.md` §3 and §6.

**Files:** `src/app/globals.css`, `src/components/homepage/theme-toggle.tsx`, `src/app/layout.tsx` (FOUC script uses `ascend-theme`).

---

### L2 — Dark mode harsh / not premium

**Symptom:** User: dark looks “terrible”; not eye-comfortable; not premium.

**Wrong first thought:** Invert to near-black (`#000`) and crank green glow.

**What we missed:** “Premium dark” here means **night study desk** — lifted charcoal, soft ink, quiet phosphor — not OLED pure black or cyberpunk glow.

**Thinking steps**
1. Soften surfaces: `#121816` / `#161c19` / `#1e2622`.
2. Soft ink ladder (`--ink` → `--ink-fainter`), never pure white body text.
3. Quiet brand glow in dark (`--elevate-glow` reduced).
4. Re-screenshot full page + hero + how + lesson.

**Solution:** Comfort palette in `.dark { … }`, not a separate “dark theme product.”

**Prevention:** If dark feels aggressive, tune `.dark` tokens — don’t invent a second brand.

---

### L3 — Forced-light island

**Symptom:** Lesson mock / a card stays bright white in dark mode.

**Wrong first thought:** Add more `dark:` overrides on that component only.

**Root cause:** Explicit light surfaces (`bg-white`, force-light wrappers) that fight the page theme.

**Solution:** Use semantic tokens: `bg-elevated`, `bg-paper`, `text-ink`, `border-card-border`. Preview must **theme with the page**.

**Prevention:** Ban `bg-white` / `text-black` on marketing surfaces unless the element is intentionally always light (rare).

**Files:** `src/components/homepage/lesson-feel.tsx`, Mac chrome helpers.

---

### L4 — Wrong section band tone

**Symptom:** `#how` (or another band) looks muddy, yellowish, or “off” vs rest of page.

**Wrong first thought:** Nudge hex on that one section.

**Root cause:** Used `tone="warm"` / `--landing-warm` where **tint** (`--landing-tint`) belongs. Warm is for rare accent bands; How-you-learn sits on soft mint tint.

**Solution:** `SectionBand` tone map: `wash` | `paper` | `tint` | `warm` | `ink`. Pedagogy → `tint`.

**Prevention:** Pick tone from the table in `SectionBand`; don’t invent per-section hex.

---

### L5 — Break icon one-off color

**Symptom:** Break tile is solid yellow / gold while Learn/Build/Debug/Explain are brand green.

**Wrong first thought:** “Break should be louder → unique color.”

**What we missed:** Loud color **breaks the ladder**. Specialness should be **material** (crystal glass), not a different hue.

**User direction (final):** Keep green gradient like the others; add crystal/glass effect.

**Solution**
- Base: same `.bg-brand-gradient` / brand stops.
- Difference: `.icon-crystal` (facet streak + frost + rim).
- Card: frosted `.glass-surface` + `.glass-wash` behind.

**Prevention:** Never give Break a unique fill color. Crystal only on Break.

**Files:** `globals.css` (`.icon-crystal`, glass tokens), `pedagogy-section.tsx`, `landing-styles.ts`.

---

### L6 — Glass without layers

**Symptom:** “Apple glass” attempt looks like a flat translucent box.

**Wrong first thought:** Only `backdrop-blur` + `bg-white/30`.

**What we didn’t think of:** Glass needs **context** — something to blur (wash), a rim, and content hierarchy.

**Layer stack (order matters)**
1. Soft color wash blobs behind (`.glass-wash`)
2. Frosted panel (`.glass-surface` — blur + border + inset highlight)
3. Content (icon + type)
4. Optionally crystal icon on Break

**Solution:** Encode stack as utilities + tokens (`--glass-*`), not ad-hoc classes per section.

---

### L7 — Crystal too subtle

**Symptom:** Close-up screenshots still look like a flat gradient tile.

**Wrong first thought:** “Blur more.”

**Root cause:** Soft opacity gradients wash out at ~40–48px icon size; sheen must be a **bright facet streak**, not a gentle veil alone.

**Solution:** Strong diagonal specular (`::before`), rim (`--crystal-rim`), corner radial highlight (`::after`), optional slow sheen animation (respect reduced motion).

**Prevention:** Always verify with **icon-only crop** in light + dark, not only full-section shots.

---

### L8 — Screenshot theme wrong key

**Symptom:** Playwright “dark” shots look light; you “fixed” dark CSS for nothing.

**Wrong first thought:** Dark CSS is broken again.

**Root cause:** Storage key is `ascend-theme`, not `theme`. Init script must set that key; FOUC script in `layout.tsx` reads the same.

**Solution**
```js
localStorage.setItem('ascend-theme', 'dark');
// and confirm: document.documentElement.classList.contains('dark') === true
```

**Prevention:** Any screenshot/automation checklist: assert `.dark` class before capture.

---

### L9 — Responsive rigidity

**Symptom:** Overflow, crushed columns, horizontal scroll at 320–768.

**Wrong first thought:** Hide sections on mobile / fixed pixel widths.

**What we missed:** Flex/grid children default to `min-width: auto` and refuse to shrink.

**Solution pattern**
- `min-w-0` on flex/grid children
- Fluid type: `clamp(...)`
- Grids: `minmax(0, 1fr)`
- Avoid fixed multi-column icon rows without wrap
- Footer: brand + 2-col links; don’t force desktop-only chrome

**Prevention:** Screenshot 320 / 768 / 1440 before calling a section done.

---

### L10 — Footer / nav width rhythm

**Symptom:** Footer “not responsive enough”; nav and content don’t share the same edge.

**Root cause:** Hardcoded `max-w-[1200px]` in some places, different padding elsewhere.

**Solution:** `--layout-max: 1200px` and `max-w-[var(--layout-max)]` on header, `SectionBand`, footer.

**Prevention:** New full-bleed sections use `SectionBand` or the same max-width var.

---

### L11 — No global primitives

**Symptom:** Changing glass / icon / heading means hunting 10 files.

**Wrong first thought:** “Just search-replace Tailwind.”

**Solution we landed on**
```
:root/.dark tokens → @theme var() → CSS utilities → landing-styles.ts → components
```

**Prevention:** If a visual formula appears twice, extract it before a third paste. Doctrine: `PHOSPHOR-THEME.md`.

---

### L12 — Purple creep

**Symptom:** Accents / gradients / hero washes look purple again.

**Wrong first thought:** “Add Phosphor on top.”

**Root cause:** Old violet token names + leftover purple hex in components / hero washes.

**Solution:** Lock Phosphor as production palette (green/teal/amber). Keep names `--brand-violet` for compatibility but **values are green**. Removed multi-theme switcher from nav; Blueprint/Graphite stay preview-only if routes exist.

**Prevention:** No new purple hex. Agent rule: `.cursor/rules/phosphor-theme.mdc`.

---

### L13 — Connectors over content

**Symptom:** Path/step arrows float on top of cards.

**Root cause:** Absolute connectors in the wrong stacking context / not in the gutter.

**Solution:** Connectors live in the **gutter** between items (rail + chip), not as overlays on card faces. Mobile: vertical connectors between rows.

**Prevention:** If it covers text/icons, it’s in the wrong layer — redesign structure, don’t raise `z-index` of content as a hack.

---

### L14 — Skeleton vs real preview

**Symptom:** Lesson area reads as wireframe / grey bars.

**Wrong first thought:** Polish the skeleton shimmer.

**User need:** Feels like a real lesson.

**Solution:** Real copy (“What is a bit?”), idea callout, nested Mac Terminal for code, knowledge-check UI — display-only, themed with page.

**Prevention:** Marketing previews should show **product truth**, not placeholder chrome.

---

### L15 — Mac chrome details

**Symptom:** Traffic lights feel “off” (wrong side, wrong nesting).

**Thinking:** User wanted Mac-like browser + nested Terminal.

**Solution:** Outer Safari-like frame + inner Terminal frame; traffic lights on the **right** (product choice for this landing). Shared `TrafficLights` helper.

**Prevention:** One chrome component; don’t fork light positions per section.

---

### L16 — Card corridor / StatStrip

**Symptom:** Landing feels like a dashboard of white cards; weak rhythm.

**Evidence:** 5-agent judge report — dissolve StatStrip, break card corridor, promote curriculum under hero.

**Solution (evolution)**
- Remove StatStrip; fold counts into curriculum story
- Alternating full-bleed bands (`SectionBand` tones)
- Why 6→4 cards
- OpenSource as quiet honesty strip (not a heavy purple/dark marketing slab forever — later moved to tint / honesty voice)

**Prevention:** Cards only when they hold an interaction or a clear unit; hero is not a card grid.

---

### L17 — CTA path vs lesson

**Symptom:** “Start” jumps into lesson 1; user expected the map.

**Wrong first thought (earlier Odin pass):** Lesson-first = correct TOP clone.

**Correction:** For Ascend feel, **map first** — primary CTA → `/curriculum`; secondary can be lesson 1.

**Prevention:** Keep header / hero / final CTA labels differentiated but hrefs intentional. Document in routes helpers (`CURRICULUM_HREF`, `FIRST_LESSON_HREF`).

---

### L18 — Sidebar collapse resets

**Symptom:** Collapse state flips when entering lesson/practice.

**Wrong first thought:** Race in React state.

**Root cause:** Different routes used different **defaults** when `localStorage` was empty.

**Solution:** One rule everywhere — `localStorage` only; default expanded. No per-route default override.

**Files:** Sidebar / AppShell collapse store.

**Prevention:** Cross-route UI prefs = single read path, single default.

---

### L19 — Hardcoded surfaces

**Symptom:** Random islands ignore theme.

**Solution / prevention:** Semantic utilities only (`bg-bg`, `paper`, `elevated`, ink scale). Selection/focus use `--focus-ring`.

---

### L20 — Button focus / contrast

**Symptom:** Secondary CTA looks disabled; keyboard focus weak.

**Evidence:** Judge P0 — focus rings + contrast.

**Solution:** Shared `Button` focus-visible rings; secondary variant contrast check in light + dark.

**Prevention:** Don’t style links as buttons without the same focus treatment.

---

### L21 — Multi-theme vs locked Phosphor

**Symptom:** Comparing Blueprint/Graphite diluted production clarity; purple crept back via “theme playground” thinking.

**Thinking path:** Built three themes to compare → user locked **Phosphor only** for production.

**Solution:** Phosphor tokens are the app default. Preview themes may exist as experiments but must not drive nav or global brand.

**Prevention:** Production = one doctrine. Experiments stay off the critical path.

---

### L22 — Reduced motion

**Symptom:** Blur/sheen harsh or distracting; a11y.

**Solution:** `.glass-surface` falls back to opaque paper without blur under `prefers-reduced-motion`; crystal sheen animation gated the same way.

**Prevention:** Any new ambient motion gets a reduced-motion off switch.

---

### L23 — Auth purple + OAuth honesty

**Symptom:** `/signin` (and reset) looked like a different product — purple panel, purple CTA; GitHub/Google looked real then surprised with “not wired.”

**Wrong first thought:** Swap purple hex for green hex only.

**Root cause:** Shared `AuthSplitLayout` + form still pre-Phosphor; OAuth used click → notice pattern.

**Solution**
- Phosphor ink panel + brand washes; semantic form tokens (`auth-styles.ts`)
- OAuth buttons **disabled** with persistent “Coming soon” + honest caption
- Theme toggle on form column; light/dark both work
- Spec: `docs/superpowers/specs/2026-09-23-phosphor-signin-design.md`

**Prevention:** Auth shares landing tokens/primitives; never ship fake-click OAuth.

**Files:** `auth-split-layout.tsx`, `auth-styles.ts`, `signin/page.tsx`, `reset/*`

---

### L24 — Auth path: two vocabularies

**Symptom:** Debating what the left auth card should say — curriculum levels (`00` Bits & Logic…) vs hero ladder (See / Understand…) vs “steps” / path slogans. Layout thrash (spine vs card vs PathNodes).

**Wrong first thought:** Pick one story forever for the whole product, or rebuild the card every time copy feels off.

**What we missed:** Ascend has **two maps**. Mixing them on one surface creates endless copy fights.

**Root cause:** “The path” meant different things — *how understanding deepens* vs *what lessons you save*.

**Solution**
- Auth card = **understanding ladder** copy from `path-ladder.ts`; keep quiet `00–03` list layout (not hero PathNodes).
- Locked header: eyebrow **The ascent**, title **Until the machine makes sense**, no count/`bottom-up` chip.
- Footer = honesty for auth: curriculum open; sign-in only saves finished work.
- Full problem→solution log: `docs/design/AUTH-PATH-COPY-PLAYBOOK.md`

**Prevention:** Before changing path copy on any page, ask which vocabulary the surface needs. Prefer copy swaps over layout rebuilds when the user already likes the card. Update the playbook when a decision flips.

**Files:** `path-ladder.ts`, `signin-client.tsx` (`decoration`), playbook above

---

## Optimizations we made (and why)

| Optimization | Why |
|--------------|-----|
| Soft charcoal dark | Eye comfort for night study |
| Mid-page secondary CTAs | Don’t rely only on hero/final |
| Fluid `clamp` type | One type scale across widths |
| Crystal only on Break | Signature without breaking ladder cohesion |
| Tokenized glass/crystal/glow | Change-once maintenance |
| Screenshot-driven pass | Words lie; crops don’t |
| Icon close-ups | Facet effects fail the “full section only” test |
| `min-w-0` discipline | Stops mysterious overflow |

---

## Thinking checklist (before you “fix” visuals)

Use this order — it matches how we wasted time when we skipped steps.

1. **Is it actually the theme?** Toggle + assert `.dark` / storage key.
2. **Is it a token bake?** Literal hex in `@theme`?
3. **Is it a forced surface?** `bg-white` / hardcoded light?
4. **Is it the wrong band tone?** `tint` vs `warm` vs `paper`?
5. **Is it a one-off color?** Should it use brand gradient + material instead?
6. **Is glass missing layers?** Wash → frost → content?
7. **Is the crop wrong?** Full section vs icon detail?
8. **Is layout structural?** `min-w-0` / clamp before media-query spaghetti?
9. **Does a primitive already exist?** Check `landing-styles.ts` + `globals.css` utilities.
10. **Document the case** in this file if it’s new.

---

## Steps we repeatedly used (working method)

```
1. Capture light + dark screenshots of the failing section
2. Name the symptom in plain language (user words)
3. Hypothesize root cause (token / structure / one-off)
4. Fix the system (token or utility), not only the instance
5. Re-screenshot the same crops
6. Check 320 / 768 / 1440 if layout involved
7. Note the case here if non-obvious
```

---

## Things we didn’t think of early (keep honest)

- `@theme` literal RGB baking (biggest dark-mode footgun)
- Storage key `ascend-theme` vs generic `theme` in automation
- Break specialness = material, not hue
- Glass needs wash behind it to read as glass
- Crystal needs aggressive specular at small sizes
- Lesson preview must theme with page (not “product light mode”)
- Sidebar default-per-route feels like a bug
- Multi-theme comparison can delay locking a production look
- Judge loop (visual/copy/ux) found structure issues screenshots alone didn’t prioritize
- Odin top-nav parity is wrong when we already have a sidebar (L26)
- Dead search / ⌘K chrome trains distrust (L25)
- Sticky `72px` offsets outlive the top bar (L29)

---

### L25 — Dead search chrome

**Symptom:** Top bar has “Search lessons… ⌘K” but search does nothing useful; users ignore it.

**Wrong first thought:** Keep it for “product completeness” / match SaaS dashboards.

**What we missed:** Chrome that doesn’t work trains distrust. Ascend’s primary nav is the sidebar; search isn’t a core habit yet.

**Root cause:** Decorative control with no real job.

**Solution:** Remove the search affordance from the learner shell. Command palette may still exist for power users elsewhere; don’t fake it in the top bar.

**Prevention:** No dead controls in AppShell. If search ships later, wire it before putting it back in chrome.

**Files:** (removed) `app-topbar.tsx`; palette remains optional in root layout.

---

### L26 — Topbar vs sidebar (don’t cargo-cult Odin)

**Symptom:** Top bar shows Curriculum / Paths / Community while the sidebar already lists Learn/You/More.

**Wrong first thought:** “Odin has those links in the header — copy that.”

**What we missed:** Odin has **no sidebar**. Ascend does. Duplicating destinations is noise, not parity.

**Root cause:** Matching a different IA without matching the shell constraint.

**Solution:** **No learner top bar.** Theme toggle lives in the **sidebar**. Primary nav stays sidebar-only. Marketing `SiteHeader` can still have flat links (no AppShell).

**Prevention:** Before copying another product’s nav, ask: do we already have a persistent rail for that job?

**Files:** `src/components/ui/app-shell.tsx`, `src/components/ui/sidebar.tsx`, specs under `docs/superpowers/specs/2026-09-23-app-topbar-design.md` (superseded).

---

### L27 — Placeholder avatar (not purple `?` gradient)

**Symptom:** Profile / sidebar identity uses `bg-brand-gradient` + `?` or purple/magenta washes; looks like a badge, not an avatar.

**Wrong first thought:** Bigger gradient = stronger brand.

**What we missed:** Identity marks should stay quiet; brand gradient is for CTAs/marks, not empty profile faces.

**Root cause:** One-off avatar styling instead of a shared placeholder.

**Solution:** Use `PlaceholderAvatar` — `bg-elevated` + `border-card-border`, **initial** if named, else **UserRound** icon. Sidebar + profile share it.

**Prevention:** Never invent a new gradient avatar square; import `PlaceholderAvatar`.

**Files:** `src/components/ui/placeholder-avatar.tsx`, `src/components/ui/sidebar.tsx`, `src/app/(learner)/profile/page.tsx`.

---

### L28 — Sidebar forced light

**Symptom:** Dark mode flips the page, sidebar stays `bg-white`.

**Wrong first thought:** Add `dark:bg-…` only on the main column.

**Root cause:** Hardcoded `bg-white` on `aside` / collapse toggle.

**Solution:** `bg-bg` / `bg-elevated` on sidebar chrome so it tracks Phosphor tokens.

**Prevention:** L19 — no `bg-white` in app shell chrome.

**Files:** `src/components/ui/sidebar.tsx`.

---

### L29 — Sticky offset ghosts

**Symptom:** After removing the 72px top bar, lesson map / practice headers still use `top-[72px]` / `h-[calc(100vh-72px)]`, leaving empty band or short rails.

**Wrong first thought:** “Padding bug in the lesson article.”

**Root cause:** Sticky math still assumed AppTopbar height.

**Solution:** Reset to `top-0` / full viewport height (`h-screen` / `max-h-screen`) when the top bar is gone.

**Prevention:** Grep `72px` when changing shell chrome; update all sticky dependents in the same change.

**Files:** `lesson-map-drawer.tsx`, lesson page aside, `practice/page.tsx`.

---

## Related docs & code

| Resource | Use for |
|----------|---------|
| `docs/design/PHOSPHOR-THEME.md` | Tokens, primitives, do/don’t |
| `.cursor/rules/phosphor-theme.mdc` | Agent enforcement |
| `.cursor/rules/app-shell-chrome.mdc` | Learner shell chrome (no topbar, etc.) |
| `docs/orchestration/landing-review/99-JUDGE-FINAL-REPORT.md` | Early landing judge decisions |
| `docs/orchestration/landing-review/shots/` | Visual evidence |
| `src/app/globals.css` | Source of tokens + utilities |
| `src/components/homepage/landing-styles.ts` | Named class exports |

---

## Append new cases

Template:

```markdown
### Lxx — Short title

**Symptom:**
**Wrong first thought:**
**What we missed:**
**Root cause:**
**Steps:**
**Solution:**
**Prevention:**
**Files:**
```

Add to the symptom index at the top.

