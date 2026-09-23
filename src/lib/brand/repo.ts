/**
 * Public GitHub repo for content / contribute links.
 * Edit + issue URLs hide themselves if CONTENT_REPO_URL is empty.
 */
export const CONTENT_REPO_URL = "https://github.com/IDDER29/ascend-platform";

export const CONTENT_DEFAULT_BRANCH = "main";

export function lessonContentPath(level: string, slug: string): string {
  return `content/curriculum/${level}/${slug}.mdx`;
}

export function lessonEditUrl(level: string, slug: string): string | null {
  const base = CONTENT_REPO_URL.trim().replace(/\/$/, "");
  if (!base) return null;
  const file = lessonContentPath(level, slug);
  return `${base}/edit/${CONTENT_DEFAULT_BRANCH}/${file}`;
}

export function lessonIssueUrl(args: {
  level: string;
  slug: string;
  title: string;
}): string | null {
  const base = CONTENT_REPO_URL.trim().replace(/\/$/, "");
  if (!base) return null;
  const file = lessonContentPath(args.level, args.slug);
  const issueTitle = `Lesson feedback: ${args.title}`;
  const body = [
    `**Lesson:** ${args.title}`,
    `**Path:** \`/curriculum/${args.level}/${args.slug}\``,
    `**Source:** \`${file}\``,
    "",
    "### What needs fixing?",
    "",
    "<!-- Broken link, typo, unclear section, etc. -->",
    "",
  ].join("\n");
  const params = new URLSearchParams({
    title: issueTitle,
    body,
  });
  return `${base}/issues/new?${params.toString()}`;
}
