# Learning science for Ascend: forgetting, spaced repetition, and keeping what you learn

A working reference for product decisions. It summarises the research (in our own words, with sources), sets it against how Ascend works today, and records what we decided and what's still open. Update it when we change Practice, Bookmarks, the dashboard or Progress.

Sources read for this version (2026-10-30):
- A long-form piece on the forgetting curve and spaced repetition the user shared (covers Ebbinghaus, the spacing and testing effects, SM-2 vs FSRS, and the research summary below).
- *Personal Knowledge Management (PKM) Guide* — nottut.com/en/blog/personal-knowledge-management-pkm-guide.

---

## 1. What the research says

### 1.1 Forgetting is fast at first, then slows
- Ebbinghaus (1880s) relearned lists of nonsense syllables after different delays and measured the savings. Memory dropped steeply soon after learning, then more and more slowly. The curve is not a straight line.
- A 2015 replication (Murre & Dros, *PLOS One*) found the same general shape — but with one participant and a "savings" measure, not "percent remembered".
- **Consequence for us:** there is no universal number like "you forget half in an hour". Any curve we show is a model of *one learner's cards*, and must be labelled as an estimate.
- Forgetting isn't erasure: a memory that can't be recalled now can often be brought back with a cue or a review. That's why "Reread the lesson" next to "Practice its cards" makes sense.

### 1.2 Spacing beats cramming
- Studying the same material spread over days gives better long-term recall than the same time in one sitting. Cepeda et al. (2006) pooled 839 assessments from 317 experiments: a robust spacing effect.
- **The best gap depends on how long you need to remember.** In a study of 1,350+ people (Cepeda et al., 2008), the best gap grew as the final test moved further away. Ascend's horizon is long (months to years), so gaps should grow long too.
- Expanding gaps (1, 3, 7, 14, 30 days…) are a reasonable start but not proven better than equal gaps in final recall; their advantage is keeping things accessible along the way. Adaptive schedules beat fixed calendars.

### 1.3 Recalling is learning (the testing effect)
- Trying to recall something strengthens it more than re-reading it. Karpicke & Roediger (2008, *Science*): repeated testing gave far better delayed recall than repeated studying.
- Re-reading builds familiarity, which feels like knowing — an "illusion of mastery".
- **Feedback matters:** after a failed recall, seeing and understanding the right answer still helps. Rehearsing a wrong answer doesn't.
- The loop: **learn → recall → check → repeat**.

### 1.4 Why spacing works (several reasons, none settled alone)
- Recall that takes some effort makes a more durable memory than recall seconds after seeing it.
- Meeting an idea on different days and in different contexts gives more routes back to it.
- Time and sleep help consolidation (mechanisms still debated).
- **The target is an achievable challenge:** far enough apart that recall takes effort, not so far that every review is relearning.

### 1.5 How schedulers decide
- **SM-2** (SuperMemo, used by early Anki): first intervals of about 1 day and 6 days, then each interval × the card's *ease*. Ease drops when you struggle. It doesn't estimate the chance you'll remember.
- **FSRS** (Free Spaced Repetition Scheduler): models each card with
  - **D** difficulty — how hard this card is *for you*;
  - **S** stability — how slowly recall falls; in FSRS 3–6, the days until predicted recall falls to 90%;
  - **R** retrievability — predicted chance of recalling it *now*.
  A successful recall after a gap raises S (longer next interval); a failure lowers it. The learner chooses a **desired retention** (90% is the usual default); the interval is when R is predicted to fall to it.
- Forgetting-curve formulas:
  - FSRS 3 (simple, exponential): `R = 0.9^(t/S)`.
  - FSRS 4.5 (power law, forgetting slows): `R = (1 + F·t/S)^C`, `C = −0.5`, `F = 19/81`, so `R(S) = 0.9`. FSRS 6 makes the shape trainable.
  - Interval for a target `r` (exponential form): `I = S · ln(r) / ln(0.9)`. Higher target → shorter intervals.
