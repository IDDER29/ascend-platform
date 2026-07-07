import { Button } from "@/components/ui/button";

export function LessonFooter({
  title,
  next,
}: {
  title: string;
  next: { href: string; title: string } | null;
}) {
  return (
    <div className="relative mt-9 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#6A3EF0] via-[#9A34D6] to-[#FF6B4A] px-8 py-8 text-white shadow-[0_22px_46px_rgba(106,62,240,0.3)]">
      <div className="animate-blob absolute -right-5 -top-12 h-[210px] w-[210px] rounded-full bg-white/[0.13] blur-[6px]" />
      <div className="relative flex flex-wrap items-center gap-5">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-white/30 bg-white/20">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="mb-1 font-display text-xl font-extrabold">
            You&apos;ve got {title.toLowerCase()} down.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm opacity-90">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-mono font-bold">
              +50 XP
            </span>
            <span>Streak extended to 12 days</span>
          </div>
        </div>
        {next ? (
          <Button href={next.href} variant="invert" className="whitespace-nowrap">
            {next.title === "Finish level" ? next.title : `Next: ${next.title}`}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A3EF0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        ) : (
          <Button variant="secondary" disabled className="text-[#6A3EF0]">
            You&apos;ve reached the end of this preview
          </Button>
        )}
      </div>
    </div>
  );
}
