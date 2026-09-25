# Practice Coach v2 — Foundations path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/practicev2/foundations` as a Coach-identical Foundations path desk inside the learner AppShell, linked from `/practicev2` home.

**Architecture:** Same pattern as Coach home — static HTML extract from `Ascend Practice.html` (“Practice — Foundations path (desktop)”), unescape `\u002F` closing tags, strip mock footer, render via `dangerouslySetInnerHTML` under cream AppShell. Extend shared coach CSS for the two-column path layout. Visual QA via Playwright screenshots per tile.

**Tech Stack:** TypeScript, Next.js App Router, React, Playwright (screenshots), existing Phosphor fonts/CSS vars.

## Global Constraints

- Route: `/practicev2/foundations` only (do not modify `/practice/foundations`)
- Cream main `#F6F4EE` flush — no nested paper card
- Strip mock Ascend top nav / © footer; keep AppShell sidebar
- Demo/static copy from mock; no live SM-2 / `practicePathDrillIn` yet
- Stub CTAs (custom deck, review due, browse) → `/practicev2` until those screens exist
- Breadcrumb Practice → `/practicev2`; home Open path / lesson chips → `/practicev2/foundations`
- Phosphor fonts via `var(--font-bricolage)`, `var(--font-hanken)`, `var(--font-plex-mono)` — not hard-coded `'Bricolage Grotesque'`
- Screenshot-until-fixed loop; confirm coach CSS applied

## File map

| File | Role |
|------|------|
| `src/components/practice/practice-coach-v2-foundations-markup.ts` | CSS + HTML for Foundations path body |
| `src/components/practice/practice-coach-v2-foundations.tsx` | Client renderer (`<style>` + `dangerouslySetInnerHTML`) |
| `src/app/(learner)/practicev2/foundations/page.tsx` | Route + cream shell |
| `src/components/practice/practice-coach-v2-markup.ts` | Update home hrefs → `/practicev2/foundations` |
| `docs/superpowers/specs/2026-09-25-practice-coach-v2-foundations-path-design.md` | Status → Implementing → Done |
| `.tmp-v2-audit/fp-*.png` | Visual QA shots (gitignored / untracked OK) |

---

### Task 1: Extract Foundations markup module

**Files:**
- Create: `src/components/practice/practice-coach-v2-foundations-markup.ts`
- Modify: `docs/superpowers/specs/2026-09-25-practice-coach-v2-foundations-path-design.md` (Status → Implementing)
- Source: `Ascend Practice.html` screen title `Practice — Foundations path (desktop)` (or `.tmp-v2-audit/foundations-path-desktop.clean.html` if already extracted)

**Interfaces:**
- Consumes: none
- Produces:
  ```ts
  export const PRACTICE_COACH_V2_FOUNDATIONS_CSS: string;
  export const PRACTICE_COACH_V2_FOUNDATIONS_HTML: string;
  ```

- [ ] **Step 1: Extract and unescape `<main>` body**

Run a one-off script (do not commit the script unless useful):

