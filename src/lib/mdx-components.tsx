import type { MDXComponents } from "mdx/types";
import { MemoryDiagram } from "@/components/lesson/memory-diagram";
import { CodeLab } from "@/components/lesson/code-lab";
import { KeyIdea } from "@/components/lesson/key-idea";
import { Visual } from "@/components/lesson/visual";
import { CodeBlock } from "@/components/lesson/code-block";
import { TruthTable } from "@/components/lesson/truth-table";

export const mdxComponents: MDXComponents = {
  MemoryDiagram,
  CodeLab,
  KeyIdea,
  Visual,
  CodeBlock,
  TruthTable,
  h2: (props) => (
    <h2
      className="mt-9 mb-3 scroll-mt-[88px] font-display text-2xl font-bold tracking-tight"
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
