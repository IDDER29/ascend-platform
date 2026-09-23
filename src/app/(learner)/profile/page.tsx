import Link from "next/link";
import { Flame, Settings, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { getAllLessons } from "@/lib/content/lessons";
import { getCurrentUser } from "@/lib/auth/auth";
import { signOutAction } from "@/lib/auth/actions";
import {
  countCompletedInLevel,
  getContinueLesson,
  getStreak,
  listCompletedLessons,
} from "@/lib/progress/queries";
import { ProfileShareButton } from "./profile-share";
import { HUB_CONTENT_CLASS, HUB_MAIN_CLASS } from "@/components/ui/page-header";
import { PlaceholderAvatar } from "@/components/ui/placeholder-avatar";

export const metadata = {
  title: "Profile — Ascend",
};

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

const SKILL_LABEL: Record<string, string> = {
  "level-00-bits-logic": "Bits, logic & the CPU",
  "level-01-machine-memory": "Assembly & memory model",
  "level-02-the-c-language": "C & pointers",
  "level-03-systems-software": "Processes & syscalls",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const lessons = getAllLessons();
  const totalLessons = lessons.length;

  let levelDone: Record<string, number> = Object.fromEntries(
    levelIds.map((id) => [id, 0]),
  );
  let totalCompleted = 0;
  let streakCurrent = 0;
  let continueHref = "/curriculum/level-00-bits-logic/what-is-a-bit";
  let continueTitle = "Start the path";

  if (user) {
    try {
      const [completed, streak, cont, counts] = await Promise.all([
        listCompletedLessons(user.id),
        getStreak(user.id),
        getContinueLesson(user.id),
        Promise.all(
          levelIds.map(
            async (id) =>
              [id, await countCompletedInLevel(user.id, id)] as const,
          ),
        ),
      ]);
      totalCompleted = completed.length;
      streakCurrent = streak?.current ?? 0;
      continueHref = cont.href;
      continueTitle = cont.title;
      levelDone = Object.fromEntries(counts);
    } catch {
      /* db unavailable */
    }
  }

  const displayName = user?.name?.trim() || null;
  const username = user?.username || null;

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <div className="relative mb-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1B1730] via-[#2A2440] to-[#3A2A55] p-7 text-white shadow-[0_24px_50px_rgba(23,20,31,0.3)] sm:p-8">
          <div className="animate-blob pointer-events-none absolute -right-10 -top-[90px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.4),transparent_66%)] blur-[10px]" />
          <div className="relative flex flex-wrap items-start gap-6">
            <PlaceholderAvatar name={displayName} size="lg" className="shadow-[0_8px_24px_rgba(0,0,0,0.18)]" />
            <div className="min-w-[220px] flex-1">
              <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em] sm:text-[30px]">
                {displayName || "Guest learner"}
              </h1>
              <div className="mt-1 font-mono text-[13px] text-[#B9B3D0]">
                {username ? `@${username}` : "Not signed in"} · open curriculum
                path
              </div>
              <p className="mt-3 max-w-[460px] text-[14.5px] leading-relaxed text-[#D3CFE2]">
                {user
                  ? "Your progress is the lessons you’ve marked complete — same idea as a curriculum checklist."
                  : "Browse any lesson free. Sign in when you want Ascend to remember where you left off."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link
                  href={continueHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#2A2540] shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
                >
                  {user ? `Continue: ${continueTitle}` : "Start the path"}
                </Link>
                <ProfileShareButton />
                {user ? (
                  <>
                    <Link
                      href="/settings"
                      title="Settings"
                      className="flex h-[39px] w-[39px] items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white"
                    >
                      <Settings size={17} strokeWidth={2.1} />
                    </Link>
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        title="Sign out"
                        className="flex h-[39px] w-[39px] items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white"
                      >
                        <LogOut size={17} strokeWidth={2.1} />
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className="inline-flex items-center rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
            {[
              {
                value: user ? String(totalCompleted) : "—",
                label: `Lessons done / ${totalLessons}`,
              },
              {
                value: user ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Flame size={16} className="fill-current text-[#FF8A4C]" />
                    {streakCurrent}
                  </span>
                ) : (
                  "—"
                ),
                label: "Day streak",
              },
              { value: "4", label: "Levels in path" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                {i > 0 && <div className="h-8 w-px bg-white/10" />}
                <div>
                  <div className="font-display text-2xl font-extrabold leading-none">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11.5px] text-[#B9B3D0]">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!user && (
            <div className="relative mt-4 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[12.5px] text-[#B9B3D0]">
              Guest view — no demo XP or fake badges.{" "}
              <Link href="/signin" className="font-bold text-white underline">
                Sign in
              </Link>{" "}
              to track completions.
            </div>
          )}
        </div>

        <Card hover={false} className="p-6">
          <div className="mb-4.5 flex items-center justify-between">
            <div className="font-display text-[17px] font-extrabold">
              Path progress
            </div>
            <Link
              href="/curriculum"
              className="text-xs font-bold text-brand-violet"
            >
              Full curriculum →
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {levelIds.map((levelId) => {
              const level = LEVELS[levelId as LevelId];
              const done = user ? (levelDone[levelId] ?? 0) : 0;
              const pct = Math.round((done / level.totalConcepts) * 100);
              const status = !user
                ? "Open"
                : pct === 100
                  ? "Done"
                  : pct === 0
                    ? "Not started"
                    : "In progress";
              const statusColor =
                pct === 100
                  ? "text-[#12A472]"
                  : pct === 0
                    ? "text-ink-faint"
                    : "text-[#6D46F2]";
              const first = lessons.find((l) => l.meta.level === levelId);
              return (
                <Link
                  key={levelId}
                  href={
                    first
                      ? `/curriculum/${levelId}/${first.meta.slug}`
                      : "/curriculum"
                  }
                  className="block"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[14.5px] font-semibold text-[#2A2540]">
                      {SKILL_LABEL[levelId]}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[11.5px] font-bold",
                        statusColor,
                      )}
                    >
                      {user
                        ? `${done}/${level.totalConcepts} · ${status}`
                        : status}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F0EEF7]">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        LEVEL_ACCENT[levelId],
                      )}
                      style={{
                        width: `${user ? Math.max(pct, pct > 0 ? 4 : 0) : 0}%`,
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </main>
  );
}
