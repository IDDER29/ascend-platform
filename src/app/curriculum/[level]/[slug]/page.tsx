import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";

import Link from "next/link";
import { getLesson, getAllLessons, getAllLessonParams, getLessonNavigation } from "@/lib/content/lessons";
import { LEVELS, levelIds } from "@/lib/content/schema";
import { mdxComponents } from "@/lib/mdx-components";

import { AppSidebar } from "@/components/ui/sidebar";
import { KnowledgeCheck } from "@/components/ui/knowledge-check";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LearningOutcomes } from "@/components/lesson/learning-outcomes";
import { PrimerBox } from "@/components/lesson/primer-box";
import { LessonListPanel } from "@/components/lesson/lesson-list-panel";
import { OnThisPageRail, type RailItem } from "@/components/lesson/on-this-page-rail";
import { AssignmentCard } from "@/components/lesson/assignment-card";
import { AdditionalResources } from "@/components/lesson/additional-resources";
import { AddNoteButton } from "@/components/lesson/add-note-button";
import { LessonFooter } from "@/components/lesson/lesson-footer";
import { LessonFeedback } from "@/components/lesson/lesson-feedback";

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
  const percent = Math.round((meta.order / levelInfo.totalConcepts) * 100);
  const { prev, next } = getLessonNavigation(meta.level, meta.order);
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

  return (
    <div className="flex min-h-screen bg-white text-ink">
      <AppSidebar defaultCollapsed />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-center border-b border-divider bg-white/85 px-4 backdrop-blur-[14px] backdrop-saturate-[1.4] sm:px-7">
          <div className="mx-auto flex w-full max-w-[1362px] items-center gap-3 sm:gap-4">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-brand-gradient md:hidden">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 15 6-6 6 6" />
              <path d="m6 9 6-6 6 6" opacity=".55" />
            </svg>
          </div>
          <div className="min-w-0 flex-1 sm:flex-none">
            <div className="truncate text-[13.5px] font-bold">
              <span className="hidden sm:inline">
                {levelInfo.name}
                <span className="font-medium text-ink-fainter"> / </span>
              </span>
              <span className="font-semibold text-ink-secondary">{meta.title}</span>
            </div>
            <div className="font-mono text-[11.5px] text-ink-faint">
              Concept {meta.order} of {levelInfo.totalConcepts}
            </div>
          </div>
          <div className="mx-1.5 hidden max-w-[260px] flex-1 items-center gap-2.5 sm:flex">
            <ProgressBar percent={percent} />
            <span className="font-mono text-[11px] text-ink-faint">{percent}%</span>
          </div>
          <div className="ml-auto flex flex-none gap-1.5">
            {prev ? (
              <Link
                href={prev.href}
                title={`Previous: ${prev.title}`}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-card-border-soft text-ink-secondary transition-colors hover:bg-[#F3F1FA]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Link>
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-card-border-soft text-ink-fainter opacity-40">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </span>
            )}
            {nextNav ? (
              <Link
                href={nextNav.href}
                title={`Next: ${nextNav.title}`}
                className="flex h-9 items-center gap-1.5 rounded-[10px] bg-brand-violet px-4 text-[13.5px] font-bold text-white shadow-[0_8px_18px_rgba(109,70,242,0.32)] transition-transform hover:-translate-y-0.5"
              >
                {isLastInLevel ? "Finish level" : "Next"}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </Link>
            ) : null}
          </div>
          </div>
        </header>

        <main className="flex flex-1 items-start justify-center">
          <div className="mx-auto flex w-full max-w-[1362px] items-start">
          <LessonListPanel
            level={meta.level}
            currentOrder={meta.order}
            lessons={lessonsInLevel}
            nextLevelName={nextLevelName}
          />

          <div className="flex min-w-0 flex-1 flex-wrap items-start">
            <div className="flex min-w-0 flex-1 justify-center px-4 py-8 sm:px-8 md:px-11 md:py-[50px]">
              <article className="w-full min-w-0 max-w-[724px]">
                <LessonHeader meta={meta} />
                <h1 className="mb-[18px] font-display text-[40px] font-extrabold leading-[1.03] tracking-[-0.032em]">
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
                  className="mb-3 mt-9 scroll-mt-[88px] font-display text-2xl font-bold tracking-tight"
                >
                  Knowledge check
                </h2>
                <p className="mb-5 text-[15.5px] leading-relaxed text-ink-secondary">
                  Answer these in your own words before moving on — no peeking. If
                  one stumps you, that&apos;s exactly the bit to revisit: expand{" "}
                  <b className="text-[#5A32D6]">&ldquo;Where to learn this&rdquo;</b>{" "}
                  for the spot that covers it.
                </p>
                <KnowledgeCheck items={meta.knowledgeCheck} />

                <div className="mt-4 flex items-center gap-3 rounded-2xl border-[1.5px] border-[#C7E9D8] bg-[#F3FBF7] px-[18px] py-3.5">
                  <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-[#12B981] text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="flex-1 text-[14.5px] font-semibold text-[#0E7D57]">
                    Comfortable with all three? You&apos;ve got {meta.title.toLowerCase()} down.
                  </span>
                  <span className="whitespace-nowrap rounded-full bg-[#E9F9F2] px-2.5 py-1 font-mono text-[12.5px] font-bold text-[#0E9E6E]">
                    +30 XP
                  </span>
                </div>

                <h2
                  id="assignment"
                  className="mb-3 mt-10 scroll-mt-[88px] font-display text-2xl font-bold tracking-tight"
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
                  className="mb-3 mt-9 scroll-mt-[88px] font-display text-2xl font-bold tracking-tight"
                >
                  Why this matters
                </h2>
                <p className="text-[16.5px] leading-[1.75] text-[#413D50]">
                  {meta.whyThisMatters}
                </p>

                <LessonFooter title={meta.title} next={nextNav} />
                <LessonFeedback />
              </article>
            </div>

            <aside className="sticky top-[70px] hidden max-h-[calc(100vh-70px)] w-full max-w-[324px] flex-1 basis-[252px] overflow-auto border-l border-divider px-6 py-[34px] lg:block">
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
      </div>
    </div>
  );
}
