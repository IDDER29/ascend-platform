# App Shell SiteFooter (Odin-style) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the shared `SiteFooter` to an Odin-style multi-column footer and mount it in `AppShell` so every learner page gets established chrome without duplicating marketing footers.

**Architecture:** One presentational `SiteFooter` (homepage) owns brand, optional socials, four link columns, and the legal strip. Social URLs live in `src/lib/brand/social.ts` and only render when non-empty. `AppShell` wraps `{children}` in a `flex-1` region and renders `SiteFooter` after it in the content column (right of the sidebar).

**Tech Stack:** Next.js App Router, React 19, Lucide icons, Phosphor tokens (`border-card-border`, `bg-bg/50`, `text-ink-*`), existing `brandMarkSmClass` / route constants.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-23-app-shell-footer-design.md`
- Honest links only — no Team / Blog / FAQ / Guides pages
- One link set for marketing and AppShell (no `variant` prop)
- Social URLs default empty; omit icons when empty
- Phosphor tokens only; no purple; no new card chrome
- Do **not** redesign `LessonFooter`; site footer sits below it via AppShell
- Do **not** put footer under the sidebar (full viewport width)
- Repo has no unit test runner — verify with `npx eslint`, `npx tsc --noEmit`, manual HTTP smoke
- Commit only when the user asks

---

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/brand/social.ts` | Optional social URL constants + `getConfiguredSocialLinks()` |
| `src/components/homepage/footer.tsx` | Odin-style `SiteFooter` (brand, socials, columns, bottom bar) |
| `src/components/ui/app-shell.tsx` | Mount `SiteFooter` after flex-1 children |

No changes required to landing / community / privacy / terms imports — they already render `<SiteFooter />` and pick up the visual upgrade.

---

### Task 1: Social URL constants

**Files:**
- Create: `src/lib/brand/social.ts`

**Interfaces:**
- Produces:

```ts
export type SocialNetwork = "github" | "discord" | "x" | "facebook";

export type SocialLink = {
  id: SocialNetwork;
  label: string;
  href: string;
};

/** Empty string = not configured (do not render). */
export const SOCIAL_URLS: Record<SocialNetwork, string>;

export function getConfiguredSocialLinks(): SocialLink[];
```

- [ ] **Step 1: Create `src/lib/brand/social.ts`**

```ts
export type SocialNetwork = "github" | "discord" | "x" | "facebook";

export type SocialLink = {
  id: SocialNetwork;
  label: string;
  href: string;
};

const SOCIAL_META: Record<SocialNetwork, { label: string }> = {
  github: { label: "GitHub" },
  discord: { label: "Discord" },
  x: { label: "Twitter" },
  facebook: { label: "Facebook" },
};

/**
 * Optional public social URLs. Leave empty until product provides a real href.
 * Footer renders an icon only when the string is non-empty after trim.
 */
export const SOCIAL_URLS: Record<SocialNetwork, string> = {
  github: "",
  discord: "",
  x: "",
  facebook: "",
};

export function getConfiguredSocialLinks(): SocialLink[] {
  return (Object.keys(SOCIAL_META) as SocialNetwork[])
    .map((id) => {
      const href = SOCIAL_URLS[id].trim();
      if (!href) return null;
      return { id, label: SOCIAL_META[id].label, href };
    })
    .filter((link): link is SocialLink => link !== null);
}
```

- [ ] **Step 2: Typecheck the new module**

Run: `npx tsc --noEmit`
Expected: PASS (or only pre-existing errors unrelated to this file)

- [ ] **Step 3: Commit (only if user asked)**

```bash
git add src/lib/brand/social.ts
git commit -m "$(cat <<'EOF'
feat: add optional social URL constants for site footer

EOF
)"
```

---

### Task 2: Expand `SiteFooter` to Odin-style columns

**Files:**
- Modify: `src/components/homepage/footer.tsx` (replace link data + layout)

**Interfaces:**
- Consumes: `getConfiguredSocialLinks` from `@/lib/brand/social`
- Consumes: `CURRICULUM_HREF`, `PATHS_HREF`, `FIRST_LESSON_HREF`, `SIGNIN_HREF`, `SIGNUP_HREF` from `@/lib/routes`
- Produces: same export `SiteFooter()` — no new props

