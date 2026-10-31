import type { Metadata } from "next";

// A preview, not part of the first version: kept out of search and unlinked.
export const metadata: Metadata = {
  title: "Community (preview)",
  robots: { index: false, follow: false },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
