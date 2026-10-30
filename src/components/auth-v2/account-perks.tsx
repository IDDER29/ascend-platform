import Link from "next/link";
import { CalendarCheck, Flame, RotateCcw, UserRound } from "lucide-react";
import { FIRST_LESSON_HREF } from "@/lib/routes";

const PERKS = [
  {
    icon: CalendarCheck,
    title: "A Today page",
    body: "Your next lesson and the reviews that are due, sized to the daily goal you pick.",
  },
  { icon: RotateCcw, title: "Practice everywhere", body: "Your cards and their schedule follow you to any device." },
  { icon: Flame, title: "Your streak", body: "Every day you finish a lesson counts." },
  { icon: UserRound, title: "A profile", body: "The topics you finished, your badges and the projects you built." },
];

/** What an account adds, beside the form: the reason to bother. */
export function AccountPerks() {
  return (
    <aside
      aria-labelledby="perks-title"
      className="rounded-[24px] bg-[var(--coach-hero-bg)] p-6 text-[var(--coach-hero-ink)] sm:p-8"
    >
      <h2
        id="perks-title"
        className="m-0 font-display text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em] [text-wrap:balance]"
      >
        Your account keeps your place.
      </h2>
      <ul className="m-0 mt-6 flex list-none flex-col gap-5 p-0">
        {PERKS.map((p) => (
          <li key={p.title} className="flex gap-3.5">
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-hero-card)] text-[var(--coach-hero-card-ink)]"
            >
              <p.icon size={19} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-[16px] font-bold">{p.title}</span>
              <span className="block text-[14.5px] leading-relaxed text-[var(--coach-hero-muted)]">{p.body}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-7 border-t-2 border-[var(--coach-hero-track)] pt-5 text-[14.5px] leading-relaxed text-[var(--coach-hero-muted)]">
        Lessons stay open without one.{" "}
        <Link
          href={FIRST_LESSON_HREF}
          className="font-semibold text-[var(--coach-hero-ink)] underline underline-offset-2"
        >
          Read the first lesson
        </Link>{" "}
        and decide later.
      </p>
    </aside>
  );
}
