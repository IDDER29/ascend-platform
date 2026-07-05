import { Button } from "@/components/ui/button";
import { LESSON_URL } from "./header";

export function FinalCta() {
  return (
    <section className="animate-rise relative my-16 overflow-hidden rounded-[28px] bg-brand-gradient px-6 py-14 text-center text-white shadow-[0_30px_60px_rgba(123,77,255,0.34)] sm:my-20 sm:px-12 sm:py-16">
      <div className="animate-blob pointer-events-none absolute -left-10 -top-20 h-[300px] w-[300px] rounded-full bg-white/[0.13] blur-[10px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-5 h-[260px] w-[260px] rounded-full bg-white/10 blur-[8px]" style={{ animationDirection: "reverse" }} />
      <div className="relative">
        <h2 className="mx-auto mb-4 max-w-[600px] font-display text-[32px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[46px]">
          Ready to see how it all really works?
        </h2>
        <p className="mx-auto mb-8 max-w-[480px] text-[17px] leading-relaxed opacity-95">
          Start at the bedrock and build up. Free forever, no account needed
          to begin.
        </p>
        <Button href={LESSON_URL} size="lg" variant="invert">
          Start learning free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6A3EF0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
        <div className="mt-4.5 font-mono text-[13px] opacity-85">
          Free forever · open source · progress saves as you go
        </div>
      </div>
    </section>
  );
}
