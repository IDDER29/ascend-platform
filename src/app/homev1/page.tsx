import { LandingPage } from "@/components/homepage/landing-page";

export const metadata = { robots: { index: false } };

/** The landing page before the public-site redesign, kept for comparison. */
export default function HomeV1() {
  return <LandingPage />;
}
