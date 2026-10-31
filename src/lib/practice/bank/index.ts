import { GENERATED_BANK } from "../generated";
import type { PracticeItem } from "../types";
import { LEVEL_00_BANK } from "./level-00";
import { COURSE1_A_BANK } from "./level-00-course1-a";
import { COURSE1_B_BANK } from "./level-00-course1-b";
import { LEVEL_01_BANK } from "./level-01";
import { LEVEL_02_BANK } from "./level-02";
import { LEVEL_03_BANK } from "./level-03";

/**
 * Every Practice card, one file per curriculum level. Card ids are
 * permanent: saved SM-2 progress keys on them, so never rename one.
 */
export const PRACTICE_BANK: PracticeItem[] = [
  ...LEVEL_00_BANK,
  ...COURSE1_A_BANK,
  ...COURSE1_B_BANK,
  // Fresh-number cards: new numbers each review (see generated.ts).
  ...GENERATED_BANK,
  ...LEVEL_01_BANK,
  ...LEVEL_02_BANK,
  ...LEVEL_03_BANK,
];
