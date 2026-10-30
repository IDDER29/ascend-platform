import { Suspense } from "react";
import type { Metadata } from "next";
import { AccountPerks } from "@/components/auth-v2/account-perks";
import { AuthForm } from "@/components/auth-v2/auth-form";
import { SiteShell } from "@/components/site/site-shell";
import { WRAP } from "@/components/site/site-ui";

export const metadata: Metadata = {
  title: "Sign in — Ascend",
  description: "Sign in or create a free Ascend account to keep your progress. Lessons stay open either way.",
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return (
    <SiteShell>
      <div
        className={`${WRAP} grid items-start gap-6 py-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10`}
      >
        <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none">
          {/* The form reads ?mode and ?next from the URL. */}
          <Suspense
            fallback={<div className="min-h-[560px] rounded-[24px] border-2 border-[var(--coach-border)]" aria-busy />}
          >
            <AuthForm />
          </Suspense>
        </div>
        <div className="mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none">
          <AccountPerks />
        </div>
      </div>
    </SiteShell>
  );
}
