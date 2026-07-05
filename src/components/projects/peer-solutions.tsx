"use client";

import { useState } from "react";
import { Heart, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/cn";

interface Solution {
  initial: string;
  name: string;
  xp: string;
  gradient: string;
  description: string;
  likes: number;
}

const SOLUTIONS: Solution[] = [
  { initial: "E", name: "elena", xp: "892 XP", gradient: "from-[#7B4DFF] to-[#C13AE0]", description: "Clean two-file parser with elegant recursive pipe handling.", likes: 142 },
  { initial: "M", name: "marc", xp: "1.2k XP", gradient: "from-[#FF6B4A] to-[#FFCE4A]", description: "Single-pass tokenizer that gracefully handles nested quotes.", likes: 98 },
  { initial: "K", name: "kenji", xp: "640 XP", gradient: "from-[#12B981] to-[#3BC6F0]", description: "Heavily commented — the friendliest version to read first.", likes: 210 },
];

const SORTS = [
  { id: "top", label: "Top rated" },
  { id: "concise", label: "Most concise" },
  { id: "recent", label: "Recent" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

function sortSolutions(sort: SortId): Solution[] {
  const copy = [...SOLUTIONS];
  if (sort === "top") return copy.sort((a, b) => b.likes - a.likes);
  if (sort === "concise") return copy.sort((a, b) => a.description.length - b.description.length);
  return copy; // "recent" — original submission order
}

export function PeerSolutions() {
  const [sort, setSort] = useState<SortId>("top");
  const solutions = sortSolutions(sort);

  return (
    <div className="mt-6 rounded-[20px] border border-card-border bg-white p-6 shadow-card-rest">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="font-display text-[19px] font-extrabold">Peer solutions</div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F8F0] px-2.5 py-1 font-mono text-[11px] text-[#0E9E6E]">
            <Lock size={12} className="rotate-180" strokeWidth={2.4} />
            UNLOCKED
          </span>
        </div>
        <div className="flex gap-1">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                sort === s.id ? "bg-xp-bg font-bold text-brand-violet" : "text-ink-fainter hover:text-ink-secondary",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-4.5 text-[13.5px] text-ink-fainter">
        You built it yourself — now see how <b>2,140</b> others solved the same problem.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {solutions.map((s) => (
          <div key={s.name} className="cursor-pointer rounded-2xl border border-[#EEECF6] p-4.5 transition-shadow hover:shadow-card-hover">
            <div className="mb-3.5 flex items-center gap-2.5">
              <div className={cn("flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br font-bold text-white", s.gradient)}>
                {s.initial}
              </div>
              <div className="min-w-0">
                <div className="text-[14.5px] font-bold">{s.name}</div>
                <div className="font-mono text-[11.5px] text-ink-fainter">{s.xp}</div>
              </div>
            </div>
            <p className="mb-3.5 min-h-[57px] text-[13px] leading-relaxed text-ink-secondary">{s.description}</p>
            <div className="flex items-center justify-between border-t border-[#F4F2FA] pt-3.5">
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-fainter">
                <Heart size={13} className="fill-[#E0564E] text-[#E0564E]" />
                {s.likes}
              </span>
              <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-brand-violet">
                Read code <ChevronRight size={13} strokeWidth={2.6} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
