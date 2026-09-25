import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  countCompletedInLevel,
  getContinueLesson,
  listCompletedLessons,
} from "@/lib/progress/queries";
import {
  PATHS,
  getPathBySlug,
  pathContinueHref,
  pathIsEngaged,
} from "@/lib/paths/catalog";
import { getSelectedPathSlug } from "@/lib/paths/selected-path";
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
  const selectedSlug = await getSelectedPathSlug();
  let completed: { level: string; slug: string }[] = [];
  let foundationsDone = 0;
  let foundationsOrder = 1;

  if (user) {
    try {
      const [done, lessons, cont] = await Promise.all([
        countCompletedInLevel(user.id, "level-00-bits-logic"),
        listCompletedLessons(user.id),
        getContinueLesson(user.id),
      ]);
      foundationsDone = done;
      completed = lessons;
      if (cont.level === "level-00-bits-logic") {
        foundationsOrder = cont.order;
      }
    } catch {
      // open-path defaults
    }
  }

  const continueHref = pathContinueHref(path, completed);
  const engaged = pathIsEngaged(path, selectedSlug, completed);
  const signedIn = Boolean(user);

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        {path.slug === "foundations" ? (
          <FoundationsDetail
            path={path}
            currentOrder={foundationsOrder}
            doneCount={foundationsDone}
            completed={completed}
            continueHref={
              continueHref ?? "/lessons/foundations-bits-what-is-a-bit"
            }
            engaged={engaged}
            signedIn={signedIn}
          />
        ) : (
          <PathDetail
            path={path}
            continueHref={continueHref}
            engaged={engaged}
            completed={completed}
            signedIn={signedIn}
          />
        )}
      </div>
    </main>
  );
}
