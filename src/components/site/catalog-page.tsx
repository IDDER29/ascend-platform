import Link from "next/link";
import { durationLabel } from "@/lib/paths/paths-v2-model";
import { FIRST_LESSON_HREF } from "@/lib/routes";
import { publicPaths, siteStats } from "@/lib/site/site-data";
import { PathTile } from "./path-tile";
import { SiteShell } from "./site-shell";
import { H2, LEAD, PageIntro, SOLID_BTN, StartBand, WRAP } from "./site-ui";

export function CatalogPage() {
  const { views } = publicPaths();
  const stats = siteStats();
  const live = views.filter((v) => !v.soon);
  const soon = views.filter((v) => v.soon);

  return (
    <SiteShell>
      <PageIntro
        title="Every path."
        lead="A path is a few topics in order, with projects along the way. Every lesson is free to read, so open any of them and see if it's for you."
      >
        <p className="m-0 mt-6 text-[15px] tabular-nums text-[var(--coach-ink-muted)]">
          {stats.lessons} lessons · {durationLabel(stats.minutes)} of reading · {stats.cards} Practice cards ·{" "}
          {stats.projects} projects
        </p>
      </PageIntro>

      <section aria-labelledby="live-title" className={`${WRAP} pb-12 sm:pb-16`}>
        <h2 id="live-title" className="m-0 mb-5 text-[20px] font-bold">
          Open now
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {live.map((p) => (
            <PathTile key={p.slug} path={p} />
          ))}
        </div>
      </section>

      <section aria-labelledby="where-title" className={`${WRAP} pb-12 sm:pb-16`}>
        <div className="flex flex-col gap-5 rounded-[24px] border-2 border-dashed border-[var(--coach-border-strong)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-[620px]">
            <h2 id="where-title" className="m-0 text-[22px] font-bold leading-tight">
              Not sure where to start?
            </h2>
            <p className={`${LEAD} mt-2 text-[16px]`}>
              Start with Foundations. It needs no background and every other path builds on it. The first lesson is four
              minutes long.
            </p>
          </div>
          <Link href={FIRST_LESSON_HREF} className={`${SOLID_BTN} shrink-0`}>
            Read “What is a bit?”
          </Link>
        </div>
      </section>

      {soon.length > 0 && (
        <section aria-labelledby="soon-title" className={`${WRAP} pb-12 sm:pb-16`}>
          <h2 id="soon-title" className={H2}>
            Coming next
          </h2>
          <p className={`${LEAD} mt-3 max-w-[60ch]`}>
            These are planned, not written yet. Their pages show what each one will cover.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {soon.map((p) => (
              <PathTile key={p.slug} path={p} />
            ))}
          </div>
        </section>
      )}

      <StartBand />
    </SiteShell>
  );
}
