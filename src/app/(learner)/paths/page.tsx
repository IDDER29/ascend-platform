import type { Metadata } from "next";
import { PathsCatalog } from "@/components/paths-v2/paths-catalog";
import { PageHeader } from "@/components/ui/page-header";
import { loadPathsV2 } from "@/lib/paths/paths-v2-data";
import { PageShell } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Paths",
  description: "Each path is a role you train toward: what it covers, how long it takes, and where you are on it.",
};

export default async function PathsPage() {
  const { views } = await loadPathsV2();
  return (
    <PageShell className="flex flex-col gap-6">
      <PageHeader title="Paths" lead="Your next lesson comes from the path you're on. Join others any time." />
      <PathsCatalog views={views} />
    </PageShell>
  );
}
