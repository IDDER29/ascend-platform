import type { Metadata } from "next";
import ResetExpiredPage from "./expired-client";

export const metadata: Metadata = {
  title: "Reset link expired · Ascend",
  description: "This password reset link has expired. Request a fresh one.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ResetExpiredPage />;
}
