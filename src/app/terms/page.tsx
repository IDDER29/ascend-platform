import { SiteHeader } from "@/components/homepage/header";
import { SiteFooter } from "@/components/homepage/footer";

export const metadata = {
  title: "Terms — Ascend",
};

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col bg-bg text-ink">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[720px] px-6 py-16 sm:px-8">
        <h1 className="mb-4 font-display text-[32px] font-extrabold tracking-[-0.03em]">Terms</h1>
        <p className="text-[15.5px] leading-relaxed text-ink-secondary">
          Ascend is an open-source demo project, not a company — there&apos;s no legal entity
          behind it and no real terms of service to agree to. This page exists so the sign-up
          form doesn&apos;t link to a dead end. Everything you build here (accounts, progress,
          project submissions) lives in a demo database and can be wiped at any time.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
