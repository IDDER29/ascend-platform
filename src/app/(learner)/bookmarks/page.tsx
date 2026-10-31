import type { Metadata } from "next";
import { BookmarksPage } from "@/components/bookmarks/bookmarks-page";
import { HUB_CONTENT_CLASS, PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "What you saved to come back to: lessons, sections, snippets, resources and Practice cards.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

export default function BookmarksRoutePage() {
  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-6`}>
        <PageHeader title="Bookmarks" lead="What you saved to come back to. Things you didn't get come first." />
        <BookmarksPage />
      </div>
    </main>
  );
}
