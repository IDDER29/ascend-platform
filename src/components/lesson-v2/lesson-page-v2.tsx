import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { ArrowUpRight, FileText, Play } from "lucide-react";
import { notFound } from "next/navigation";
import { LessonBookmarksProvider, SaveLessonButton } from "@/components/bookmarks/lesson-bookmarks";
import { LessonContributeLinks } from "@/components/lesson/lesson-contribute-links";
import { LessonFeedback } from "@/components/lesson/lesson-feedback";
import { PageRail, type RailItem } from "./page-rail";
import { PracticeHistoryProvider } from "@/components/paths-v2/lesson-memory";
import { getCurrentUser } from "@/lib/auth/auth";
import { lessonEditUrl, lessonIssueUrl } from "@/lib/brand/repo";
import { getAllLessons, getLesson } from "@/lib/content/lessons";
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { mdxComponents } from "@/lib/mdx-components";
import { PATHS } from "@/lib/paths/catalog";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { deckSessionHref } from "@/lib/practice/coach-custom-model";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { completionKey, unlockedQuestions } from "@/lib/practice/session";
import { isLessonComplete } from "@/lib/progress/queries";
import { CheckYourself } from "./check-yourself";
import { FinishCard } from "./finish-card";
import { ResourceList } from "./resource-list";
import { LockItIn } from "./lock-it-in";

/** Lesson links stay on v2 while it's being tried out. */
export const v2Href = (level: string, slug: string) => lessonHref(level, slug).replace(/^\/lessons\//, "/lessonsv2/");

function headings(body: string): RailItem[] {
  const slugger = new GithubSlugger();
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => ({ id: slugger.slug(m[1].trim()), label: m[1].trim() }));
}

const H2 = "m-0 scroll-mt-[88px] font-display text-[24px] font-bold tracking-tight";

