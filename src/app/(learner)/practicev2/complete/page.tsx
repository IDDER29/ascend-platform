import type { Metadata } from "next";
import { PracticeCoachV2CompleteLive } from "@/components/practice/practice-coach-v2-complete-live";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Review complete — Practice Coach (v2) — Ascend",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const data = await loadPracticePageData();
  const sessionParam = Array.isArray(params.session)
    ? params.session[0]
    : params.session;

  return (
    <main className="practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10">
      <div className={HUB_CONTENT_CLASS}>
        <PracticeCoachV2CompleteLive
          userId={data.userId}
          reviewHrefs={data.reviewHrefs}
          initialHistory={data.initialHistory}
          sessionId={sessionParam ?? null}
        />
      </div>
    </main>
  );
}
