import Link from "next/link";
import { CrestPatch } from "@/components/achievements/emblems";
import { Medallion } from "@/components/achievements/medallion";
import { byPrecedence } from "@/lib/achievements/ribbons";
import type { ProfileModel } from "@/lib/profile/profile-model";
import { CARD, CARD_TITLE, MUTED_LINE } from "./styles";

const LATEST = 3;

/** The learner's decorations, worn as on the chest: medals, highest first, then the newest few by name. */
export function AchievementsCard({
  achievements,
  insignia,
  owner,
}: {
  achievements: ProfileModel["achievements"];
  insignia: ProfileModel["insignia"];
  owner: boolean;
}) {
  const worn = byPrecedence(achievements);
  return (
    <section aria-labelledby="achievements-title" className={CARD}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="achievements-title" className={CARD_TITLE}>
          Achievements
        </h2>
        {owner ? (
          <Link href="/achievements" className="text-[13px] font-semibold text-[var(--coach-ink)] underline-offset-2 hover:underline">
            Open your chest
          </Link>
        ) : null}
      </div>
      {insignia.crests.some((c) => c.earned) ? (
        <ul aria-label="Clans" className="m-0 flex list-none justify-center gap-2 rounded-xl bg-[var(--coach-hero-bg)] p-0 py-3">
          {insignia.crests.map((c) => (
            <li key={c.crest} title={c.earned ? c.label : `${c.label}: not joined yet`}>
              <CrestPatch crest={c.crest} earned={c.earned} size="sm" />
              <span className="sr-only">
                {c.label}
                {c.earned ? "" : ", not joined yet"}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {achievements.length === 0 ? (
        <p className={MUTED_LINE}>{owner ? "Finish a lesson to earn your first decoration." : "No decorations yet."}</p>
      ) : (
        <>
          <ol
            aria-label={`${achievements.length} decorations, highest first`}
            className="m-0 flex list-none flex-wrap justify-center gap-2 rounded-xl bg-[var(--coach-hero-bg)] p-0 px-3 py-3"
          >
            {worn.map((a) => (
              <li key={a.id} title={`${a.label}, ${a.earnedLabel}`}>
                <Medallion glyph={a.glyph} earned size="sm" />
                <span className="sr-only">
                  {a.label}, awarded {a.earnedLabel}
                </span>
              </li>
            ))}
          </ol>
          <ul aria-label="Newest decorations" className="m-0 flex list-none flex-col gap-2 p-0">
            {achievements.slice(0, LATEST).map((a) => (
              <li key={a.id} className="flex items-center gap-2.5">
                <Medallion glyph={a.glyph} earned size="xs" />
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">{a.label}</span>
                <span className="shrink-0 font-mono text-[11.5px] text-[var(--coach-ink-muted)]">{a.earnedLabel}</span>
              </li>
            ))}
          </ul>
          {achievements.length > LATEST ? (
            <p className="m-0 text-[12.5px] text-[var(--coach-ink-muted)]">
              {achievements.length - LATEST} more above.
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}