/** One lesson, the Coach way: understand it, check yourself honestly, lock it in with Practice, then go on. */
export async function LessonPageV2({ level, slug }: { level: string; slug: string }) {
  const lesson = getLesson(level, slug);
  if (!lesson) notFound();
  const { meta, body } = lesson;
  const key = completionKey(meta.level, meta.slug);
  const href = v2Href(meta.level, meta.slug);
  const topic = LEVELS[meta.level];
  const inTopic = getAllLessons()
    .filter((l) => l.meta.level === meta.level)
    .sort((a, b) => a.meta.order - b.meta.order);
  const index = inTopic.findIndex((l) => l.meta.slug === meta.slug);
  const path = PATHS.find((p) => p.courses.some((c) => c.levelId === meta.level));

  // Next: the next lesson in the topic, the topic's finish line, or the next topic / capstone.
  const after = inTopic[index + 1];
  const nextTopic = levelIds[levelIds.indexOf(meta.level) + 1] as LevelId | undefined;
  const next = after
    ? { href: v2Href(after.meta.level, after.meta.slug), label: "Next", title: after.meta.title }
    : nextTopic
      ? { href: `/level-complete/${meta.level}`, label: "Finish", title: topic.name }
      : { href: "/projects/shellforge", label: "Capstone", title: "ShellForge" };

  const [user, practice] = await Promise.all([getCurrentUser(), loadPracticePageData()]);
  let complete = false;
  if (user) {
    try {
      complete = await isLessonComplete(user.id, meta.level, meta.slug);
    } catch {
      // database unavailable: shown as not done
    }
  }
  const before = inTopic[index - 1];
  const prev = before ? { href: v2Href(before.meta.level, before.meta.slug), title: before.meta.title } : null;
  const cardIds = PRACTICE_BANK.filter((q) => completionKey(q.lessonLevel, q.lessonSlug) === key).map((q) => q.id);
  const unlocked = new Set(unlockedQuestions(new Set(practice.completedKeys)).map((q) => q.id));
  const canReview = cardIds.length > 0 && cardIds.every((id) => unlocked.has(id));

  // Real links only: the lesson's extra resources, then what it asks you to skim first.
  const deeper = meta.additionalResources.filter((r): r is typeof r & { url: string } => Boolean(r.url));
  const learnMore = [
    ...deeper.map((r) => ({ title: r.title, type: r.type, meta: r.duration ?? r.meta, url: r.url })),
    ...meta.primer
      .filter((p): p is typeof p & { url: string } => Boolean(p.url))
      .map((p) => ({ title: p.title, type: p.type, meta: p.meta, url: p.url })),
  ].filter((r, i, all) => all.findIndex((x) => x.url === r.url) === i); // a link can be in both lists
  const rail: RailItem[] = [
    ...(meta.primer.length > 0 ? [{ id: "study-first", label: "Study these first" }] : []),
    ...headings(body),
    { id: "check-yourself", label: "Check yourself" },
    ...(cardIds.length > 0 ? [{ id: "lock-it-in", label: "Lock it in" }] : []),
    { id: "assignment", label: "Assignment" },
    { id: "why-this-matters", label: "Why this matters" },
    ...(deeper.length > 0 ? [{ id: "go-deeper", label: "Go deeper" }] : []),
  ];
  const bookmarkLesson = { key, title: meta.title, href, topic: meta.level };
  const issueUrl = lessonIssueUrl({ level: meta.level, slug: meta.slug, title: meta.title });

  return (
    <LessonBookmarksProvider lesson={bookmarkLesson}>
      <PracticeHistoryProvider userId={practice.userId} initialHistory={practice.initialHistory}>
        <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(0,720px)_280px] xl:justify-center">
          <article className="flex min-w-0 flex-col gap-8">
            <header className="flex flex-col gap-3">
              <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--coach-ink-muted)]">
                {path && (
                  <>
                    <Link
                      href={`/paths/${path.slug}`}
                      className="text-[var(--coach-ink-muted)] no-underline hover:text-[var(--coach-ink)]"
                    >
                      {path.title}
                    </Link>
                    <span aria-hidden className="mx-1.5">
                      /
                    </span>
                  </>
                )}
                <span>{topic.name}</span>
              </nav>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-[var(--coach-ink-muted)]">
                  <span>
                    Lesson {index + 1} of {inTopic.length}
                  </span>
                  <span>{meta.timeMin} min</span>
                  {complete && (
                    <span className="rounded-full bg-[var(--coach-ink)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--coach-surface)]">
                      Done
                    </span>
                  )}
                </p>
                <SaveLessonButton />
              </div>
              <h1 className="m-0 font-display text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:balance] sm:text-[42px]">
                {meta.title}
              </h1>
            </header>

            <section
              aria-labelledby="outcomes"
              className="flex flex-col gap-3 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6"
            >
              <h2 id="outcomes" className="m-0 text-[17px] font-bold">
                By the end, you&apos;ll be able to
              </h2>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {meta.learningOutcomes.map((o) => (
                  <li key={o} className="flex gap-2.5 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--coach-ink)]" />
                    {o}
                  </li>
                ))}
              </ul>
              <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">
                &ldquo;Check yourself&rdquo; at the end asks about exactly these.
              </p>
            </section>

            {meta.primer.length > 0 && (
              <section
                id="study-first"
                aria-labelledby="study-first-title"
                className="flex scroll-mt-[88px] flex-col gap-3"
              >
                <div>
                  <h2 id="study-first-title" className="m-0 text-[17px] font-bold">
                    Study these first
                  </h2>
                  <p className="m-0 mt-0.5 text-[14px] text-[var(--coach-ink-muted)]">
                    The lesson assumes them — a quick skim is enough.
                  </p>
                </div>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {meta.primer.map((p) => {
                    const Icon = p.type === "video" ? Play : FileText;
                    const inner = (
                      <>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]">
                          <Icon size={16} strokeWidth={2.2} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14.5px] font-semibold">{p.title}</span>
                          <span className="block text-[12.5px] text-[var(--coach-ink-muted)]">
                            {p.meta} · {p.essential ? "Essential" : "Optional"}
                          </span>
                        </span>
                        {p.url && <ArrowUpRight size={16} aria-hidden className="text-[var(--coach-ink-muted)]" />}
                      </>
                    );
                    const cls =
                      "flex items-center gap-3 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-4 py-3 text-[var(--coach-ink)] no-underline";
                    return (
                      <li key={p.title}>
                        {p.url ? (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`${cls} hover:border-[var(--coach-border-strong)]`}
                          >
                            {inner}
                          </a>
                        ) : (
                          <div className={cls}>{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <div className="lesson-v2-body min-w-0">
              <MDXRemote
                source={body}
                components={mdxComponents}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
              />
            </div>

            <section id="check-yourself" aria-labelledby="check-title" className="flex scroll-mt-[88px] flex-col gap-3">
              <div>
                <h2 id="check-title" className={H2}>
                  Check yourself
                </h2>
                <p className="m-0 mt-1 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
                  Answer each in your own words before you look — trying to recall is what makes it stick, even when you
                  get it wrong.
                </p>
              </div>
              <CheckYourself items={meta.knowledgeCheck} lesson={bookmarkLesson} resources={learnMore} />
            </section>

            <div id="lock-it-in" className="scroll-mt-[88px]">
              <LockItIn
                lessonKey={key}
                cardIds={cardIds}
                canReview={canReview}
                reviewHref={deckSessionHref(cardIds, meta.title)}
              />
            </div>

            <section
              id="assignment"
              aria-labelledby="assignment-title"
              className="flex scroll-mt-[88px] flex-col gap-3"
            >
              <h2 id="assignment-title" className={H2}>
                Assignment
              </h2>
              <div className="flex flex-col gap-3 rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6">
                <p className="m-0 text-[13px] font-semibold text-[var(--coach-ink-muted)]">Before the next lesson</p>
                <p className="m-0 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
                  {meta.assignment.instruction}
                </p>
                {meta.assignment.resourceUrl ? (
                  <a
                    href={meta.assignment.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-1 text-[14.5px] font-semibold text-[var(--coach-ink)] underline underline-offset-2"
                  >
                    {meta.assignment.resourceName}
                    <ArrowUpRight size={15} aria-hidden />
                  </a>
                ) : (
                  <span className="text-[14.5px] font-semibold">{meta.assignment.resourceName}</span>
                )}
              </div>
            </section>

            <section id="why-this-matters" aria-labelledby="why-title" className="flex scroll-mt-[88px] flex-col gap-2">
              <h2 id="why-title" className={H2}>
                Why this matters
              </h2>
              <p className="m-0 text-[16px] leading-[1.75] text-[var(--coach-ink-secondary)]">{meta.whyThisMatters}</p>
            </section>

            {deeper.length > 0 && (
              <section id="go-deeper" aria-labelledby="deeper-title" className="flex scroll-mt-[88px] flex-col gap-3">
                <div>
                  <h2 id="deeper-title" className={H2}>
                    Go deeper
                  </h2>
                  <p className="m-0 mt-1 text-[15px] text-[var(--coach-ink-secondary)]">
                    Optional — if you want more on this.
                  </p>
                </div>
                <ResourceList resources={deeper} />
              </section>
            )}

            <FinishCard
              level={meta.level}
              slug={meta.slug}
              initiallyComplete={complete}
              signedIn={Boolean(user)}
              next={next}
              prev={prev}
            />

            <div className="flex flex-col gap-4">
              <LessonContributeLinks editUrl={lessonEditUrl(meta.level, meta.slug)} issueUrl={issueUrl} />
              <LessonFeedback issueUrl={issueUrl} />
            </div>
          </article>

          <aside className="hidden xl:sticky xl:top-6 xl:block">
            <p className="m-0 mb-2 text-[13px] font-semibold text-[var(--coach-ink-muted)]">On this page</p>
            <PageRail items={rail} />
          </aside>
        </div>
      </PracticeHistoryProvider>
    </LessonBookmarksProvider>
  );
}
