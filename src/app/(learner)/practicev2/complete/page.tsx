import type { Metadata } from "next";
import { PracticeCoachV2Complete } from "@/components/practice/practice-coach-v2-complete";

export const metadata: Metadata = {
  title: "Review complete — Practice Coach (v2) — Ascend",
  description: "Coach Review complete desk — AppShell + cream surface.",
};

export default function Page() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2Complete />
      </div>
    </main>
  );
}
