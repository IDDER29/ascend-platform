/** Coach desktop body (no mock chrome) from Ascend Practice.html */
export const PRACTICE_COACH_V2_CSS = `.practice-coach-v2{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  /* Surface comes from the page shell — avoid nested cream card on paper */
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2 .coach-main{
  display:flex;
  flex-direction:column;
  gap:40px;
  min-width:0;
  max-width:100%;
}
.practice-coach-v2 .coach-hero-grid,
.practice-coach-v2 .coach-bottom-grid,
.practice-coach-v2 .coach-modes-grid{
  min-width:0;
  width:100%;
  max-width:100%;
}
.practice-coach-v2 .coach-hero-grid > *,
.practice-coach-v2 .coach-bottom-grid > *,
.practice-coach-v2 .coach-modes-grid > *{
  min-width:0;
}
.practice-coach-v2 .coach-due{
  min-width:0;
  overflow:hidden;
}
.practice-coach-v2 .coach-path-head{
  width:100%;
  flex-wrap:nowrap;
}
.practice-coach-v2 .coach-path-meta{
  min-width:0;
}
.practice-coach-v2 .coach-path-head > a{
  flex-shrink:0;
}
.practice-coach-v2 .coach-modes-head,
.practice-coach-v2 .coach-due-cta{
  width:100%;
}
.practice-coach-v2 table{
  width:100%;
  border-collapse:collapse;
  table-layout:auto;
}
.practice-coach-v2 th,
.practice-coach-v2 td{
  vertical-align:middle;
}
.practice-coach-v2 .coach-cloze-blank{box-sizing:border-box}
.practice-coach-v2 a[href]:hover{filter:brightness(.97)}
.practice-coach-v2 a[href]:active,
.practice-coach-v2 button:not(:disabled):active{transform:translateY(2px)}
.practice-coach-v2 a:focus-visible,
.practice-coach-v2 button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1023px){
  .practice-coach-v2 .coach-hero-grid,
  .practice-coach-v2 .coach-bottom-grid{
    grid-template-columns:1fr !important;
  }
  .practice-coach-v2 .coach-modes-grid{
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  }
  .practice-coach-v2 .coach-due{
    flex-direction:column !important;
    align-items:stretch !important;
  }
  .practice-coach-v2 .coach-due-preview{
    width:min(240px,100%) !important;
    margin-inline:auto;
  }
}
@media (max-width:639px){
  .practice-coach-v2 .coach-modes-grid{
    grid-template-columns:1fr !important;
  }
  .practice-coach-v2 h1{font-size:40px !important}
  .practice-coach-v2 .coach-due{padding:28px 24px !important}
  .practice-coach-v2 .coach-due-cta > a{width:100% !important}
  .practice-coach-v2 .coach-path-head{
    flex-wrap:wrap;
  }
}
.practice-coach-v2 .coach-step-track{
  width:100%;
  min-width:0;
  align-items:flex-start !important;
}
.practice-coach-v2 .coach-step-line{
  flex:1 1 20px;
  min-width:20px;
  height:3px;
  /* Center on 44px circles when track is flex-start */
  margin-top:20px !important;
  margin-bottom:0 !important;
}
.practice-coach-v2 .coach-step-track > a{
  flex:0 0 80px;
  width:80px !important;
}
.practice-coach-v2 .coach-step-label{
  min-height:2.6em;
  display:block;
}`;

