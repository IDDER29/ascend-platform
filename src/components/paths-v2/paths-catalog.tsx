import Link from "next/link";
import type { PathView } from "@/lib/paths/paths-v2-model";
import { TrackMap } from "./track-map";
import { CARD, ContinueLink, JoinButton, PathGlyph, PathIcon, pathMeta, SECONDARY, TopicBar } from "./path-parts";

function YourPathCard({ path }: { path: PathView }) {
  return (
    <section
      aria-labelledby={`your-${path.slug}`}
      className={`${CARD} flex flex-col gap-4 p-5 sm:p-6 ${path.active ? "border-[var(--coach-ink)]" : ""}`}
    >
      <div className="flex items-start gap-3.5">
        <PathIcon slug={path.slug} />
        <div className="min-w-0 flex-1">
          <h3 id={`your-${path.slug}`} className="m-0 text-[18px] font-bold leading-tight">
            {path.title}
          </h3>
          <p className="m-0 mt-0.5 text-[13px] text-[var(--coach-ink-muted)]">
            {path.finished ? "Finished" : path.next ? `Next: ${path.next.title}` : pathMeta(path)}
          </p>
        </div>
        {path.active && (
          <span className="shrink-0 rounded-full bg-[var(--coach-lime)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--coach-lime-ink)]">
            Active
          </span>
        )}
      </div>
      <TopicBar path={path} />
      <div className="mt-auto flex flex-wrap gap-2">
        {!path.finished && <ContinueLink path={path} />}
        <Link href={path.href} className={SECONDARY}>
          View path
        </Link>
      </div>
    </section>
  );
}

function ExploreCard({ path }: { path: PathView }) {
  const topics = path.courses.map((c) => c.title);
  return (
    <section
      aria-labelledby={`explore-${path.slug}`}
      className={`${CARD} flex flex-col gap-3.5 p-5 sm:p-6 ${path.soon ? "bg-transparent" : ""}`}
    >
      <div className="flex items-start gap-3.5">
        <PathIcon slug={path.slug} muted={path.soon} />
        <div className="min-w-0 flex-1">
          <h3
            id={`explore-${path.slug}`}
            className={`m-0 text-[18px] font-bold leading-tight ${path.soon ? "text-[var(--coach-ink-secondary)]" : ""}`}
          >
            {path.title}
          </h3>
          <p className="m-0 mt-0.5 text-[13px] text-[var(--coach-ink-muted)]">{pathMeta(path)}</p>
        </div>
        {path.soon && (
          <span className="shrink-0 rounded-full bg-[var(--coach-tint-neutral-bg)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--coach-ink-muted)]">
            Soon
          </span>
        )}
      </div>
      <p className="m-0 text-[14.5px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
        {path.pitch}
      </p>
      <ul aria-label="What it covers" className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {topics.map((t) => (
          <li
            key={t}
            className="rounded-full border-2 border-[var(--coach-border)] px-2.5 py-0.5 text-[12.5px] text-[var(--coach-ink-secondary)]"
          >
            {t}
          </li>
        ))}
      </ul>
      {path.requires && !path.soon && (
        <p className="m-0 text-[12.5px] text-[var(--coach-ink-muted)]">
          {path.requires.done ? `Builds on ${path.requires.title} (done).` : `Best after ${path.requires.title}.`}
        </p>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        {!path.soon && <JoinButton slug={path.slug} />}
        <Link href={path.href} className={SECONDARY}>
          {path.soon ? "See what's planned" : "View path"}
        </Link>
      </div>
    </section>
  );
}

/** Foundations, offered first to someone who hasn't started anywhere. */
function StartHere({ path }: { path: PathView }) {
  return (
    <section
      aria-labelledby="start-here"
      className="flex flex-col gap-5 rounded-[20px] bg-[var(--coach-hero-bg)] p-6 text-[var(--coach-hero-ink)] sm:flex-row sm:items-center sm:p-7"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]">
        <PathGlyph slug={path.slug} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[13px] text-[var(--coach-hero-muted)]">New here? Start with</p>
        <h2 id="start-here" className="m-0 font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
          {path.title}
        </h2>
        <p className="m-0 mt-1 max-w-[60ch] text-[14.5px] leading-relaxed text-[var(--coach-hero-muted)]">
          {path.pitch} {pathMeta(path)}.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <JoinButton
          slug={path.slug}
          label="Start Foundations"
          className="inline-flex h-11 items-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_4px_0_var(--coach-lime-shadow)]"
        />
        <Link
          href={path.href}
          className="inline-flex h-11 items-center rounded-xl border-2 border-[var(--coach-hero-track)] px-4 text-[14px] font-semibold text-[var(--coach-hero-ink)] no-underline"
        >
          View path
        </Link>
      </div>
    </section>
  );
}

export function PathsCatalog({ views }: { views: PathView[] }) {
  const joined = views
    .filter((v) => v.joined)
    .sort((a, b) => Number(b.active) - Number(a.active) || Number(a.finished) - Number(b.finished));
  const foundations = views.find((v) => v.slug === "foundations");
  const newcomer = joined.length === 0 && foundations && foundations.lessons.done === 0;
  const explore = views
    .filter((v) => !v.joined && !(newcomer && v.slug === "foundations"))
    .sort((a, b) => Number(a.soon) - Number(b.soon));

  return (
    <div className="flex flex-col gap-8">
      {newcomer && foundations && <StartHere path={foundations} />}

      {joined.length > 0 && (
        <section aria-labelledby="your-paths" className="flex flex-col gap-3">
          <h2 id="your-paths" className="m-0 text-[18px] font-bold">
            Your paths
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {joined.map((p) => (
              <YourPathCard key={p.slug} path={p} />
            ))}
          </div>
        </section>
      )}

      <TrackMap views={views} progress={views.some((v) => v.lessons.done > 0)} />

      {explore.length > 0 && (
        <section aria-labelledby="explore" className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 id="explore" className="m-0 text-[18px] font-bold">
              {joined.length > 0 ? "More paths" : "Paths"}
            </h2>
            <p className="m-0 text-[13.5px] text-[var(--coach-ink-muted)]">
              Each path is a role you train toward. Join as many as you like.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {explore.map((p) => (
              <ExploreCard key={p.slug} path={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
