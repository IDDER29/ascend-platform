import { Suspense } from "react";
import type { Metadata } from "next";
import { SignInClient } from "../signin/signin-client";

export const metadata: Metadata = {
  title: "Sign in (v1) · Ascend",
  robots: { index: false, follow: false },
};

/** The sign-in page before the Coach redesign, kept for comparison. */
export default function SignInV1Page() {
  return (
    <Suspense>
      <SignInClient />
    </Suspense>
  );
}
