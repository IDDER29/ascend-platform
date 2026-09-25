import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  PageHeader,
  HUB_CONTENT_CLASS,
  HUB_MAIN_CLASS,
} from "@/components/ui/page-header";
import { cn } from "@/lib/cn";
import { LEVELS, levelIds } from "@/lib/content/schema";
import { getAllLessons } from "@/lib/content/lessons";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  countCompletedInLevel,
  getStreak,
  listCompletedLessons,
} from "@/lib/progress/queries";

export const metadata = {
  title: "Progress — Ascend",
};

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

function relativeWhen(date: Date): string {
  const ms = Date.now() - date.getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default async function ProgressPage() {
  const user = await getCurrentUser();
  const lessons = getAllLessons();
  const totalLessons = lessons.length;
  const lessonTitle = new Map<string, string>(
    lessons.map((l) => [`${l.meta.level}/${l.meta.slug}`, l.meta.title]),
  );

  let levelDone: Record<string, number> = Object.fromEntries(
    levelIds.map((id) => [id, 0]),
  );
  let totalCompleted = 0;
  let streakCurrent = 0;
  let streakLongest = 0;
  let recent: { title: string; href: string; when: string }[] = [];

  if (user) {
    try {
      const [completed, streak, counts] = await Promise.all([
        listCompletedLessons(user.id),
        getStreak(user.id),
        Promise.all(
          levelIds.map(
            async (id) =>
              [id, await countCompletedInLevel(user.id, id)] as const,
          ),
        ),
      ]);
      totalCompleted = completed.length;
      streakCurrent = streak?.current ?? 0;
      streakLongest = streak?.longest ?? 0;
      levelDone = Object.fromEntries(counts);
      recent = [...completed]
        .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
        .slice(0, 8)
        .map((c) => ({
          title: lessonTitle.get(`${c.level}/${c.slug}`) ?? c.slug,
          href: `/curriculum/${c.level}/${c.slug}`,
          when: relativeWhen(c.completedAt),
        }));
    } catch {
      /* db unavailable */
    }
  }

  const pathPct = totalLessons
    ? Math.round((totalCompleted / totalLessons) * 100)
    : 0;

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <PageHeader
          title="Your progress"
          description="Lessons you've marked complete — that's the climb we track."
        />

        {!user ? (
          <Card hover={false} className="mb-5 p-6">
            <p className="text-[14.5px] leading-relaxed text-ink-secondary">
              Progress is saved when you{" "}
              <Link
                href="/signin"
                className="font-bold text-brand-violet hover:underline"
              >
                sign in
              </Link>{" "}
              and mark lessons complete. Until then, browse the open path
              freely.
            </p>
            <Link
              href="/curriculum"
              className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-brand-violet"
            >
              Open curriculum <ChevronRight size={14} />
            </Link>
          </Card>
        ) : null}

        <div className="mb-5 flex flex-wrap gap-4">
          {[
            {
              value: `${totalCompleted}/${totalLessons}`,
              label: "Lessons done",
            },
            {
              value: `${pathPct}%`,
              label: "Path complete",
            },
            {
              value: user ? String(streakCurrent) : "—",
              label: "Current streak",
            },
            {
              value: user && streakLongest > 0 ? String(streakLongest) : "—",
              label: "Longest streak",
            },
          ].map((s) => (
            <Card key={s.label} className="flex-[1_1_210px] p-5">
              <div className="font-display text-[26px] font-extrabold leading-none tracking-tight">
                {s.value}
              </div>
              <div className="mt-1 text-[12.5px] text-ink-muted">{s.label}</div>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-start gap-5">
          <div className="min-w-0 flex-[2_1_460px]">
            <Card hover={false} className="p-6">
              <div className="mb-4 font-display text-[16.5px] font-extrabold">
                By level
              </div>
              <div className="flex flex-col gap-3.5">
                {levelIds.map((levelId) => {
                  const level = LEVELS[levelId];
                  const done = levelDone[levelId] ?? 0;
                  const pct = Math.round((done / level.totalConcepts) * 100);
                  const notStarted = done === 0;
                  return (
                    <div
                      key={levelId}
                      className={notStarted && user ? "opacity-55" : ""}
                    >
                      <div className="mb-1.5 flex justify-between text-[13.5px]">
                        <span className="font-bold text-[#2A2540]">
                          {levelId.slice(6, 8)} · {level.name}
                        </span>
                        <span className="font-mono text-xs text-ink-muted">
                          {done}/{level.totalConcepts}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#F0EEF7]">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            LEVEL_ACCENT[levelId],
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="min-w-[280px] flex-[1_1_300px]">
            <Card hover={false} className="p-6">
              <div className="mb-3.5 font-display text-[16.5px] font-extrabold">
                Recent completions
              </div>
              {recent.length === 0 ? (
                <p className="text-[13px] leading-relaxed text-ink-muted">
                  {user
                    ? "No lessons marked complete yet — finish one to see it here."
                    : "Sign in and mark lessons complete to build this list."}
                </p>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {recent.map((c) => (
                    <Link
                      key={c.href + c.when}
                      href={c.href}
                      className="-mx-1.5 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#FAF9FE]"
                    >
                      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-[#E7F8F0] text-[#12A472]">
                        <Check size={15} strokeWidth={2.6} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-bold text-[#2A2540]">
                          {c.title}
                        </div>
                        <div className="font-mono text-[11px] text-ink-faint">
                          {c.when}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href="/curriculum"
                className="mt-3 flex items-center justify-center gap-1 border-t border-[#F2F0F8] pt-3 text-[12.5px] font-bold text-brand-violet"
              >
                View full curriculum <ChevronRight size={13} />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
