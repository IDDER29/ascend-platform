/** Coach Foundations path body (no mock chrome) from Ascend Practice.html */
export const PRACTICE_COACH_V2_FOUNDATIONS_CSS = `
.practice-coach-v2-foundations{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-foundations .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-foundations .coach-path-grid{
  min-width:0;
  width:100%;
}
.practice-coach-v2-foundations .coach-path-grid > *{
  min-width:0;
}
.practice-coach-v2-foundations a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-foundations a[href]:active{transform:translateY(2px)}
.practice-coach-v2-foundations a:focus-visible,
.practice-coach-v2-foundations button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-foundations .coach-path-grid{
    grid-template-columns:1fr !important;
  }
  .practice-coach-v2-foundations .coach-path-hero{
    flex-direction:column !important;
    align-items:stretch !important;
  }
  .practice-coach-v2-foundations .coach-path-ctas{
    width:100%;
    flex-wrap:wrap;
  }
  .practice-coach-v2-foundations .coach-path-ctas > a{
    flex:1 1 auto;
    justify-content:center;
  }
  .practice-coach-v2-foundations .coach-path-summary,
  .practice-coach-v2-foundations .coach-lesson-copy{
    min-width:0;
  }
  .practice-coach-v2-foundations .coach-path-title > span{
    white-space:nowrap;
  }
  .practice-coach-v2-foundations .coach-path-title{
    flex-wrap:wrap;
  }
  .practice-coach-v2-foundations .coach-lesson-row{
    flex-wrap:wrap;
    gap:12px !important;
  }
  .practice-coach-v2-foundations .coach-lesson-copy{
    flex:1 1 calc(100% - 68px);
  }
  .practice-coach-v2-foundations .coach-lesson-title{
    flex-wrap:wrap;
  }
  .practice-coach-v2-foundations .coach-lesson-strength{
    flex:1 1 100%;
    width:100% !important;
    order:3;
  }
  .practice-coach-v2-foundations .coach-lesson-row > a{
    order:4;
    justify-content:center;
  }
}
@media (max-width:639px){
  .practice-coach-v2-foundations h1{font-size:36px !important}
  .practice-coach-v2-foundations .coach-path-summary{
    align-items:flex-start !important;
  }
  .practice-coach-v2-foundations .coach-path-summary > span{
    width:64px !important;
    height:64px !important;
    border-radius:18px !important;
    font-size:34px !important;
  }
}
`.trim();

