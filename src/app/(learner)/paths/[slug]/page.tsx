import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  countCompletedInLevel,
  getContinueLesson,
  getStreak,
} from "@/lib/progress/queries";
import {
  PATHS,
  getPathBySlug,
  pathSelectHrefWithContinue,
} from "@/lib/paths/catalog";
import { PathDetail } from "@/components/paths/path-detail";
import { FoundationsDetail } from "@/components/paths/foundations-detail";
import { HUB_CONTENT_CLASS, HUB_MAIN_CLASS } from "@/components/ui/page-header";

export function generateStaticParams() {
  return PATHS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = getPathBySlug(slug);
  if (!path) return { title: "Path — Ascend" };
  return {
    title: `${path.title} — Ascend`,
    description: path.body,
    robots: { index: false },
  };
}

export default async function PathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = getPathBySlug(slug);
  if (!path) notFound();

  const user = await getCurrentUser();
  let continueHref: string | null = null;
  let continueLevel: string | null = null;
  let foundationsOrder = 1;
  let foundationsDone = 0;
  let streakCurrent = 0;

  if (user) {
    try {
      const cont = await getContinueLesson(user.id);
      continueHref = cont.href;
      continueLevel = cont.level;
      if (cont.level === "level-00-bits-logic") {
        foundationsOrder = cont.order;
      }
      const [done, streak] = await Promise.all([
        countCompletedInLevel(user.id, "level-00-bits-logic"),
        getStreak(user.id),
      ]);
      foundationsDone = done;
      streakCurrent = streak?.current ?? 0;
    } catch {
      // open-path defaults
    }
  }

  const selectHref = pathSelectHrefWithContinue(
    path,
    continueHref,
    continueLevel,
  );

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        {path.slug === "foundations" ? (
          <FoundationsDetail
            path={path}
            currentOrder={foundationsOrder}
            doneCount={foundationsDone}
            streakCurrent={streakCurrent}
            signedIn={Boolean(user)}
          />
        ) : (
          <PathDetail path={path} selectHref={selectHref} />
        )}
      </div>
    </main>
  );
}