- **Grades must be honest.** In FSRS, "Hard" counts as a *success*; pressing Hard after a blank distorts the model. "Again" is the only failure.

### 1.6 What's strongly supported, and what isn't
| Claim | Evidence |
|---|---|
| Spacing improves delayed recall vs cramming | Strong (large meta-analyses) |
| Recall practice beats re-studying | Strong |
| Best gap depends on how long you need to remember | Strong; exact timing varies |
| Expanding gaps always beat equal gaps | **Not** supported as a rule |
| Flashcards alone give deep understanding and transfer | **Not** established — the kind of practice matters |

### 1.7 Practical learning cycle
1. **Understand first** — diagrams, examples, links to what you know. Don't memorise what doesn't make sense.
2. **Turn key ideas into small, unambiguous questions** (why / how / when / what changes), not one card per lecture.
3. **Recall before revealing**, then check and correct.
4. **Repeat across days and weeks**, older material mixed with new.
5. **Apply it** — solve unfamiliar problems, build, debug, explain. Mixing problem types (interleaving) helps, especially in maths and engineering.

A reasonable 45-minute session: ~10 min recall of old material, ~20 min new concept, ~10 min a problem or explaining without notes, ~5 min writing a few good questions / fixing mistakes. (A suggestion, not a proven ratio.)

### 1.8 From the PKM guide
- PKM = capture → organise → connect → distill → express. Your head is good at ideas and bad at storage, so keep them somewhere outside it.
- Notes in your own words beat copied text (it forces processing).
- Linking notes turns a filing cabinet into a thinking tool; **expressing** (writing, building, teaching) closes the loop and shows gaps.
- A **weekly review** (15–30 min: clear the inbox, update links, reflect) is the habit that keeps the system alive; the guide ties it to the spacing effect.
- Mistakes: hoarding, collecting ≠ understanding, over-complex systems, skipping reviews.
- The guide doesn't cover flashcards or active recall directly — it's about organising knowledge, which complements, not replaces, Practice.

---

## 2. How Ascend works today

| Research idea | Ascend now | Where |
|---|---|---|
| Understand first | Lessons with diagrams, knowledge checks, assignments | `content/curriculum`, lesson page |
| Recall before revealing | Practice: MCQ, typed, cloze, flashcards (answer in your head first) | `src/components/practice/practice-coach-v2-session-live.tsx` |
| Feedback | Wrong answer → right answer + "where to learn this" lesson link | session, `reviewHrefs` |
| Spacing | **SM-2**: first good → 1 day, then interval × ease; again → relearn now, ease −0.2 | `src/lib/practice/sm2.ts` |
| Honest grades | Only **Again / Good** are used (MCQ/typed by correctness; flashcards self-graded). Hard/Easy exist in code but no UI uses them — good, no Hard misuse | `cards.ts`, session |
| Retrievability (R) | **Not modelled** by SM-2. The dashboard's memory curve estimates it (§3) | `src/lib/practice/memory-curve.ts` |
| Desired retention | Not a setting; SM-2 has none | — |
| Apply it | Projects (half adder, ShellForge), assignments | projects, profile |
| Capture / your own words | Bookmarks with a reason and a note | `src/lib/bookmarks` |
| Weak spots | "To revisit": flagged bookmarks + lessons under 70% right lately | `src/lib/dashboard/revisit-model.ts` |
| Daily habit | Daily goal (Casual / Regular / Serious), lesson streak, Today checklist | `src/lib/dashboard/day-plan.ts`, `src/lib/progress/streak.ts` |

---

## 3. Decision: the memory curve on the dashboard (2026-10-30)

**Why:** the user asked to replace a "cards due per day" bar chart with the *forgetting curve of the learner's own deck*. It shows the reason for reviewing, not just a count.