```bash
cd /home/idder/Documents/github/ascend-platform && python3 <<'PY'
import gzip, base64, re, json
from pathlib import Path

raw = Path("Ascend Practice.html").read_text()
entries = re.findall(
    r'"([^"]+)"\s*:\s*\{"mime":"text/html","compressed":true,"data":"([^"]+)"\}',
    raw,
)
body = None
for _name, data in entries:
    b = gzip.decompress(base64.b64decode(data)).decode("utf-8", errors="replace")
    # Stitch often stores closing slashes as \u002F
    b = b.replace("\\u002F", "/").replace('\\"', '"')
    title_m = re.search(r"<title>([^<]+)</title>", b)
    if title_m and title_m.group(1) == "Practice — Foundations path (desktop)":
        body = b
        break
assert body, "screen not found"
start = body.find('<main style="padding: 32px 80px')
assert start >= 0
# Cut before mock © footer
foot = body.find("© 2026 Ascend", start)
assert foot > start
chunk = body[start:foot]
# Drop opening <main ...> wrapper — we’ll use coach-main
inner = re.sub(r"^<main[^>]*>", "", chunk, count=1).strip()
# Stop before <footer if present inside slice
fi = inner.rfind("<footer")
if fi >= 0:
    inner = inner[:fi].rstrip()

# Rewrite fonts to CSS vars
inner = inner.replace("'Bricolage Grotesque', sans-serif", "var(--font-bricolage), sans-serif")
inner = inner.replace("'IBM Plex Mono', monospace", "var(--font-plex-mono), monospace")
inner = inner.replace("'IBM Plex Sans', sans-serif", "var(--font-hanken), system-ui, sans-serif")
inner = inner.replace("'Hanken Grotesk', sans-serif", "var(--font-hanken), system-ui, sans-serif")

# Link rewrites
inner = inner.replace('href="Coach.dc.html"', 'href="/practicev2"')
inner = inner.replace('href="DeskDeck.dc.html"', 'href="/practicev2"')
inner = inner.replace('href="SessionDesktop.dc.html"', 'href="/practicev2"')
inner = inner.replace('href="DeskBank.dc.html"', 'href="/practicev2"')
# Any remaining *.dc.html → /practicev2
inner = re.sub(r'href="[^"]*\.dc\.html"', 'href="/practicev2"', inner)

# Zero main padding — page shell owns padding
html = f'<div class="coach-main coach-path-page" style="padding: 0; display: flex; flex-direction: column; gap: 32px">\n{inner}\n</div>'

# Sanity
assert "Foundations" in html and "Bits" in html and "Logic" in html
assert "First principles" in html and "Where to focus" in html
assert "</a>" in html and "<\\u002F" not in html
assert "Coach.dc.html" not in html
Path(".tmp-v2-audit/fp-extracted-body.html").write_text(html)
print("ok", len(html))
PY
```

Expected: `ok` + byte length printed; file `.tmp-v2-audit/fp-extracted-body.html` exists.

- [ ] **Step 2: Write markup module**

Create `src/components/practice/practice-coach-v2-foundations-markup.ts`:

```ts
/** Coach Foundations path body (no mock chrome) from Ascend Practice.html */
export const PRACTICE_COACH_V2_FOUNDATIONS_CSS = `
.practice-coach-v2-foundations{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-foundations .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-foundations .coach-path-grid{
  min-width:0;
  width:100%;
}
.practice-coach-v2-foundations .coach-path-grid > *{
  min-width:0;
}
.practice-coach-v2-foundations a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-foundations a[href]:active{transform:translateY(2px)}
.practice-coach-v2-foundations a:focus-visible,
.practice-coach-v2-foundations button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1023px){
  .practice-coach-v2-foundations .coach-path-grid{
    grid-template-columns:1fr !important;
  }
  .practice-coach-v2-foundations .coach-path-hero{
    flex-direction:column !important;
    align-items:stretch !important;
  }
  .practice-coach-v2-foundations .coach-path-ctas{
    width:100%;
    flex-wrap:wrap;
  }
  .practice-coach-v2-foundations .coach-path-ctas > a{
    flex:1 1 auto;
  }
}
@media (max-width:639px){
  .practice-coach-v2-foundations h1{font-size:36px !important}
}
`.trim();

export const PRACTICE_COACH_V2_FOUNDATIONS_HTML = `PASTE_EXTRACTED_HTML_HERE`;
```

