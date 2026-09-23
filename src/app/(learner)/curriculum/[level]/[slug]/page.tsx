import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";

import Link from "next/link";
import { getLesson, getAllLessons, getAllLessonParams, getLessonNavigation } from "@/lib/content/lessons";
import { LEVELS, levelIds } from "@/lib/content/schema";
import { mdxComponents } from "@/lib/mdx-components";

import { KnowledgeCheck } from "@/components/ui/knowledge-check";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LearningOutcomes } from "@/components/lesson/learning-outcomes";
import { PrimerBox } from "@/components/lesson/primer-box";
import {
  LessonMapProvider,
  LessonMapRail,
} from "@/components/lesson/lesson-map-drawer";
import { OnThisPageRail, type RailItem } from "@/components/lesson/on-this-page-rail";
import { AssignmentCard } from "@/components/lesson/assignment-card";
import { AdditionalResources } from "@/components/lesson/additional-resources";
import { AddNoteButton } from "@/components/lesson/add-note-button";
import { LessonFooter } from "@/components/lesson/lesson-footer";
import { LessonFeedback } from "@/components/lesson/lesson-feedback";
import { LessonContributeLinks } from "@/components/lesson/lesson-contribute-links";
import { LessonSupportStrip } from "@/components/lesson/lesson-support-strip";
import { getCurrentUser } from "@/lib/auth/auth";
import { isLessonComplete, getStreak } from "@/lib/progress/queries";
import { lessonEditUrl, lessonIssueUrl } from "@/lib/brand/repo";

export async function generateStaticParams() {
  return getAllLessonParams();
}

