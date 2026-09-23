/**
 * OAuth providers — styled placeholders until wired.
 * Flip `OAUTH_ENABLED` (and hook onClick) when ready; keep button markup as-is.
 */
import { cn } from "@/lib/cn";

/** Set true when GitHub / Google auth is live. */
export const OAUTH_ENABLED = false;

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 1C5.9 1 1 5.9 1 12c0 4.9 3.2 9 7.6 10.5.6.1.8-.2.8-.5v-1.8c-3.1.7-3.7-1.5-3.7-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1.9-.2 1.8-.4 2.7-.4.9 0 1.8.1 2.7.4 2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2.1v3.1c0 .3.2.6.8.5C19.8 21 23 16.9 23 12c0-6.1-4.9-11-11-11z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h5.9c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.9C4.1 20.6 7.8 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M6 14.3c-.2-.7-.4-1.4-.4-2.3s.1-1.6.4-2.3V6.8H2.3C1.5 8.4 1 10.1 1 12s.5 3.6 1.3 5.2L6 14.3z"
      />
      <path
        fill="#EA4335"
        d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.8 1 4.1 3.4 2.3 6.8L6 9.7c.9-2.5 3.2-4.3 6-4.3z"
      />
    </svg>
  );
}

const PROVIDERS = [
  {
    id: "github" as const,
    label: "GitHub",
    icon: <GitHubIcon className="text-ink" />,
  },
  {
    id: "google" as const,
    label: "Google",
    icon: <GoogleIcon />,
  },
] as const;

export type OAuthProviderId = (typeof PROVIDERS)[number]["id"];

/**
 * Final button styling for OAuth. Disabled + Coming soon until `OAUTH_ENABLED`.
 * When enabling: set OAUTH_ENABLED, pass `onProvider`.
 */
export function AuthOAuthButtons({
  onProvider,
  className,
}: {
  onProvider?: (id: OAuthProviderId) => void;
  className?: string;
}) {
  const enabled = OAUTH_ENABLED;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex items-center gap-3.5">
        <div className="h-px flex-1 bg-card-border" />
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
          or continue with
        </span>
        <div className="h-px flex-1 bg-card-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={!enabled}
            title={enabled ? `Continue with ${p.label}` : `${p.label} coming soon`}
            aria-label={enabled ? `Continue with ${p.label}` : `${p.label} coming soon`}
            onClick={() => {
              if (enabled) onProvider?.(p.id);
            }}
            className={cn(
              "relative flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-xl border border-card-border bg-elevated px-3 py-2.5 text-sm font-bold text-ink transition-all dark:bg-paper",
              enabled
                ? "hover:-translate-y-0.5 hover:border-xp-border hover:shadow-card-rest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                : "cursor-not-allowed opacity-60",
            )}
          >
            <span className="flex items-center gap-2">
              {p.icon}
              {p.label}
            </span>
            {!enabled ? (
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                Coming soon
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {!enabled ? (
        <p className="mt-2.5 text-center text-[11.5px] leading-snug text-ink-faint text-pretty">
          Email works today. GitHub and Google land here when ready.
        </p>
      ) : null}
    </div>
  );
}
