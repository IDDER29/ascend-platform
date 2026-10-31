import type { Metadata } from "next";
import { PracticeCoachV2SessionLive } from "@/components/practice/practice-coach-v2-session-live";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Review session · Practice",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const data = await loadPracticePageData();
  return (
    <main className="practice-coach-v2 flex flex-1 flex-col bg-[var(--coach-bg)] px-5 pt-5 font-sans text-[var(--coach-ink)] antialiased sm:px-10">
      <PracticeCoachV2SessionLive
        userId={data.userId}
        completedKeys={data.completedKeys}
        reviewHrefs={data.reviewHrefs}
        initialCards={data.initialCards}
        searchParams={params}
      />
    </main>
  );
}
