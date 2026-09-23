export type Curriculum2LessonNode = {
  level: string;
  slug: string;
  title: string;
  order: number;
  timeMin: number;
};

export type Curriculum2LevelRegion = {
  id: string; // LevelId
  name: string;
  short: string;
  timeLabel: string;
  totalConcepts: number;
  done: number;
  accentClass: string; // e.g. "bg-level-00"
  lessons: Curriculum2LessonNode[];
};

export type Curriculum2IntroProps = {
  continueHref: string;
  continueTitle: string;
  contextLine: string;
  ctaLabel: "Continue" | "Start";
  pathPct: number | null; // null when signed out
  streakCurrent: number | null; // null when signed out or 0
};
