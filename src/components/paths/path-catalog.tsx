
import {
  Binary,
  Bot,
  Code2,
  Network,
  Server,
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
};