Paste the extracted HTML from Step 1 into the template literal (escape `` ` `` / `${` if any).

While pasting, add helper classes on the big layout nodes (match existing inline styles, only add `class`):

- Hero row (`display: flex; justify-content: space-between; align-items: flex-end`) → add `class="coach-path-hero"`
- CTA pair div → `class="coach-path-ctas"`
- Two-column grid (`grid-template-columns: minmax(0, 1fr) 380px`) → `class="coach-path-grid"`

- [ ] **Step 3: Smoke-check exports**

Run:

```bash
cd /home/idder/Documents/github/ascend-platform && npx tsx -e "
import {
  PRACTICE_COACH_V2_FOUNDATIONS_CSS,
  PRACTICE_COACH_V2_FOUNDATIONS_HTML,
} from './src/components/practice/practice-coach-v2-foundations-markup.ts';
const must = ['Foundations','Bits','Logic','First principles','Your progress','Where to focus','Always open'];
for (const s of must) if (!PRACTICE_COACH_V2_FOUNDATIONS_HTML.includes(s)) throw new Error('missing '+s);
if (!PRACTICE_COACH_V2_FOUNDATIONS_CSS.includes('coach-path-grid')) throw new Error('css');
if (PRACTICE_COACH_V2_FOUNDATIONS_HTML.includes('.dc.html')) throw new Error('dc href');
console.log('pass', PRACTICE_COACH_V2_FOUNDATIONS_HTML.length);
"
```

Expected: `pass <length>`

- [ ] **Step 4: Commit**

```bash
git add src/components/practice/practice-coach-v2-foundations-markup.ts \
  docs/superpowers/specs/2026-09-25-practice-coach-v2-foundations-path-design.md
git commit -m "$(cat <<'EOF'
feat(practicev2): add Coach Foundations path markup extract

EOF
)"
```

---

### Task 2: Route + renderer + home links

**Files:**
- Create: `src/components/practice/practice-coach-v2-foundations.tsx`
- Create: `src/app/(learner)/practicev2/foundations/page.tsx`
- Modify: `src/components/practice/practice-coach-v2-markup.ts` (Open path + lesson chip hrefs)

**Interfaces:**
- Consumes: `PRACTICE_COACH_V2_FOUNDATIONS_CSS`, `PRACTICE_COACH_V2_FOUNDATIONS_HTML`
- Produces: page at `/practicev2/foundations`; home links point here

- [ ] **Step 1: Create client component**

`src/components/practice/practice-coach-v2-foundations.tsx`:

```tsx
"use client";

import {
  PRACTICE_COACH_V2_FOUNDATIONS_CSS,
  PRACTICE_COACH_V2_FOUNDATIONS_HTML,
} from "@/components/practice/practice-coach-v2-foundations-markup";

/** Coach Foundations path desk body inside learner AppShell. */
export function PracticeCoachV2Foundations() {
  return (
    <>
      <style id="practice-coach-v2-foundations-css">
        {PRACTICE_COACH_V2_FOUNDATIONS_CSS}
      </style>
      <div
        className="practice-coach-v2-foundations"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_FOUNDATIONS_HTML }}
      />
    </>
  );
}
```

- [ ] **Step 2: Create page**

`src/app/(learner)/practicev2/foundations/page.tsx`:

```tsx
import type { Metadata } from "next";
import { PracticeCoachV2Foundations } from "@/components/practice/practice-coach-v2-foundations";

export const metadata: Metadata = {
  title: "Foundations — Practice Coach (v2) — Ascend",
  description: "Coach Foundations path desk — AppShell + cream surface.",
};

export default function PracticeV2FoundationsPage() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2Foundations />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Point home links at Foundations path**

In `src/components/practice/practice-coach-v2-markup.ts`, replace:

- `href="/practice/foundations"` → `href="/practicev2/foundations"` (Open path button + all 6 lesson chips)

Do not change mode/session stubs that intentionally stay on `/practice` or `/practicev2` per home design.

- [ ] **Step 4: Verify route responds**

With dev server on `:3000`:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/practicev2/foundations
```

Expected: `200`

Also:

```bash
curl -s http://localhost:3000/practicev2/foundations | grep -o "Foundations" | head -3
```

Expected: at least one `Foundations`

- [ ] **Step 5: Commit**

```bash
git add src/components/practice/practice-coach-v2-foundations.tsx \
  src/app/\(learner\)/practicev2/foundations/page.tsx \
  src/components/practice/practice-coach-v2-markup.ts
git commit -m "$(cat <<'EOF'
feat(practicev2): add Foundations path route and wire home links

