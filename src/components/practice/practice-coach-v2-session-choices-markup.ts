/** Coach screen body (no mock chrome) — 12-session-multiple-choice.html */
export const PRACTICE_COACH_V2_SESSION_CHOICES_CSS = `.practice-coach-v2-session-choices{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-session-choices .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-session-choices a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-session-choices a[href]:active{transform:translateY(2px)}
.practice-coach-v2-session-choices a:focus-visible,
.practice-coach-v2-session-choices button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-session-choices .coach-path-grid,
  .practice-coach-v2-session-choices [style*="grid-template-columns: minmax(0, 1fr)"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-session-choices h1{font-size:36px !important}
}`;

export const PRACTICE_COACH_V2_SESSION_CHOICES_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<div style="display: flex; align-items: center; gap: 8px">
<span style="padding: 4px 10px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Choices</span>
<span style="font-size: 13px; color: #5A5E66">Foundations · What is a bit?</span>
</div>
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 28px; line-height: 1.25; text-wrap: pretty">How many different values can 3 bits represent?</h1>
<div role="group" aria-label="Answer choices" style="display: flex; flex-direction: column; gap: 12px">
<button type="button" aria-pressed="false" style="display: flex; align-items: center; gap: 14px; height: 60px; padding: 0 16px; border-radius: 14px; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; background: #FFFFFF; font-family: inherit; font-size: 18px; color: #16181D; text-align: left"><span style="width: 28px; height: 28px; border-radius: 8px; border: 2px solid #D5D0C3; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-family: var(--font-plex-mono), monospace; font-size: 13px; color: #5A5E66">1</span>3</button>
<button type="button" aria-pressed="false" style="display: flex; align-items: center; gap: 14px; height: 60px; padding: 0 16px; border-radius: 14px; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; background: #FFFFFF; font-family: inherit; font-size: 18px; color: #16181D; text-align: left"><span style="width: 28px; height: 28px; border-radius: 8px; border: 2px solid #D5D0C3; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-family: var(--font-plex-mono), monospace; font-size: 13px; color: #5A5E66">2</span>6</button>
<button type="button" aria-pressed="true" style="display: flex; align-items: center; gap: 14px; height: 60px; padding: 0 16px; border-radius: 14px; border: 2px solid #2E4BDB; box-shadow: 0 4px 0 #2E4BDB; background: #F3F5FF; font-family: inherit; font-size: 18px; font-weight: 600; color: #16181D; text-align: left"><span style="width: 28px; height: 28px; border-radius: 8px; background: #2E4BDB; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-family: var(--font-plex-mono), monospace; font-size: 13px">3</span>8</button>
<button type="button" aria-pressed="false" style="display: flex; align-items: center; gap: 14px; height: 60px; padding: 0 16px; border-radius: 14px; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; background: #FFFFFF; font-family: inherit; font-size: 18px; color: #16181D; text-align: left"><span style="width: 28px; height: 28px; border-radius: 8px; border: 2px solid #D5D0C3; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-family: var(--font-plex-mono), monospace; font-size: 13px; color: #5A5E66">4</span>9</button>
</div>
<footer style="border-top: 2px solid #E2DED3; padding: 18px 20px 28px; display: flex; gap: 12px; align-items: center">
<a href="/practicev2/session/flashcard" style="display: flex; align-items: center; justify-content: center; height: 56px; padding: 0 18px; border-radius: 16px; border: 2px solid #D5D0C3; color: #4A4E57; font-weight: 600; font-size: 15px; text-decoration: none">Skip</a>
<a href="/practicev2/session/correct" style="flex-grow: 1; display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; margin-bottom: 5px">Check</a>
</footer>
</div>`;
