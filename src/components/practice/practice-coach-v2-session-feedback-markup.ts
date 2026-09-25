/** Coach screen body (no mock chrome) — 15-session-answer-feedback.html */
export const PRACTICE_COACH_V2_SESSION_FEEDBACK_CSS = `.practice-coach-v2-session-feedback{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-session-feedback .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-session-feedback a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-session-feedback a[href]:active{transform:translateY(2px)}
.practice-coach-v2-session-feedback a:focus-visible,
.practice-coach-v2-session-feedback button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-session-feedback .coach-path-grid,
  .practice-coach-v2-session-feedback [style*="grid-template-columns: minmax(0, 1fr)"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-session-feedback h1{font-size:36px !important}
}`;

export const PRACTICE_COACH_V2_SESSION_FEEDBACK_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<div style="display: flex; align-items: center; gap: 8px">
<span style="padding: 4px 10px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Cloze</span>
<span style="font-size: 13px; color: #5A5E66">Foundations · What is a bit?</span>
</div>
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 28px; line-height: 1.25">Fill in the blank</h1>
<div style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 18px">
<p style="margin: 0; font-size: 20px; line-height: 1.5">A single bit can hold one of <strong style="font-weight: 700; color: #1F3BB8">two</strong> values: 0 or 1.</p>
<label style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: #4A4E57">Your answer
<input type="text" value="two" readonly="" style="height: 52px; box-sizing: border-box; padding: 0 16px; border-radius: 12px; border: 2px solid #2E4BDB; background: #F3F5FF; font-family: inherit; font-size: 18px; font-weight: 600; color: #16181D"></label>
</div>
<section aria-live="polite" aria-labelledby="fb-title" style="background: #EAF5BE; border-top: 2px solid #C5DD62; padding: 22px 20px 28px; display: flex; flex-direction: column; gap: 16px">
<div style="display: flex; align-items: center; gap: 12px">
<span style="width: 40px; height: 40px; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg></span>
<div style="display: flex; flex-direction: column"><h2 id="fb-title" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 22px">Correct</h2><span style="font-size: 13px; color: #3D4A0B">3 in a row</span></div>
</div>
<p style="margin: 0; font-size: 15px; line-height: 1.5; color: #2A330A">A bit is one binary digit, so it has exactly two states. Eight bits make a byte.</p>
<a href="/practicev2/session/wrong" style="display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 16px; background: #16181D; box-shadow: 0 5px 0 #000000; color: #F6F4EE; font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; margin-bottom: 5px">Continue</a>
</section>
</div>`;
