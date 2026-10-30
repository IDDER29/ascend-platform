"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clearBrowser, DELETING_KEY } from "@/lib/auth/clear-browser";
import { WRAP } from "./site-ui";

/** After an account is deleted, Settings sends you home with ?deleted=1. */
export function DeletedNotice() {
  const deleted = useSearchParams().get("deleted") === "1";

  // The account is gone: clear what this browser kept for it.
  useEffect(() => {
    if (!deleted) return;
    try {
      const userId = window.sessionStorage.getItem(DELETING_KEY);
      if (userId) clearBrowser(userId, "account");
      window.sessionStorage.removeItem(DELETING_KEY);
    } catch {}
  }, [deleted]);

  if (!deleted) return null;
  return (
    <div className={`${WRAP} pt-4`}>
      <p
        role="status"
        className="m-0 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-5 py-3.5 text-[15px] text-[var(--coach-ink-secondary)]"
      >
        <span className="font-semibold text-[var(--coach-ink)]">Your account was deleted.</span> Everything in it is
        gone. Lessons stay open if you ever want to come back.
      </p>
    </div>
  );
}
