"use client";

import { Check, Copy, Eye, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { setProfilePublicAction } from "@/lib/profile/actions";
import { SMALL_BUTTON, SMALL_LIME_BUTTON } from "./styles";
import { useProfileAction } from "./use-profile-action";

export function OwnerBar({ isPublic, publicPath }: { isPublic: boolean; publicPath: string }) {
  const { pending, error, run } = useProfileAction();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the path is visible to copy by hand.
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2.5 text-[13.5px]">
        <span
          aria-hidden="true"
          className={`size-2.5 shrink-0 rounded-full ${isPublic ? "bg-[var(--coach-success)]" : "bg-[var(--coach-border-strong)]"}`}
        />
        {isPublic ? (
          <span className="min-w-0">
            <strong className="font-semibold">Your profile is public.</strong>
            <span className="text-[var(--coach-ink-secondary)]"> Anyone with the link can see it.</span>
          </span>
        ) : (
          <span className="min-w-0">
            <strong className="font-semibold">Your profile is private.</strong>
            <span className="text-[var(--coach-ink-secondary)]"> Only you can see it until you make it public.</span>
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {isPublic ? (
          <>
            <button type="button" onClick={copy} className={SMALL_BUTTON}>
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <Link href={publicPath} className={SMALL_BUTTON}>
              <Eye size={14} aria-hidden="true" />
              View as visitor
            </Link>
          </>
        ) : null}
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => setProfilePublicAction(!isPublic))}
          className={isPublic ? SMALL_BUTTON : SMALL_LIME_BUTTON}
        >
          {isPublic ? <Lock size={14} aria-hidden="true" /> : null}
          {isPublic ? "Make private" : "Make public"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="m-0 text-[13px] text-[var(--coach-wrong-ink)] sm:basis-full">
          {error}
        </p>
      ) : null}
    </div>
  );
}
