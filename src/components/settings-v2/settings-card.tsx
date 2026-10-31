import Link from "next/link";
import { SIGNIN_HREF } from "@/lib/routes";

/** One block of settings: a title, what it's for, then its controls. */
export function SettingsCard({
  title,
  description,
  danger = false,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[20px] border-2 bg-[var(--coach-surface)] p-5 sm:p-6 ${
        danger ? "border-[var(--coach-wrong-border)]" : "border-[var(--coach-border)]"
      }`}
    >
      <h2 className="m-0 text-[18px] font-bold">{title}</h2>
      {description && (
        <p className="m-0 mt-1 text-[14.5px] leading-relaxed text-[var(--coach-ink-secondary)]">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Shown to guests in place of settings that need an account. */
export function SignInFirst({ what }: { what: string }) {
  return (
    <div className="rounded-[20px] border-2 border-dashed border-[var(--coach-border-strong)] p-5 sm:p-6">
      <p className="m-0 text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
        {what}{" "}
        <Link
          href={`${SIGNIN_HREF}?next=${encodeURIComponent("/settings")}`}
          className="font-semibold text-[var(--coach-ink)] underline underline-offset-2"
        >
          Sign in
        </Link>{" "}
        or{" "}
        <Link href="/signin?mode=signup" className="font-semibold text-[var(--coach-ink)] underline underline-offset-2">
          create a free account
        </Link>
        .
      </p>
    </div>
  );
}

/** "Saved" / an error, read out when it changes. */
export function SaveStatus({
  status,
}: {
  status: { kind: "idle" | "saving" | "saved" } | { kind: "error"; message: string };
}) {
  return (
    <p aria-live="polite" className="m-0 min-h-6 text-[14px]">
      {status.kind === "saving" && <span className="text-[var(--coach-ink-muted)]">Saving…</span>}
      {status.kind === "saved" && <span className="font-semibold text-[var(--coach-success)]">Saved</span>}
      {status.kind === "error" && (
        <span className="font-semibold text-[var(--coach-wrong-title)]">{status.message}</span>
      )}
    </p>
  );
}
