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

### 1.9 The math, checked (2026-10-30)
From a worked explanation the user shared, every number re-computed:

**Forgetting.** If the rate of forgetting is proportional to what's left, `dR/dt = −λR`, so `R(t) = e^(−λt)` — fast at first, then slower. (λ = 0.5/day gives 60.7%, 36.8%, 22.3%, 8.2%, 3.0% at days 1, 2, 3, 5, 7 — illustrative, not human data.)

**Stability.** Write it with S instead of λ: `R(t, S) = 0.9^(t/S)` — S is the days until recall falls to 90%. Bigger S stretches the curve sideways: `R(t, 2S) = R(t/2, S)`. The slope is `∂R/∂t = (ln 0.9 / S) · R`, so at the same recall, doubling S halves the speed of forgetting. One day after a review, recall is 90% / 94.9% / 97.4% / 98.7% / 99.3% for S = 1 / 2 / 4 / 8 / 16 days.

**What a review does.** Two things: the clock restarts (`t − t_i`) and S grows. Between reviews: `R_i(t) = 0.9^((t − t_i)/S_i)`. If each review is done at 90% and doubles S (`S_i = 2^i`), reviews fall on `t_{i+1} = t_i + S_i`, i.e. days 1, 3, 7, 15, 31 (`t_i = 2^i − 1`). Without reviews, recall would be 90%, 72.9%, 47.8%, 20.6%, 3.8% on those days; with them, it's 90% each time. Desmos version (one memory):
```
y = 100(0.9)^x            {0 ≤ x ≤ 31}   no reviews
y = 100(0.9)^((x−1)/2)    {1 ≤ x ≤ 3}
y = 100(0.9)^((x−3)/4)    {3 ≤ x ≤ 7}
y = 100(0.9)^((x−7)/8)    {7 ≤ x ≤ 15}
y = 100(0.9)^((x−15)/16)  {15 ≤ x ≤ 31}
```
Each piece starts at 100% and ends at exactly 90% where the next begins.

**When to review.** For a target recall r: `t = S · ln r / ln 0.9`. With S = 16: 95% → 7.8 days, 90% → 16, 80% → 33.9. Higher target, more reviews.

**Real schedulers.** FSRS 6: `R = (1 + F·t/S)^(−d)`, `F = 0.9^(−1/d) − 1` (still 90% at t = S); `d` sets the shape. With d = 0.5, F = 19/81 — exactly the curve our dashboard uses. And the update `S_new = f(S, D, R, result)` depends on difficulty, current stability and how long you waited — not a fixed ×2.

**Where we agree and where we'd add:**
- Agree with all of it as a teaching model; the two parts — *predict forgetting* and *update stability* — are the right way to think about any scheduler.
- **Doubling is only an example.** Ascend's SM-2 multiplies the interval by the card's ease (2.5, +0.1 per "good"): always answering right, reviews fall on days 1, 4, 12, 34, 98, 290 — faster growth than doubling. Answering wrong drops ease and restarts the card.
- **"A review restores 100%" is an idealisation.** Right after a review recall is high but not certain, and a failed review doesn't restore anything.
- **Why the deck curve is a power law even if each card were exponential.** Average many exponentials with different S and the result drops faster early and flatter late than any single one: for S = 1, 3, 8, 22, 64, the average is 96.9%, 82.6%, 57.7%, 37.2% at days 1, 7, 30, 90, versus 98.7%, 91.2%, 67.4%, 30.6% for one card with S = 8. That's one reason forgetting data across many items fits power laws — and why the dashboard's *whole-deck* curve uses the FSRS power law, while a *single card* is easiest to explain with the exponential sawtooth above.

---

## 2. How Ascend works today

| Research idea | Ascend now | Where |
|---|---|---|
| Understand first | Lessons with diagrams, knowledge checks, assignments | `content/curriculum`, lesson page |
| Recall before revealing | Practice: choices (shuffled each showing), short answer, fill in the blank (typed in place), flashcards (answer in your head first) — see §3c | `src/components/practice/practice-coach-v2-session-live.tsx` |
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
- **Fix (2026-10-30):** the first version started "Reviewing when due" at 100% today while the sentence said 35% — it silently assumed today's due reviews were done. Now both lines start at the real recall ("Now 35%"), the solid line jumps up at today to show what doing today's reviews gives, and the sentence says it: "about 35% now — about 100% once you've done today's reviews". The wobble in the solid line is real: it's the average of many sawtooths.

**The model** (`memoryCurve` in `src/lib/practice/memory-curve.ts`):
- Per card: stability `S = intervalDays` (min 1) for review cards — SM-2 sets the interval so the card comes due about when it's worth reviewing, which is FSRS's definition of S at 90%. Last review = `dueAt − intervalDays`. Cards just missed ("learning") get `S = 0.5` days from `updatedAt`.
- Curve: **FSRS 4.5 power law** `R(t,S) = (1 + (19/81)·t/S)^−0.5`. We first tried the exponential `0.9^(t/S)`; with real, long-overdue cards it gave single-digit percentages (e.g. 7%) because it never slows down. The power law matches the research: forgetting slows over time.
- Average over cards, day 0 to 30.

