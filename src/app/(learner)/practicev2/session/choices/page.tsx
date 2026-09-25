import type { Metadata } from "next";
import { PracticeCoachV2SessionChoices } from "@/components/practice/practice-coach-v2-session-choices";

export const metadata: Metadata = {
  title: "Choices — Practice Coach (v2) — Ascend",
  description: "Coach Choices desk — AppShell + cream surface.",
};

export default function Page() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2SessionChoices />
      </div>
    </main>
  );
}
