"use client";

import { useState } from "react";
import Link from "next/link";
import { Code2, Video, BookOpen, FileText, Bookmark } from "lucide-react";
import { AppSidebar } from "@/components/ui/sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { cn } from "@/lib/cn";
import { BOOKMARKS, type BookmarkIcon, type BookmarkItem } from "@/lib/bookmarks-data";

const ICONS: Record<BookmarkIcon, typeof Code2> = {
  code: Code2,
  video: Video,
  book: BookOpen,
  file: FileText,
};

const TABS = [
  { key: "all", label: "All" },
  { key: "lesson", label: "Lessons" },
  { key: "resource", label: "Resources" },
  { key: "snippet", label: "Snippets" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function BookmarkCard({ item, onRemove }: { item: BookmarkItem; onRemove: () => void }) {
  const Icon = ICONS[item.icon];
  const isDark = item.iconGradient === "dark";

  const inner = (
    <>
      <div className="mb-3.5 flex items-center justify-between">
        <span
          className={cn(
            "flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px]",
            isDark ? "bg-[#181428]" : `bg-gradient-to-br ${item.iconGradient}`,
          )}
        >
          <Icon size={17} strokeWidth={2.2} className={isDark ? "text-[#6BE3A3]" : "text-white"} />
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          title="Remove bookmark"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#C13AE0] transition-transform hover:-translate-y-0.5 hover:text-[#A730C4]"
        >
          <Bookmark size={16} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
      <div className="font-display text-[15.5px] font-bold text-[#181528]">{item.title}</div>
      <div className="mt-1 text-[12.5px] text-ink-muted">{item.subtitle}</div>
    </>
  );

  const className = "flex flex-col rounded-[18px] border border-card-border bg-white p-5 shadow-card-rest transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover";

  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

export default function BookmarksPage() {
  const [items, setItems] = useState(BOOKMARKS);
  const [tab, setTab] = useState<TabKey>("all");

  const counts = {
    all: items.length,
    lesson: items.filter((i) => i.kind === "lesson").length,
    resource: items.filter((i) => i.kind === "resource").length,
    snippet: items.filter((i) => i.kind === "snippet").length,
  };

  const visible = tab === "all" ? items : items.filter((i) => i.kind === tab);

  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-[1160px]">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <h1 className="mb-1.5 font-display text-[26px] font-extrabold leading-tight tracking-[-0.028em] sm:text-[29px]">
                  Bookmarks
                </h1>
                <p className="text-[14.5px] text-ink-secondary">
                  Lessons, resources and snippets you saved for later.
                </p>
              </div>
              <div className="inline-flex flex-wrap rounded-[11px] bg-[#EDEAF6] p-[3px]">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={cn(
                      "rounded-[9px] px-3.5 py-2 text-[13px] font-bold transition-colors",
                      tab === t.key
                        ? "bg-white text-[#2A2540] shadow-[0_4px_10px_rgba(28,18,64,0.08)]"
                        : "text-[#7A7590]",
                    )}
                  >
                    {t.label === "All" ? `All · ${counts.all}` : `${t.label} · ${counts[t.key]}`}
                  </button>
                ))}
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DCD7EC] bg-[#FAF9FD] p-10 text-center">
                <div className="mb-1 font-display text-[15px] font-bold text-[#2A2540]">
                  Nothing saved here yet
                </div>
                <p className="text-[13px] text-ink-muted">
                  {items.length === 0
                    ? "You've removed all your bookmarks."
                    : `No ${tab}s saved yet — bookmark one from a lesson, resource, or the Playground.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((item) => (
                  <BookmarkCard
                    key={item.id}
                    item={item}
                    onRemove={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