**Chart rules followed** (dataviz skill): one axis; 2px lines; legend + direct end labels (two series); dashed line as a second cue besides colour; colours validated for colour-blind separation and contrast in light and dark (`--coach-chart-kept`, `--coach-chart-stopped` in `globals.css`; dark orange stepped to `#e0703a` to pass the lightness band); text in ink colours, not series colours; crosshair tooltip; table view.

**Honesty limits:** S from an SM-2 interval is a stand-in, not a fitted FSRS stability; we don't model difficulty; "kept" assumes every review succeeds. Good enough to show the shape and the stakes; not a score.

---

**Redesign (2026-10-30), at the user's request — the deck chart reads like a card's page:**
- **The past is real:** every reviewed card's sawtooth is rebuilt from Practice history (as on the card page) and averaged — solid line, from at least two weeks back and always back to the last review (up to 60 days), with "Last review <date>" marked on the curve where the deck actually rose to.
- **Today:** "Now N%" on the curve, and a verdict above the chart — **"Review today"** when any card is below 90% ("N have dropped below 90%; reviewing today brings you back to about M%"), or **"No review needed today"** with when the next card comes due.
- **Two futures** from today: *If you review today* (blue dashed, jumping up at today, then reviewed when due) and *If you skip* (orange dashed).
- Model: `src/lib/practice/deck-memory.ts` (tested); the future is `memoryCurve` run on the replayed cards, so past and future meet at today.

## 3b. Decision: "Right, but shaky" (2026-10-30)
**Why (the user):** some cards you answer fast and easily; others you get right but only after a struggle. Those are a set worth reviewing on their own.
**Research link:** FSRS/Anki's *Hard* is exactly this — a success with effort, which should grow stability less than an easy recall (§1.5). Response time is a common signal of retrieval effort.
**What we record:** each answer's time (ms) in the session record (`timesMs`): to answer for choices / typed / cloze, **to reveal** for flashcards (the recall itself, not the self-grade). Stored in the browser; the account copy doesn't carry it yet (database pass), and merging keeps the browser's times.
**Rule** (`src/lib/practice/shaky.ts`, tested): a card is shaky when its latest review was right and either
- **slow** — over max(floor, 1.75 × your median right-answer time for that kind of card); floors: choices 10 s, flashcards 8 s, cloze 15 s, short answer 20 s; your median needs ≥ 5 answers of that kind; answers over 3 min are ignored (away); or
- **just recovered** — missed in one of the two reviews before.
A later quick right answer clears it. Misses aren't shaky — they're misses.
**Where:** "Right, but shaky" in Ways to review (right after Fix your misses) — a review of those cards; each card's page lists answer times.
**Next (not done):** grade slow-but-right as SM-2 "hard" (smaller interval, ease −0.15), so the schedule itself reflects the struggle — the user's call.

## 3c. Decision: the session's answer moment (2026-10-30)
**Why (audit of the session, with the user):** the moment after answering is where the testing effect pays off (§1.3), and a few things blunted it or graded unfairly.
- **Choices are shuffled every time a card is shown** (`shuffledOrder` in `src/lib/practice/session-view.ts`). With a fixed order, after a few reviews learners recall *"it's number 2"* instead of the idea — a cue the real world never gives. The stored `correct` index is unchanged; only the display order moves.
- **The result shows on the card.** After checking, the right choice turns green and a wrong pick orange (others fade); a blank is typed *inside* the sentence or code line. The answer appears once, in the feedback bar, in mono only when it is code.
- **"I was right" on a missed short answer / blank.** Exact matching (after trimming, case and a trailing `;`) refuses typos and other wordings ("0/1" vs "0 or 1"); a wrong *Again* on a card you knew resets its interval and wastes reviews. One press turns that answer into *Good*, honestly self-reported as with flashcards. It only changes the answer just given, before Continue; the bar then says "Counted as right". Risk: learners can wave through real misses — the same trust flashcards already rely on.
- **After a right typed answer that differs from the official wording**, the bar shows it ("Exact wording: 2"), so the precise term sticks.
- **Flashcards don't get a feedback bar.** The learner has just seen the back and graded themselves; "Not quite — the answer is …" repeated it and judged an honest "Not yet". Grading moves straight on (the progress bar still records it). Buttons read "Not yet" / "Knew it".

## 3d. Decision: honest multiple choice (2026-10-30)
**Why:** a measurement of the bank found the right option was the single longest in **56%** of the 99 multiple-choice cards (chance ≈ 25%), and in 39 it was more than 1.2× every wrong option. "Pick the longest" won more than half the time, so a recognition score said little about memory — and every lucky win pushed a card days away (SM-2 *Good*).
- **Wrong options rewritten** as real misconceptions, as long and specific as the right answer. A test (`src/lib/practice/bank-quality.test.ts`) now fails if any card's right option is over 1.2× the longest wrong one, or if "pick the longest" wins in more than 35% of cards across the bank.
- **"I don't know"** on choices, short answers and blanks (key **D** for choices): the answer is shown on the card (right choice lit, or the field filled in, dashed) and the card is graded *Again* — no guess, no false *Good*. The bar reads "Here's the answer", without "I was right". Skip still exists for "not now" (no grade, the card stays due).