**What it shows** (Practice card, under the review button):
- "You'd recall about **N%** of your **M** cards today." M = cards reviewed at least once (new, never-reviewed cards don't count).
- A line chart over the next 30 days, 0–100%:
  - **Reviewing when due** (solid blue): each card reviewed the day it's due, assumed remembered, stability × its ease (like SM-2 "good"). Stays around 90%+.
  - **If you stop** (dashed orange): no more reviews; each card's recall falls on its own curve.
- Hover/tap: the day and both values. Screen readers get a table (weekly points).
- Footnote: "An estimate from when you last reviewed each card, not a test."

**The model** (`memoryCurve` in `src/lib/practice/memory-curve.ts`):
- Per card: stability `S = intervalDays` (min 1) for review cards — SM-2 sets the interval so the card comes due about when it's worth reviewing, which is FSRS's definition of S at 90%. Last review = `dueAt − intervalDays`. Cards just missed ("learning") get `S = 0.5` days from `updatedAt`.
- Curve: **FSRS 4.5 power law** `R(t,S) = (1 + (19/81)·t/S)^−0.5`. We first tried the exponential `0.9^(t/S)`; with real, long-overdue cards it gave single-digit percentages (e.g. 7%) because it never slows down. The power law matches the research: forgetting slows over time.
- Average over cards, day 0 to 30.

**Chart rules followed** (dataviz skill): one axis; 2px lines; legend + direct end labels (two series); dashed line as a second cue besides colour; colours validated for colour-blind separation and contrast in light and dark (`--coach-chart-kept`, `--coach-chart-stopped` in `globals.css`; dark orange stepped to `#e0703a` to pass the lightness band); text in ink colours, not series colours; crosshair tooltip; table view.

**Honesty limits:** S from an SM-2 interval is a stand-in, not a fitted FSRS stability; we don't model difficulty; "kept" assumes every review succeeds. Good enough to show the shape and the stakes; not a score.

---

## 4. Open ideas (ranked by value for effort)

1. **Use the curve elsewhere** — Progress (the long view) and Practice home; per topic ("Bits & Logic: 88%").
2. **Order due reviews by lowest R first**, not just due date, so the most-at-risk cards come first when a learner can't do them all.
3. **"Explain it" prompts** — a short free-text recall after a lesson (expressing / testing effect), checked against the lesson's key points.
4. **Interleaving** — mix topics in a review rather than one lesson's cards in a row (already shuffled within a deck; check across topics).
5. **Weekly review** (from PKM) — a Sunday screen: what you learned this week, your To revisit list, bookmarks to tidy, next week's due load.
6. **Move to FSRS** — store D/S per card, fit parameters to review history, let the learner pick desired retention (85 / 90 / 95%). Needs the database pass (see prelaunch notes). Keep Again/Good only, or add Hard with clear wording.
7. **Card quality** — keep cards small and unambiguous (SuperMemo's formulation rules); one fact per card; audit the bank.

## 5. References
- Ebbinghaus, H. (1885). *Memory: A Contribution to Experimental Psychology.*
- Murre, J. M. J., & Dros, J. (2015). Replication and analysis of Ebbinghaus' forgetting curve. *PLOS One.*
- Cepeda, N. J., et al. (2006). Distributed practice in verbal recall tasks: a review and quantitative synthesis. *Psychological Bulletin.*
- Cepeda, N. J., et al. (2008). Spacing effects in learning: a temporal ridgeline of optimal retention. *Psychological Science.*
- Karpicke, J. D., & Roediger, H. L. (2008). The critical importance of retrieval for learning. *Science.*
- Carpenter, S. K., Pan, S. C., & Butler, A. C. (2022). The science of effective learning with spacing and retrieval practice. *Nature Reviews Psychology.*
- Wozniak, P. — SuperMemo SM-2 algorithm and "20 rules of formulating knowledge".
- Open Spaced Repetition — FSRS algorithm documentation (github.com/open-spaced-repetition).
- nottut.com — *Personal Knowledge Management (PKM) Guide*.