export const PRACTICE_COACH_V2_HTML = `<main class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 40px">

<div style="display: flex; flex-direction: column; gap: 10px">
<span style="font-family: var(--font-plex-mono), monospace; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">Friday, Sep 25</span>
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 56px; line-height: 1; letter-spacing: -0.03em">Practice</h1>
<p style="margin: 0; font-size: 18px; line-height: 1.55; color: #4A4E57; max-width: 640px; text-wrap: pretty">Mixed recall—choices, flashcards, cloze, and short answers—in one shuffled queue. Misses come back on a schedule.</p>
</div>

<div class="coach-hero-grid" style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 320px); gap: 24px; align-items: stretch">

<section class="coach-due" aria-labelledby="up-next" style="background: #16181D; color: #F6F4EE; border-radius: 24px; padding: 36px 40px; display: flex; gap: 32px; align-items: center">
<div style="flex-grow: 1; display: flex; flex-direction: column; gap: 18px">
<div style="display: flex; align-items: center; gap: 10px">
<span style="padding: 5px 10px; border-radius: 999px; background: #D7F26B; color: #16181D; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase">Recommended</span>
<span style="font-family: var(--font-plex-mono), monospace; font-size: 13px; color: #B9BCC4">Up next</span>
</div>
<h2 id="up-next" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 44px; line-height: 1; letter-spacing: -0.02em">Due review</h2>
<p style="margin: 0; font-size: 16px; color: #B9BCC4">8 cards · choices, flashcards, cloze and short answers, shuffled</p>
<div aria-label="0 of 8 done" style="display: flex; gap: 6px">
<span style="flex-grow: 1; height: 10px; border-radius: 999px; background: #3A3D45"></span>
<span style="flex-grow: 1; height: 10px; border-radius: 999px; background: #3A3D45"></span>
<span style="flex-grow: 1; height: 10px; border-radius: 999px; background: #3A3D45"></span>
<span style="flex-grow: 1; height: 10px; border-radius: 999px; background: #3A3D45"></span>
<span style="flex-grow: 1; height: 10px; border-radius: 999px; background: #3A3D45"></span>
<span style="flex-grow: 1; height: 10px; border-radius: 999px; background: #3A3D45"></span>
<span style="flex-grow: 1; height: 10px; border-radius: 999px; background: #3A3D45"></span>
<span style="flex-grow: 1; height: 10px; border-radius: 999px; background: #3A3D45"></span>
</div>
<div class="coach-due-cta" style="display: flex; align-items: center; gap: 20px; margin-top: 6px; flex-wrap: wrap">
<a href="/practice?demo=1&amp;view=session" style="display: flex; align-items: center; justify-content: center; gap: 14px; height: 60px; width: 272px; max-width: 100%; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-weight: 700; font-size: 18px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none">Start review
<kbd style="height: 26px; box-sizing: border-box; padding: 0 8px; display: inline-flex; align-items: center; border: 1px solid #9DB43A; border-bottom-width: 2px; border-radius: 6px; background: #E8F7A6; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none; color: #16181D">Enter</kbd></a>
<div style="display: flex; flex-direction: column; gap: 2px; font-size: 14px; line-height: 1.5; color: #B9BCC4">
<span>Last time <strong style="color: #F6F4EE; font-weight: 600">5/8</strong></span>
<span>Next review <strong style="color: #F6F4EE; font-weight: 600">Sep 26, 12:23 PM</strong></span>
</div>
</div>
</div>
<div class="coach-due-preview" aria-hidden="true" style="width: 240px; height: 200px; flex-shrink: 0; position: relative">
<div style="position: absolute; left: 20px; top: 20px; width: 200px; height: 150px; border-radius: 18px; background: #2E4BDB; transform: rotate(-9deg)"></div>
<div style="position: absolute; left: 24px; top: 16px; width: 200px; height: 150px; border-radius: 18px; background: #3A3D45; transform: rotate(5deg)"></div>
<div style="position: absolute; left: 20px; top: 24px; width: 200px; height: 150px; box-sizing: border-box; border-radius: 18px; background: #F6F4EE; color: #16181D; padding: 18px; display: flex; flex-direction: column; justify-content: space-between">
<span style="font-family: var(--font-plex-mono), monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">Cloze</span>
<span style="font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 19px; line-height: 1.2">A bit holds one of <span class="coach-cloze-blank" style="display: inline-block; width: 48px; height: 1.1em; vertical-align: baseline; border-bottom: 3px solid #2E4BDB"></span> values.</span>
</div>
</div>
</section>

<section aria-labelledby="status-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 18px">
<h2 id="status-title" style="margin: 0; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">Your day</h2>
<div style="display: flex; align-items: center; gap: 14px">
<span style="width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; background: #FDE7DA; color: #C2410C; display: flex; align-items: center; justify-content: center"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 3 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.3-3.8 2.5-5 0 2 1 3 2 3.2C11 8.5 10.5 6 12 3z"></path></svg></span>
<div style="display: flex; flex-direction: column; gap: 2px">
<span style="font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 26px; line-height: 1">1 day streak</span>
<span style="font-size: 14px; color: #4A4E57">Practice tomorrow to make it 2.</span>
</div>
</div>
<div style="height: 1px; background: #ECE9E0"></div>
<div style="display: flex; align-items: center; gap: 16px">
<svg width="84" height="84" viewBox="0 0 100 100" role="img" aria-label="Daily goal met: 28 of 20 cards" style="flex-shrink: 0">
<circle cx="50" cy="50" r="42" fill="none" stroke="#ECE9E0" stroke-width="10"></circle>
<circle cx="50" cy="50" r="42" fill="none" stroke="#2E4BDB" stroke-width="10" stroke-linecap="round" transform="rotate(-90 50 50)" stroke-dasharray="264 264"></circle>
<text x="50" y="52" text-anchor="middle" font-family="var(--font-bricolage), sans-serif" font-weight="800" font-size="28" fill="#16181D">28</text>
<text x="50" y="70" text-anchor="middle" font-family="var(--font-plex-mono), monospace" font-size="12" fill="#5A5E66">/20</text>
</svg>
<div style="display: flex; flex-direction: column; gap: 2px">
<span style="font-size: 17px; font-weight: 600">Daily goal met</span>
<span style="font-size: 14px; line-height: 1.45; color: #4A4E57">Anything more today is a bonus.</span>
</div>
</div>
<div role="group" aria-label="Daily goal" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; padding: 4px; border-radius: 12px; background: #F1EEE6">
<button type="button" aria-pressed="false" style="height: 44px; border: 0; border-radius: 9px; background: transparent; font-family: inherit; font-size: 13px; color: #4A4E57">Casual · 10</button>
<button type="button" aria-pressed="true" style="height: 44px; border: 0; border-radius: 9px; background: #FFFFFF; box-shadow: 0 1px 3px rgba(22,24,29,0.12); font-family: inherit; font-size: 13px; font-weight: 600; color: #16181D">Regular · 20</button>
<button type="button" aria-pressed="false" style="height: 44px; border: 0; border-radius: 9px; background: transparent; font-family: inherit; font-size: 13px; color: #4A4E57">Serious · 40</button>
</div>
</section>

</div>

<section aria-labelledby="modes" style="display: flex; flex-direction: column; gap: 16px">
<div class="coach-modes-head" style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap">
<h2 id="modes" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 26px">Or pick a mode</h2>
<span style="font-size: 14px; color: #5A5E66">Every mode counts toward your daily goal</span>
</div>
<div class="coach-modes-grid" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px">

<a href="/practice?demo=1&amp;view=session" style="display: flex; flex-direction: column; gap: 14px; padding: 22px; border-radius: 18px; background: #FFFFFF; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; color: #16181D; text-decoration: none">
<span style="display: flex; justify-content: space-between; align-items: flex-start">
<span style="width: 48px; height: 48px; border-radius: 14px; background: #FDE7DA; color: #C2410C; display: flex; align-items: center; justify-content: center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path></svg></span>
<span style="padding: 3px 9px; border-radius: 999px; background: #FDE7DA; color: #9A3412; font-size: 12px; font-weight: 600">11 today</span>
</span>
<span style="display: flex; flex-direction: column; gap: 4px">
<span style="font-size: 18px; font-weight: 600">Fix your misses</span>
<span style="font-size: 14px; line-height: 1.5; color: #4A4E57">Only the cards you got wrong today, while they're fresh.</span>
</span>
</a>

<a href="/practice?demo=1&amp;view=session" style="display: flex; flex-direction: column; gap: 14px; padding: 22px; border-radius: 18px; background: #FFFFFF; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; color: #16181D; text-decoration: none">
<span style="display: flex; justify-content: space-between; align-items: flex-start">
<span style="width: 48px; height: 48px; border-radius: 14px; background: #F0F8CF; color: #4D5E0E; display: flex; align-items: center; justify-content: center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 3L5 14h6l-1 7 8-11h-6z"></path></svg></span>
<span style="padding: 3px 9px; border-radius: 999px; background: #F0F8CF; color: #4D5E0E; font-size: 12px; font-weight: 600">5 cards</span>
</span>
<span style="display: flex; flex-direction: column; gap: 4px">
<span style="font-size: 18px; font-weight: 600">Quick 5</span>
<span style="font-size: 14px; line-height: 1.5; color: #4A4E57">Five random cards from your bank, for a spare moment.</span>
</span>
</a>

<a href="/practice?demo=1&amp;view=session" style="display: flex; flex-direction: column; gap: 14px; padding: 22px; border-radius: 18px; background: #FFFFFF; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; color: #16181D; text-decoration: none">
<span style="display: flex; justify-content: space-between; align-items: flex-start">
<span style="width: 48px; height: 48px; border-radius: 14px; background: #E3E8FF; color: #1F3BB8; display: flex; align-items: center; justify-content: center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg></span>
<span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">32 cards</span>
</span>
<span style="display: flex; flex-direction: column; gap: 4px">
<span style="font-size: 18px; font-weight: 600">Everything unlocked</span>
<span style="font-size: 14px; line-height: 1.5; color: #4A4E57">Shuffle every card you've unlocked, due or not.</span>
</span>
</a>

<a href="/practice" style="display: flex; flex-direction: column; gap: 14px; padding: 22px; border-radius: 18px; background: #FFFFFF; border: 2px solid #E2DED3; box-shadow: 0 4px 0 #E2DED3; color: #16181D; text-decoration: none">
<span style="display: flex; justify-content: space-between; align-items: flex-start">
<span style="width: 48px; height: 48px; border-radius: 14px; background: #ECE9E0; color: #16181D; display: flex; align-items: center; justify-content: center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></span>
<span style="padding: 3px 9px; border-radius: 999px; background: #ECE9E0; color: #4A4E57; font-size: 12px; font-weight: 600">Your pick</span>
</span>
<span style="display: flex; flex-direction: column; gap: 4px">
<span style="font-size: 18px; font-weight: 600">Custom deck</span>
<span style="font-size: 14px; line-height: 1.5; color: #4A4E57">Choose lessons and drill only those cards.</span>
</span>
</a>

</div>
</section>

<div class="coach-bottom-grid" style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 320px); gap: 24px; align-items: start">

<div style="display: flex; flex-direction: column; gap: 24px">

<section class="coach-path" aria-labelledby="path-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 24px">
<div class="coach-path-head" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px">
<div class="coach-path-meta" style="display: flex; gap: 16px; align-items: center; min-width: 0; flex: 1">
<span style="width: 52px; height: 52px; border-radius: 14px; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 24px">F</span>
<div style="display: flex; flex-direction: column; gap: 4px">
<div style="display: flex; align-items: center; gap: 10px"><h2 id="path-title" style="margin: 0; font-size: 20px; font-weight: 600">Foundations</h2><span style="padding: 3px 8px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Always open</span></div>
<span style="font-size: 14px; color: #4A4E57">Bits, logic, and first principles — your always-open warm-up. <span style="font-family: var(--font-plex-mono), monospace; font-size: 13px; color: #5A5E66">32 cards · 6 lessons</span></span>
</div>
</div>
<a href="/practicev2/foundations" style="display: flex; align-items: center; height: 44px; padding: 0 18px; border-radius: 12px; border: 2px solid #16181D; color: #16181D; font-weight: 600; font-size: 15px; text-decoration: none; flex-shrink: 0">Open path</a>
</div>
<div class="coach-step-track" style="display: flex; align-items: flex-start; width: 100%; min-width: 0">
<a href="/practicev2/foundations" style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 80px; text-decoration: none; color: #16181D; flex: 0 0 80px"><span style="width: 44px; height: 44px; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">1</span><span class="coach-step-label" style="font-size: 13px; font-weight: 600; text-align: center; line-height: 1.3">What is a bit?</span></a>
<span class="coach-step-line" style="flex: 1 1 20px; min-width: 20px; height: 3px; background: #16181D; margin-top: 20px"></span>
<a href="/practicev2/foundations" style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 80px; text-decoration: none; flex: 0 0 80px; color: #16181D"><span style="width: 44px; height: 44px; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">2</span><span class="coach-step-label" style="font-size: 13px; font-weight: 600; text-align: center; line-height: 1.3">Counting in binary</span></a>
<span class="coach-step-line" style="flex: 1 1 20px; min-width: 20px; height: 3px; background: #16181D; margin-top: 20px"></span>
<a href="/practicev2/foundations" style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 80px; text-decoration: none; flex: 0 0 80px; color: #16181D"><span style="width: 44px; height: 44px; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">3</span><span class="coach-step-label" style="font-size: 13px; font-weight: 600; text-align: center; line-height: 1.3">Bytes and hex</span></a>
<span class="coach-step-line" style="flex: 1 1 20px; min-width: 20px; height: 3px; background: #16181D; margin-top: 20px"></span>
<a href="/practicev2/foundations" style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 80px; text-decoration: none; flex: 0 0 80px; color: #16181D"><span style="width: 44px; height: 44px; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">4</span><span class="coach-step-label" style="font-size: 13px; font-weight: 600; text-align: center; line-height: 1.3">Boolean logic</span></a>
<span class="coach-step-line" style="flex: 1 1 20px; min-width: 20px; height: 3px; background: #16181D; margin-top: 20px"></span>
<a href="/practicev2/foundations" style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 80px; text-decoration: none; flex: 0 0 80px; color: #16181D"><span style="width: 44px; height: 44px; border-radius: 50%; background: #16181D; color: #D7F26B; display: flex; align-items: center; justify-content: center; font-weight: 700">5</span><span class="coach-step-label" style="font-size: 13px; font-weight: 600; text-align: center; line-height: 1.3">Logic gates</span></a>
<span class="coach-step-line" style="flex: 1 1 20px; min-width: 20px; height: 3px; background: #E2DED3; margin-top: 20px"></span>
<a href="/practicev2/foundations" style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 80px; text-decoration: none; flex: 0 0 80px; color: #4A4E57"><span style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid #D5D0C3; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-weight: 700">6</span><span class="coach-step-label" style="font-size: 13px; text-align: center; line-height: 1.3">First principles</span></a>
</div>
<div style="display: flex; align-items: center; gap: 16px">
<span style="font-size: 14px; color: #4A4E57; width: 72px">Hit rate</span>
<div role="img" aria-label="Hit rate 61 percent" style="flex-grow: 1; height: 10px; border-radius: 999px; background: #ECE9E0; overflow: hidden"><div style="width: 61%; height: 100%; border-radius: 999px; background: #2E4BDB"></div></div>
<span style="font-family: var(--font-plex-mono), monospace; font-size: 14px">61% · 17/28 correct · 6 sessions</span>
</div>
</section>

<section aria-labelledby="recent-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 18px">
<div style="display: flex; justify-content: space-between; align-items: center; gap: 16px">
<div style="display: flex; flex-direction: column; gap: 2px">
<h2 id="recent-title" style="margin: 0; font-size: 20px; font-weight: 600">Today's sessions</h2>
<span style="font-size: 13px; color: #5A5E66">Saved on this device</span>
</div>
<div style="display: flex; gap: 8px">
<span style="padding: 6px 12px; border-radius: 999px; background: #F6F4EE; font-size: 13px"><strong style="font-weight: 600">28</strong> answered</span>
<span style="padding: 6px 12px; border-radius: 999px; background: #F6F4EE; font-size: 13px"><strong style="font-weight: 600">17</strong> correct</span>
<span style="padding: 6px 12px; border-radius: 999px; background: #FDE7DA; color: #9A3412; font-size: 13px"><strong style="font-weight: 600">11</strong> to fix</span>
</div>
</div>
<table style="width: 100%; border-collapse: collapse; font-size: 15px">
<thead>
<tr style="text-align: left; font-size: 12px; color: #5A5E66; text-transform: uppercase; letter-spacing: 0.06em">
<th scope="col" style="padding: 0 0 10px; font-weight: 500">Session</th>
<th scope="col" style="padding: 0 0 10px; font-weight: 500">Time</th>
<th scope="col" style="padding: 0 0 10px; font-weight: 500">Result</th>
<th scope="col" style="padding: 0 0 10px; font-weight: 500; text-align: right">Score</th>
<th scope="col" style="padding: 0 0 10px; font-weight: 500; text-align: right"><span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)">Action</span></th>
</tr>
</thead>
<tbody>
<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 8px 0; font-weight: 600">Due cards</td>
<td style="padding: 8px 0; color: #4A4E57">2:13 PM</td>
<td style="padding: 8px 0"><div aria-hidden="true" style="display: flex; gap: 3px"><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span></div></td>
<td style="padding: 8px 0; text-align: right; font-family: var(--font-plex-mono), monospace">5/8</td>
<td style="padding: 8px 0; text-align: right; width: 150px"><a href="/practice?demo=1&amp;view=session" style="display: inline-flex; align-items: center; height: 44px; padding: 0 14px; border-radius: 10px; border: 2px solid #D5D0C3; color: #16181D; font-size: 14px; font-weight: 600; text-decoration: none">Retry 3 misses</a></td>
</tr>
<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 8px 0; font-weight: 600">Due cards</td>
<td style="padding: 8px 0; color: #4A4E57">12:23 PM</td>
<td style="padding: 8px 0"><div aria-hidden="true" style="display: flex; gap: 3px"><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span></div></td>
<td style="padding: 8px 0; text-align: right; font-family: var(--font-plex-mono), monospace">5/8</td>
<td style="padding: 8px 0; text-align: right"><a href="/practice?demo=1&amp;view=session" style="display: inline-flex; align-items: center; height: 44px; padding: 0 14px; border-radius: 10px; border: 2px solid #D5D0C3; color: #16181D; font-size: 14px; font-weight: 600; text-decoration: none">Retry 3 misses</a></td>
</tr>
<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 8px 0; font-weight: 600">1 lesson</td>
<td style="padding: 8px 0; color: #4A4E57">12:23 PM</td>
<td style="padding: 8px 0"><div aria-hidden="true" style="display: flex; gap: 3px"><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span></div></td>
<td style="padding: 8px 0; text-align: right; font-family: var(--font-plex-mono), monospace">2/2</td>
<td style="padding: 8px 0; text-align: right; height: 44px; font-size: 14px; color: #4A5E0E"><span style="display: inline-flex; align-items: center; gap: 6px; padding-right: 14px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>Perfect</span></td>
</tr>
<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 8px 0; font-weight: 600">Foundations</td>
<td style="padding: 8px 0; color: #4A4E57">8:50 AM</td>
<td style="padding: 8px 0"><div aria-hidden="true" style="display: flex; gap: 3px"><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span></div></td>
<td style="padding: 8px 0; text-align: right; font-family: var(--font-plex-mono), monospace">4/4</td>
<td style="padding: 8px 0; text-align: right; height: 44px; font-size: 14px; color: #4A5E0E"><span style="display: inline-flex; align-items: center; gap: 6px; padding-right: 14px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>Perfect</span></td>
</tr>
<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 8px 0; font-weight: 600">2 lessons</td>
<td style="padding: 8px 0; color: #4A4E57">2:49 AM</td>
<td style="padding: 8px 0"><div aria-hidden="true" style="display: flex; gap: 3px"><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span></div></td>
<td style="padding: 8px 0; text-align: right; font-family: var(--font-plex-mono), monospace">0/2</td>
<td style="padding: 8px 0; text-align: right"><a href="/practice?demo=1&amp;view=session" style="display: inline-flex; align-items: center; height: 44px; padding: 0 14px; border-radius: 10px; border: 2px solid #D5D0C3; color: #16181D; font-size: 14px; font-weight: 600; text-decoration: none">Retry 2 misses</a></td>
</tr>
<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 8px 0; font-weight: 600">Everything unlocked</td>
<td style="padding: 8px 0; color: #4A4E57">2:44 AM</td>
<td style="padding: 8px 0"><div aria-hidden="true" style="display: flex; gap: 3px"><span style="width: 8px; height: 18px; border-radius: 2px; background: #2E4BDB"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span><span style="width: 8px; height: 18px; border-radius: 2px; background: #D9622B"></span></div></td>
<td style="padding: 8px 0; text-align: right; font-family: var(--font-plex-mono), monospace">1/4</td>
<td style="padding: 8px 0; text-align: right"><a href="/practice?demo=1&amp;view=session" style="display: inline-flex; align-items: center; height: 44px; padding: 0 14px; border-radius: 10px; border: 2px solid #D5D0C3; color: #16181D; font-size: 14px; font-weight: 600; text-decoration: none">Retry 3 misses</a></td>
</tr>
</tbody>
</table>
<div style="display: flex; gap: 16px; font-size: 13px; color: #4A4E57">
<span style="display: flex; align-items: center; gap: 6px"><span style="width: 8px; height: 14px; border-radius: 2px; background: #2E4BDB"></span>Correct</span>
<span style="display: flex; align-items: center; gap: 6px"><span style="width: 8px; height: 14px; border-radius: 2px; background: #D9622B"></span>Missed</span>
</div>
</section>

</div>

<aside style="display: flex; flex-direction: column; gap: 24px">

<section aria-labelledby="memory-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 18px">
<div style="display: flex; justify-content: space-between; align-items: baseline">
<h2 id="memory-title" style="margin: 0; font-size: 18px; font-weight: 600">Card strength</h2>
<span style="font-size: 13px; color: #5A5E66">32 in your bank</span>
</div>
<div role="img" aria-label="New 4, Learning 13, Solid 11, Mastered 4" style="display: flex; gap: 2px; height: 16px">
<span title="New · 4 cards" style="flex: 4 1 0; border-radius: 4px 0 0 4px; background: #BAC6FA"></span>
<span title="Learning · 13 cards" style="flex: 13 1 0; background: #7F95F0"></span>
<span title="Solid · 11 cards" style="flex: 11 1 0; background: #3F5BDE"></span>
<span title="Mastered · 4 cards" style="flex: 4 1 0; border-radius: 0 4px 4px 0; background: #1A2F96"></span>
</div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 16px; font-size: 14px">
<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #BAC6FA"></span>New<strong style="margin-left: auto; font-family: var(--font-plex-mono), monospace; font-weight: 500">4</strong></span>
<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #7F95F0"></span>Learning<strong style="margin-left: auto; font-family: var(--font-plex-mono), monospace; font-weight: 500">13</strong></span>
<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #3F5BDE"></span>Solid<strong style="margin-left: auto; font-family: var(--font-plex-mono), monospace; font-weight: 500">11</strong></span>
<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #1A2F96"></span>Mastered<strong style="margin-left: auto; font-family: var(--font-plex-mono), monospace; font-weight: 500">4</strong></span>
</div>
<div style="height: 1px; background: #ECE9E0"></div>
<div style="display: flex; justify-content: space-between; align-items: baseline">
<h3 style="margin: 0; font-size: 15px; font-weight: 600">Due this week</h3>
<span style="font-size: 13px; color: #5A5E66">29 cards</span>
</div>
<div role="img" aria-label="Cards due: today 8, Saturday 6, Sunday 3, Monday 5, Tuesday 2, Wednesday 4, Thursday 1" style="display: flex; flex-direction: column; gap: 6px">
<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; height: 92px; align-items: end; border-bottom: 1px solid #E2DED3">
<span title="Today · 8 cards" style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span style="font-family: var(--font-plex-mono), monospace; font-size: 12px">8</span><span style="width: 24px; height: 72px; border-radius: 4px 4px 0 0; background: #1A2F96"></span></span>
<span title="Sat · 6 cards" style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span style="font-family: var(--font-plex-mono), monospace; font-size: 12px">6</span><span style="width: 24px; height: 54px; border-radius: 4px 4px 0 0; background: #7F95F0"></span></span>
<span title="Sun · 3 cards" style="display: flex; justify-content: center"><span style="width: 24px; height: 27px; border-radius: 4px 4px 0 0; background: #7F95F0"></span></span>
<span title="Mon · 5 cards" style="display: flex; justify-content: center"><span style="width: 24px; height: 45px; border-radius: 4px 4px 0 0; background: #7F95F0"></span></span>
<span title="Tue · 2 cards" style="display: flex; justify-content: center"><span style="width: 24px; height: 18px; border-radius: 4px 4px 0 0; background: #7F95F0"></span></span>
<span title="Wed · 4 cards" style="display: flex; justify-content: center"><span style="width: 24px; height: 36px; border-radius: 4px 4px 0 0; background: #7F95F0"></span></span>
<span title="Thu · 1 card" style="display: flex; justify-content: center"><span style="width: 24px; height: 9px; border-radius: 4px 4px 0 0; background: #7F95F0"></span></span>
</div>
<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; font-size: 12px; color: #5A5E66; text-align: center">
<span style="font-weight: 600; color: #16181D">Today</span><span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span>
</div>
</div>
<a href="/practice" style="display: flex; align-items: center; gap: 6px; height: 44px; font-size: 14px; font-weight: 600; text-decoration: none">Browse all 32 cards
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
</section>

<section aria-labelledby="days-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px">
<div style="display: flex; justify-content: space-between; align-items: baseline">
<h2 id="days-title" style="margin: 0; font-size: 18px; font-weight: 600">Practice days</h2>
<span style="font-size: 13px; color: #5A5E66">Last 12 weeks</span>
</div>
<div role="img" aria-label="Practiced on 1 day in the last 12 weeks: today, 6 sessions" style="display: flex; flex-direction: column; gap: 6px">
<div style="display: grid; grid-template-columns: 20px repeat(12, 16px); column-gap: 4px; font-size: 11px; color: #5A5E66">
<span></span><span style="grid-column: 2 / span 3">Jul</span><span style="grid-column: 6 / span 3">Aug</span><span style="grid-column: 11 / span 2">Sep</span>
</div>
<div style="display: flex; gap: 4px">
<div style="display: grid; grid-template-rows: repeat(7, 16px); row-gap: 4px; width: 20px; font-size: 11px; color: #5A5E66">
<span style="line-height: 16px">M</span><span></span><span style="line-height: 16px">W</span><span></span><span style="line-height: 16px">F</span><span></span><span></span>
</div>
<div style="display: grid; grid-template-rows: repeat(7, 16px); grid-auto-flow: column; grid-auto-columns: 16px; gap: 4px">
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span>
<span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span style="border-radius: 4px; background: #ECE9E0"></span><span title="Today · 6 sessions" style="border-radius: 4px; background: #1A2F96; box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #1A2F96"></span><span style="box-sizing: border-box; border-radius: 4px; border: 1px dashed #D5D0C3"></span><span style="box-sizing: border-box; border-radius: 4px; border: 1px dashed #D5D0C3"></span>
</div>
</div>
</div>
<div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #4A4E57">
<span><strong style="font-weight: 600; color: #16181D">1 day</strong> practiced · today</span>
<span style="display: flex; align-items: center; gap: 4px">Less
<span style="width: 12px; height: 12px; border-radius: 3px; background: #ECE9E0"></span>
<span style="width: 12px; height: 12px; border-radius: 3px; background: #BAC6FA"></span>
<span style="width: 12px; height: 12px; border-radius: 3px; background: #7F95F0"></span>
<span style="width: 12px; height: 12px; border-radius: 3px; background: #3F5BDE"></span>
<span style="width: 12px; height: 12px; border-radius: 3px; background: #1A2F96"></span>More</span>
</div>
</section>

</aside>
</div>
</main>`;
