import type { Metadata } from "next";
import { PathsCatalog } from "@/components/paths-v2/paths-catalog";
import { HUB_CONTENT_CLASS, PageHeader } from "@/components/ui/page-header";
import { loadPathsV2 } from "@/lib/paths/paths-v2-data";

export const metadata: Metadata = {
  title: "Paths — Ascend",
  description: "Each path is a role you train toward: what it covers, how long it takes, and where you are on it.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

export default async function PathsPage() {
  const { views } = await loadPathsV2();
  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-6`}>
        <PageHeader title="Paths" lead="Your next lesson comes from the path you're on. Join others any time." />
        <PathsCatalog views={views} />
      </div>
    </main>
  );
}
