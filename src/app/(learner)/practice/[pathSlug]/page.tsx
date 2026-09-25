import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PracticeSessionHost } from "@/components/practice/practice-home";
import {
  HUB_CONTENT_CLASS,
  HUB_MAIN_CLASS,
  PageHeader,
} from "@/components/ui/page-header";
import { practicePathDrillIn } from "@/lib/practice/drill-in";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { practiceTreeForPath } from "@/lib/practice/tree";

type PracticePathPageProps = {
  params: Promise<{ pathSlug: string }>;
};

export async function generateMetadata({ params }: PracticePathPageProps) {
  const { pathSlug } = await params;
  const path = practiceTreeForPath(pathSlug);
  return { title: `${path?.title ?? "Practice path"} — Practice — Ascend` };
}

export default async function PracticePathPage({
  params,
}: PracticePathPageProps) {
  const { pathSlug } = await params;
  if (!practiceTreeForPath(pathSlug)) notFound();

  const pageData = await loadPracticePageData();
  const drillIn = practicePathDrillIn(
    new Set(pageData.completedKeys),
    pathSlug,
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
          <span className="text-ink-secondary">{drillIn.title}</span>
        </nav>
        <PageHeader
          title={drillIn.title}
          description="Choose a branch, or mix every unlocked card in this path."
        />
        <Suspense fallback={null}>
          <PracticeSessionHost {...pageData} drillIn={drillIn} />
        </Suspense>
      </div>
    </main>
  );
}
