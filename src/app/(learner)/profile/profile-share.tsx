"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ProfileShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/15 bg-white/[0.08] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
    >
      <Share2 size={15} strokeWidth={2.3} />
      {copied ? "Link copied!" : "Share"}
    </button>
  );
}
