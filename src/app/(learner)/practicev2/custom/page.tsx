import type { Metadata } from "next";
import { PracticeCoachV2Custom } from "@/components/practice/practice-coach-v2-custom";

export const metadata: Metadata = {
  title: "Custom deck — Practice Coach (v2) — Ascend",
  description: "Build a custom practice deck from the lessons you want to drill.",
};

export default function PracticeV2CustomPage() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2Custom />
      </div>
    </main>
  );
}
