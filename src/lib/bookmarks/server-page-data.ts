import "server-only";
import GithubSlugger from "github-slugger";
import { getAllLessons } from "@/lib/content/lessons";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { completionKey } from "@/lib/practice/session";
import { decodeEntities } from "@/lib/content/entities";
import { cardTarget, snippetTarget, type Bookmark, type BookmarkReason, type BookmarkTarget } from "./model";

/**
 * DEVELOPMENT ONLY: a few bookmarks made from real lessons, so the page can be
 * seen filled in. Offered on the empty page outside production builds.
 */
export function sampleBookmarks(now = new Date()): Bookmark[] {
  const lessons = getAllLessons().sort(
    (a, b) => a.meta.level.localeCompare(b.meta.level) || a.meta.order - b.meta.order,
  );
  const ago = (hours: number) => new Date(now.getTime() - hours * 3_600_000).toISOString();
  const out: Bookmark[] = [];
  const add = (t: BookmarkTarget, reason: BookmarkReason, note: string, hours: number) =>
    out.push({ ...t, reason, note, savedAt: ago(hours) });

  lessons.slice(0, 7).forEach(({ meta, body }, i) => {
    const key = completionKey(meta.level, meta.slug);
    const href = lessonHref(meta.level, meta.slug);
    const base = { topic: meta.level, lessonKey: key, where: meta.title };
    const slugger = new GithubSlugger();
    const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => ({
      title: m[1].trim(),
      id: slugger.slug(m[1].trim()),
    }));
    const h = headings[1] ?? headings[0];

    if (i === 0)
      add(
        { ...base, ref: `lesson:${key}`, kind: "lesson", title: meta.title, where: "Whole lesson", href },
        "reference",
        "",
        200,
      );
    if (h && i % 2 === 1)
      add(
        { ...base, ref: `section:${key}#${h.id}`, kind: "section", title: h.title, href: `${href}#${h.id}` },
        i === 1 ? "revisit" : "later",
        i === 1 ? "Why does this work the same way in base 2? Read it again slowly." : "",
        i * 9,
      );
    if (i === 4)
      add(
        { ...base, ref: `lesson:${key}`, kind: "lesson", title: meta.title, where: "Whole lesson", href },
        "later",
        "Finish the second half",
        30,
      );
    const resource = meta.additionalResources.find((r) => r.url);
    if (resource && i === 3)
      add(
        {
          ref: `resource:${resource.url}`,
          kind: "resource",
          title: resource.title,
          where: `From ${meta.title}`,
          href: resource.url!,
          topic: null,
          lessonKey: key,
        },
        "later",
        "Watch on the weekend",
        75,
      );
  });

  const withCode = lessons.find(({ body }) => /<CodeBlock lang='(\w+)' linesJson='(.*?)'/.test(body));
  if (withCode) {
    const [, lang, json] = /<CodeBlock lang='(\w+)' linesJson='(.*?)'/.exec(withCode.body)!;
    const { meta } = withCode;
    const lesson = {
      key: completionKey(meta.level, meta.slug),
      title: meta.title,
      href: lessonHref(meta.level, meta.slug),
      topic: meta.level,
    };
    add(snippetTarget(lesson, (JSON.parse(json) as string[]).map(decodeEntities), lang), "reference", "", 52);
  }

  const cards = PRACTICE_BANK.filter((q) =>
    out.some((b) => b.lessonKey === completionKey(q.lessonLevel, q.lessonSlug)),
  );
  if (cards[3]) add(cardTarget(cards[3]), "revisit", "I keep mixing this up.", 5);
  if (cards[6]) add(cardTarget(cards[6]), "reference", "", 120);
  return out;
}
