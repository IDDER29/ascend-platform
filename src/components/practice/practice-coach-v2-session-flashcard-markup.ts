/** Coach screen body (no mock chrome) — 14-session-flashcard-desktop.html */
export const PRACTICE_COACH_V2_SESSION_FLASHCARD_CSS = `.practice-coach-v2-session-flashcard{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-session-flashcard .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-session-flashcard a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-session-flashcard a[href]:active{transform:translateY(2px)}
.practice-coach-v2-session-flashcard a:focus-visible,
.practice-coach-v2-session-flashcard button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-session-flashcard .coach-path-grid,
  .practice-coach-v2-session-flashcard [style*="grid-template-columns: minmax(0, 1fr)"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-session-flashcard h1{font-size:36px !important}
}`;

export const PRACTICE_COACH_V2_SESSION_FLASHCARD_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<div style="width: 760px; display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; align-items: center; justify-content: space-between">
<div style="display: flex; align-items: center; gap: 10px">
<span style="padding: 5px 11px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 13px; font-weight: 600">Flashcard</span>
<span style="font-size: 14px; color: #5A5E66">Foundations · Bytes and hex</span>
</div>
<span style="font-size: 14px; color: #4A4E57">Answer in your head first, then be honest with yourself.</span>
</div>
<div style="position: relative; flex-grow: 1">
<div aria-hidden="true" style="position: absolute; left: 20px; right: 20px; top: 16px; bottom: -16px; border-radius: 26px; background: #E2DED3"></div>
<div style="position: relative; height: 100%; box-sizing: border-box; background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 26px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr))">
<div style="padding: 40px; display: flex; flex-direction: column; gap: 12px; border-right: 2px dashed #E2DED3">
<span style="font-family: var(--font-plex-mono), monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">Front</span>
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 72px; line-height: 1; letter-spacing: -0.02em">Byte</h1>
</div>
<div style="padding: 40px; display: flex; flex-direction: column; gap: 12px; background: #F9F8F4; border-radius: 0 24px 24px 0">
<span style="font-family: var(--font-plex-mono), monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #1F3BB8">Back</span>
<p style="margin: 0; font-size: 24px; line-height: 1.5">A group of 8 bits. It can represent 256 different values, from 0 to 255.</p>
</div>
</div>
</div>
</div>
<footer style="border-top: 2px solid #E2DED3; background: #FFFFFF; padding: 24px 48px; display: flex; justify-content: center">
<div style="width: 760px; display: flex; align-items: center; justify-content: space-between; gap: 24px">
<span id="grade-label" style="font-size: 16px; font-weight: 600">Did you know it?</span>
<div role="group" aria-labelledby="grade-label" style="display: flex; gap: 16px">
<a href="/practicev2/session/wrong" style="display: flex; align-items: center; justify-content: center; gap: 10px; height: 56px; width: 220px; border-radius: 16px; background: #FFFFFF; border: 2px solid #F4B596; box-shadow: 0 5px 0 #F4B596; color: #9A3412; font-weight: 700; font-size: 16px; text-decoration: none; margin-bottom: 5px">Missed it
<kbd style="width: 24px; height: 24px; box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #F4B596; border-bottom-width: 2px; border-radius: 6px; background: #FFF4EE; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500">1</kbd></a>
<a href="/practicev2/session/correct" style="display: flex; align-items: center; justify-content: center; gap: 10px; height: 56px; width: 220px; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-weight: 700; font-size: 16px; text-decoration: none; margin-bottom: 5px">Got it
<kbd style="width: 24px; height: 24px; box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #9DB43A; border-bottom-width: 2px; border-radius: 6px; background: #E8F7A6; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500">2</kbd></a>
</div>
</div>
</footer>
</div>`;
