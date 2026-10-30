import Link from "next/link";
import type { ProfileModel } from "@/lib/profile/profile-model";
import { CARD, CARD_TITLE, MUTED_LINE } from "./styles";

export function AchievementsCard({ achievements, owner }: { achievements: ProfileModel["achievements"]; owner: boolean }) {
  return (
    <section aria-labelledby="achievements-title" className={CARD}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="achievements-title" className={CARD_TITLE}>
          Achievements
        </h2>
        {owner ? (
          <Link href="/achievements" className="text-[13px] font-semibold text-[var(--coach-ink)] underline-offset-2 hover:underline">
            See all
          </Link>
        ) : null}
      </div>
      {achievements.length === 0 ? (
        <p className={MUTED_LINE}>
          {owner ? "Ship a curriculum project to earn the first badge." : "No badges yet."}
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {achievements.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-tint-lime-bg)] text-[17px] text-[var(--coach-tint-lime-ink)]"
              >
                {a.glyph}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[14px] font-semibold">{a.label}</span>
                <span className="text-[12.5px] leading-snug text-[var(--coach-ink-secondary)]">{a.description}</span>
                <span className="font-mono text-[11.5px] text-[var(--coach-ink-muted)]">{a.earnedLabel}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
