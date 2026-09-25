import type { Metadata } from "next";
import { PracticeCoachV2Foundations } from "@/components/practice/practice-coach-v2-foundations";

export const metadata: Metadata = {
  title: "Foundations — Practice Coach (v2) — Ascend",
  description: "Coach Foundations path desk — AppShell + cream surface.",
};

export default function PracticeV2FoundationsPage() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2Foundations />
      </div>
    </main>
  );
}
