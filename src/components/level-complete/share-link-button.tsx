"use client";

import { useState } from "react";

/** Copies this page's address. */
export function ShareLinkButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard unavailable.
        }
      }}
    >
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
