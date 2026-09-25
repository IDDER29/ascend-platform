/** Coach screen body (no mock chrome) — 11-session-desktop.html */
export const PRACTICE_COACH_V2_SESSION_CSS = `.practice-coach-v2-session{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-session .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-session a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-session a[href]:active{transform:translateY(2px)}
.practice-coach-v2-session a:focus-visible,
.practice-coach-v2-session button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-session .coach-path-grid,
  .practice-coach-v2-session [style*="grid-template-columns: minmax(0, 1fr)"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-session h1{font-size:36px !important}
}`;

export const PRACTICE_COACH_V2_SESSION_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<div style="width: 760px; display: flex; flex-direction: column; gap: 28px">
<div style="display: flex; align-items: center; gap: 10px">
<span style="padding: 5px 11px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 13px; font-weight: 600">Choices</span>
<span style="font-size: 14px; color: #5A5E66">Foundations</span>
</div>
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 40px; line-height: 1.2; letter-spacing: -0.01em; text-wrap: pretty">Which logic gate outputs 1 only when both inputs are 1?</h1>
<div role="group" aria-label="Answer choices" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
<button type="button" aria-pressed="true" style="display: flex; align-items: center; gap: 16px; height: 76px; padding: 0 20px; border-radius: 16px; border: 2px solid #2E4BDB; box-shadow: 0 4px 0 #2E4BDB; background: #F3F5FF; font-family: var(--font-plex-mono), monospace; font-size: 20px; color: #16181D; text-align: left"><kbd style="width: 32px; height: 32px; border-radius: 8px; background: #2E4BDB; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-family: var(--font-plex-mono), monospace; font-size: 14px">1</kbd>AND</button>
<button type="button" aria-pressed="false" style="display: flex; align-items: center; gap: 16px; height: 76px; padding: 0 20px; border-radius: 16px; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; background: #FFFFFF; font-family: var(--font-plex-mono), monospace; font-size: 20px; color: #16181D; text-align: left"><kbd style="width: 32px; height: 32px; box-sizing: border-box; border-radius: 8px; border: 2px solid #D5D0C3; display: flex; align-items: center; justify-content: center; font-family: var(--font-plex-mono), monospace; font-size: 14px; color: #5A5E66">2</kbd>OR</button>
<button type="button" aria-pressed="false" style="display: flex; align-items: center; gap: 16px; height: 76px; padding: 0 20px; border-radius: 16px; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; background: #FFFFFF; font-family: var(--font-plex-mono), monospace; font-size: 20px; color: #16181D; text-align: left"><kbd style="width: 32px; height: 32px; box-sizing: border-box; border-radius: 8px; border: 2px solid #D5D0C3; display: flex; align-items: center; justify-content: center; font-family: var(--font-plex-mono), monospace; font-size: 14px; color: #5A5E66">3</kbd>XOR</button>
<button type="button" aria-pressed="false" style="display: flex; align-items: center; gap: 16px; height: 76px; padding: 0 20px; border-radius: 16px; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; background: #FFFFFF; font-family: var(--font-plex-mono), monospace; font-size: 20px; color: #16181D; text-align: left"><kbd style="width: 32px; height: 32px; box-sizing: border-box; border-radius: 8px; border: 2px solid #D5D0C3; display: flex; align-items: center; justify-content: center; font-family: var(--font-plex-mono), monospace; font-size: 14px; color: #5A5E66">4</kbd>NOT</button>
</div>
</div>
<footer style="border-top: 2px solid #E2DED3; background: #FFFFFF; padding: 24px 48px; display: flex; justify-content: center">
<div style="width: 760px; display: flex; align-items: center; justify-content: space-between; gap: 24px">
<a href="/practicev2/session/correct" style="display: flex; align-items: center; gap: 10px; height: 56px; padding: 0 22px; border-radius: 16px; border: 2px solid #D5D0C3; color: #4A4E57; font-weight: 600; font-size: 16px; text-decoration: none">Skip
<kbd style="min-width: 24px; height: 24px; box-sizing: border-box; padding: 0 6px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #D5D0C3; border-bottom-width: 2px; border-radius: 6px; background: #F6F4EE; font-family: var(--font-plex-mono), monospace; font-size: 12px">S</kbd></a>
<span style="font-size: 13px; color: #5A5E66">Press 1–4 to choose</span>
<a href="/practicev2/session/correct" style="display: flex; align-items: center; justify-content: center; gap: 12px; height: 56px; width: 240px; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; margin-bottom: 5px">Check
<kbd style="height: 24px; box-sizing: border-box; padding: 0 7px; display: inline-flex; align-items: center; border: 1px solid #9DB43A; border-bottom-width: 2px; border-radius: 6px; background: #E8F7A6; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none; color: #16181D">Enter</kbd></a>
</div>
</footer>
</div>`;
