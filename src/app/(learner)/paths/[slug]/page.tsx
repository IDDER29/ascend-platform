import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PracticeHistoryProvider } from "@/components/paths-v2/lesson-memory";
import { PathPage } from "@/components/paths-v2/path-page";
import { getPathBySlug } from "@/lib/paths/catalog";
import { loadPathsV2, PATHS_INDEX_HREF } from "@/lib/paths/paths-v2-data";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { PageShell } from "@/components/ui/page-shell";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const path = getPathBySlug((await params).slug);
  return { title: path ? `${path.title} · Paths` : "Path", description: path?.body };
}

export default async function PathRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ views, earns }, practice] = await Promise.all([loadPathsV2(), loadPracticePageData()]);
  const path = views.find((v) => v.slug === slug);
  if (!path) notFound();
  const other = path.requires ? (views.find((v) => v.slug === path.requires!.slug) ?? null) : null;

  return (
    <PageShell className="flex flex-col gap-4">
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--coach-ink-muted)]">
        <Link
          href={PATHS_INDEX_HREF}
          className="text-[var(--coach-ink-muted)] no-underline hover:text-[var(--coach-ink)]"
        >
          Paths
        </Link>
        <span aria-hidden className="mx-1.5">
          /
        </span>
        <span className="text-[var(--coach-ink)]">{path.title}</span>
      </nav>
      <PracticeHistoryProvider userId={practice.userId} initialHistory={practice.initialHistory}>
        <PathPage path={path} earns={earns[slug] ?? []} other={other} />
      </PracticeHistoryProvider>
    </PageShell>
  );
}
