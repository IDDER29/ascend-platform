#!/usr/bin/env python3
"""Extract Coach mock <main> into a practice-coach-v2 markup.ts module."""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]  # repo root (…/ascend-platform)


def unescape(html: str) -> str:
    html = html.replace("\\u002F", "/").replace("\\u003C", "<").replace("\\u003E", ">")
    html = html.replace('\\"', '"').replace("\\n", "\n").replace("\\t", "\t")
    html = html.replace("<\\/", "</")
    return html


def rewrite_fonts(html: str) -> str:
    reps = [
        ("'Bricolage Grotesque', sans-serif", "var(--font-bricolage), sans-serif"),
        ('"Bricolage Grotesque", sans-serif', "var(--font-bricolage), sans-serif"),
        ("'IBM Plex Mono', monospace", "var(--font-plex-mono), monospace"),
        ('"IBM Plex Mono", monospace', "var(--font-plex-mono), monospace"),
        ("'IBM Plex Sans', sans-serif", "var(--font-hanken), system-ui, sans-serif"),
        ('"IBM Plex Sans", sans-serif', "var(--font-hanken), system-ui, sans-serif"),
        ("'Hanken Grotesk', sans-serif", "var(--font-hanken), system-ui, sans-serif"),
        ('"Hanken Grotesk", sans-serif', "var(--font-hanken), system-ui, sans-serif"),
    ]
    for a, b in reps:
        html = html.replace(a, b)
    return html


def rewrite_links(html: str) -> str:
    """Map mock .dc.html / legacy paths to practicev2 routes."""
    mapping = {
        "Coach.dc.html": "/practicev2",
        "DeskPath.dc.html": "/practicev2/foundations",
        "DeskBank.dc.html": "/practicev2/bank",
        "DeskDeck.dc.html": "/practicev2/custom",
        "SessionDesktop.dc.html": "/practicev2/session",
        "SessionChoices.dc.html": "/practicev2/session/choices",
        "SessionFlashcard.dc.html": "/practicev2/session/flashcard",
        "SessionCorrect.dc.html": "/practicev2/session/correct",
        "SessionWrong.dc.html": "/practicev2/session/wrong",
        "SessionFeedback.dc.html": "/practicev2/session/feedback",
        "DeskCorrect.dc.html": "/practicev2/session/correct",
        "DeskWrong.dc.html": "/practicev2/session/wrong",
        "DeskFlash.dc.html": "/practicev2/session/flashcard",
        "DeskFlashcard.dc.html": "/practicev2/session/flashcard",
        "DeskComplete.dc.html": "/practicev2/complete",
        "ReviewComplete.dc.html": "/practicev2/complete",
        "CaughtUp.dc.html": "/practicev2/caught-up",
        "AllCaughtUp.dc.html": "/practicev2/caught-up",
        "DeskCaughtUp.dc.html": "/practicev2/caught-up",
    }
    for src, dst in mapping.items():
        html = html.replace(f'href="{src}"', f'href="{dst}"')
        html = html.replace(f"href='{src}'", f"href='{dst}'")
    # leftover mock files → home
    html = re.sub(r'href="[^"]*\.dc\.html"', 'href="/practicev2"', html)
    html = html.replace('href="/practice/foundations"', 'href="/practicev2/foundations"')
    html = html.replace('href="/practice"', 'href="/practicev2"')
    # hash stubs
    html = re.sub(r'href="#"', 'href="/practicev2"', html)
    return html


