import { Pencil } from "lucide-react";
import Link from "next/link";
import { PlaceholderAvatar } from "@/components/ui/placeholder-avatar";
import type { ProfileModel } from "@/lib/profile/profile-model";
import { PROFILE_ROUTES } from "@/lib/profile/routes";
import { LinkChips } from "./link-chips";

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** One plain sentence of facts instead of a grid of stat tiles. */
function factsLine(snapshot: ProfileModel["snapshot"]): string {
  const parts = [`${snapshot.lessonsDone} of ${snapshot.lessonTotal} lessons finished`];
  if (snapshot.projectsShipped > 0) parts.push(`${plural(snapshot.projectsShipped, "curriculum project")} shipped`);
  if (snapshot.ownProjects > 0) parts.push(`${plural(snapshot.ownProjects, "project")} of their own`);
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0];
  return `${list}. On Ascend since ${snapshot.memberSince}.`;
}

export function ProfileHero({ model }: { model: ProfileModel }) {
  const { hero, owner, snapshot } = model;
  return (
    <section
      aria-labelledby="profile-name"
      className="flex min-w-0 flex-col gap-5 rounded-[24px] bg-[var(--coach-hero-bg)] px-6 py-7 text-[var(--coach-hero-ink)] sm:px-9 sm:py-9"
    >
      <div className="flex items-start gap-4 sm:gap-5">
        <PlaceholderAvatar name={hero.name} size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h1
            id="profile-name"
            className="m-0 font-display text-[30px] font-extrabold leading-[1.05] tracking-[-0.035em] [overflow-wrap:anywhere] sm:text-[42px]"
          >
            {hero.name}
          </h1>
          <span className="text-[14px] text-[var(--coach-hero-muted)]">@{hero.username}</span>
        </div>
        {owner ? (
          <Link
            href={PROFILE_ROUTES.settings}
            aria-label="Edit profile"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 text-[13px] font-semibold text-[var(--coach-hero-ink)] no-underline hover:bg-white/15 sm:px-3"
          >
            <Pencil size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Edit profile</span>
          </Link>
        ) : null}
      </div>

      {hero.bio ? (
        <p className="m-0 max-w-[60ch] text-[16px] leading-relaxed [overflow-wrap:anywhere]">{hero.bio}</p>
      ) : owner ? (
        <p className="m-0 text-[14px] text-[var(--coach-hero-muted)]">
          No bio yet.{" "}
          <Link href={PROFILE_ROUTES.settings} className="font-semibold text-[var(--coach-lime)] underline-offset-2 hover:underline">
            Add one line about what you&apos;re building
          </Link>
        </p>
      ) : null}

      <LinkChips links={hero.links} editable={owner} />

      <p className="m-0 border-t border-white/10 pt-4 text-[14px] leading-relaxed text-[var(--coach-hero-muted)]">
        {factsLine(snapshot)}
      </p>
    </section>
  );
}
