<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Design system

Ascend production look is **Phosphor**.

| Doc | Use |
|-----|-----|
| `docs/design/PHOSPHOR-THEME.md` | Tokens, primitives, how to change once |
| `docs/design/PHOSPHOR-LESSONS-AND-RUNBOOK.md` | **Go-to first** when something breaks or looks wrong — past issues, thinking, fixes |
| `.cursor/rules/phosphor-theme.mdc` | Agent enforcement (tokens / no purple) |
| `.cursor/rules/app-shell-chrome.mdc` | Learner shell: no topbar, theme in sidebar, placeholder avatars |
| `src/app/globals.css` | Token + utility source |
| `src/components/homepage/landing-styles.ts` | Named class exports |