- [ ] **Step 1: Replace footer link constants and imports**

At top of `src/components/homepage/footer.tsx`:

```tsx
import Link from "next/link";
import { Github } from "lucide-react";
import { brandMarkSmClass } from "@/components/homepage/landing-styles";
import {
  CURRICULUM_HREF,
  FIRST_LESSON_HREF,
  PATHS_HREF,
  SIGNIN_HREF,
  SIGNUP_HREF,
} from "@/lib/routes";
import {
  getConfiguredSocialLinks,
  type SocialNetwork,
} from "@/lib/brand/social";

const LEARN = [
  { href: CURRICULUM_HREF, label: "Curriculum" },
  { href: PATHS_HREF, label: "Paths" },
  { href: "/practice", label: "Practice" },
  { href: "/playground", label: "Playground" },
] as const;

const COMMUNITY = [
  { href: "/community", label: "Community" },
  { href: "/#open", label: "Support us" },
] as const;

const ACCOUNT = [
  { href: "/dashboard", label: "Continue" },
  { href: "/progress", label: "Progress" },
  { href: "/profile", label: "Profile" },
  { href: SIGNIN_HREF, label: "Sign in" },
  { href: SIGNUP_HREF, label: "Create account" },
  { href: FIRST_LESSON_HREF, label: "Start learning" },
] as const;

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;
```

Keep existing `FooterNav` helper as-is (same signature).

- [ ] **Step 2: Add social icon helper (inline SVG for networks Lucide lacks)**

Below `FooterNav`, add:

```tsx
function SocialIcon({ id }: { id: SocialNetwork }) {
  const className = "size-4 shrink-0";
  if (id === "github") return <Github className={className} aria-hidden />;
  if (id === "discord") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.07.07 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.3 18.3 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.08.08 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 4.37a.09.09 0 0 0-.032.027C.533 9.047-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.08.08 0 0 0 .084-.028 14 14 0 0 0 1.226-1.994.08.08 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.08.08 0 0 1-.008-.127c.126-.094.252-.192.372-.292a.07.07 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .079.01c.12.1.246.198.373.292a.08.08 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.08.08 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.08.08 0 0 0 .084.028 19.8 19.8 0 0 0 6.002-3.03.08.08 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    );
  }
  if (id === "x") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    );
  }
  // facebook
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}
```

- [ ] **Step 3: Rewrite `SiteFooter` body**

Replace the `SiteFooter` function with:

```tsx
export function SiteFooter() {
  const socials = getConfiguredSocialLinks();

  return (
    <footer className="min-w-0 overflow-x-clip border-t border-card-border bg-bg/50">
      <div className="mx-auto flex w-full min-w-0 max-w-[var(--layout-max)] flex-col gap-10 px-4 py-10 sm:gap-12 sm:px-8 sm:py-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:py-[52px]">
        <div className="min-w-0 max-w-md lg:max-w-sm lg:shrink-0">
          <div className="mb-3 flex items-center gap-2.5 sm:mb-3.5">
            <div className={brandMarkSmClass}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m6 15 6-6 6 6" />
                <path d="m6 9 6-6 6 6" opacity=".55" />
              </svg>
            </div>
            <span className="font-display text-[18px] font-extrabold text-ink sm:text-[19px]">
              Ascend
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-ink-secondary text-pretty">
            High-quality coding education maintained by an open-source community.
          </p>
          {socials.length > 0 ? (
            <ul className="mt-5 flex flex-wrap items-center gap-2" aria-label="Social links">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-elevated hover:text-ink"
                    aria-label={s.label}
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-10 lg:gap-x-12 xl:gap-x-16">
          <FooterNav title="Learn" items={LEARN} />
          <FooterNav title="Community" items={COMMUNITY} />
          <FooterNav title="Account" items={ACCOUNT} />
          <FooterNav title="Legal" items={LEGAL} />
        </div>
      </div>

      <div className="border-t border-card-border">
        <div className="mx-auto flex w-full min-w-0 max-w-[var(--layout-max)] flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-5">
          <span className="text-[12px] text-ink-faint sm:text-[12.5px]">
            © 2026 Ascend · Free &amp; open source
          </span>
          <span className="font-mono text-[11px] leading-snug text-ink-faint text-pretty sm:text-right sm:text-[12.5px]">
            Made for people who want to know how it really works.
          </span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Lint the footer**

Run: `npx eslint src/components/homepage/footer.tsx src/lib/brand/social.ts`
Expected: no errors

- [ ] **Step 5: Commit (only if user asked)**

```bash
git add src/components/homepage/footer.tsx
git commit -m "$(cat <<'EOF'
feat: expand SiteFooter to Odin-style columns

