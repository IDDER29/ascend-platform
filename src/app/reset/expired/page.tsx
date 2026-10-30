import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetExpired } from "@/components/auth-v2/reset-views";
import { SiteShell } from "@/components/site/site-shell";
import { WRAP } from "@/components/site/site-ui";

export const metadata: Metadata = {
  title: "Reset link expired — Ascend",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <SiteShell>
      <div className={`${WRAP} py-10 sm:py-16`}>
        <Suspense>
          <ResetExpired />
        </Suspense>
      </div>
    </SiteShell>
  );
}
