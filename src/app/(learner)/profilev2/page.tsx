import type { Metadata } from "next";
import Link from "next/link";
import { ProfileView } from "@/components/profile-v2/profile-view";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileOwner } from "@/lib/profile/queries";
import { loadProfileModel } from "@/lib/profile/server-page-data";
import { SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Profile (v2) — Ascend",
  description: "Who you are as a learner, and what you have built.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

export default async function ProfileV2Page() {
  const user = await getCurrentUser();
  const owner = user ? await getProfileOwner(user.id) : null;

  if (!owner) {
    return (
      <main className={MAIN}>
        <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-4`}>
          <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.03em]">Your profile</h1>
          <p className="m-0 max-w-[520px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
            Sign in to get a profile: the projects you ship, what you can do, and the links you want people to see.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={SIGNIN_HREF}
              className="inline-flex h-11 items-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14px] font-bold uppercase tracking-[0.02em] text-[var(--coach-lime-ink)] no-underline shadow-[0_4px_0_var(--coach-lime-shadow)]"
            >
              Sign in
            </Link>
            <Link href={SIGNUP_HREF} className="inline-flex h-11 items-center px-2 text-[14px] font-semibold text-[var(--coach-ink)]">
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const model = await loadProfileModel(owner, "owner");
  return (
    <main className={MAIN}>
      <div className={HUB_CONTENT_CLASS}>
        <ProfileView model={model} />
      </div>
    </main>
  );
}