## 3e. Decision: produce, don't recognise — two card types for code (2026-10-30)
**Why:** the C topic leaned on multiple choice (39 of 86 cards), and "what does this print?" was asked as pick-one-of-four — recognition, where the real skill (and the stronger memory, §1.3) is producing the answer by tracing the code.
- **Predict the output** (`kind: "output"`): code, then type exactly what it prints into a terminal box (Shift+Enter for new lines). Matched exactly, ignoring only trailing whitespace and line endings (`outputMatches`). "I was right" covers formatting slips. 10 cards converted from "what does this print"; every `output` was produced by compiling and running the snippet with gcc. Questions about *meaning* (undefined behaviour, where output goes) stay multiple choice.
- **Spot the bug** (`kind: "bug"`): click (or press the line number of) the one faulty line; the bar always explains the fix ("Line 4: …"). 11 new cards across C and Systems — every bug confirmed by a gcc warning, AddressSanitizer or running it. Context labels describe what the code does ("Moving a point"), never the bug.

## 3f. Decision: sequences and bits you build yourself (2026-10-30)
**Why:** half of systems knowledge is *order* (fork before exec, pipe before fork, trap before kernel mode), and Foundations is about *bit patterns* — neither had a card type that made the learner produce them.
- **Put in order** (`kind: "order"`): 3–7 steps arrive scrambled (never already right); pick a step (click or its number) and move it with the arrows (buttons or ↑/↓). After Check each step is marked right, or "belongs at n". 6 cards: the instruction cycle, a call and its return, a heap block's life, how a shell runs a command, wiring a pipe, inside a write() call. Steps that happen at the same time in different processes are avoided, so there is one right order.
- **Flip the bits** (`kind: "bits"`): switch bits on and off to make a value (place values shown: 8 4 2 1), or fill a gate's output column (cells start as "?"). After Check every cell shows the right value, green where you had it, orange where not. 7 cards: 65 / 'A', 13, the largest 4-bit number, hex C, OR, XOR, the half adder. A test checks each truth-table answer against the gate itself.

## 3g. Decision: a picture after a miss (2026-10-31)
**Why:** a miss is the moment a learner is most open to the explanation (§1.3, feedback); words alone ("add the place values…") often don't land, and the bank already holds diagrams that show the answer.
**How:** after a miss or "I don't know" on any non-flashcard card, a "Picture it" box appears under the card with the diagram that explains it — scrolled into view above the bar, never on a right answer. The diagram comes from the card's `figureFrom` (a flashcard id), or else from a diagram flashcard on the same `conceptId` (`buildMissFigures`). 76 cards have one (some by concept, the rest named with `figureFrom`). A test fails if a `figureFrom` names a card without a diagram.

## 3h. Decision: fresh numbers, and a bug in every course (2026-11-01)
**Problem.** A card with fixed numbers can be passed by remembering its answer ("1011 0110 is 182") rather than by converting. Spaced repetition then strengthens the memory of one answer, not the skill, which is exactly what the curriculum blueprint (`docs/curriculum/sugestion/01_foundations_overview.md`, section 3) warns against: "avoid using the exact same answer-bearing numerical examples repeatedly", and test with unseen transfer items.

**Decision.** Fresh-number cards (`src/lib/practice/generated.ts`): binary to decimal, decimal to binary, hex to binary, two's complement, 8-bit wraparound, and a tiny CPU trace. Each keeps one card id, so SM-2 schedules it as usual, but its numbers come from a seed (the card's reps plus lapses), so every review is a problem the learner hasn't seen. The answer is computed, never stored; the CPU trace's output comes from the simulator itself. Consecutive reviews always differ (tested).

Also from the blueprint: every Foundations course with lessons has at least one Spot-the-bug card (finding the first wrong step is a separate skill from tracing a correct one), enforced by `bank-quality.test.ts`.

**Open.** Grading a fresh card still updates one schedule, so its interval reflects the skill across many problems, which is what we want; whether lapses on generated cards should count toward "shaky" the same way is untested.

## 4. Open ideas (ranked by value for effort)

1. **Use the curve elsewhere** — Progress (the long view) and Practice home; per topic ("Bits & Logic: 88%").
1b. ~~Show one card's sawtooth~~ — **done (2026-10-30)**: `/practice/cards/<id>` (linked from the card bank, To revisit, and the dashboard curve). Rebuilt from Practice history by replaying the same SM-2 grades: each review restarts the clock; a right answer sets S to the new interval, a miss to half a day. Solid up to today, dashed prediction after, dotted "never reviewed again", a 90% "time to review" line, the next review marked. Answer hidden behind "Try to recall it" (testing effect). Model: `src/lib/practice/card-memory.ts` (tested).
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
