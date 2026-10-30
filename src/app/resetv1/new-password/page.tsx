import type { Metadata } from "next";
import { Suspense } from "react";
import { NewPasswordClient } from "./new-password-client";

export const metadata: Metadata = {
  title: "Set new password (v1) · Ascend",
  description: "Choose a new password for your Ascend account.",
  robots: { index: false, follow: true },
};

function Fallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-ink-muted">
      <p className="font-mono text-sm">Loading…</p>
    </div>
  );
}

export default function SetNewPasswordPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <NewPasswordClient />
    </Suspense>
  );
}
