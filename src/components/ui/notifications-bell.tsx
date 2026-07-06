"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { NOTIFICATIONS, type NotificationItem } from "@/lib/notifications-data";
import { cn } from "@/lib/cn";

function renderBody(item: NotificationItem) {
  if (item.boldParts.length === 0) return item.body;
  const pattern = new RegExp(`(${item.boldParts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = item.body.split(pattern);
  return parts.map((part, i) => (item.boldParts.includes(part) ? <b key={i}>{part}</b> : <span key={i}>{part}</span>));
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const rootRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(
    () => NOTIFICATIONS.filter((n) => n.section === "Today" && !readIds.has(n.id)).length,
    [readIds],
  );

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

  function markRead(id: string) {
    setReadIds((s) => new Set(s).add(id));
  }

  function markAllRead() {
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  }

  const today = NOTIFICATIONS.filter((n) => n.section === "Today");
  const earlier = NOTIFICATIONS.filter((n) => n.section === "Earlier");

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative flex h-[39px] w-[39px] flex-none items-center justify-center rounded-xl border border-card-border-soft bg-[#F3F1FA] text-ink-secondary"
      >
        <Bell size={17} strokeWidth={2.1} />
        {unreadCount > 0 && (
          <span className="absolute right-[9px] top-2 h-2 w-2 rounded-full border-2 border-white bg-[#FF5A38]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[360px] max-w-[calc(100vw-40px)] overflow-hidden rounded-2xl border border-[#E7E3F2] bg-white shadow-[0_24px_50px_rgba(28,18,64,0.16)]">
          <div className="flex items-center justify-between border-b border-[#F0EEF6] px-4.5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="font-display text-[15px] font-extrabold">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#FF5A38] px-2 py-0.5 font-mono text-[11px] font-extrabold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <button onClick={markAllRead} className="text-[12.5px] font-bold text-brand-violet">
              Mark all read
            </button>
          </div>

          <div className="flex max-h-[60vh] flex-col overflow-y-auto py-1">
            {([["Today", today] as const, ["Earlier", earlier] as const]).map(([label, items]) =>
              items.length === 0 ? null : (
                <div key={label}>
                  <div className="px-4.5 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-fainter">
                    {label}
                  </div>
                  {items.map((n) => {
                    const isUnread = n.section === "Today" && !readIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={cn(
                          "relative flex cursor-pointer gap-3 px-4.5 py-3.5 transition-colors hover:bg-[#FAF9FE]",
                          isUnread && "bg-[#FBFAFE]",
                        )}
                      >
                        {isUnread && (
                          <span className="absolute left-2 top-[26px] h-[7px] w-[7px] rounded-full bg-brand-violet" />
                        )}
                        <span className={cn("flex h-9 w-9 flex-none items-center justify-center rounded-[11px] text-base", n.iconBg, n.iconFg)}>
                          {n.glyph}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] leading-snug text-[#2A2540]">{renderBody(n)}</div>
                          {n.cta && (
                            <Link
                              href={n.cta.href}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                              }}
                              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#E9E5F4] bg-[#F3F1FA] px-3 py-1.5 text-[12px] font-bold text-[#5A32D6]"
                            >
                              {n.cta.label}
                            </Link>
                          )}
                          <div className="mt-1.5 font-mono text-[10.5px] text-ink-faint">{n.when}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
            )}
          </div>

          <div className="border-t border-[#F0EEF6] bg-[#FBFAFE] py-3 text-center text-[12.5px] text-ink-fainter">
            That&apos;s everything — no notification archive in this preview.
          </div>
        </div>
      )}
    </div>
  );
}
