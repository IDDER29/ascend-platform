import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile-v2/profile-view";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileByUsername, isProfilePublic, type ProfileOwner } from "@/lib/profile/queries";
import { PROFILE_ROUTES } from "@/lib/profile/routes";
import { loadProfileModel } from "@/lib/profile/server-page-data";

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

/** The profile a request may see: public ones, plus your own private one. */
async function visibleProfile(username: string): Promise<{ owner: ProfileOwner; isPublic: boolean; isSelf: boolean } | null> {
  const owner = await getProfileByUsername(decodeURIComponent(username));
  if (!owner) return null;
  const [isPublic, viewer] = await Promise.all([isProfilePublic(owner.userId), getCurrentUser()]);
  const isSelf = viewer?.id === owner.userId;
  return isPublic || isSelf ? { owner, isPublic, isSelf } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const visible = await visibleProfile(username);
  if (!visible) return { title: "Profile not found" };
  const { owner } = visible;
  return {
    title: `${owner.name} (@${owner.username})`,
    description: owner.bio || `${owner.name}'s projects and progress on Ascend.`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const visible = await visibleProfile(username);
  if (!visible) notFound();

  const model = await loadProfileModel(visible.owner, "visitor");
  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-5`}>
        {visible.isSelf ? (
          <p className="m-0 rounded-xl bg-[var(--coach-tint-blue-bg)] px-4 py-2.5 text-[13.5px] text-[var(--coach-tint-blue-ink)]">
            {visible.isPublic ? "This is how visitors see your profile. " : "Your profile is private — only you can see this page. "}
            <Link href={PROFILE_ROUTES.owner} className="font-semibold underline underline-offset-2">
              Back to editing
            </Link>
          </p>
        ) : null}
        <ProfileView model={model} />
      </div>
    </main>
  );
}
