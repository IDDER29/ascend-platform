import type { Metadata } from "next";
import { OpenSourcePage } from "@/components/site/open-source-page";

export const metadata: Metadata = {
  title: "Open source — Ascend",
  description: "Ascend's code and lessons are on GitHub. Fix a lesson, report a problem, or run your own copy.",
};

export default function Page() {
  return <OpenSourcePage />;
}
