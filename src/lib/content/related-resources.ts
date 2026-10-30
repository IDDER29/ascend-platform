/**
 * Reading and viewing to go deeper on one question: its own hand-picked
 * resources when the lesson has them, otherwise the lesson's resources that
 * share the most words with the question and its answer. Only real links.
 */
export type LearnMoreResource = { title: string; type: "video" | "doc" | "pdf"; meta: string; url: string };

const STOP = new Set(
  "that this with what when where which while from into than then they them their there these those about would could should because between your yours only just like more most much many such each every other some does done have having been being were will also very over under onto upon here".split(
    " ",
  ),
);

function words(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP.has(w))
      .map((w) => w.replace(/s$/, "")),
  );
}

export function relatedResources(
  question: {
    question: string;
    answer: string;
    resources?: LearnMoreResource[] | { title: string; type: LearnMoreResource["type"]; meta?: string; url: string }[];
  },
  lessonResources: LearnMoreResource[],
  max = 3,
): LearnMoreResource[] {
  if (question.resources && question.resources.length > 0) {
    return question.resources.map((r) => ({ ...r, meta: r.meta ?? "" }));
  }
  const want = words(`${question.question} ${question.answer}`);
  const scored = lessonResources.map((r, i) => {
    const have = words(`${r.title} ${r.meta}`);
    let score = 0;
    for (const w of have) if (want.has(w)) score += 1;
    return { r, i, score };
  });
  const matched = scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score || a.i - b.i);
  return (matched.length > 0 ? matched : scored).slice(0, max).map((x) => x.r);
}
