import type { Metadata } from "next";
import { PracticeCoachV2HomeLive } from "@/components/practice/practice-coach-v2-home-live";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { PageShell } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Practice",
  description:
    "Spaced-repetition review of every concept you have unlocked.",
};

export default async function PracticeV2Page() {
  const data = await loadPracticePageData();

  return (
    <PageShell>
      <PracticeCoachV2HomeLive
        userId={data.userId}
        completedKeys={data.completedKeys}
        initialCards={data.initialCards}
        initialHistory={data.initialHistory}
        initialDecks={data.initialDecks}
        initialGoal={data.initialGoal}
        completionDates={data.completionDates}
      />
    </PageShell>
  );
}
