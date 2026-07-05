#!/usr/bin/env python3
import json, html, os, re
import yaml

SRC = os.path.join(os.path.dirname(__file__), "..", "content-source")
OUT = os.path.join(os.path.dirname(__file__), "..", "content", "curriculum")

CODE_SPAN_RE = re.compile(
    r"<span style=\"font-family:'Space Mono',monospace;[^\"]*\">(.*?)</span>"
)


def slugify(title):
    t = html.unescape(title).lower()
    t = t.split(":")[0] if ":" in t and len(t.split(":")[0]) < 40 else t
    t = re.sub(r"&", " and ", t)
    t = re.sub(r"[^a-z0-9\s-]", "", t)
    t = re.sub(r"\s+", "-", t.strip())
    t = re.sub(r"-+", "-", t)
    return t


def clean_html_to_mdx(s):
    s = html.unescape(s)
    s = CODE_SPAN_RE.sub(lambda m: "`" + m.group(1) + "`", s)
    s = re.sub(r"</p>\s*<p>", "\n\n", s)
    s = re.sub(r"^<p>", "", s)
    s = re.sub(r"</p>$", "", s)
    return s.strip()


def load(fname):
    with open(os.path.join(SRC, fname)) as f:
        return json.load(f)


l00 = load("level00.json")
l01 = load("level01.json")
l02a = load("level02_part1.json")
l02b = load("level02_part2.json")
l03 = load("level03.json")

# (level_dir, order, lesson_dict)
PLAN = []
for i, lesson in enumerate(l00):
    PLAN.append(("level-00-bits-logic", i + 1, lesson))
for i, lesson in enumerate(l01):
    PLAN.append(("level-01-machine-memory", i + 1, lesson))

# level 02: part1 -> positions 1,2,4,5 ; part2 -> positions 6,7,8 (position 3 is the hand-authored pointer lesson)
l02_positions_a = [1, 2, 4, 5]
for pos, lesson in zip(l02_positions_a, l02a):
    PLAN.append(("level-02-the-c-language", pos, lesson))
l02_positions_b = [6, 7, 8]
for pos, lesson in zip(l02_positions_b, l02b):
    PLAN.append(("level-02-the-c-language", pos, lesson))

for i, lesson in enumerate(l03):
    PLAN.append(("level-03-systems-software", i + 1, lesson))


def render_section_body(sections):
    parts = []
    for sec in sections:
        heading = html.unescape(sec["heading"])
        parts.append(f"## {heading}\n")
        for p in sec["paragraphs"]:
            parts.append(clean_html_to_mdx(p) + "\n")
        visual = sec.get("visual")
        if visual:
            parts.append(render_visual(visual) + "\n")
    return "\n".join(parts)


def render_visual(visual):
    # IMPORTANT: next-mdx-remote/rsc (this project's MDX version) silently drops
    # any JSX curly-brace expression attribute (e.g. `prop={...}`) -- the
    # component receives an empty props object at runtime, no error is raised.
    # Only plain quoted string attributes survive. So: every prop below is a
    # plain single-quoted attribute; arrays are JSON-encoded into a string prop
    # and JSON.parse()'d inside the component. Text is kept HTML-entity-escaped
    # (not html.unescape'd) since a literal '<' also breaks the MDX parser by
    # looking like a new tag -- components decode entities themselves.
    vtype = visual["type"]
    if vtype in ("diagram", "memory-diagram"):
        caption = attr_safe(visual["caption"])
        desc = attr_safe(visual["description"])
        return f"<Visual type='{vtype}' caption='{caption}' description='{desc}' />"
    if vtype == "truth-table":
        caption = attr_safe(visual["caption"])
        rows_json = attr_safe(json.dumps(visual["rows"]))
        return f"<TruthTable caption='{caption}' rowsJson='{rows_json}' />"
    if vtype == "code":
        lines_json = attr_safe(json.dumps(visual["lines"]))
        lang = visual.get("lang", "text")
        runnable_attr = " runnable" if visual.get("runnable") else ""
        out_attr = ""
        if visual.get("expected_output"):
            out_attr = f" expectedOutput='{attr_safe(visual['expected_output'])}'"
        return f"<CodeBlock lang='{lang}' linesJson='{lines_json}'{runnable_attr}{out_attr} />"
    return ""


def attr_safe(s):
    # s may already contain HTML entities (&lt; &amp; etc) from the source JSON.
    # Escape any literal single quote so it can't prematurely close our
    # single-quoted MDX attribute.
    return s.replace("'", "&#39;")


count = 0
for level_dir, order, lesson in PLAN:
    title = html.unescape(lesson["concept"])
    slug = slugify(lesson["concept"])

    frontmatter = {
        "title": title,
        "level": level_dir,
        "slug": slug,
        "order": order,
        "timeMin": lesson["time_min"],
        "learningOutcomes": [html.unescape(o) for o in lesson["learning_outcomes"]],
        "knowledgeCheck": [
            {
                "question": html.unescape(kc["question"]),
                "whereToLearn": html.unescape(kc["where_to_learn"]),
            }
            for kc in lesson["knowledge_check"]
        ],
        "assignment": {
            "instruction": html.unescape(lesson["assignment"]["instruction"]),
            "resourceName": html.unescape(lesson["assignment"]["resource_name"]),
            "resourceType": lesson["assignment"]["resource_type"],
        },
        "additionalResources": [
            {
                "title": html.unescape(r["title"]),
                "type": r["type"],
                "meta": html.unescape(r["meta"]),
            }
            for r in lesson["additional_resources"]
        ],
    }

    fm_yaml = yaml.safe_dump(
        frontmatter, sort_keys=False, allow_unicode=True, default_flow_style=False, width=1000
    )

    intro = clean_html_to_mdx(lesson["intro"])
    body = render_section_body(lesson["sections"])

    mdx = f"---\n{fm_yaml}---\n\n{intro}\n\n{body}"

    out_dir = os.path.join(OUT, level_dir)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{slug}.mdx")
    with open(out_path, "w") as f:
        f.write(mdx)
    count += 1
    print(f"wrote {level_dir}/{slug}.mdx (order {order})")

print(f"\nTOTAL: {count}")
