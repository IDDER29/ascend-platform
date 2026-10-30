import { Pencil } from "lucide-react";
import Link from "next/link";
import { PlaceholderAvatar } from "@/components/ui/placeholder-avatar";
import type { ProfileModel } from "@/lib/profile/profile-model";
import { PROFILE_ROUTES } from "@/lib/profile/routes";
import { LinkChips } from "./link-chips";

export function ProfileHero({ model }: { model: ProfileModel }) {
  const { hero, owner } = model;
  return (
    <section
      aria-labelledby="profile-name"
      className="flex min-w-0 flex-col gap-5 rounded-[20px] bg-[var(--coach-hero-bg)] px-6 py-6 text-[var(--coach-hero-ink)] sm:px-8 sm:py-7"
    >
      <div className="flex items-start gap-4">
        <PlaceholderAvatar name={hero.name} size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1
            id="profile-name"
            className="m-0 font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em] [overflow-wrap:anywhere] sm:text-[30px]"
          >
            {hero.name}
          </h1>
          <span className="font-mono text-[13px] text-[var(--coach-hero-muted)]">@{hero.username}</span>
        </div>
        {owner ? (
          <Link
            href={PROFILE_ROUTES.settings}
            className="hidden h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 text-[13px] font-semibold text-[var(--coach-hero-ink)] no-underline hover:bg-white/15 sm:inline-flex"
          >
            <Pencil size={13} aria-hidden="true" />
            Edit profile
          </Link>
        ) : null}
      </div>

      {hero.bio ? (
        <p className="m-0 max-w-[560px] text-[15px] leading-relaxed [overflow-wrap:anywhere]">{hero.bio}</p>
      ) : owner ? (
        <p className="m-0 text-[14px] text-[var(--coach-hero-muted)]">
          No bio yet.{" "}
          <Link href={PROFILE_ROUTES.settings} className="font-semibold text-[var(--coach-lime)] underline-offset-2 hover:underline">
            Add one line about you
          </Link>
        </p>
      ) : null}

      <LinkChips links={hero.links} editable={owner} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[var(--coach-lime)] px-3 py-1 font-mono text-[11.5px] font-semibold uppercase tracking-[0.04em] text-[var(--coach-lime-ink)]">
          {hero.levelLabel ?? "Just getting started"}
        </span>
        {owner ? (
          <Link
            href={PROFILE_ROUTES.settings}
            className="ml-auto text-[13px] font-semibold text-[var(--coach-hero-muted)] underline-offset-2 hover:underline sm:hidden"
          >
            Edit profile
          </Link>
        ) : null}
      </div>
    </section>
  );
}
