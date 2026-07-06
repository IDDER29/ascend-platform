"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutDashboard, Swords, Play, Trophy, User, Terminal, Flame } from "lucide-react";

export interface PaletteLesson {
  title: string;
  href: string;
  subtitle: string;
}

interface PaletteAction {
  title: string;
  subtitle?: string;
  href: string;
  icon: typeof LayoutDashboard;
  iconBg: string;
  iconFg: string;
  kbd: string;
}

interface PaletteProject {
  title: string;
  subtitle: string;
  href: string;
}

const PROJECTS: PaletteProject[] = [
  { title: "Shellforge", subtitle: "Level 03 · capstone project", href: "/projects/shellforge" },
  { title: "Shellforge — your submission", subtitle: "Test results & peer solutions", href: "/projects/shellforge/result?outcome=passed" },
];

const ACTIONS: PaletteAction[] = [
  {
    title: "Resume last lesson",
    subtitle: "What a pointer really is",
    href: "/curriculum/level-02-the-c-language/what-a-pointer-really-is",
    icon: Play,
    iconBg: "bg-[#E7F8F0]",
    iconFg: "text-[#12A472]",
    kbd: "↵",
  },
  {
    title: "Start a practice drill",
    href: "/practice",
    icon: Swords,
    iconBg: "bg-[#FFF1EC]",
    iconFg: "text-[#FF6B4A]",
    kbd: "G P",
  },
  {
    title: "Open the Playground",
    href: "/playground",
    icon: Play,
    iconBg: "bg-[#F1EDFE]",
    iconFg: "text-[#6D46F2]",
    kbd: "G L",
  },
  {
    title: "View achievements",
    href: "/achievements",
    icon: Trophy,
    iconBg: "bg-[#FEF4E1]",
    iconFg: "text-[#E0900A]",
    kbd: "G A",
  },
  {
    title: "Go to dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    iconBg: "bg-[#F3F1F8]",
    iconFg: "text-[#6E6A7C]",
    kbd: "G D",
  },
  {
    title: "Go to my profile",
    href: "/profile",
    icon: User,
    iconBg: "bg-[#F3F1F8]",
    iconFg: "text-[#6E6A7C]",
    kbd: "G U",
  },
];

export function CommandPalette({ lessons }: { lessons: PaletteLesson[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function onOpenRequest() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("ascend:open-palette", onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("ascend:open-palette", onOpenRequest);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const matchedLessons = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? lessons.filter((l) => l.title.toLowerCase().includes(q)) : lessons.slice(0, 3);
    return list.slice(0, 6);
  }, [lessons, query]);

  const matchedProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? PROJECTS.filter((p) => p.title.toLowerCase().includes(q)) : PROJECTS;
  }, [query]);

  const matchedActions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ACTIONS.filter((a) => a.title.toLowerCase().includes(q)) : ACTIONS;
  }, [query]);

  const flatResults = useMemo(
    () => [
      ...matchedLessons.map((l) => ({ kind: "lesson" as const, href: l.href })),
      ...matchedProjects.map((p) => ({ kind: "project" as const, href: p.href })),
      ...matchedActions.map((a) => ({ kind: "action" as const, href: a.href })),
    ],
    [matchedLessons, matchedProjects, matchedActions],
  );

  function go(href: string) {
    close();
    router.push(href);
  }

  function onInputKeydown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const active = flatResults[activeIndex];
      if (active) go(active.href);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex cursor-pointer items-start justify-center bg-[#181528]/45 px-6 pt-16 backdrop-blur-sm sm:pt-24"
      onClick={close}
    >
      <div
        className="w-full max-w-[600px] cursor-auto overflow-hidden rounded-[20px] border border-[#E4DEF3] bg-white shadow-[0_40px_90px_rgba(24,16,50,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#F0EEF6] px-5 py-4">
          <Search size={19} strokeWidth={2.2} className="flex-none text-[#8A8698]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeydown}
            placeholder="Search concepts, projects, actions…"
            className="min-w-0 flex-1 border-0 bg-transparent text-[16px] text-[#2A2540] outline-none placeholder:text-[#B0ACBC]"
          />
          <span className="flex-none rounded-md border border-[#E2DDEF] px-2 py-1 font-mono text-[11px] text-[#B4AECB]">
            ESC
          </span>
        </div>

        <div className="max-h-[52vh] overflow-y-auto py-2">
          {flatResults.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13.5px] text-ink-muted">
              No matches for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <>
              {matchedLessons.length > 0 && (
                <>
                  <div className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B0ACBC]">
                    Concepts
                  </div>
                  {matchedLessons.map((l, i) => (
                    <button
                      key={l.href}
                      onClick={() => go(l.href)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`mx-1.5 mb-0.5 flex w-[calc(100%-12px)] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F1EDFE] ${
                        activeIndex === i ? "bg-[#F1EDFE]" : ""
                      }`}
                    >
                      <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] bg-[#FBEBFA] text-[#C13AE0]">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14.5px] font-bold text-[#2A2540]">{l.title}</div>
                        <div className="mt-0.5 font-mono text-xs text-[#A29EB4]">{l.subtitle}</div>
                      </div>
                      <span className="whitespace-nowrap rounded-full bg-[#F3F1F8] px-2.5 py-1 font-mono text-[10.5px] font-bold text-[#8A8698]">
                        Lesson
                      </span>
                    </button>
                  ))}
                </>
              )}

              {matchedProjects.length > 0 && (
                <>
                  <div className="mx-3 my-1.5 h-px bg-[#F2F0F8]" />
                  <div className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B0ACBC]">
                    Projects
                  </div>
                  {matchedProjects.map((p, i) => {
                    const flatIndex = matchedLessons.length + i;
                    return (
                      <button
                        key={p.href}
                        onClick={() => go(p.href)}
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        className={`mx-1.5 mb-0.5 flex w-[calc(100%-12px)] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F1EDFE] ${
                          activeIndex === flatIndex ? "bg-[#F1EDFE]" : ""
                        }`}
                      >
                        <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] bg-[#181428] text-white">
                          <Terminal size={16} strokeWidth={2.1} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[14.5px] font-bold text-[#2A2540]">{p.title}</div>
                          <div className="mt-0.5 font-mono text-xs text-[#A29EB4]">{p.subtitle}</div>
                        </div>
                        <span className="whitespace-nowrap rounded-full bg-[#F3F1F8] px-2.5 py-1 font-mono text-[10.5px] font-bold text-[#8A8698]">
                          Project
                        </span>
                      </button>
                    );
                  })}
                </>
              )}

              {matchedActions.length > 0 && (
                <>
                  <div className="mx-3 my-1.5 h-px bg-[#F2F0F8]" />
                  <div className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B0ACBC]">
                    Actions
                  </div>
                  {matchedActions.map((a, i) => {
                    const flatIndex = matchedLessons.length + matchedProjects.length + i;
                    return (
                      <button
                        key={a.href}
                        onClick={() => go(a.href)}
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        className={`mx-1.5 mb-0.5 flex w-[calc(100%-12px)] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F1EDFE] ${
                          activeIndex === flatIndex ? "bg-[#F1EDFE]" : ""
                        }`}
                      >
                        <span className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] ${a.iconBg} ${a.iconFg}`}>
                          <a.icon size={17} strokeWidth={2.1} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[14.5px] font-semibold text-[#2A2540]">{a.title}</div>
                          {a.subtitle && <div className="mt-0.5 font-mono text-xs text-[#A29EB4]">{a.subtitle}</div>}
                        </div>
                        <span className="whitespace-nowrap rounded-full bg-[#F3F1F8] px-2.5 py-1 font-mono text-[10.5px] font-bold text-[#8A8698]">
                          {a.kbd}
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-[#F0EEF6] bg-[#FBFAFE] px-4.5 py-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#8A8698]">
            <kbd className="rounded-md border border-[#E4E1EE] bg-[#F7F6FB] px-1.5 py-0.5 font-mono text-[11px] text-[#A29EB4]">↑</kbd>
            <kbd className="rounded-md border border-[#E4E1EE] bg-[#F7F6FB] px-1.5 py-0.5 font-mono text-[11px] text-[#A29EB4]">↓</kbd>
            navigate
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#8A8698]">
            <kbd className="rounded-md border border-[#E4E1EE] bg-[#F7F6FB] px-1.5 py-0.5 font-mono text-[11px] text-[#A29EB4]">↵</kbd>
            select
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#8A8698]">
            <kbd className="rounded-md border border-[#E4E1EE] bg-[#F7F6FB] px-1.5 py-0.5 font-mono text-[11px] text-[#A29EB4]">esc</kbd>
            close
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs font-bold text-streak-text">
            <Flame size={13} className="fill-current" />
            12-day streak
          </span>
        </div>
      </div>
    </div>
  );
}
