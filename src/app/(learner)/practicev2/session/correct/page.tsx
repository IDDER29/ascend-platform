import type { Metadata } from "next";
import { PracticeCoachV2SessionCorrect } from "@/components/practice/practice-coach-v2-session-correct";

export const metadata: Metadata = {
  title: "Correct — Practice Coach (v2) — Ascend",
  description: "Coach Correct desk — AppShell + cream surface.",
};

export default function Page() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2SessionCorrect />
      </div>
    </main>
  );
}
