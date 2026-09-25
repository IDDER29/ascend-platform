import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PracticeSessionHost } from "@/components/practice/practice-home";
import {
  HUB_CONTENT_CLASS,
  HUB_MAIN_CLASS,
  PageHeader,
} from "@/components/ui/page-header";
import { practiceSectionDrillIn } from "@/lib/practice/drill-in";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { practiceSectionForPath } from "@/lib/practice/tree";

type PracticeSectionPageProps = {
  params: Promise<{ pathSlug: string; sectionId: string }>;
};

export async function generateMetadata({ params }: PracticeSectionPageProps) {
  const { pathSlug, sectionId } = await params;
  const section = practiceSectionForPath(pathSlug, sectionId);
  return { title: `${section?.title ?? "Practice section"} — Practice — Ascend` };
}

export default async function PracticeSectionPage({
  params,
}: PracticeSectionPageProps) {
  const { pathSlug, sectionId } = await params;
  if (!practiceSectionForPath(pathSlug, sectionId)) notFound();

  const pageData = await loadPracticePageData();
  const drillIn = practiceSectionDrillIn(
    new Set(pageData.completedKeys),
    pathSlug,
    sectionId,
  );
  if (!drillIn) notFound();

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[12px] text-ink-fainter"
        >
          <Link
            href="/practice"
            className="transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/35"
          >
            Practice
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/practice/${pathSlug}`}
            className="transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/35"
          >
            {drillIn.pathTitle}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink-secondary">{drillIn.title}</span>
        </nav>
        <PageHeader
          title={drillIn.title}
          description={
            drillIn.blurb ??
            "Study the whole branch, or focus on one lesson at a time."
          }
        />
        <Suspense fallback={null}>
          <PracticeSessionHost {...pageData} drillIn={drillIn} />
        </Suspense>
      </div>
    </main>
  );
}
