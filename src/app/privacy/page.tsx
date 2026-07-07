import { SiteHeader } from "@/components/homepage/header";
import { SiteFooter } from "@/components/homepage/footer";

export const metadata = {
  title: "Privacy — Ascend",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col bg-bg text-ink">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16 sm:px-8">
        <div className="w-full max-w-[720px]">
          <h1 className="mb-4 font-display text-[32px] font-extrabold tracking-[-0.03em]">Privacy</h1>
          <p className="text-[15.5px] leading-relaxed text-ink-secondary">
            Ascend&apos;s sign-up stores exactly what you&apos;d expect for an account: your name,
            email, and a bcrypt-hashed password — nothing is sold, shared, or tracked beyond that.
            This is a demo project, so treat it accordingly: don&apos;t use a real password you
            reuse elsewhere, and expect the underlying database to be reset without notice.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