EOF
)"
```

---

### Task 3: Visual QA — screenshot tiles, fix CSS, re-shot

**Files:**
- Modify: `src/components/practice/practice-coach-v2-foundations-markup.ts` (CSS/HTML polish as needed)
- Write (untracked OK): `.tmp-v2-audit/fp-final-*.png`

**Interfaces:**
- Consumes: live `/practicev2/foundations`
- Produces: verified tiles; CSS confirmed present

- [ ] **Step 1: Inventory + shoot each block**

```bash
cd /tmp/pwshot && node <<'EOF'
const { chromium } = require('playwright-core');
const out = '/home/idder/Documents/github/ascend-platform/.tmp-v2-audit';
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });
  await page.goto('http://localhost:3000/practicev2/foundations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.reload({ waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const root = document.querySelector('.practice-coach-v2-foundations');
    const css = document.getElementById('practice-coach-v2-foundations-css');
    const main = document.querySelector('main');
    const grid = document.querySelector('.coach-path-grid');
    return {
      cssLen: css?.textContent?.length ?? 0,
      mainBg: main ? getComputedStyle(main).backgroundColor : null,
      h1: document.querySelector('h1')?.textContent?.trim(),
      branches: [...document.querySelectorAll('h2')].map((h) => h.textContent.trim().slice(0, 40)),
      gridCols: grid ? getComputedStyle(grid).gridTemplateColumns : null,
      overflow: [...(root?.querySelectorAll('*') ?? [])].some((el) => {
        const r = el.getBoundingClientRect();
        const pr = root.getBoundingClientRect();
        return r.right > pr.right + 2;
      }),
    };
  });
  console.log(JSON.stringify(info, null, 2));

  await page.screenshot({ path: `${out}/fp-viewport.png`, fullPage: false });
  const root = page.locator('.practice-coach-v2-foundations');
  await root.screenshot({ path: `${out}/fp-full.png`, animations: 'disabled' });
  // Hero = first flex column child blocks: breadcrumb + hero row
  await page.locator('.coach-path-hero').screenshot({ path: `${out}/fp-hero.png` });
  for (const id of ['b1', 'b2', 'b3']) {
    const loc = page.locator(`[aria-labelledby="${id}"]`);
    if (await loc.count()) await loc.screenshot({ path: `${out}/fp-branch-${id}.png` });
  }
  // Progress / focus — match aria or h2 text
  for (const [key, sel] of [
    ['progress', 'h2:has-text("Your progress")'],
    ['focus', 'h2:has-text("Where to focus")'],
  ]) {
    const h = page.locator(sel).first();
    if (await h.count()) {
      const section = h.locator('xpath=ancestor::section[1]');
      await section.screenshot({ path: `${out}/fp-${key}.png` }).catch(async () => {
        await h.locator('xpath=ancestor::div[1]').screenshot({ path: `${out}/fp-${key}.png` });
      });
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
EOF
```

Expected metrics:
- `cssLen` > 0
- `mainBg` = `rgb(246, 244, 238)`
- `h1` = `Foundations`
- `branches` include Bits, Logic, First principles, Your progress, Where to focus
- `overflow` = false
- Desktop `gridCols` two tracks (e.g. `…px 380px`)

- [ ] **Step 2: Read each PNG and fix issues**

Open `.tmp-v2-audit/fp-*.png` with the Read tool. Fix in markup/CSS (common risks from home port):

- Hero CTAs wrap / collide → `coach-path-ctas` flex-wrap + full width on tablet
- Right rail (progress/focus) stacks under branches on narrow — already in CSS media query; verify
- Tables/lists if any mangled `\u002F` left → re-unescape
- Hard-coded mock fonts still showing → CSS var replace
- Soft overflow on lesson action rows → `min-width: 0` / wrap buttons

After each fix: reload + re-shot the affected tile only.

- [ ] **Step 3: Confirm home → path navigation**

```bash
cd /tmp/pwshot && node <<'EOF'
const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto('http://localhost:3000/practicev2', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Open path' }).click();
  await page.waitForURL('**/practicev2/foundations');
  const h1 = await page.locator('h1').first().textContent();
  console.log('landed', h1, page.url());
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
EOF
```

Expected: `landed Foundations` and URL contains `/practicev2/foundations`

- [ ] **Step 4: Mark spec Done + commit**

Set spec Status → `Done`.

```bash
git add src/components/practice/practice-coach-v2-foundations-markup.ts \
  docs/superpowers/specs/2026-09-25-practice-coach-v2-foundations-path-design.md
git commit -m "$(cat <<'EOF'
fix(practicev2): polish Foundations path Coach layout

EOF
)"
```

---

## Spec coverage check

| Spec item | Task |
|-----------|------|
| Route `/practicev2/foundations` | Task 2 |
| Cream AppShell flush | Task 2 page |
| Mock main extract, no chrome | Task 1 |
| Composition blocks (crumb→focus) | Task 1 extract + Task 3 shots |
| CTA stubs → `/practicev2` | Task 1 link rewrite |
| Home Open path / chips → foundations | Task 2 Step 3 |
| Visual QA loop | Task 3 |
| No `/practice/[pathSlug]` changes | Global — not touched |

## Placeholder scan

None — extract script, file contents, commands, and expected outputs are concrete.
