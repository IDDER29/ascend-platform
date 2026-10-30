import type { Metadata } from "next";
import { SiteShell } from "@/components/site/site-shell";
import { LEAD, WRAP } from "@/components/site/site-ui";

export const metadata: Metadata = {
  title: "Terms — Ascend",
};

export default function TermsPage() {
  return (
    <SiteShell>
      <article className={`${WRAP} pb-20 pt-12 sm:pt-20`}>
        <h1 className="m-0 font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[56px]">
          Terms
        </h1>
        <p className={`${LEAD} mt-6 max-w-[68ch]`}>
          Ascend is an open-source demo project, not a company — there&apos;s no legal entity behind it and no real
          terms of service to agree to. This page exists so the sign-up form doesn&apos;t link to a dead end. Everything
          you build here (accounts, progress, project submissions) lives in a demo database and can be wiped at any
          time.
        </p>
      </article>
    </SiteShell>
  );
}
