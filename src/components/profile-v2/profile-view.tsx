import type { ProfileModel } from "@/lib/profile/profile-model";
import { AchievementsCard } from "./achievements-card";
import { ContinueCard } from "./continue-card";
import { CurriculumProjects } from "./curriculum-projects";
import { JourneyCard } from "./journey-card";
import { OwnerBar } from "./owner-bar";
import { OwnProjects } from "./own-projects";
import { ProfileHero } from "./profile-hero";
import { SkillsCard } from "./skills-card";
import { SnapshotCard } from "./snapshot-card";
import { TWO_COLUMNS } from "./styles";

/** The whole profile. Owner and visitor share it; `model.owner` turns the editing on. */
export function ProfileView({ model }: { model: ProfileModel }) {
  const { owner } = model;
  const showCurriculum = owner || model.curriculumProjects.length > 0;
  const showOwn = owner || model.ownProjects.length > 0;

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-8">
      {owner ? <OwnerBar isPublic={model.isPublic} publicPath={model.publicPath} /> : null}

      <div className={`${TWO_COLUMNS} lg:items-stretch`}>
        <ProfileHero model={model} />
        <SnapshotCard snapshot={model.snapshot} />
      </div>

      <div className={TWO_COLUMNS}>
        <div className="flex min-w-0 flex-col gap-8">
          {showCurriculum ? <CurriculumProjects model={model} /> : null}
          {showOwn ? <OwnProjects projects={model.ownProjects} editable={owner} /> : null}
          <SkillsCard skills={model.skills} owner={owner} />
        </div>
        <aside className="flex min-w-0 flex-col gap-5">
          {model.next ? <ContinueCard next={model.next} /> : null}
          <AchievementsCard achievements={model.achievements} owner={owner} />
          <JourneyCard journey={model.journey} />
        </aside>
      </div>
    </div>
  );
}
