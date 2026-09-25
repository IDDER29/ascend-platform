import type { Metadata } from "next";
import { PracticeCoachV2SessionFeedback } from "@/components/practice/practice-coach-v2-session-feedback";

export const metadata: Metadata = {
  title: "Feedback — Practice Coach (v2) — Ascend",
  description: "Coach Feedback desk — AppShell + cream surface.",
};

export default function Page() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2SessionFeedback />
      </div>
    </main>
  );
}
