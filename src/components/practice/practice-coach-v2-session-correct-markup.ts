/** Coach screen body (no mock chrome) — 16-session-correct-desktop.html */
export const PRACTICE_COACH_V2_SESSION_CORRECT_CSS = `.practice-coach-v2-session-correct{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-session-correct .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-session-correct a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-session-correct a[href]:active{transform:translateY(2px)}
.practice-coach-v2-session-correct a:focus-visible,
.practice-coach-v2-session-correct button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-session-correct .coach-path-grid,
  .practice-coach-v2-session-correct [style*="grid-template-columns: minmax(0, 1fr)"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-session-correct h1{font-size:36px !important}
}`;

export const PRACTICE_COACH_V2_SESSION_CORRECT_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<div style="width: 760px; display: flex; flex-direction: column; gap: 28px">
<div style="display: flex; align-items: center; gap: 10px">
<span style="padding: 5px 11px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 13px; font-weight: 600">Cloze</span>
<span style="font-size: 14px; color: #5A5E66">Foundations · What is a bit?</span>
</div>
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 40px; line-height: 1.2; letter-spacing: -0.01em">Fill in the blank</h1>
<div style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 32px; display: flex; flex-direction: column; gap: 22px">
<p style="margin: 0; font-size: 24px; line-height: 1.5">A single bit can hold one of <strong style="font-weight: 700; color: #1F3BB8">two</strong> values: 0 or 1.</p>
<label style="display: flex; flex-direction: column; gap: 8px; font-size: 14px; color: #4A4E57">Your answer
<input type="text" value="two" readonly="" style="height: 56px; box-sizing: border-box; padding: 0 18px; border-radius: 12px; border: 2px solid #2E4BDB; background: #F3F5FF; font-family: inherit; font-size: 20px; font-weight: 600; color: #16181D"></label>
</div>
</div>
<section aria-live="polite" aria-labelledby="fb-title" style="background: #EAF5BE; border-top: 2px solid #C5DD62; padding: 28px 48px 32px; display: flex; justify-content: center">
<div style="width: 760px; display: flex; align-items: center; justify-content: space-between; gap: 32px">
<div style="display: flex; gap: 16px; align-items: flex-start">
<span style="width: 48px; height: 48px; flex-shrink: 0; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg></span>
<div style="display: flex; flex-direction: column; gap: 6px">
<h2 id="fb-title" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 26px">Correct</h2>
<p style="margin: 0; font-size: 15px; line-height: 1.5; color: #2A330A; max-width: 460px">A bit is one binary digit, so it has exactly two states. Eight bits make a byte.</p>
</div>
</div>
<a href="/practicev2/session/flashcard" style="display: flex; align-items: center; justify-content: center; gap: 12px; height: 56px; width: 220px; flex-shrink: 0; border-radius: 16px; background: #16181D; box-shadow: 0 5px 0 #000000; color: #F6F4EE; font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; margin-bottom: 5px">Continue
<kbd style="height: 24px; box-sizing: border-box; padding: 0 7px; display: inline-flex; align-items: center; border: 1px solid #4A4E57; border-bottom-width: 2px; border-radius: 6px; background: #2C2F36; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none; color: #F6F4EE">Enter</kbd></a>
</div>
</section>
</div>`;
