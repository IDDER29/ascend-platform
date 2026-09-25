import type { Metadata } from "next";
import { PracticeCoachV2CompleteLive } from "@/components/practice/practice-coach-v2-complete-live";
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
    <main className="flex-1 bg-paper px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
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
