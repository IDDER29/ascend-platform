import type { Metadata } from "next";
import { PracticeCoachV2Bank } from "@/components/practice/practice-coach-v2-bank";

export const metadata: Metadata = {
  title: "Card bank — Practice Coach (v2) — Ascend",
  description:
    "Browse unlocked practice cards, their strength, and next review date.",
};

export default function PracticeV2BankPage() {
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2Bank />
      </div>
    </main>
  );
}
