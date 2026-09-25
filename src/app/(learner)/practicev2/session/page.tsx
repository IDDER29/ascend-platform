import type { Metadata } from "next";
import { PracticeCoachV2SessionLive } from "@/components/practice/practice-coach-v2-session-live";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Review session — Practice Coach (v2) — Ascend",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const data = await loadPracticePageData();
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2SessionLive
          userId={data.userId}
          completedKeys={data.completedKeys}
          reviewHrefs={data.reviewHrefs}
          initialCards={data.initialCards}
          searchParams={params}
        />
      </div>
    </main>
  );
}
