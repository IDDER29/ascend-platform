import type { Metadata } from "next";
import { BookmarksPage } from "@/components/bookmarks/bookmarks-page";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Bookmarks — Ascend",
  description: "What you saved to come back to: lessons, sections, snippets, resources and Practice cards.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

export default function BookmarksRoutePage() {
  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-6`}>
        <header className="flex flex-col gap-1.5">
          <h1 className="m-0 font-display text-[30px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[36px]">
            Bookmarks
          </h1>
          <p className="m-0 max-w-[640px] text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
            What you saved to come back to. Things you didn&apos;t get come first.
          </p>
        </header>
        <BookmarksPage />
      </div>
    </main>
  );
}
