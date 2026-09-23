import { Button } from "@/components/ui/button";
import { CURRICULUM_HREF } from "@/lib/routes";

export function FinalCta() {
  return (
    <section className="animate-rise relative overflow-hidden rounded-[22px] bg-brand-gradient px-5 py-10 text-center text-white shadow-[0_8px_28px_rgba(13,159,110,0.2),inset_0_1px_0_rgba(255,255,255,0.28)] sm:rounded-[28px] sm:px-12 sm:py-14 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/18 to-transparent"
      />
      <div className="animate-blob pointer-events-none absolute -left-10 -top-20 h-[min(260px,50vw)] w-[min(260px,50vw)] rounded-full bg-white/[0.12] blur-[10px]" />
      <div
        className="animate-blob pointer-events-none absolute -bottom-20 -right-5 h-[min(220px,45vw)] w-[min(220px,45vw)] rounded-full bg-white/10 blur-[8px]"
        style={{ animationDirection: "reverse" }}
      />
      <div className="relative mx-auto flex w-full min-w-0 max-w-2xl flex-col items-center">
        <h2 className="mb-3 w-full font-display text-[clamp(1.5rem,5vw,2.625rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance">
          Ready to see how it all really works?
        </h2>
        <p className="mb-7 w-full max-w-md text-[15px] leading-relaxed text-white/90 text-pretty sm:text-[17px]">
          Begin at Level 00 — bits, logic, and the ground everything else stands on.
        </p>
        <Button href={CURRICULUM_HREF} size="lg" variant="invert" className="w-full max-w-xs sm:w-auto sm:max-w-none">
          View full curriculum
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
        <div className="mt-4 max-w-xs px-1 font-mono text-[11.5px] leading-relaxed text-white/85 sm:max-w-none sm:text-[12.5px]">
          Free forever · sign in anytime to save progress
        </div>
      </div>
    </section>
  );
}
