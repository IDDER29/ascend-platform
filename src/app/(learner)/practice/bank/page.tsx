import type { Metadata } from "next";
import { PracticeCoachV2Bank } from "@/components/practice/practice-coach-v2-bank";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { PageShell } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Card bank · Practice",
};

export default async function Page() {
  const data = await loadPracticePageData();

  return (
    <PageShell>
      <PracticeCoachV2Bank
        userId={data.userId}
        completedKeys={data.completedKeys}
        initialCards={data.initialCards}
        initialHistory={data.initialHistory}
        reviewHrefs={data.reviewHrefs}
      />
    </PageShell>
  );
}
