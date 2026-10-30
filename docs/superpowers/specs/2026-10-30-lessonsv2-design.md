# Lesson page v2

**Goal:** a lesson is where something gets understood and then kept. The page should help you read it, check yourself honestly, and hand it to Practice so it sticks — then send you on.

**User stories**
- I know where I am: path › topic, "Lesson 1 of 6", minutes, done or not; I can save it.
- I see what I'll be able to do, and what to skim first.
- I read the lesson (unchanged MDX content, Coach colours in light and dark).
- I check myself: answer in my head, reveal, then say honestly "Got it" / "Not yet". Not yet → re-read the section that covers it, or save it as "Didn't get it" (Bookmarks; it then shows on the dashboard's Ways to review).
- I lock it in: how many Practice cards the lesson has, how well I remember them, Review its cards (or: mark it done and they join your reviews).
- I do the assignment, read why it matters, mark it done (counts toward today's goal and the streak) and go to the next lesson, the topic's finish line, or the capstone.

**Decisions**
- Built at `/lessonsv2/<publicSlug>`; lesson links inside v2 stay on v2; `/lessons/…` unchanged until promoted.
- Removed from v1: "CONCEPT 01", the purple-tinted knowledge check and its "Comfortable with all three?" (it didn't match the question count), the fake "Add a note", the gradient banners, the lesson-map drawer (breadcrumb + path page instead).
- Kept: MDX body and components, Study these first, outcomes, resources rail with save buttons, on-this-page rail, contribute links and feedback.
- `.lesson-v2-body` in `globals.css` overrides the MDX components' hard-coded paragraph/code colours.
- Self-ratings are not stored (they'd need the database); "Not yet" + save is how a miss persists.

## Finishing pass (2026-10-30)
- **In <topic>:** the topic's lessons in order (✓ done, this one marked, "N of M done", See the whole path) — in the rail on wide screens, at the end below that. Replaces v1's lesson-map drawer.
- **Previous lesson** link under the finish card.
- **Below the rail breakpoint** (phones, tablets): the topic's lessons and "Go deeper" resources come after the finish card instead of disappearing.
- **Check yourself remembers** your reveals and ratings in this browser (`ascend:check-yourself:<lesson>`), with "Try them again".
- **On this page** highlights the last section whose heading has passed the top (v1's rail lit up a large early section for too long).
- Finish card stacks below `lg` so tablet widths don't squeeze it.
