import type { Metadata } from "next";
import { FaqPage } from "@/components/site/faq-page";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Is Ascend free, do you need an account, how long it takes, and other questions people ask before starting.",
};

export default function Page() {
  return <FaqPage />;
}
