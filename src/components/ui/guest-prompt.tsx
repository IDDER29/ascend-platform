import Link from "next/link";
import { SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";

/** What a signed-out learner sees on a page that's about their own record. */
export function GuestPrompt({ title, body, next }: { title: string; body: string; next: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="m-0 font-display text-[30px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[36px]">
        {title}
      </h1>
      <p className="m-0 max-w-[560px] text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
        {body}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={`${SIGNIN_HREF}?next=${encodeURIComponent(next)}`}
          className="inline-flex min-h-11 items-center rounded-full bg-[var(--coach-lime)] px-5 text-[15px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)]"
        >
          Sign in
        </Link>
        <Link
          href={SIGNUP_HREF}
          className="inline-flex min-h-11 items-center rounded-full border-2 border-[var(--coach-border)] px-5 text-[15px] font-semibold text-[var(--coach-ink)] no-underline"
        >
          Create a free account
        </Link>
      </div>
    </div>
  );
}
