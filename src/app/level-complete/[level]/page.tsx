import { notFound } from "next/navigation";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, levelIds, LevelIdSchema, type LevelId } from "@/lib/content/schema";
import { LevelCompleteCard } from "@/components/level-complete/level-complete-card";

const FLAVOR: Record<LevelId, string> = {
  "level-00-bits-logic": "binary, logic gates and the fetch-execute loop are yours now. That's the foundation everything else stands on.",
  "level-01-machine-memory": "registers, the stack and the heap are yours now. You can see exactly what the CPU is doing.",
  "level-02-the-c-language": "pointers, memory and structs are yours now. That's the hard part of C behind you.",
  "level-03-systems-software": "processes, syscalls and signals are yours now. You understand how real systems actually run.",
};

const BADGE: Record<LevelId, { glyph: string; label: string }> = {
  "level-00-bits-logic": { glyph: "◇", label: "Groundwork" },
  "level-01-machine-memory": { glyph: "▣", label: "Machine Head" },
  "level-02-the-c-language": { glyph: "◆", label: "Pointer Wizard" },
  "level-03-systems-software": { glyph: "⬢", label: "Systems Sage" },
};

const NEXT_SUBTITLE: Record<LevelId, string> = {
  "level-00-bits-logic": "Registers, the stack & heap — see what the CPU is really doing",
  "level-01-machine-memory": "Pointers, memory & structs — the real language of systems",
  "level-02-the-c-language": "Processes, syscalls — build a shell & an allocator",
  "level-03-systems-software": "",
};

export function generateStaticParams() {
  return levelIds.map((level) => ({ level }));
}

export default async function LevelCompletePage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const parsed = LevelIdSchema.safeParse(level);
  if (!parsed.success) notFound();

  const levelId = parsed.data;
  const levelInfo = LEVELS[levelId];
  const levelIndex = levelIds.indexOf(levelId);
  const nextLevelId = levelIds[levelIndex + 1] ?? null;

  const lessons = getAllLessons();
  const concepts = lessons.filter((l) => l.meta.level === levelId).length;
  const xpEarned = concepts * 50;
  const badge = BADGE[levelId];

  const nextLevelFirstLesson = nextLevelId
    ? lessons.filter((l) => l.meta.level === nextLevelId).sort((a, b) => a.meta.order - b.meta.order)[0]
    : null;

  const unlock =
    nextLevelId && nextLevelFirstLesson
      ? {
          href: `/curriculum/${nextLevelFirstLesson.meta.level}/${nextLevelFirstLesson.meta.slug}`,
          label: `Start Level ${nextLevelId.slice(6, 8)} · ${LEVELS[nextLevelId].name}`,
          title: LEVELS[nextLevelId].name,
          subtitle: NEXT_SUBTITLE[levelId],
          badge: nextLevelId.slice(6, 8),
          unlockLabel: "NEW LEVEL UNLOCKED",
        }
      : {
          href: "/projects/shellforge",
          label: "Start the capstone: Shellforge",
          title: "Shellforge",
          subtitle: "Build your own shell in C — the final project",
          badge: "◆◆◆",
          unlockLabel: "CAPSTONE UNLOCKED",
        };

  return (
    <LevelCompleteCard
      levelNumber={levelId.slice(6, 8)}
      levelName={levelInfo.name}
      concepts={concepts}
      xpEarned={xpEarned}
      flavor={FLAVOR[levelId]}
      badgeGlyph={badge.glyph}
      badgeLabel={badge.label}
      nextHref={unlock.href}
      nextLabel={unlock.label}
      nextTitle={unlock.title}
      nextSubtitle={unlock.subtitle}
      unlockBadge={unlock.badge}
      unlockLabel={unlock.unlockLabel}
    />
  );
}
