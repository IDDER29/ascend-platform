import type { Metadata } from "next";
import { ProfileView } from "@/components/profile-v2/profile-view";
import { GuestPrompt } from "@/components/ui/guest-prompt";
import { getCurrentUser } from "@/lib/auth/auth";
import { getProfileOwner } from "@/lib/profile/queries";
import { loadProfileModel } from "@/lib/profile/server-page-data";
import { PageShell } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Profile",
  description: "Who you are as a learner, and what you have built.",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const owner = user ? await getProfileOwner(user.id) : null;

  if (!owner) {
    return (
      <PageShell>
        <GuestPrompt
          title="Your profile"
          body="Sign in to get a profile: the topics you finished, the projects you shipped and the links you want people to see."
          next="/profile"
        />
      </PageShell>
    );
  }

  const model = await loadProfileModel(owner, "owner");
  return (
    <PageShell>
      <ProfileView model={model} />
    </PageShell>
  );
}
