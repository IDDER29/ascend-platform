"use client";

import { useState } from "react";
import { MessageSquare, CircleHelp, Rocket, BookOpen, Plus, ChevronDown } from "lucide-react";
import { SiteHeader } from "@/components/homepage/header";
import { SiteFooter } from "@/components/homepage/footer";
import { cn } from "@/lib/cn";
import { CATEGORIES, THREADS, type CommunityThread, type ThreadCategory } from "@/lib/community-data";

const CATEGORY_ICON = { message: MessageSquare, help: CircleHelp, ship: Rocket, resource: BookOpen };
const CATEGORY_STYLE: Record<ThreadCategory, { bg: string; fg: string }> = {
  "General discussion": { bg: "bg-[#F1EDFE]", fg: "text-brand-violet" },
  "Help & debugging": { bg: "bg-[#FFF1EC]", fg: "text-[#F0562F]" },
  "Show your project": { bg: "bg-[#E7F8F0]", fg: "text-[#12A472]" },
  "Resources & links": { bg: "bg-[#FEF4E1]", fg: "text-[#E0900A]" },
};

type SortMode = "latest" | "unanswered";

export default function CommunityPage() {
  const [threads, setThreads] = useState<CommunityThread[]>(THREADS);
  const [categoryFilter, setCategoryFilter] = useState<ThreadCategory | null>(null);
  const [sort, setSort] = useState<SortMode>("latest");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ThreadCategory>("General discussion");

  let visible = categoryFilter ? threads.filter((t) => t.category === categoryFilter) : threads;
  if (sort === "unanswered") visible = visible.filter((t) => t.replies === 0);

  function submitThread(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const thread: CommunityThread = {
      id: `local-${Date.now()}`,
      title: newTitle.trim(),
      author: "Amine",
      avatarGradient: "from-[#7B4DFF] to-[#FF6B4A]",
      category: newCategory,
      when: "just now",
      replies: 0,
      body: newTitle.trim(),
      responses: [],
    };
    setThreads((prev) => [thread, ...prev]);
    setNewTitle("");
    setComposing(false);
    setSort("latest");
    setCategoryFilter(null);
    setExpandedId(thread.id);
  }

  return (
    <div className="flex flex-1 flex-col bg-radial-wash text-ink">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1080px] px-6 py-12 sm:px-8 sm:py-[52px]">
        <div className="mx-auto mb-10 max-w-[640px] text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-violet/20 bg-brand-violet/[0.08] px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.1em] text-[#8A6AF2]">
            Free · always open
          </div>
          <h1 className="mb-3 font-display text-[32px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[36px]">
            Learn alongside people on the same climb.
          </h1>
          <p className="mb-5 text-[15.5px] leading-relaxed text-ink-secondary">
            Stuck on a segfault, comparing solutions, or just want to say the drop finally clicked — this is where
            Ascend learners talk to each other.
          </p>
          <button
            onClick={() => setComposing((c) => !c)}
            className="inline-flex items-center gap-2 rounded-[13px] bg-gradient-to-r from-[#6D46F2] to-[#C13AE0] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(109,70,242,0.28)] transition-transform hover:-translate-y-0.5"
          >
            <Plus size={16} />
            {composing ? "Cancel" : "Start a discussion"}
          </button>
        </div>

        {composing && (
          <form
            onSubmit={submitThread}
            className="mx-auto mb-10 max-w-[560px] rounded-2xl border border-card-border bg-white p-5 shadow-card-rest"
          >
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Title</label>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="mb-3.5 w-full rounded-xl border border-[#E4E1EE] bg-[#FBFAFE] px-4 py-3 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]"
            />
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as ThreadCategory)}
              className="mb-4 w-full rounded-xl border border-[#E4E1EE] bg-[#FBFAFE] px-4 py-3 text-[15px] text-[#2A2540] outline-none focus:border-[#B79AF2]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-[#6D46F2] to-[#C13AE0] py-3 text-sm font-bold text-white transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40"
            >
              Post thread
            </button>
          </form>
        )}

        <div className="mb-11 flex flex-wrap justify-center gap-11">
          {[
            { value: `${threads.length.toLocaleString()}+`, label: "Threads (this session)" },
            { value: "4,900+", label: "Members" },
            { value: "~9 min", label: "Avg. reply time" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-[26px] font-extrabold text-brand-violet">{s.value}</div>
              <div className="mt-0.5 text-[12.5px] text-ink-muted">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-9">
          <div className="mb-3.5 font-display text-[16.5px] font-extrabold">Browse by category</div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICON[c.icon];
              const style = CATEGORY_STYLE[c.name];
              const active = categoryFilter === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => setCategoryFilter(active ? null : c.name)}
                  className={cn(
                    "flex flex-col items-start rounded-2xl border bg-white p-4.5 text-left shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover",
                    active ? "border-brand-violet ring-2 ring-brand-violet/20" : "border-card-border",
                  )}
                >
                  <span className={cn("mb-2.5 flex h-9 w-9 items-center justify-center rounded-[11px]", style.bg, style.fg)}>
                    <Icon size={17} strokeWidth={2.2} />
                  </span>
                  <div className="text-sm font-bold text-[#181528]">{c.name}</div>
                  <div className="mt-0.5 text-xs text-ink-muted">{c.threadCount.toLocaleString()} threads</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3.5 flex items-center justify-between">
            <div className="font-display text-[16.5px] font-extrabold">
              Recent threads
              {categoryFilter && <span className="ml-2 text-sm font-medium text-ink-muted">· {categoryFilter}</span>}
            </div>
            <div className="inline-flex rounded-[10px] bg-[#EDEAF6] p-[3px]">
              {(["latest", "unanswered"] as SortMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setSort(m)}
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold capitalize transition-colors",
                    sort === m ? "bg-white text-[#2A2540] shadow-[0_3px_8px_rgba(28,18,64,0.08)]" : "text-[#7A7590]",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-card-border bg-white shadow-card-rest">
            {visible.length === 0 ? (
              <div className="p-8 text-center text-[13.5px] text-ink-muted">
                No {sort === "unanswered" ? "unanswered" : ""} threads {categoryFilter ? `in ${categoryFilter}` : ""} yet.
              </div>
            ) : (
              visible.map((t, i) => {
                const expanded = expandedId === t.id;
                return (
                  <div key={t.id} className={i > 0 ? "border-t border-[#F2F0F8]" : ""}>
                    <button
                      onClick={() => setExpandedId(expanded ? null : t.id)}
                      className="flex w-full items-center gap-3.5 px-4.5 py-4 text-left transition-colors hover:bg-[#FAF9FE]"
                    >
                      <span
                        className={cn(
                          "flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] bg-gradient-to-br font-display text-[13px] font-extrabold text-white",
                          t.avatarGradient,
                        )}
                      >
                        {t.author[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-[#181528]">{t.title}</div>
                        <div className="mt-0.5 text-xs text-ink-faint">
                          {t.author} · {t.category} · {t.when}
                        </div>
                      </div>
                      <span className="flex-none whitespace-nowrap font-mono text-xs text-ink-muted">
                        {t.replies} {t.replies === 1 ? "reply" : "replies"}
                      </span>
                      <ChevronDown size={16} className={cn("flex-none text-ink-faint transition-transform", expanded && "rotate-180")} />
                    </button>
                    {expanded && (
                      <div className="border-t border-[#F2F0F8] bg-[#FBFAFE] px-4.5 py-4">
                        <p className="mb-3.5 text-[13.5px] leading-relaxed text-[#413D50]">{t.body}</p>
                        {t.responses.length > 0 ? (
                          <div className="flex flex-col gap-3">
                            {t.responses.map((r, ri) => (
                              <div key={ri} className="flex items-start gap-2.5">
                                <span
                                  className={cn(
                                    "flex h-6 w-6 flex-none items-center justify-center rounded-md bg-gradient-to-br text-[10px] font-extrabold text-white",
                                    r.avatarGradient,
                                  )}
                                >
                                  {r.author[0]}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold text-[#2A2540]">
                                    {r.author} <span className="font-normal text-ink-faint">· {r.when}</span>
                                  </div>
                                  <p className="mt-0.5 text-[13px] leading-relaxed text-[#5C5773]">{r.body}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs italic text-ink-faint">No replies yet — be the first.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-4.5 rounded-2xl border border-dashed border-[#DCD7EC] bg-white p-5.5">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-[#181428] text-white">
            <MessageSquare size={20} strokeWidth={2.1} />
          </span>
          <div className="min-w-[220px] flex-1">
            <div className="text-sm font-bold text-[#181528]">Community guidelines</div>
            <div className="mt-0.5 text-xs text-ink-muted">
              Be kind, no spoilers outside &quot;Show your project,&quot; and always search before you ask.
            </div>
          </div>
          <button onClick={() => setGuidelinesOpen((g) => !g)} className="text-[13.5px] font-bold text-brand-violet">
            {guidelinesOpen ? "Hide" : "Read the guidelines"} →
          </button>
          {guidelinesOpen && (
            <ol className="ml-[59px] mt-1 flex w-full list-decimal flex-col gap-1.5 pl-4 text-[13px] leading-relaxed text-ink-secondary">
              <li>Be kind — everyone here is at a different point on the same climb.</li>
              <li>Search before you post — your question may already have a great answer.</li>
              <li>Keep full project solutions inside &quot;Show your project&quot;, not other categories.</li>
              <li>No spoilers for knowledge-check answers outside a clearly marked spoiler.</li>
            </ol>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
