import type { Metadata } from "next";
import { HowItWorksPage } from "@/components/site/how-it-works-page";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Short lessons, questions that show what stuck, spaced Practice that brings ideas back before you forget, and real projects.",
};

export default function HowItWorks() {
  return <HowItWorksPage />;
}
