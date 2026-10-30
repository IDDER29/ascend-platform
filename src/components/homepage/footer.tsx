import Link from "next/link";
import { brandMarkSmClass } from "@/components/homepage/landing-styles";
import {
  CURRICULUM_HREF,
  FIRST_LESSON_HREF,
  PATHS_HREF,
  SIGNIN_HREF,
  SIGNUP_HREF,
} from "@/lib/routes";
import {
  getConfiguredSocialLinks,
  type SocialNetwork,
} from "@/lib/brand/social";

const LEARN = [
  { href: CURRICULUM_HREF, label: "Curriculum" },
  { href: PATHS_HREF, label: "Paths" },
  { href: "/practice", label: "Practice" },
] as const;

const COMMUNITY = [
  { href: "/community", label: "Community" },
  { href: "/#open", label: "Support us" },
] as const;

const ACCOUNT = [
  { href: "/dashboard", label: "Today" },
  { href: "/progress", label: "Progress" },
  { href: "/profile", label: "Profile" },
  { href: SIGNIN_HREF, label: "Sign in" },
  { href: SIGNUP_HREF, label: "Create account" },
  { href: FIRST_LESSON_HREF, label: "Start learning" },
] as const;

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

function FooterNav({
  title,
  items,
}: {
  title: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title} className="min-w-0">
      <div className="mb-3 font-mono text-[11px] font-extrabold uppercase tracking-[0.1em] text-ink-muted sm:mb-3.5 sm:text-xs">
        {title}
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="inline-flex min-h-9 items-center text-[13.5px] text-ink-secondary transition-colors hover:text-ink sm:min-h-0 sm:py-0.5 sm:text-sm"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SocialIcon({ id }: { id: SocialNetwork }) {
  const className = "size-4 shrink-0";
  if (id === "github") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.082 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.997.117-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12" />
      </svg>
    );
  }
  if (id === "discord") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.07.07 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.3 18.3 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.08.08 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 4.37a.09.09 0 0 0-.032.027C.533 9.047-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.08.08 0 0 0 .084-.028 14 14 0 0 0 1.226-1.994.08.08 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.08.08 0 0 1-.008-.127c.126-.094.252-.192.372-.292a.07.07 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .079.01c.12.1.246.198.373.292a.08.08 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.08.08 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.08.08 0 0 0 .084.028 19.8 19.8 0 0 0 6.002-3.03.08.08 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    );
  }
  if (id === "x") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    );
  }
  // facebook
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export function SiteFooter() {
  const socials = getConfiguredSocialLinks();

  return (
    <footer className="min-w-0 overflow-x-clip border-t border-card-border bg-bg/50">
      <div className="mx-auto flex w-full min-w-0 max-w-[var(--layout-max)] flex-col gap-10 px-4 py-10 sm:gap-12 sm:px-8 sm:py-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:py-[52px]">
        <div className="min-w-0 max-w-md lg:max-w-sm lg:shrink-0">
          <div className="mb-3 flex items-center gap-2.5 sm:mb-3.5">
            <div className={brandMarkSmClass}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m6 15 6-6 6 6" />
                <path d="m6 9 6-6 6 6" opacity=".55" />
              </svg>
            </div>
            <span className="font-display text-[18px] font-extrabold text-ink sm:text-[19px]">
              Ascend
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-ink-secondary text-pretty">
            High-quality coding education maintained by an open-source community.
          </p>
          {socials.length > 0 ? (
            <ul className="mt-5 flex flex-wrap items-center gap-2" aria-label="Social links">
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-elevated hover:text-ink"
                    aria-label={s.label}
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-10 lg:gap-x-12 xl:gap-x-16">
          <FooterNav title="Learn" items={LEARN} />
          <FooterNav title="Community" items={COMMUNITY} />
          <FooterNav title="Account" items={ACCOUNT} />
          <FooterNav title="Legal" items={LEGAL} />
        </div>
      </div>

      <div className="border-t border-card-border">
        <div className="mx-auto flex w-full min-w-0 max-w-[var(--layout-max)] flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-5">
          <span className="text-[12px] text-ink-faint sm:text-[12.5px]">
            © 2026 Ascend · Free &amp; open source
          </span>
          <span className="font-mono text-[11px] leading-snug text-ink-faint text-pretty sm:text-right sm:text-[12.5px]">
            Made for people who want to know how it really works.
          </span>
        </div>
      </div>
    </footer>
  );
}
