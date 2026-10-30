import type { Metadata } from "next";
import { AboutPage } from "@/components/site/about-page";

export const metadata: Metadata = {
  title: "About — Ascend",
  description: "Why Ascend teaches computers from the bottom up, who it's for, and what it won't do.",
};

export default function Page() {
  return <AboutPage />;
}
