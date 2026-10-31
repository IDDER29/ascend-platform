import type { MDXComponents } from "mdx/types";
import { MemoryDiagram } from "@/components/lesson/memory-diagram";
import { CodeLab } from "@/components/lesson/code-lab";
import { KeyIdea } from "@/components/lesson/key-idea";
import { Visual } from "@/components/lesson/visual";
import { CodeBlock } from "@/components/lesson/code-block";
import { TruthTable } from "@/components/lesson/truth-table";
import { TinyCpu } from "@/components/lesson/tiny-cpu";
import { TinyCpu2 } from "@/components/lesson/tiny-cpu-2";
import { ByteLab } from "@/components/lesson/byte-lab";
import { GateLab } from "@/components/lesson/gate-lab";
import { ClockLab } from "@/components/lesson/clock-lab";
import { MemoryBoard } from "@/components/lesson/memory-board";
import { DatapathLab } from "@/components/lesson/datapath-lab";
import { ControlLab } from "@/components/lesson/control-lab";
import { AssemblerLab } from "@/components/lesson/assembler-lab";
import { CompilerOutput } from "@/components/lesson/compiler-output";
import { TranslatorLab } from "@/components/lesson/translator-lab";
import { EndToEnd } from "@/components/lesson/end-to-end";
import { SyscallLab } from "@/components/lesson/syscall-lab";
import { ChannelLab } from "@/components/lesson/channel-lab";
import { CRun } from "@/components/lesson/c-run";
import { PipelineLab } from "@/components/lesson/pipeline-lab";
import { CacheLab } from "@/components/lesson/cache-lab";
import { PredictorLab } from "@/components/lesson/predictor-lab";
import { OooLab } from "@/components/lesson/ooo-lab";
import { HdlRun } from "@/components/lesson/hdl-run";
import { SectionHeading } from "@/components/bookmarks/lesson-bookmarks";

export const mdxComponents: MDXComponents = {
  MemoryDiagram,
  CodeLab,
  KeyIdea,
  Visual,
  CodeBlock,
  TruthTable,
  TinyCpu,
  TinyCpu2,
  ByteLab,
  GateLab,
  ClockLab,
  MemoryBoard,
  DatapathLab,
  ControlLab,
  AssemblerLab,
  CompilerOutput,
  TranslatorLab,
  EndToEnd,
  SyscallLab,
  ChannelLab,
  CRun,
  PipelineLab,
  CacheLab,
  PredictorLab,
  OooLab,
  HdlRun,
  h2: (props) => (
    <SectionHeading
      className="group/section mt-9 mb-3 scroll-mt-[88px] font-display text-2xl font-bold tracking-tight"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-1.5 text-[16.5px] leading-[1.75] text-[#413D50]" {...props} />
  ),
  code: (props) => (
    <code
      className="rounded-[5px] bg-[#F3F1FA] px-1.5 py-0.5 font-mono text-[14px] text-[#41395E]"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-bold text-inherit" {...props} />,
};
