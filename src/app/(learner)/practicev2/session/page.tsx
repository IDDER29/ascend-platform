import type { Metadata } from "next";
import { PracticeCoachV2Session } from "@/components/practice/practice-coach-v2-session";

export const metadata: Metadata = {
  title: "Review session — Practice Coach (v2) — Ascend",
  description: "Coach Review session desk — AppShell + cream surface.",
};

export default function Page() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2Session />
      </div>
    </main>
  );
}
