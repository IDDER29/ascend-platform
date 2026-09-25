/** Coach screen body (no mock chrome) — 04-all-caught-up-desktop.html */
export const PRACTICE_COACH_V2_CAUGHT_UP_CSS = `.practice-coach-v2-caught-up{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-caught-up .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-caught-up a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-caught-up a[href]:active{transform:translateY(2px)}
.practice-coach-v2-caught-up a:focus-visible,
.practice-coach-v2-caught-up button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-caught-up .coach-path-grid,
  .practice-coach-v2-caught-up .coach-main [style*="display: grid"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-caught-up h1{font-size:36px !important}
  .practice-coach-v2-caught-up section[aria-labelledby="cu-title"]{
    align-items:flex-start !important;
    flex-direction:column !important;
    gap:24px !important;
    padding:28px 24px !important;
  }
  .practice-coach-v2-caught-up section[aria-labelledby="cu-title"] > span{
    border-radius:24px !important;
    height:88px !important;
    width:88px !important;
  }
  .practice-coach-v2-caught-up #cu-title{font-size:36px !important}
  .practice-coach-v2-caught-up section[aria-labelledby="cu-title"] button{
    height:auto !important;
    min-height:56px;
    padding:12px 20px !important;
  }
}`;

export const PRACTICE_COACH_V2_CAUGHT_UP_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<div style="display: flex; flex-direction: column; gap: 10px">
<span style="font-family: var(--font-plex-mono), monospace; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">Friday, Sep 25 · Practice</span>
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 52px; line-height: 1.02; letter-spacing: -0.03em">You're all caught up</h1>
<p style="margin: 0; font-size: 18px; line-height: 1.55; color: #4A4E57; max-width: 640px; text-wrap: pretty">Nothing is due. Waiting is part of the method: cards stick better when reviews are spaced out.</p>
</div>

<div style="display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 24px; align-items: stretch">
<section aria-labelledby="cu-title" style="background: #16181D; color: #F6F4EE; border-radius: 24px; padding: 36px 40px; display: flex; gap: 32px; align-items: center">
<span style="width: 120px; height: 120px; flex-shrink: 0; border-radius: 32px; background: #D7F26B; color: #16181D; display: flex; align-items: center; justify-content: center"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg></span>
<div style="flex-grow: 1; display: flex; flex-direction: column; gap: 14px">
<h2 id="cu-title" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 44px; line-height: 1">0 cards due</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.55; color: #D4D6DB">Next review <strong style="color: #F6F4EE; font-weight: 600">Sep 26, 12:23 PM</strong> · 6 cards</p>
<button type="button" style="align-self: flex-start; display: flex; align-items: center; gap: 10px; height: 56px; padding: 0 24px; border: 0; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-family: inherit; font-weight: 700; font-size: 16px; margin-top: 6px">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"></path></svg>Remind me when cards are due</button>
</div>
</section>

<section aria-labelledby="day-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 18px">
<h2 id="day-title" style="margin: 0; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">Your day</h2>
<div style="display: flex; align-items: center; gap: 14px">
<span style="width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; background: #FDE7DA; color: #C2410C; display: flex; align-items: center; justify-content: center"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 3 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.3-3.8 2.5-5 0 2 1 3 2 3.2C11 8.5 10.5 6 12 3z"></path></svg></span>
<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 26px; line-height: 1">1 day streak</span><span style="font-size: 14px; color: #4A4E57">Safe for today.</span></div>
</div>
<div style="height: 1px; background: #ECE9E0"></div>
<div style="display: flex; align-items: center; gap: 16px">
<svg width="84" height="84" viewBox="0 0 100 100" role="img" aria-label="Daily goal met: 36 of 20 cards" style="flex-shrink: 0"><circle cx="50" cy="50" r="42" fill="none" stroke="#2E4BDB" stroke-width="10"></circle><text x="50" y="52" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="28" fill="#16181D">36</text><text x="50" y="70" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" fill="#5A5E66">/20</text></svg>
<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 600">Daily goal met</span><span style="font-size: 14px; color: #4A4E57">16 bonus cards today.</span></div>
</div>
</section>
</div>

<section aria-labelledby="more-title" style="display: flex; flex-direction: column; gap: 16px">
<h2 id="more-title" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 26px">Still in the mood?</h2>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px">
<a href="/practicev2/session" style="display: flex; gap: 18px; align-items: flex-start; padding: 24px; border-radius: 18px; background: #FFFFFF; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; color: #16181D; text-decoration: none">
<span style="width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; background: #F0F8CF; color: #4D5E0E; display: flex; align-items: center; justify-content: center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 3L5 14h6l-1 7 8-11h-6z"></path></svg></span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 18px; font-weight: 600">Quick 5</span><span style="font-size: 14px; line-height: 1.5; color: #4A4E57">Five random cards from your bank. Won't change their schedule much.</span></span></a>
<a href="/practicev2/session" style="display: flex; gap: 18px; align-items: flex-start; padding: 24px; border-radius: 18px; background: #FFFFFF; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; color: #16181D; text-decoration: none">
<span style="width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; background: #FDE7DA; color: #C2410C; display: flex; align-items: center; justify-content: center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path></svg></span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 18px; font-weight: 600">Fix your misses</span><span style="font-size: 14px; line-height: 1.5; color: #4A4E57">2 cards from your last review, while they're fresh.</span></span></a>
<a href="/practicev2/foundations" style="display: flex; gap: 18px; align-items: flex-start; padding: 24px; border-radius: 18px; background: #FFFFFF; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; color: #16181D; text-decoration: none">
<span style="width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 22px">F</span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 18px; font-weight: 600">Learn something new</span><span style="font-size: 14px; line-height: 1.5; color: #4A4E57">Start Thinking from first principles — 4 new cards.</span></span></a>
</div>
</section>
</div>`;
