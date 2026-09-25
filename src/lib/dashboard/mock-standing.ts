/**
 * Demo standing for Continue — reputation, exams, extras.
 * Replace with real APIs later.
 */

export type MonthPulseMock = {
  reputation: number;
  reputationLabel: string;
  activeDays: number;
  reviewsCount: number;
  months: { label: string; rate: number }[];
  exams: {
    id: string;
    title: string;
    pathLabel: string;
    status: "upcoming" | "due" | "passed" | "retry";
    when: string;
    href: string;
  }[];
  extras: {
    id: string;
    title: string;
    why: string;
    href: string;
  }[];
};

export const DEMO_MONTH_PULSE: MonthPulseMock = {
  reputation: 78,
  reputationLabel: "Rising",
  activeDays: 13,
  reviewsCount: 3,
  months: [
    { label: "Jan", rate: 40 },
    { label: "Feb", rate: 52 },
    { label: "Mar", rate: 48 },
    { label: "Apr", rate: 61 },
    { label: "May", rate: 70 },
    { label: "Jun", rate: 66 },
  ],
  exams: [
    {
      id: "ex1",
      title: "Bits & bases check",
      pathLabel: "Foundations",
      status: "due",
      when: "Due in 3 days",
      href: "/practice",
    },
    {
      id: "ex2",
      title: "Logic gates quiz",
      pathLabel: "Foundations",
      status: "upcoming",
      when: "Unlocks after lesson 04",
      href: "/paths/foundations",
    },
    {
      id: "ex3",
      title: "Half-adder review",
      pathLabel: "Foundations",
      status: "passed",
      when: "Passed · 2w ago",
      href: "/lessons/foundations-logic-project-half-adder",
    },
  ],
  extras: [
    {
      id: "x1",
      title: "Build a 4-bit ripple adder",
      why: "Stretch after the half-adder — optional, builds reputation.",
      href: "/paths/foundations",
    },
    {
      id: "x2",
      title: "Write a 10-line bit primer",
      why: "Teach-back extra · peer review fodder.",
      href: "/community",
    },
    {
      id: "x3",
      title: "Shellforge dry-run",
      why: "Practice the capstone harness before Systems.",
      href: "/projects/shellforge",
    },
  ],
};
