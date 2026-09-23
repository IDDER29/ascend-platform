import type { Metadata } from "next";
import ResetRequestPage from "./reset-client";

export const metadata: Metadata = {
  title: "Reset password · Ascend",
  description: "Request a link to reset your Ascend password.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ResetRequestPage />;
}
