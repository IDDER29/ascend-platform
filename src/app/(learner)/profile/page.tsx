import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/auth";
import { signOutAction } from "@/lib/auth/actions";
import { listCompletedLessons } from "@/lib/progress/queries";
import {
  daysOnSince,
  formatAccountTenure,
} from "@/lib/dashboard/tenure";
import {
  PageHeader,
  HUB_CONTENT_CLASS,
  HUB_MAIN_CLASS,
} from "@/components/ui/page-header";
import { PlaceholderAvatar } from "@/components/ui/placeholder-avatar";
import { Button } from "@/components/ui/button";
import { SIGNIN_HREF } from "@/lib/routes";

export const metadata = {
  title: "Profile — Ascend",
};

/**
 * Thin identity + account surface. Learning home is /dashboard (Continue).
 */
export default async function ProfilePage() {
  const user = await getCurrentUser();

  let totalCompleted = 0;
  if (user) {
    try {
      const completed = await listCompletedLessons(user.id);
      totalCompleted = completed.length;
    } catch {
      /* db unavailable */
    }
  }

  const displayName = user?.name?.trim() || null;
  const username = user?.username || null;
  const now = new Date();
  const accountDays =
    user?.createdAt != null ? daysOnSince(user.createdAt, now) : null;

  const description = user ? (
    <>
      {username ? (
        <span className="font-mono text-ink-secondary">@{username}</span>
      ) : (
        <span className="font-mono text-ink-fainter">No username</span>
      )}
      {accountDays != null ? (
        <>
          <span className="mx-1.5 text-ink-fainter">·</span>
          <span className="font-mono text-ink-secondary">
            {formatAccountTenure(accountDays)}
          </span>
        </>
      ) : null}
    </>
  ) : (
    <>
      Browse free.{" "}
      <Link
        href={SIGNIN_HREF}
        className="font-bold text-brand-violet hover:underline"
      >
        Sign in
      </Link>{" "}
      to save your place on Ascend.
    </>
  );

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <div className="mb-8 flex flex-wrap items-start gap-5">
          <PlaceholderAvatar name={displayName} size="lg" />
          <div className="min-w-0 flex-1">
            <PageHeader
              className="mb-0"
              title={displayName || "Guest learner"}
              description={description}
              actions={
                user ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button href="/settings" variant="secondary" size="sm">
                      <Settings size={15} strokeWidth={2.2} aria-hidden />
                      Settings
                    </Button>
                    <form action={signOutAction}>
                      <Button type="submit" variant="ghost" size="sm">
                        <LogOut size={15} strokeWidth={2.2} aria-hidden />
                        Sign out
                      </Button>
                    </form>
                  </div>
                ) : (
                  <Button href={SIGNIN_HREF} size="sm">
                    Sign in
                  </Button>
                )
              }
            />
          </div>
        </div>

        {user ? (
          <p className="text-[14px] text-ink-secondary">
            <Link
              href="/progress"
              className="font-bold text-brand-violet hover:underline"
            >
              {totalCompleted}{" "}
              {totalCompleted === 1 ? "lesson" : "lessons"} completed
            </Link>
            <span className="text-ink-fainter"> — full checklist on Progress.</span>
          </p>
        ) : (
          <p className="text-[14px] text-ink-fainter">
            No progress tracked until you sign in.
          </p>
        )}
      </div>
    </main>
  );
}
