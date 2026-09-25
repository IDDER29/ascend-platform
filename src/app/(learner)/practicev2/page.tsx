import type { Metadata } from "next";
import { PracticeCoachV2HomeLive } from "@/components/practice/practice-coach-v2-home-live";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Practice Coach (v2) — Ascend",
  description:
    "Coach desk alternative for Practice — same AppShell as the rest of Ascend.",
};

export default async function PracticeV2Page() {
  const data = await loadPracticePageData();

  return (
    <main className="flex-1 bg-paper px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2HomeLive
          userId={data.userId}
          completedKeys={data.completedKeys}
          initialCards={data.initialCards}
          initialHistory={data.initialHistory}
        />
      </div>
    </main>
  );
}
