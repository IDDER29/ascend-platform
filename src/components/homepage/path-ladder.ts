/**
 * Display-only understanding ladder — shared by landing hero + auth path card.
 * Not a syllabus; shows how knowledge deepens on Ascend.
 */
export const PATH_STEPS = [
  {
    mark: "01",
    title: "See",
    gain: "How a bit becomes a decision",
    tone: "bg-level-00",
  },
  {
    mark: "02",
    title: "Understand",
    gain: "How the machine actually runs",
    tone: "bg-level-01",
  },
  {
    mark: "03",
    title: "Control",
    gain: "How code touches that hardware",
    tone: "bg-level-02",
  },
  {
    mark: "04",
    title: "Orchestrate",
    gain: "How the OS keeps it all alive",
    tone: "bg-level-03",
  },
] as const;

export const PATH_OUTCOME = {
  mark: "★",
  title: "Arrive",
  gain: "A clear path from bit to shell",
  tone: "bg-brand-gradient font-mono shadow-[0_4px_14px_rgba(13,159,110,0.2)] dark:shadow-[0_2px_10px_rgba(13,159,110,0.15)]",
} as const;