EOF
)"
```

---

### Task 3: Mount footer in `AppShell`

**Files:**
- Modify: `src/components/ui/app-shell.tsx`

**Interfaces:**
- Consumes: `SiteFooter` from `@/components/homepage/footer`
- Produces: unchanged `AppShell({ children, streakDays? })` signature

- [ ] **Step 1: Update `AppShell` layout**

Replace `src/components/ui/app-shell.tsx` with:

```tsx
import { SiteFooter } from "@/components/homepage/footer";
import { AppSidebar } from "@/components/ui/sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";

/**
 * Universal learner chrome — sidebar + topbar + site footer.
 * Mount once from route layouts; pages only render main content.
 * Sidebar collapse state is shared via localStorage across all shells.
 */
export function AppShell({
  children,
  streakDays = null,
}: {
  children: React.ReactNode;
  streakDays?: number | null;
}) {
  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar streakDays={streakDays} />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint AppShell**

Run: `npx eslint src/components/ui/app-shell.tsx`
Expected: no errors

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS for changed files

- [ ] **Step 4: Commit (only if user asked)**

```bash
git add src/components/ui/app-shell.tsx
git commit -m "$(cat <<'EOF'
feat: mount SiteFooter in AppShell learner chrome

EOF
)"
```

---

### Task 4: Manual verification smoke

**Files:** none (verify only)

- [ ] **Step 1: Ensure dev server is running**

Run: `npm run dev` (if not already)
Expected: ready on local port (usually `http://localhost:3000`)

- [ ] **Step 2: Smoke AppShell pages**

Open and scroll to bottom:

| Route | Expect |
|-------|--------|
| `/dashboard` | One site footer in content column; Learn/Community/Account/Legal present |
| `/curriculum` | Same |
| `/curriculum/level-00-bits-logic/what-is-a-bit` | `LessonFooter` (prev/next) still present; **site** footer below it |
| `/practice` | Same AppShell footer |

Expect: no social icon row (URLs empty). No second footer. Footer does not sit under the sidebar.

- [ ] **Step 3: Smoke marketing pages**

| Route | Expect |
|-------|--------|
| `/` | Updated Odin-style footer |
| `/community` | One footer (page-owned, not AppShell) |
| `/privacy` | One footer |
| `/terms` | One footer |

- [ ] **Step 4: Optional social sanity (local only, revert)**

Temporarily set `github: "https://github.com/example"` in `SOCIAL_URLS`, refresh landing — GitHub icon appears. Clear back to `""` before finishing.

- [ ] **Step 5: Final lint**

Run: `npx eslint src/lib/brand/social.ts src/components/homepage/footer.tsx src/components/ui/app-shell.tsx`
Expected: clean

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Expand shared `SiteFooter` | Task 2 |
| Mount in `AppShell` after children | Task 3 |
| Honest columns (Learn / Community / Account / Legal) | Task 2 |
| Social constants; hide when empty | Task 1 + 2 |
| Content column only (not under sidebar) | Task 3 |
| `flex-1` children so short pages push footer down | Task 3 |
| Marketing pages keep existing import | (no task — automatic) |
| No LessonFooter redesign | (out of scope) |
| Empty socials → no icons | Task 4 Step 2 |

## Self-review notes

- No placeholders / TBD left in steps.
- `PATHS_HREF` already exists in `src/lib/routes.ts` — Task 2 imports it; do not re-add.
- Account column matches spec one-link-set rule (includes Sign in / Create account on AppShell too).
