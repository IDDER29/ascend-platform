
import {
  Binary,
  Bot,
  Code2,
  Cpu,
  Network,
  Server,
  ShieldCheck,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export const PATH_ICONS: Record<string, LucideIcon> = {
  foundations: Binary,
  "python-foundations": Code2,
  "systems-programmer": Terminal,
  "linux-engineer": Server,
  "network-engineer": Network,
  "ai-engineer": Bot,
  "security-engineer": ShieldCheck,
  "computer-architect": Cpu,
};
