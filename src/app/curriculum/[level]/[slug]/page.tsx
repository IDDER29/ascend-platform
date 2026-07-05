import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";

import Link from "next/link";
import { getLesson, getAllLessonParams, getLessonNavigation } from "@/lib/content/lessons";
import { LEVELS } from "@/lib/content/schema";
import { mdxComponents } from "@/lib/mdx-components";

import { IconSidebar } from "@/components/ui/sidebar";
import { KnowledgeCheck } from "@/components/ui/knowledge-check";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LearningOutcomes } from "@/components/lesson/learning-outcomes";
import { OnThisPageRail, type RailItem } from "@/components/lesson/on-this-page-rail";
import { AssignmentCard } from "@/components/lesson/assignment-card";
import { AdditionalResources } from "@/components/lesson/additional-resources";
import { LessonFooter } from "@/components/lesson/lesson-footer";

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
    ...extractHeadings(body),
    { id: "knowledge-check", label: "Knowledge check" },
    { id: "assignment", label: "Assignment" },
  ];

  return (
    <div className="flex min-h-screen bg-white text-ink">
      <IconSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[70px] items-center gap-3 border-b border-divider bg-white/85 px-4 backdrop-blur-[14px] backdrop-saturate-[1.4] sm:gap-4 sm:px-7">
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
        </header>

        <main className="flex flex-1 items-start">
          <div className="flex min-w-0 flex-1 flex-wrap items-start">
            <div className="flex min-w-0 flex-1 justify-center px-4 py-8 sm:px-8 md:px-11 md:py-[50px]">
              <article className="w-full min-w-0 max-w-[724px]">
                <LessonHeader meta={meta} />
                <h1 className="mb-[18px] font-display text-[40px] font-extrabold leading-[1.03] tracking-[-0.032em]">
                  {meta.title}
                </h1>

                <LearningOutcomes title={meta.title} outcomes={meta.learningOutcomes} />

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

                <LessonFooter title={meta.title} next={nextNav} />
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
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
