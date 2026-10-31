import Link from "next/link";
import type { TopicComplete } from "@/lib/achievements/topic-complete-model";
import { CrestPatch } from "@/components/achievements/emblems";
import { BadgeMark, RankChip } from "@/components/achievements/marks";
import { deckSessionHref } from "@/lib/practice/coach-custom-model";
import { Confetti } from "./confetti";
import { ShareLinkButton } from "./share-link-button";

const LIME_CONFETTI = ["#d7f26b", "#ffffff", "#2e4bdb", "#d7f26b", "#9fb0ff"];

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-[var(--coach-hero-card)] px-3 py-3.5 text-[var(--coach-hero-card-ink)]">
      <div className="font-display text-[24px] font-extrabold leading-none tabular-nums">{value}</div>
      <div className="mt-1.5 text-[12.5px] leading-tight text-[var(--coach-hero-card-muted)]">{label}</div>
    </div>
  );
}

const SECONDARY =
  "inline-flex h-11 flex-1 items-center justify-center whitespace-nowrap rounded-full border-2 border-[var(--coach-hero-track)] px-4 text-[14px] font-semibold text-[var(--coach-hero-ink)] transition-colors hover:border-[var(--coach-hero-muted)]";

/** The topic's finish line: a celebration once every lesson is done, what's left before that. */
export function TopicCompleteView({ t }: { t: TopicComplete }) {
  const lessonsWord = t.total === 1 ? "lesson" : "lessons";
  const clan = t.earned.find((b) => b.insignia?.kind === "crest");

  return (
    <main className="practice-coach-v2 relative min-h-dvh overflow-hidden bg-[var(--coach-hero-bg)] px-4 py-10 font-sans text-[var(--coach-hero-ink)] antialiased sm:py-14">
      {t.finished && <Confetti colors={LIME_CONFETTI} />}

      <div className="relative mx-auto flex w-full max-w-[520px] flex-col items-center text-center">

        <span className="animate-rise">
          <CrestPatch crest={t.crest} earned={t.finished} size="lg" />
        </span>

        {t.finished ? (
          <>
            <p className="animate-rise m-0 mt-6 flex items-center gap-2 text-[13px] text-[var(--coach-hero-muted)]">
              <RankChip rank="B" /> task done {t.finishedAt && `on ${longDate(t.finishedAt)}`}
            </p>
            <h1 className="animate-rise m-0 mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.035em] [text-wrap:balance] sm:text-[44px]">
              {t.name}, finished.
            </h1>
            <p className="animate-rise m-0 mt-3 max-w-[420px] text-[16px] leading-relaxed text-[var(--coach-hero-muted)] [text-wrap:pretty]">
              {clan ? `You joined the ${clan.label}. ` : ""}
              All {t.total} {lessonsWord}
              {t.days ? `, in ${t.days === 1 ? "one day" : `${t.days} days`}` : ""}.
            </p>
          </>
        ) : (
          <>
            <h1 className="m-0 mt-6 font-display text-[32px] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:balance] sm:text-[38px]">
              {t.name} isn&apos;t finished yet
            </h1>
            <p className="m-0 mt-3 max-w-[420px] text-[16px] leading-relaxed text-[var(--coach-hero-muted)]">
              {t.done} of {t.total} {lessonsWord} done. Finish the rest to join the {t.clan} and earn this topic&apos;s
              badge.
            </p>
          </>
        )}

        <div className="animate-rise mt-7 flex w-full gap-2.5 text-left">
          <Stat value={`${t.done}/${t.total}`} label={lessonsWord} />
          <Stat value={`${t.cards.solid}/${t.cards.total}`} label="Practice cards held solid" />
          <Stat
            value={t.accuracy === null ? "–" : `${t.accuracy}%`}
            label={t.accuracy === null ? "No reviews yet" : "right in Practice"}
          />
        </div>

        {t.finished && t.earned.length > 0 && (
          <section
            aria-labelledby="earned-title"
            className="animate-rise mt-4 w-full rounded-2xl bg-[var(--coach-hero-card)] p-4 text-left text-[var(--coach-hero-card-ink)]"
          >
            <h2 id="earned-title" className="m-0 mb-2.5 text-[13px] font-semibold text-[var(--coach-hero-card-muted)]">
              Earned by finishing it
            </h2>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {t.earned.map((b) => (
                <li key={b.id} className="flex items-center gap-3">
                  <BadgeMark badge={b} />
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold leading-tight">{b.label}</span>
                    <span className="block text-[12.5px] leading-snug text-[var(--coach-hero-card-muted)]">
                      {b.means}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {t.nextTitle?.topics && (
              <p className="m-0 mt-3 border-t-2 border-[var(--coach-divider)] pt-3 text-[13px] text-[var(--coach-hero-card-muted)]">
                Toward {t.nextTitle.label}: {t.nextTitle.topics.done} of {t.nextTitle.topics.total} topics finished.
              </p>
            )}
          </section>
        )}

        {!t.finished && t.remaining.length > 0 && (
          <section
            aria-labelledby="left-title"
            className="mt-4 w-full rounded-2xl bg-[var(--coach-hero-card)] p-4 text-left text-[var(--coach-hero-card-ink)]"
          >
            <h2 id="left-title" className="m-0 mb-1.5 text-[13px] font-semibold text-[var(--coach-hero-card-muted)]">
              Still to do
            </h2>
            <ul className="m-0 flex list-none flex-col p-0">
              {t.remaining.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="-mx-2 block rounded-lg px-2 py-1.5 text-[15px] font-semibold hover:bg-[var(--coach-tint-neutral-bg)]"
                  >
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="animate-rise mt-7 flex w-full flex-col gap-2.5">
          <Link
            href={t.next.href}
            className="flex min-h-14 flex-col items-center justify-center rounded-full bg-[var(--coach-lime)] px-6 py-2 text-[var(--coach-lime-ink)] transition-transform hover:-translate-y-0.5"
          >
            <span className="text-[16px] font-extrabold">{t.next.label}</span>
            <span className="text-[12.5px] opacity-75">{t.next.title}</span>
          </Link>
          <div className="flex flex-wrap gap-2.5">
            {t.done > 0 && t.cards.ids.length > 0 && (
              <Link href={deckSessionHref(t.cards.ids.slice(0, 30), t.name)} className={SECONDARY}>
                Review its cards
              </Link>
            )}
            {t.finished ? (
              <Link href="/achievements" className={SECONDARY}>
                Achievements
              </Link>
            ) : (
              <Link href="/progress" className={SECONDARY}>
                Your progress
              </Link>
            )}
            {t.finished && <ShareLinkButton className={SECONDARY} />}
          </div>
          <Link
            href="/dashboard"
            className="mt-2 text-[13.5px] text-[var(--coach-hero-muted)] underline-offset-2 hover:underline"
          >
            Back to the dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
