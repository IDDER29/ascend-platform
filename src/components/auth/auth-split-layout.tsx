import Link from "next/link";

export function AuthSplitLayout({
  icon,
  title,
  subtitle,
  caption,
  decoration,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  caption?: string;
  decoration?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <div className="relative hidden flex-1 basis-[46%] flex-col overflow-hidden bg-gradient-to-br from-[#1B1730] via-[#2A2440] to-[#3A2A55] px-10 py-12 text-white lg:flex">
        <div className="animate-blob pointer-events-none absolute -right-16 -top-24 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.42),transparent_66%)] blur-[12px]" />
        <div className="pointer-events-none absolute -bottom-28 -left-10 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,107,74,0.28),transparent_66%)] blur-[12px]" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-brand-gradient shadow-glow">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 15 6-6 6 6" />
              <path d="m6 9 6-6 6 6" opacity=".55" />
            </svg>
          </div>
          <span className="font-display text-[21px] font-extrabold tracking-tight">Ascend</span>
        </Link>
        <div className="relative my-auto py-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-[#C6A6FF]">
            {icon}
          </div>
          <h1 className="mb-4 max-w-[420px] font-display text-[38px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
            {title}
          </h1>
          <p className="max-w-[400px] text-[16.5px] leading-relaxed text-[#C4BEDA]">{subtitle}</p>
          {decoration}
        </div>
        {caption && (
          <div className="relative font-mono text-[12.5px] text-[#9990B8]">{caption}</div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-11">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
