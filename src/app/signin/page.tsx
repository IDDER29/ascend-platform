import { Suspense } from "react";
import type { Metadata } from "next";
import { SignInClient } from "./signin-client";

export const metadata: Metadata = {
  title: "Sign in · Ascend",
  description: "Sign in or create a free Ascend account to save progress. Curriculum stays open either way.",
  robots: { index: false, follow: true },
};

function SignInFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-ink-muted">
      <p className="font-mono text-sm">Loading…</p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInClient />
    </Suspense>
  );
}
