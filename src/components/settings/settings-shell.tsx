import type { ReactNode } from "react";
import Link from "next/link";
import {
  PageHeader,
  HUB_CONTENT_CLASS,
  HUB_MAIN_CLASS,
} from "@/components/ui/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SIGNIN_HREF } from "@/lib/routes";

/** GitHub-style settings shell: left nav + focused section pane (from layout). */
export function SettingsShell({
  signedIn,
  children,
}: {
  signedIn: boolean;
  children: ReactNode;
}) {
  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <PageHeader
          className="mb-7"
          title="Settings"
          description="One section at a time — change what you need, leave the rest alone."
        />

        {!signedIn ? (
          <p className="mb-6 rounded-[14px] border border-divider bg-elevated/40 px-4 py-3 text-[13px] leading-relaxed text-ink-secondary">
            Browsing as a guest.{" "}
            <Link
              href={SIGNIN_HREF}
              className="font-bold text-brand-violet hover:underline"
            >
              Sign in
            </Link>{" "}
            to edit profile and preferences — Appearance works either way.
          </p>
        ) : null}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <aside className="w-full flex-none lg:sticky lg:top-8 lg:w-[200px]">
            <SettingsNav />
          </aside>

          <div className="min-w-0 w-full max-w-[640px] flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}

/** Section title inside the settings pane. */
export function SettingsSectionHeader({
  title,
  description,
}: {
  title: string;
  description?: ReactNode;
}) {
  return (
    <header className="mb-6 border-b border-divider pb-5">
      <h2 className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink sm:text-[24px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 max-w-[48ch] text-[14.5px] leading-relaxed text-ink-secondary">
          {description}
        </p>
      ) : null}
    </header>
  );
}
