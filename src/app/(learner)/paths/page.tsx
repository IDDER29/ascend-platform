import { getCurrentUser } from "@/lib/auth/auth";
import { listCompletedLessons } from "@/lib/progress/queries";
import {
  PATHS,
  getPathBySlug,
  pathContinueHref,
  pathHref,
  pathIsEngaged,
  pathMark,
  pathProgressFraction,
  pathTypeMeta,
} from "@/lib/paths/catalog";
import { getSelectedPathSlug } from "@/lib/paths/selected-path";
import {
  PathActionCard,
  PathFeaturedStart,
} from "@/components/paths/path-catalog";
import {
  HUB_CONTENT_CLASS,
  HUB_MAIN_CLASS,
  PageHeader,
} from "@/components/ui/page-header";

export const metadata = {
  title: "All paths — Ascend",
  description:
    "Start with Foundations if you're new, or choose any path you want to train on.",
  robots: { index: false },
};

export default async function PathsPage() {
  const foundations = getPathBySlug("foundations");
  const viewHref = pathHref("foundations");
  const foundationsMeta = foundations ? pathTypeMeta(foundations) : null;

  let completed: { level: string; slug: string }[] = [];
  const selectedSlug = await getSelectedPathSlug();

  const user = await getCurrentUser();
  if (user) {
    try {
      completed = await listCompletedLessons(user.id);
    } catch {
      // db unavailable — empty rings / select only
    }
  }

  const foundationsProgress = foundations
    ? pathProgressFraction(foundations, completed)
    : null;
  const foundationsEngaged = foundations
    ? pathIsEngaged(foundations, selectedSlug, completed)
    : false;
  const foundationsContinueHref =
    (foundations && pathContinueHref(foundations, completed)) ??
    pathHref("foundations");

  const choosePaths = PATHS.filter((p) => p.slug !== "foundations").sort(
    (a, b) => {
      if (a.status === b.status) return 0;
      return a.status === "live" ? -1 : 1;
    },
  );

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <PageHeader
          title="All paths"
          description="Pick a track to train on."
        />

        {foundations && foundations.status === "live" && foundationsMeta ? (
          <div className="mb-10 sm:mb-12">
            <PathFeaturedStart
              title={foundations.title}
              body={foundations.body}
              typeLabel={foundationsMeta.typeLabel}
              courseCountLabel={foundationsMeta.sizeLabel}
              mark={pathMark(foundations)}
              slug={foundations.slug}
              progress={foundationsProgress}
              gradientId="path-ring-featured-foundations"
              engaged={foundationsEngaged}
              continueHref={foundationsContinueHref}
              viewHref={viewHref}
            />
          </div>
        ) : null}

        <section>
          <div className="mb-4">
            <h2 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              Then choose a learning path
            </h2>
            <p className="mt-1.5 max-w-[54ch] text-[13px] text-ink-fainter">
              Each path is a role you can train toward. Take courses in order.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {choosePaths.map((path) => {
              const progress = pathProgressFraction(path, completed);
              const meta = pathTypeMeta(path);
              const engaged = pathIsEngaged(path, selectedSlug, completed);
              const primaryHref = pathContinueHref(path, completed);
              return (
                <PathActionCard
                  key={path.slug}
                  title={path.title}
                  body={path.body}
                  typeLabel={meta.typeLabel}
                  courseCountLabel={meta.sizeLabel}
                  mark={pathMark(path)}
                  slug={path.slug}
                  progress={progress}
                  gradientId={`path-ring-${path.slug}`}
                  soon={path.status === "soon"}
                  engaged={engaged}
                  continueHref={primaryHref}
                  viewHref={pathHref(path.slug)}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
