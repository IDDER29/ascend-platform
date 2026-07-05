"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/notifications-data";
import { cn } from "@/lib/cn";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          setUnread(false);
        }}
        className="relative flex h-[39px] w-[39px] flex-none items-center justify-center rounded-xl border border-card-border-soft bg-[#F3F1FA] text-ink-secondary"
      >
        <Bell size={17} strokeWidth={2.1} />
        {unread && (
          <span className="absolute right-[9px] top-2 h-2 w-2 rounded-full border-2 border-white bg-[#FF5A38]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[320px] overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-[0_24px_50px_rgba(28,18,64,0.16)]">
          <div className="border-b border-[#F0EEF6] px-4 py-3 font-display text-[14px] font-extrabold">
            Notifications
          </div>
          <div className="flex max-h-[360px] flex-col overflow-y-auto py-1.5">
            {NOTIFICATIONS.map((n) => (
              <Link
                key={n.id}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "mx-1.5 mb-0.5 flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[#FAF9FE]",
                )}
              >
                <span className={cn("flex h-9 w-9 flex-none items-center justify-center rounded-[10px] text-base", n.iconBg, n.iconFg)}>
                  {n.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold leading-snug text-[#2A2540]">{n.title}</div>
                  <div className="mt-0.5 text-[12px] leading-snug text-ink-muted">{n.subtitle}</div>
                  <div className="mt-1 font-mono text-[10.5px] text-ink-faint">{n.when}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
