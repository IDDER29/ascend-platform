import type { Metadata } from "next";
import { PracticeCoachV2Custom } from "@/components/practice/practice-coach-v2-custom";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Custom deck — Practice Coach (v2) — Ascend",
  description: "Build a custom practice deck from the lessons you want to drill.",
};

export default async function PracticeV2CustomPage() {
  const data = await loadPracticePageData();

  return (
    <main className="practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10">
      <div className={HUB_CONTENT_CLASS}>
        <PracticeCoachV2Custom
          userId={data.userId}
          completedKeys={data.completedKeys}
          initialCards={data.initialCards}
          initialHistory={data.initialHistory}
          initialDecks={data.initialDecks}
        />
      </div>
    </main>
  );
}
