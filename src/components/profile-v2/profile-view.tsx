import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/auth/actions";
import type { ProfileModel } from "@/lib/profile/profile-model";
import { AchievementsCard } from "./achievements-card";
import { JourneyCard } from "./journey-card";
import { OwnerBar } from "./owner-bar";
import { OwnProjects } from "./own-projects";
import { ProfileHero } from "./profile-hero";
import { StackSection } from "./stack-section";
import { TWO_COLUMNS } from "./styles";

/** The whole profile. Owner and visitor share it; `model.owner` turns the editing on. */
export function ProfileView({ model }: { model: ProfileModel }) {
  const { owner } = model;
  const showOwn = owner || model.ownProjects.length > 0;

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-6">
      {owner ? <OwnerBar isPublic={model.isPublic} publicPath={model.publicPath} /> : null}

      <ProfileHero model={model} />

      <div className={`${TWO_COLUMNS} gap-y-8`}>
        <div className="flex min-w-0 flex-col gap-10">
          <StackSection model={model} />
          {showOwn ? <OwnProjects projects={model.ownProjects} editable={owner} /> : null}
        </div>
        <aside className="flex min-w-0 flex-col gap-5">
          <AchievementsCard achievements={model.achievements} owner={owner} />
          <JourneyCard journey={model.journey} />
          {owner ? (
            <form action={signOutAction} className="self-start">
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] font-semibold text-[var(--coach-ink-secondary)] hover:text-[var(--coach-ink)]"
              >
                <LogOut size={14} aria-hidden="true" />
                Sign out
              </button>
            </form>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
