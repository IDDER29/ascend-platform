import type { Metadata } from "next";
import { PracticeCoachV2SessionWrong } from "@/components/practice/practice-coach-v2-session-wrong";

export const metadata: Metadata = {
  title: "Wrong answer — Practice Coach (v2) — Ascend",
  description: "Coach Wrong answer desk — AppShell + cream surface.",
};

export default function Page() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2SessionWrong />
      </div>
    </main>
  );
}
