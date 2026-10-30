import type { Metadata } from "next";
import { ProfileView } from "@/components/profile-v2/profile-view";
import { GuestPrompt } from "@/components/ui/guest-prompt";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileOwner } from "@/lib/profile/queries";
import { loadProfileModel } from "@/lib/profile/server-page-data";

export const metadata: Metadata = {
  title: "Profile — Ascend",
  description: "Who you are as a learner, and what you have built.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const owner = user ? await getProfileOwner(user.id) : null;

  if (!owner) {
    return (
      <main className={MAIN}>
        <div className={HUB_CONTENT_CLASS}>
          <GuestPrompt
            title="Your profile"
            body="Sign in to get a profile: the topics you finished, the projects you shipped and the links you want people to see."
            next="/profile"
          />
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
