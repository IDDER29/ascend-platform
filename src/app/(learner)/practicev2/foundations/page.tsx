import { permanentRedirect } from "next/navigation";
import { practicePathHref } from "@/lib/practice/routes";

export default function PracticeV2FoundationsPage() {
  permanentRedirect(practicePathHref("foundations"));
}
