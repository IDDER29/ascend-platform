import type { Metadata } from "next";
import { BookmarksPage } from "@/components/bookmarks/bookmarks-page";
import { PageHeader } from "@/components/ui/page-header";
import { PageShell } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "What you saved to come back to: lessons, sections, snippets, resources and Practice cards.",
};

export default function BookmarksRoutePage() {
  return (
    <PageShell className="flex flex-col gap-6">
      <PageHeader title="Bookmarks" lead="What you saved to come back to. Things you didn't get come first." />
      <BookmarksPage />
    </PageShell>
  );
}
