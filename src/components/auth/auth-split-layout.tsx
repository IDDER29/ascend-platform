import Link from "next/link";
import { ThemeToggle } from "@/components/homepage/theme-toggle";
import { brandMarkClass, brandMarkSmClass } from "@/components/homepage/landing-styles";

function AscendMark({ size = "md" }: { size?: "md" | "sm" }) {
  return (
    <span className={size === "sm" ? brandMarkSmClass : brandMarkClass}>
      <svg
        width={size === "sm" ? 17 : 19}
        height={size === "sm" ? 17 : 19}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m6 15 6-6 6 6" />
        <path d="m6 9 6-6 6 6" opacity=".55" />
      </svg>
    </span>
  );
}

export function AuthSplitLayout({
  icon,
  title,
  subtitle,
  caption,
  decoration,
  mobileLine,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  caption?: React.ReactNode;
  decoration?: React.ReactNode;
  /** One-line thesis shown above the form on small screens (left panel is hidden). */
  mobileLine?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg text-ink">
      {/* Brand stage — desktop */}
      <div className="relative hidden w-[44%] flex-none flex-col overflow-hidden bg-landing-ink px-10 py-12 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 h-[400px] w-[400px] rounded-full blur-[12px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--brand-violet) 38%, transparent), transparent 66%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-10 h-[320px] w-[320px] rounded-full blur-[12px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--brand-orange) 26%, transparent), transparent 66%)",
          }}
        />

        <Link href="/" className="relative flex items-center gap-2.5">
          <AscendMark />
          <span className="font-display text-[21px] font-extrabold tracking-tight">Ascend</span>
        </Link>

        <div className="relative my-auto py-8">
          <div className="mb-4 flex max-w-[420px] items-start gap-4">
            <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-white/90 sm:h-14 sm:w-14">
              {icon}
            </div>
            <h1 className="min-w-0 flex-1 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance">
              {title}
            </h1>
          </div>
          <p className="max-w-[400px] text-[16.5px] leading-relaxed text-white/75 text-pretty">
            {subtitle}
          </p>
          {decoration}
        </div>

        {caption ? (
          <div className="relative flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[12.5px] text-white/55">
            {caption}
          </div>
        ) : null}
      </div>

      {/* Form column */}
      <div className="relative flex flex-1 flex-col px-5 pb-10 pt-4 sm:px-6 sm:pb-11 sm:pt-5">
        <div className="mb-6 flex items-center justify-between gap-3 lg:mb-0 lg:justify-end">
          {/* Mobile brand strip */}
          <Link href="/" className="flex min-w-0 items-center gap-2.5 lg:hidden">
            <AscendMark size="sm" />
            <span className="min-w-0">
              <span className="block font-display text-[17px] font-extrabold tracking-tight text-ink">
                Ascend
              </span>
              {mobileLine ? (
                <span className="block truncate text-[12px] text-ink-muted">{mobileLine}</span>
              ) : null}
            </span>
          </Link>
          <ThemeToggle className="shrink-0" />
        </div>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
