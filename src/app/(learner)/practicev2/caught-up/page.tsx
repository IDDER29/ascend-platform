import type { Metadata } from "next";
import { PracticeCoachV2CaughtUp } from "@/components/practice/practice-coach-v2-caught-up";

export const metadata: Metadata = {
  title: "All caught up — Practice Coach (v2) — Ascend",
  description: "Your completed practice review and optional next activities.",
};

export default function PracticeV2CaughtUpPage() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 pb-8 pt-16 sm:px-10 sm:py-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2CaughtUp />
      </div>
    </main>
  );
}
