import type { Metadata } from "next";
import { PracticeCoachV2Bank } from "@/components/practice/practice-coach-v2-bank";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Card bank — Practice — Ascend",
};

export default async function Page() {
  const data = await loadPracticePageData();

  return (
    <main className="practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10">
      <div className={HUB_CONTENT_CLASS}>
        <PracticeCoachV2Bank
          userId={data.userId}
          completedKeys={data.completedKeys}
          initialCards={data.initialCards}
          initialHistory={data.initialHistory}
          reviewHrefs={data.reviewHrefs}
        />
      </div>
    </main>
  );
}
