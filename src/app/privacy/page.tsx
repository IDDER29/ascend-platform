import type { Metadata } from "next";
import { SiteShell } from "@/components/site/site-shell";
import { LEAD, WRAP } from "@/components/site/site-ui";

export const metadata: Metadata = {
  title: "Privacy — Ascend",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <article className={`${WRAP} pb-20 pt-12 sm:pt-20`}>
        <h1 className="m-0 font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[56px]">
          Privacy
        </h1>
        <p className={`${LEAD} mt-6 max-w-[68ch]`}>
          Ascend&apos;s sign-up stores exactly what you&apos;d expect for an account: your name, email, and a
          bcrypt-hashed password — nothing is sold, shared, or tracked beyond that. This is a demo project, so treat it
          accordingly: don&apos;t use a real password you reuse elsewhere, and expect the underlying database to be
          reset without notice.
        </p>
      </article>
    </SiteShell>
  );
}