def extract_main_inner(html: str) -> str:
    html = unescape(html)
    m = re.search(r"<main\b[^>]*>([\s\S]*?)</main>", html, re.I)
    if m:
        rest = m.group(1).rstrip()
        # Session mocks put chrome after </main>:
        # - <footer> Skip/Check / Knew it
        # - <section aria-live> correct/wrong feedback strip
        # Include consecutive siblings until Ascend site footer/header.
        pos = m.end()
        for _ in range(4):
            after = html[pos : pos + 12000]
            fm = re.match(
                r"\s*(<(?:footer|section)\b[\s\S]*?</(?:footer|section)>)",
                after,
                re.I,
            )
            if not fm:
                break
            block = fm.group(1)
            if "©" in block or "Ascend · Free" in block or 'aria-label="Learn"' in block:
                break
            # only keep session chrome / feedback, not random sections far away
            low = block.lower()
            if block.lower().startswith("<footer") or "aria-live" in low or "fb-title" in low or "wr-title" in low:
                rest = rest + "\n" + block
                pos = pos + fm.end()
                continue
            break
        return rest.strip()

    # Fallback: unclosed main (stitch truncation)
    m = re.search(r"<main\b([^>]*)>([\s\S]*)", html, re.I)
    if not m:
        raise SystemExit("no <main> found")
    rest = m.group(2)
    for marker in ("© 2026 Ascend", "© 2024 Ascend", "</body>", "</html>"):
        i = rest.find(marker)
        if i >= 0:
            rest = rest[:i]
    fi = rest.rfind("<footer")
    if fi >= 0 and "©" in rest[fi : fi + 500]:
        rest = rest[:fi]
    rest = re.sub(r"</main>\s*$", "", rest, flags=re.I).rstrip()
    return rest.strip()


DEFAULT_CSS = """
.practice-coach-v2-{slug}{{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}}
.practice-coach-v2-{slug} .coach-main{{
  min-width:0;
  max-width:100%;
}}
.practice-coach-v2-{slug} a[href]:hover{{filter:brightness(.97)}}
.practice-coach-v2-{slug} a[href]:active{{transform:translateY(2px)}}
.practice-coach-v2-{slug} a:focus-visible,
.practice-coach-v2-{slug} button:focus-visible{{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}}
@media (max-width:1279px){{
  .practice-coach-v2-{slug} .coach-path-grid,
  .practice-coach-v2-{slug} [style*="grid-template-columns: minmax(0, 1fr)"]{{
    grid-template-columns:1fr !important;
  }}
}}
@media (max-width:639px){{
  .practice-coach-v2-{slug} h1{{font-size:36px !important}}
}}
""".strip()


def write_module(
    *,
    slug: str,
    const_prefix: str,
    source: Path,
    out: Path,
    extra_css: str = "",
    must_contain: list[str] | None = None,
) -> None:
    inner = extract_main_inner(source.read_text())
    inner = rewrite_fonts(inner)
    inner = rewrite_links(inner)
    # fix stitch SVG typos
    inner = inner.replace("sc-camel-view-box=", "viewBox=")

    html = (
        f'<div class="coach-main" style="padding: 0; display: flex; '
        f'flex-direction: column; gap: 32px">\n{inner}\n</div>'
    )
    if must_contain:
        for s in must_contain:
            if s not in html:
                raise SystemExit(f"missing required string {s!r}")

    css = DEFAULT_CSS.format(slug=slug)
    if extra_css:
        css = css + "\n" + extra_css.strip()

    # escape for template literal
    def esc(s: str) -> str:
        return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        f"/** Coach screen body (no mock chrome) — {source.name} */\n"
        f"export const {const_prefix}_CSS = `{esc(css)}`;\n\n"
        f"export const {const_prefix}_HTML = `{esc(html)}`;\n"
    )
    print(f"wrote {out} ({out.stat().st_size} bytes)")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--source", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--slug", required=True)
    p.add_argument("--prefix", required=True, help="e.g. PRACTICE_COACH_V2_BANK")
    p.add_argument("--must", action="append", default=[])
    args = p.parse_args()
    write_module(
        slug=args.slug,
        const_prefix=args.prefix,
        source=ROOT / args.source,
        out=ROOT / args.out,
        must_contain=args.must,
    )


if __name__ == "__main__":
    main()
