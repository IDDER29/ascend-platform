import type { PracticeItem } from "../types";

const L11 = "level-11-pipelining";

/** Pipelining: the project's cards. The lessons' cards are in level-11-a.ts. */
export const LEVEL_11_BANK: PracticeItem[] = [
  {
    kind: "typed",
    id: "pipesim-typed-01",
    prompt: "With forwarding, ALU instruction p enters EX in cycle 5. What is the earliest cycle the next instruction, which uses p's result, can be in EX?",
    answers: ["6", "six", "cycle 6"],
    hint: "An ALU result is forwarded straight to the next EX.",
    reviewLabel: "Forwarding an ALU result",
    lessonLevel: L11,
    lessonSlug: "project-pipeline-sim",
    conceptId: "ready-time",
  },
  {
    kind: "typed",
    id: "pipesim-typed-02",
    prompt: "With forwarding, a lw enters MEM in cycle 6. What is the earliest cycle an instruction using its value can be in EX?",
    answers: ["7", "seven", "cycle 7"],
    hint: "A load's value exists only after MEM.",
    reviewLabel: "When a loaded value is ready",
    lessonLevel: L11,
    lessonSlug: "project-pipeline-sim",
    conceptId: "ready-time",
  },
  {
    kind: "mcq",
    id: "pipesim-01",
    prompt: "A loop body is lw x3; add x2, x2, x3; addi x1, x1, -1; bne. How do you remove its load-use stall?",
    options: [
      "Move the addi between the lw and the add",
      "Move the add before the lw in the body",
      "Put a nop after the bne at the end",
      "Swap the addi and the bne at the end",
    ],
    correct: 0,
    hint: "Fill the slot after the load with independent work.",
    reviewLabel: "Scheduling around a load",
    lessonLevel: L11,
    lessonSlug: "project-pipeline-sim",
    conceptId: "scheduling",
  },
  {
    kind: "typed",
    id: "pipesim-typed-03",
    prompt: "A loop iteration has 4 instructions, 1 load-use stall and a taken branch that flushes 2. How many cycles does each iteration add?",
    answers: ["7", "seven"],
    hint: "4 + 1 + 2.",
    reviewLabel: "Cycles per iteration",
    lessonLevel: L11,
    lessonSlug: "project-pipeline-sim",
    conceptId: "steady-state",
  },
  {
    kind: "flashcard",
    id: "pipesim-fc-01",
    front: "What is the only rule that changes when a pipeline simulator turns forwarding off?",
    back: "When a source is ready: instead of the producer's EX + 1 (ALU) or MEM + 1 (load), it's WB + 1, because the value must be written to the register file and read in ID.",
    reviewLabel: "Forwarding in one line",
    lessonLevel: L11,
    lessonSlug: "project-pipeline-sim",
    conceptId: "ready-time",
  },
];
