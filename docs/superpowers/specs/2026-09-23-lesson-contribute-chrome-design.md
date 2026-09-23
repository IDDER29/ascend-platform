# Lesson page contribute chrome (Odin gaps)

**Date:** 2026-09-23  
**Status:** Approved via “go for it” on recommended priorities  
**Surface:** Lesson reading pages only (`/curriculum/[level]/[slug]`)

## Goal

Add the three highest-value Odin lesson affordances Ascend lacks, without cloning TOP’s full nav density or inventing changelog.

## In scope

1. **Edit on GitHub** — deep link to the lesson MDX on the default branch  
2. **Report an issue** — GitHub issue template prefilled with lesson path/title; also offered when thumbs-down on feedback  
3. **Quiet Support us strip** — one short line + link to `/#open` (existing open-source section), placed after lesson chrome and before the AppShell `SiteFooter`

## Out of scope

- Lesson changelog  
- Donate buttons / funding widgets  
- Notifications / avatar menu on the lesson  
- Replacing AppShell with Odin breadcrumb nav  
- New Team / Blog / FAQ pages

## Placement (article bottom)

```
Why this matters
LessonFooter (mark complete + next)
Contribute row: Edit on GitHub · Report an issue
LessonFeedback (thumbs; down → report link)
LessonSupportStrip (Support us → /#open)
── AppShell SiteFooter ──
```

## Data

- Repo base: `https://github.com/IDDER29/ascend-platform` (from `origin`)  
- Edit: `/edit/main/content/curriculum/{level}/{slug}.mdx`  
- Issue: `/issues/new` with title/body query params  
- Also set `SOCIAL_URLS.github` so the site footer can show GitHub when configured

## Visual

Phosphor quiet: text links / faint row, no cards, no purple, no hero stickers.