export const PRACTICE_COACH_V2_FOUNDATIONS_HTML = `<div class="coach-main coach-path-page" style="padding: 0; display: flex; flex-direction: column; gap: 32px">

<nav aria-label="Breadcrumb" style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #5A5E66">
<a href="/practicev2" style="color: #4A4E57; text-decoration: none">Practice</a><span aria-hidden="true">/</span><span aria-current="page" style="color: #16181D; font-weight: 600">Foundations</span>
</nav>

<div class="coach-path-hero" style="display: flex; justify-content: space-between; align-items: flex-end; gap: 32px">
<div class="coach-path-summary" style="display: flex; gap: 24px; align-items: center">
<span style="width: 88px; height: 88px; flex-shrink: 0; border-radius: 24px; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 44px">F</span>
<div style="display: flex; flex-direction: column; gap: 8px">
<div class="coach-path-title" style="display: flex; align-items: center; gap: 12px"><h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 48px; line-height: 1; letter-spacing: -0.03em">Foundations</h1><span style="padding: 4px 10px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 13px; font-weight: 600">Always open</span></div>
<p style="margin: 0; font-size: 17px; color: #4A4E57">Bits, logic, and first principles — your always-open warm-up.</p>
<span style="font-family: var(--font-plex-mono), monospace; font-size: 13px; color: #5A5E66">3 branches · 6 lessons · 32 cards</span>
</div>
</div>
<div class="coach-path-ctas" style="display: flex; gap: 12px; flex-shrink: 0">
<a href="/practicev2/custom" style="display: flex; align-items: center; height: 56px; padding: 0 20px; border-radius: 16px; border: 2px solid #16181D; color: #16181D; font-weight: 600; font-size: 15px; text-decoration: none">Build a custom deck</a>
<a href="/practicev2/session" style="display: flex; align-items: center; justify-content: center; gap: 10px; height: 56px; padding: 0 24px; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-weight: 700; font-size: 16px; text-decoration: none">Review 8 due cards</a>
</div>
</div>

<div class="coach-path-grid" style="display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 24px; align-items: start">

<div style="display: flex; flex-direction: column; gap: 28px">

<section aria-labelledby="b1" style="display: flex; flex-direction: column; gap: 12px">
<div style="display: flex; justify-content: space-between; align-items: baseline">
<h2 id="b1" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 24px">Bits <span style="font-family: var(--font-hanken), system-ui, sans-serif; font-weight: 400; font-size: 14px; color: #5A5E66">· 3 lessons · 17 cards</span></h2>
<a href="/practicev2/session" style="display: flex; align-items: center; height: 44px; font-size: 14px; font-weight: 600; text-decoration: none">Practice this branch</a>
</div>

<div class="coach-lesson-row" style="display: flex; align-items: center; gap: 20px; padding: 18px 20px; border-radius: 16px; background: #FFFFFF; border: 2px solid #E2DED3">
<span style="width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">1</span>
<div class="coach-lesson-copy" style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 17px; font-weight: 600">What is a bit?</span><span style="font-size: 13px; color: #4A4E57">6 cards · 1 due now</span></div>
<div class="coach-lesson-strength" role="img" aria-label="Learning 1, Solid 3, Mastered 2" style="width: 180px; display: flex; gap: 2px; height: 10px"><span style="flex: 1 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 3 1 0; background: #3F5BDE"></span><span style="flex: 2 1 0; border-radius: 0 4px 4px 0; background: #1A2F96"></span></div>
<a href="/practicev2/session" style="display: flex; align-items: center; height: 44px; padding: 0 16px; border-radius: 12px; border: 2px solid #D5D0C3; color: #16181D; font-size: 14px; font-weight: 600; text-decoration: none">Practice</a>
<a href="/practicev2" style="display: flex; align-items: center; height: 44px; font-size: 14px; font-weight: 600; text-decoration: none">Open lesson</a>
</div>

<div class="coach-lesson-row" style="display: flex; align-items: center; gap: 20px; padding: 18px 20px; border-radius: 16px; background: #FFFFFF; border: 2px solid #E2DED3">
<span style="width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">2</span>
<div class="coach-lesson-copy" style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 17px; font-weight: 600">Counting in binary</span><span style="font-size: 13px; color: #4A4E57">5 cards · 2 due now</span></div>
<div class="coach-lesson-strength" role="img" aria-label="Learning 3, Solid 2" style="width: 180px; display: flex; gap: 2px; height: 10px"><span style="flex: 3 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 2 1 0; border-radius: 0 4px 4px 0; background: #3F5BDE"></span></div>
<a href="/practicev2/session" style="display: flex; align-items: center; height: 44px; padding: 0 16px; border-radius: 12px; border: 2px solid #D5D0C3; color: #16181D; font-size: 14px; font-weight: 600; text-decoration: none">Practice</a>
<a href="/practicev2" style="display: flex; align-items: center; height: 44px; font-size: 14px; font-weight: 600; text-decoration: none">Open lesson</a>
</div>

<div class="coach-lesson-row" style="display: flex; align-items: center; gap: 20px; padding: 18px 20px; border-radius: 16px; background: #FFFFFF; border: 2px solid #E2DED3">
<span style="width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">3</span>
<div class="coach-lesson-copy" style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 17px; font-weight: 600">Bytes and hex</span><span style="font-size: 13px; color: #4A4E57">6 cards · 1 due now</span></div>
<div class="coach-lesson-strength" role="img" aria-label="Learning 3, Solid 2, Mastered 1" style="width: 180px; display: flex; gap: 2px; height: 10px"><span style="flex: 3 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 2 1 0; background: #3F5BDE"></span><span style="flex: 1 1 0; border-radius: 0 4px 4px 0; background: #1A2F96"></span></div>
<a href="/practicev2/session" style="display: flex; align-items: center; height: 44px; padding: 0 16px; border-radius: 12px; border: 2px solid #D5D0C3; color: #16181D; font-size: 14px; font-weight: 600; text-decoration: none">Practice</a>
<a href="/practicev2" style="display: flex; align-items: center; height: 44px; font-size: 14px; font-weight: 600; text-decoration: none">Open lesson</a>
</div>
</section>

<section aria-labelledby="b2" style="display: flex; flex-direction: column; gap: 12px">
<div style="display: flex; justify-content: space-between; align-items: baseline">
<h2 id="b2" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 24px">Logic <span style="font-family: var(--font-hanken), system-ui, sans-serif; font-weight: 400; font-size: 14px; color: #5A5E66">· 2 lessons · 11 cards</span></h2>
<a href="/practicev2/session" style="display: flex; align-items: center; height: 44px; font-size: 14px; font-weight: 600; text-decoration: none">Practice this branch</a>
</div>

<div class="coach-lesson-row" style="display: flex; align-items: center; gap: 20px; padding: 18px 20px; border-radius: 16px; background: #FFFFFF; border: 2px solid #E2DED3">
<span style="width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">4</span>
<div class="coach-lesson-copy" style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px"><span class="coach-lesson-title" style="display: flex; align-items: center; gap: 10px"><span style="font-size: 17px; font-weight: 600">Boolean logic</span><span style="padding: 2px 8px; border-radius: 999px; background: #FDE7DA; color: #9A3412; font-size: 12px; font-weight: 600">Needs work</span></span><span style="font-size: 13px; color: #4A4E57">5 cards · 2 due now</span></div>
<div class="coach-lesson-strength" role="img" aria-label="Learning 3, Solid 1, Mastered 1" style="width: 180px; display: flex; gap: 2px; height: 10px"><span style="flex: 3 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 1 1 0; background: #3F5BDE"></span><span style="flex: 1 1 0; border-radius: 0 4px 4px 0; background: #1A2F96"></span></div>
<a href="/practicev2/session" style="display: flex; align-items: center; height: 44px; padding: 0 16px; border-radius: 12px; border: 2px solid #D5D0C3; color: #16181D; font-size: 14px; font-weight: 600; text-decoration: none">Practice</a>
<a href="/practicev2" style="display: flex; align-items: center; height: 44px; font-size: 14px; font-weight: 600; text-decoration: none">Open lesson</a>
</div>

<div class="coach-lesson-row" style="display: flex; align-items: center; gap: 20px; padding: 18px 20px; border-radius: 16px; background: #FFFFFF; border: 2px solid #E2DED3">
<span style="width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">5</span>
<div class="coach-lesson-copy" style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px"><span class="coach-lesson-title" style="display: flex; align-items: center; gap: 10px"><span style="font-size: 17px; font-weight: 600">Logic gates</span><span style="padding: 2px 8px; border-radius: 999px; background: #FDE7DA; color: #9A3412; font-size: 12px; font-weight: 600">Needs work</span></span><span style="font-size: 13px; color: #4A4E57">6 cards · 2 due now</span></div>
<div class="coach-lesson-strength" role="img" aria-label="Learning 3, Solid 3" style="width: 180px; display: flex; gap: 2px; height: 10px"><span style="flex: 3 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 3 1 0; border-radius: 0 4px 4px 0; background: #3F5BDE"></span></div>
<a href="/practicev2/session" style="display: flex; align-items: center; height: 44px; padding: 0 16px; border-radius: 12px; border: 2px solid #D5D0C3; color: #16181D; font-size: 14px; font-weight: 600; text-decoration: none">Practice</a>
<a href="/practicev2" style="display: flex; align-items: center; height: 44px; font-size: 14px; font-weight: 600; text-decoration: none">Open lesson</a>
</div>
</section>

<section aria-labelledby="b3" style="display: flex; flex-direction: column; gap: 12px">
<div style="display: flex; justify-content: space-between; align-items: baseline">
<h2 id="b3" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 24px">First principles <span style="font-family: var(--font-hanken), system-ui, sans-serif; font-weight: 400; font-size: 14px; color: #5A5E66">· 1 lesson · 4 cards</span></h2>
</div>

<div class="coach-lesson-row" style="display: flex; align-items: center; gap: 20px; padding: 18px 20px; border-radius: 16px; background: #FFFFFF; border: 2px dashed #D5D0C3">
<span style="width: 44px; height: 44px; flex-shrink: 0; box-sizing: border-box; border-radius: 50%; border: 2px solid #D5D0C3; color: #4A4E57; display: flex; align-items: center; justify-content: center; font-weight: 700">6</span>
<div class="coach-lesson-copy" style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px"><span class="coach-lesson-title" style="display: flex; align-items: center; gap: 10px"><span style="font-size: 17px; font-weight: 600">Thinking from first principles</span><span style="padding: 2px 8px; border-radius: 999px; background: #ECE9E0; color: #4A4E57; font-size: 12px; font-weight: 600">Not started</span></span><span style="font-size: 13px; color: #4A4E57">4 cards · none seen yet</span></div>
<a href="/practicev2/session" style="display: flex; align-items: center; height: 44px; padding: 0 18px; border-radius: 12px; background: #16181D; color: #F6F4EE; font-size: 14px; font-weight: 600; text-decoration: none">Start lesson</a>
</div>
</section>

</div>

<aside style="display: flex; flex-direction: column; gap: 24px">
<section aria-labelledby="pp-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 18px">
<h2 id="pp-title" style="margin: 0; font-size: 18px; font-weight: 600">Your progress</h2>
<div style="display: flex; flex-direction: column; gap: 10px">
<div style="display: flex; justify-content: space-between; align-items: baseline"><span style="font-size: 15px; color: #4A4E57">Hit rate</span><span style="font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 36px; line-height: 1">61%</span></div>
<div role="img" aria-label="Hit rate 61 percent" style="height: 10px; border-radius: 999px; background: #ECE9E0; overflow: hidden"><div style="width: 61%; height: 100%; border-radius: 999px; background: #2E4BDB"></div></div>
<span style="font-family: var(--font-plex-mono), monospace; font-size: 13px; color: #5A5E66">17/28 correct · 6 sessions</span>
</div>
<div style="height: 1px; background: #ECE9E0"></div>
<div style="display: flex; flex-direction: column; gap: 12px">
<span style="font-size: 15px; font-weight: 600">Card strength</span>
<div role="img" aria-label="New 4, Learning 13, Solid 11, Mastered 4" style="display: flex; gap: 2px; height: 14px">
<span style="flex: 4 1 0; border-radius: 4px 0 0 4px; background: #BAC6FA"></span><span style="flex: 13 1 0; background: #7F95F0"></span><span style="flex: 11 1 0; background: #3F5BDE"></span><span style="flex: 4 1 0; border-radius: 0 4px 4px 0; background: #1A2F96"></span>
</div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 16px; font-size: 14px">
<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #BAC6FA"></span>New<strong style="margin-left: auto; font-family: var(--font-plex-mono), monospace; font-weight: 500">4</strong></span>
<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #7F95F0"></span>Learning<strong style="margin-left: auto; font-family: var(--font-plex-mono), monospace; font-weight: 500">13</strong></span>
<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #3F5BDE"></span>Solid<strong style="margin-left: auto; font-family: var(--font-plex-mono), monospace; font-weight: 500">11</strong></span>
<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #1A2F96"></span>Mastered<strong style="margin-left: auto; font-family: var(--font-plex-mono), monospace; font-weight: 500">4</strong></span>
</div>
</div>
<a href="/practicev2/bank" style="display: flex; align-items: center; gap: 6px; height: 44px; font-size: 14px; font-weight: 600; text-decoration: none">Browse all 32 cards
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
</section>

<section aria-labelledby="tip-title" style="background: #16181D; color: #F6F4EE; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 10px">
<h2 id="tip-title" style="margin: 0; font-size: 16px; font-weight: 600; color: #D7F26B">Where to focus</h2>
<p style="margin: 0; font-size: 15px; line-height: 1.55; color: #D4D6DB">Most of your misses are in the Logic branch. A short deck of Boolean logic and Logic gates will do more than another full review.</p>
<a href="/practicev2/custom" style="display: flex; align-items: center; height: 44px; font-size: 14px; font-weight: 600; color: #F6F4EE; text-decoration: underline">Build that deck</a>
</section>
</aside>

</div>



</div>`;
