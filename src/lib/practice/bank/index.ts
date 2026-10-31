import { GENERATED_BANK } from "../generated";
import type { PracticeItem } from "../types";
import { LEVEL_00_BANK } from "./level-00";
import { COURSE1_A_BANK } from "./level-00-course1-a";
import { COURSE1_B_BANK } from "./level-00-course1-b";
import { COURSE2_A_BANK } from "./level-00-course2-a";
import { COURSE2_B_BANK } from "./level-00-course2-b";
import { COURSE3_A_BANK } from "./level-00-course3-a";
import { COURSE3_B_BANK } from "./level-00-course3-b";
import { COURSE4_A_BANK } from "./level-00-course4-a";
import { COURSE4_B_BANK } from "./level-00-course4-b";
import { COURSE5_A_BANK } from "./level-00-course5-a";
import { COURSE6_A_BANK } from "./level-00-course6-a";
import { COURSE6_B_BANK } from "./level-00-course6-b";
import { COURSE7_A_BANK } from "./level-00-course7-a";
import { COURSE7_B_BANK } from "./level-00-course7-b";
import { COURSE8_A_BANK } from "./level-00-course8-a";
import { COURSE8_B_BANK } from "./level-00-course8-b";
import { LEVEL_01_BANK } from "./level-01";
import { LEVEL_04_BANK } from "./level-04";
import { C_BASICS_A_BANK } from "./level-04-a";
import { C_BASICS_B_BANK } from "./level-04-b";
import { LEVEL_02_BANK } from "./level-02";
import { C_LANGUAGE_B_BANK } from "./level-02-b";
import { C_LANGUAGE_C_BANK } from "./level-02-c";
import { LEVEL_05_BANK } from "./level-05";
import { C_TOOLS_A_BANK } from "./level-06-a";
import { C_TOOLS_B_BANK } from "./level-06-b";
import { C_TOOLS_C_BANK } from "./level-06-c";
import { C_TOOLS_PROJECT_BANK } from "./level-06-project";
import { LEVEL_07_BANK } from "./level-07";
import { DATA_STRUCTURES_A_BANK } from "./level-07-a";
import { DATA_STRUCTURES_B_BANK } from "./level-07-b";
import { C_CONTRACT_A_BANK } from "./level-05-a";
import { C_CONTRACT_B_BANK } from "./level-05-b";
import { LEVEL_03_BANK } from "./level-03";
import { SYSTEMS_B_BANK } from "./level-03-b";
import { LEVEL_08_BANK } from "./level-08";
import { VM_THREADS_A_BANK } from "./level-08-a";
import { VM_THREADS_B_BANK } from "./level-08-b";
import { LEVEL_09_BANK } from "./level-09";
import { PERFORMANCE_BANK } from "./level-10";
import { LEVEL_11_BANK } from "./level-11";
import { ADVANCED_BANK } from "./level-12";
import { LEVEL_13_BANK } from "./level-13";
import { MULTICORE_BANK } from "./level-14";
import { COMPILERS_BANK } from "./level-18";
import { RISCV_A_BANK } from "./level-19-a";
import { RISCV_PROJECT_BANK } from "./level-19-project";
import { VERILOG_BANK } from "./level-15";
import { VERILOG_PROJECT_BANK } from "./level-15-project";
import { VERIFICATION_BANK } from "./level-16";
import { RTL_BANK } from "./level-17";
import { CACHES_A_BANK } from "./level-13-a";
import { PIPELINING_A_BANK } from "./level-11-a";

/**
 * Every Practice card, one file per curriculum level. Card ids are
 * permanent: saved SM-2 progress keys on them, so never rename one.
 */
export const PRACTICE_BANK: PracticeItem[] = [
  ...LEVEL_00_BANK,
  ...COURSE1_A_BANK,
  ...COURSE1_B_BANK,
  ...COURSE2_A_BANK,
  ...COURSE2_B_BANK,
  ...COURSE3_A_BANK,
  ...COURSE3_B_BANK,
  ...COURSE4_A_BANK,
  ...COURSE4_B_BANK,
  ...COURSE5_A_BANK,
  ...COURSE6_A_BANK,
  ...COURSE6_B_BANK,
  ...COURSE7_A_BANK,
  ...COURSE7_B_BANK,
  ...COURSE8_A_BANK,
  ...COURSE8_B_BANK,
  // Fresh-number cards: new numbers each review (see generated.ts).
  ...GENERATED_BANK,
  ...LEVEL_01_BANK,
  ...C_BASICS_A_BANK,
  ...C_BASICS_B_BANK,
  ...LEVEL_04_BANK,
  ...LEVEL_02_BANK,
  ...C_LANGUAGE_B_BANK,
  ...C_LANGUAGE_C_BANK,
  ...C_CONTRACT_A_BANK,
  ...C_CONTRACT_B_BANK,
  ...LEVEL_05_BANK,
  ...C_TOOLS_A_BANK,
  ...C_TOOLS_B_BANK,
  ...C_TOOLS_C_BANK,
  ...C_TOOLS_PROJECT_BANK,
  ...DATA_STRUCTURES_A_BANK,
  ...DATA_STRUCTURES_B_BANK,
  ...LEVEL_07_BANK,
  ...LEVEL_03_BANK,
  ...SYSTEMS_B_BANK,
  ...VM_THREADS_A_BANK,
  ...VM_THREADS_B_BANK,
  ...LEVEL_08_BANK,
  ...LEVEL_09_BANK,
  ...PERFORMANCE_BANK,
  ...PIPELINING_A_BANK,
  ...LEVEL_11_BANK,
  ...ADVANCED_BANK,
  ...CACHES_A_BANK,
  ...LEVEL_13_BANK,
  ...MULTICORE_BANK,
  ...VERILOG_BANK,
  ...VERILOG_PROJECT_BANK,
  ...VERIFICATION_BANK,
  ...RTL_BANK,
  ...COMPILERS_BANK,
  ...RISCV_A_BANK,
  ...RISCV_PROJECT_BANK,
];
