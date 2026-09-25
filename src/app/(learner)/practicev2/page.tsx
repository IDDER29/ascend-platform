import type { Metadata } from "next";
import { PracticeCoachV2 } from "@/components/practice/practice-coach-v2";

export const metadata: Metadata = {
  title: "Practice Coach (v2) — Ascend",
  description:
    "Coach desk alternative for Practice — same AppShell as the rest of Ascend.",
};

/**
 * Parallel Practice surface using the Coach mock composition,
 * inside the learner shell (sidebar / theme / account chrome).
 * Cream desk surface (not paper) so Coach tiles sit flush — no nested card.
 */
export default function PracticeV2Page() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2 />
      </div>
    </main>
  );
}
