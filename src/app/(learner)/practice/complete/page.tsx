import type { Metadata } from "next";
import { PracticeCoachV2CompleteLive } from "@/components/practice/practice-coach-v2-complete-live";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { PageShell } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Review complete · Practice",
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
    <PageShell>
      <PracticeCoachV2CompleteLive
        userId={data.userId}
        reviewHrefs={data.reviewHrefs}
        initialHistory={data.initialHistory}
        sessionId={sessionParam ?? null}
        initialGoal={data.initialGoal}
        completionDates={data.completionDates}
      />
    </PageShell>
  );
}
