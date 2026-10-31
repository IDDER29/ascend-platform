import type { Metadata } from "next";
import { Suspense } from "react";
import { NewPassword } from "@/components/auth-v2/reset-views";
import { SiteShell } from "@/components/site/site-shell";
import { emailConfigured } from "@/lib/email";
import { WRAP } from "@/components/site/site-ui";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <SiteShell>
      <div className={`${WRAP} py-10 sm:py-16`}>
        <Suspense>
          <NewPassword enabled={emailConfigured()} />
        </Suspense>
      </div>
    </SiteShell>
  );
}
