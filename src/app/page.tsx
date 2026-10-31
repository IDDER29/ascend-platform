import type { Metadata } from "next";
import { HomePage } from "@/components/site/home-page";

export const metadata: Metadata = {
  title: { absolute: "Ascend · Learn how computers really work" },
  description:
    "Free, bottom-up lessons on how computers really work: bits, logic, memory, C and the operating system, up to a shell you write yourself.",
};

export default function Home() {
  return <HomePage />;
}