function extractHeadings(body: string): RailItem[] {
  const slugger = new GithubSlugger();
  const items: RailItem[] = [];
  for (const line of body.split("\n")) {
    const match = /^##\s+(.+)$/.exec(line.trim());
    if (match) {
      const label = match[1].trim();
      items.push({ id: slugger.slug(label), label });
    }
  }
  return items;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ level: string; slug: string }>;
}) {
  const { level, slug } = await params;
  const lesson = getLesson(level, slug);
  if (!lesson) notFound();

  const { meta, body } = lesson;
  const levelInfo = LEVELS[meta.level];
  const { next } = getLessonNavigation(meta.level, meta.order);
  const isLastInLevel = next !== null && meta.order === levelInfo.totalConcepts;
  const nextNav = next
    ? isLastInLevel
      ? { href: `/level-complete/${meta.level}`, title: "Finish level" }
      : next
    : null;
  const railItems: RailItem[] = [
    ...(meta.primer.length > 0 ? [{ id: "study-these-first", label: "Study these first" }] : []),
    ...extractHeadings(body),
    { id: "knowledge-check", label: "Knowledge check" },
    { id: "assignment", label: "Assignment" },
    { id: "why-this-matters", label: "Why this matters" },
  ];

  const lessonsInLevel = getAllLessons()
    .filter((l) => l.meta.level === meta.level)
    .map((l) => ({ slug: l.meta.slug, title: l.meta.title, order: l.meta.order }))
    .sort((a, b) => a.order - b.order);
  const levelIndex = levelIds.indexOf(meta.level);
  const nextLevelId = levelIds[levelIndex + 1];
  const nextLevelName = nextLevelId ? LEVELS[nextLevelId].name : null;

  const user = await getCurrentUser();
  let initiallyComplete = false;
  let streakDays: number | null = null;
  if (user) {
    try {
      initiallyComplete = await isLessonComplete(user.id, meta.level, meta.slug);
      const streak = await getStreak(user.id);
      streakDays = streak?.current ?? null;
    } catch {
      // db unavailable
    }
  }

  const endOfCurriculum = next === null;
  const footerNext = nextNav
    ?? (endOfCurriculum ? { href: "/projects/shellforge", title: "Shellforge project" } : null);
  const editUrl = lessonEditUrl(meta.level, meta.slug);
  const issueUrl = lessonIssueUrl({
    level: meta.level,
    slug: meta.slug,
    title: meta.title,
  });

  return (
    <LessonMapProvider
      level={meta.level}
      currentOrder={meta.order}
      lessons={lessonsInLevel}
      nextLevelName={nextLevelName}
    >
        <main className="relative flex flex-1 items-start bg-paper dark:bg-bg">
          <div className="flex w-full items-start">
          <LessonMapRail />
          <div className="flex min-w-0 flex-1 flex-wrap items-start">
            <div className="flex min-w-0 flex-1 justify-center px-2.5 py-8 md:py-[50px]">
              <article className="w-full min-w-0 max-w-[724px] text-ink">
                <LessonHeader meta={meta} />
                <h1 className="mb-[18px] font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.032em] text-ink sm:text-[40px]">
                  {meta.title}
                </h1>

                <LearningOutcomes title={meta.title} outcomes={meta.learningOutcomes} />

                <PrimerBox items={meta.primer} />

                <div className="mt-2">
                  <MDXRemote
                    source={body}
                    components={mdxComponents}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [rehypeSlug],
                      },
                    }}
                  />
                </div>

                <h2
                  id="knowledge-check"
                  className="mb-3 mt-9 scroll-mt-[88px] font-display text-2xl font-bold tracking-tight text-ink"
                >
                  Knowledge check
                </h2>
                <p className="mb-5 text-[15.5px] leading-relaxed text-ink-secondary">
                  Answer these in your own words before moving on — no peeking. If
                  one stumps you, that&apos;s exactly the bit to revisit: expand{" "}
                  <b className="text-brand-violet">&ldquo;Where to learn this&rdquo;</b>{" "}
                  for the spot that covers it.
                </p>
                <KnowledgeCheck items={meta.knowledgeCheck} />

                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-xp-border bg-xp-bg/50 px-[18px] py-3.5">
                  <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-brand-gradient text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="flex-1 text-[14.5px] font-semibold text-ink-secondary">
                    Comfortable with all three? You&apos;ve got {meta.title.toLowerCase()} down.
                  </span>
                  <span className="whitespace-nowrap rounded-full bg-brand-gradient px-2.5 py-1 font-mono text-[12.5px] font-bold text-white">
                    Ready
                  </span>
                </div>

                <h2
                  id="assignment"
                  className="mb-3 mt-10 scroll-mt-[88px] font-display text-2xl font-bold tracking-tight text-ink"
                >
                  Assignment
                </h2>
                <p className="mb-[18px] text-[15.5px] leading-relaxed text-ink-secondary">
                  We won&apos;t re-teach what the source material already nails. Go
                  straight to the authoritative resource and do the reading — this
                  is where the concept truly sets.
                </p>
                <AssignmentCard assignment={meta.assignment} />

                <h2
                  id="why-this-matters"
                  className="mb-3 mt-9 scroll-mt-[88px] font-display text-2xl font-bold tracking-tight text-ink"
                >
                  Why this matters
                </h2>
                <p className="text-[16.5px] leading-[1.75] text-ink-secondary">
                  {meta.whyThisMatters}
                </p>

                <LessonFooter
                  title={meta.title}
                  level={meta.level}
                  slug={meta.slug}
                  next={footerNext}
                  initiallyComplete={initiallyComplete}
                  signedIn={Boolean(user)}
                  streakDays={streakDays}
                />
                <LessonContributeLinks editUrl={editUrl} issueUrl={issueUrl} />
                <LessonFeedback issueUrl={issueUrl} />
                <LessonSupportStrip />
              </article>
            </div>

            <aside className="sticky top-0 hidden max-h-screen w-full max-w-[324px] flex-1 basis-[252px] overflow-auto border-l border-divider bg-paper px-6 py-[34px] dark:bg-bg lg:block">
              <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-fainter">
                On this page
              </div>
              <OnThisPageRail items={railItems} />
              <div className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-fainter">
                Additional resources
              </div>
              <div className="mb-3 text-[11px] text-ink-fainter">
                Optional — go deeper if you want
              </div>
              <AdditionalResources resources={meta.additionalResources} />
              <div className="mt-3">
                <AddNoteButton />
              </div>
            </aside>
          </div>
          </div>
        </main>
    </LessonMapProvider>
  );
}
