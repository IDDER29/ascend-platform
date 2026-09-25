/** Coach screen body (no mock chrome) — 20-review-complete-desktop.html */
export const PRACTICE_COACH_V2_COMPLETE_CSS = `.practice-coach-v2-complete{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-complete .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-complete a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-complete a[href]:active{transform:translateY(2px)}
.practice-coach-v2-complete a:focus-visible,
.practice-coach-v2-complete button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-complete .coach-path-grid,
  .practice-coach-v2-complete [style*="grid-template-columns: minmax(0, 1fr)"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-complete h1{font-size:36px !important}
}`;

export const PRACTICE_COACH_V2_COMPLETE_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<div style="width: 1100px; display: grid; grid-template-columns: minmax(0, 1fr) 460px; gap: 48px; align-items: start">

<div style="display: flex; flex-direction: column; gap: 28px">
<div style="display: flex; align-items: center; gap: 24px">
<div aria-hidden="true" style="position: relative; width: 112px; height: 112px; flex-shrink: 0">
<div style="position: absolute; inset: 0; border-radius: 32px; background: #2E4BDB; transform: rotate(-8deg)"></div>
<div style="position: absolute; inset: 0; border-radius: 32px; background: #16181D; display: flex; align-items: center; justify-content: center; color: #D7F26B"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"></path></svg></div>
</div>
<div style="display: flex; flex-direction: column; gap: 8px">
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 52px; line-height: 1; letter-spacing: -0.03em">Review complete</h1>
<p style="margin: 0; font-size: 18px; color: #4A4E57">6 of 8 right. The 2 you missed are already scheduled to come back.</p>
</div>
</div>

<div style="display: flex; flex-direction: column; gap: 10px">
<div aria-label="Results by card: 6 correct, 2 missed" style="display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px">
<span title="Card 1 · correct" style="height: 14px; border-radius: 999px; background: #2E4BDB"></span>
<span title="Card 2 · correct" style="height: 14px; border-radius: 999px; background: #2E4BDB"></span>
<span title="Card 3 · correct" style="height: 14px; border-radius: 999px; background: #2E4BDB"></span>
<span title="Card 4 · missed" style="height: 14px; border-radius: 999px; background: #D9622B"></span>
<span title="Card 5 · correct" style="height: 14px; border-radius: 999px; background: #2E4BDB"></span>
<span title="Card 6 · correct" style="height: 14px; border-radius: 999px; background: #2E4BDB"></span>
<span title="Card 7 · missed" style="height: 14px; border-radius: 999px; background: #D9622B"></span>
<span title="Card 8 · correct" style="height: 14px; border-radius: 999px; background: #2E4BDB"></span>
</div>
<div style="display: flex; gap: 16px; font-size: 13px; color: #4A4E57">
<span style="display: flex; align-items: center; gap: 6px"><span style="width: 14px; height: 8px; border-radius: 999px; background: #2E4BDB"></span>Correct</span>
<span style="display: flex; align-items: center; gap: 6px"><span style="width: 14px; height: 8px; border-radius: 999px; background: #D9622B"></span>Missed</span>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px">
<div style="display: flex; flex-direction: column; gap: 4px; padding: 20px; border-radius: 18px; background: #FFFFFF; border: 2px solid #E2DED3"><span style="font-size: 13px; color: #4A4E57">Accuracy</span><span style="font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 36px; line-height: 1.1">75%</span><span style="font-size: 13px; color: #4A4E57">Last time 63%</span></div>
<div style="display: flex; flex-direction: column; gap: 4px; padding: 20px; border-radius: 18px; background: #FFFFFF; border: 2px solid #E2DED3"><span style="font-size: 13px; color: #4A4E57">Daily goal</span><span style="font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 36px; line-height: 1.1">36<span style="font-size: 18px; color: #5A5E66">/20</span></span><span style="font-size: 13px; color: #4A4E57">Goal met</span></div>
<div style="display: flex; flex-direction: column; gap: 4px; padding: 20px; border-radius: 18px; background: #FDE7DA; border: 2px solid #F4B596"><span style="font-size: 13px; color: #7C2D12">Streak</span><span style="font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 36px; line-height: 1.1; color: #7C2D12">1 day</span><span style="font-size: 13px; color: #7C2D12">Safe for today</span></div>
</div>

<section aria-labelledby="moved-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 14px">
<h2 id="moved-title" style="margin: 0; font-size: 17px; font-weight: 600">Card strength after this review</h2>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; font-size: 15px">
<div style="display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 12px; background: #F3F5FF">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F3BB8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>
<span><strong style="font-weight: 600">6 cards</strong> moved up</span>
</div>
<div style="display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 12px; background: #FFF4EE">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A3412" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path></svg>
<span><strong style="font-weight: 600">2 cards</strong> back to Learning</span>
</div>
</div>
</section>
</div>

<aside style="display: flex; flex-direction: column; gap: 20px">
<section aria-labelledby="missed-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 4px">
<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px">
<h2 id="missed-title" style="margin: 0; font-size: 18px; font-weight: 600">Coming back</h2>
<span style="font-size: 13px; color: #5A5E66">2 cards</span>
</div>
<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 0; border-top: 1px solid #ECE9E0">
<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: var(--font-plex-mono), monospace; font-size: 16px">1 AND 0 = ?</span><span style="font-size: 13px; color: #4A4E57">You said 1 · Answer: 0 · Boolean logic</span></div>
<span style="padding: 3px 9px; border-radius: 999px; background: #FDE7DA; color: #9A3412; font-size: 12px; font-weight: 600">Missed</span>
</div>
<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 0; border-top: 1px solid #ECE9E0">
<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: var(--font-plex-mono), monospace; font-size: 16px">1 XOR 1 = ?</span><span style="font-size: 13px; color: #4A4E57">You said 1 · Answer: 0 · Logic gates</span></div>
<span style="padding: 3px 9px; border-radius: 999px; background: #FDE7DA; color: #9A3412; font-size: 12px; font-weight: 600">Missed</span>
</div>
</section>

<div style="display: flex; flex-direction: column; gap: 12px">
<a href="/practicev2/session/wrong" style="display: flex; align-items: center; justify-content: center; gap: 12px; height: 60px; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; margin-bottom: 5px">Fix 2 misses now
<kbd style="height: 24px; box-sizing: border-box; padding: 0 7px; display: inline-flex; align-items: center; border: 1px solid #9DB43A; border-bottom-width: 2px; border-radius: 6px; background: #E8F7A6; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none">Enter</kbd></a>
<a href="/practicev2/caught-up" style="display: flex; align-items: center; justify-content: center; height: 52px; border-radius: 14px; border: 2px solid #D5D0C3; color: #16181D; font-weight: 600; font-size: 15px; text-decoration: none">Back to practice</a>
</div>
</aside>

</div>
</div>`;
