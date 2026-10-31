import type { Metadata } from "next";
import { CatalogPage } from "@/components/site/catalog-page";

export const metadata: Metadata = {
  title: "All paths",
  description:
    "Every Ascend path: Foundations and Systems Programmer are open now, with Linux, networking, Python and AI paths on the way.",
};

export default function Catalog() {
  return <CatalogPage />;
}
