/** Coach screen body (no mock chrome) — 09-custom-deck-desktop.html */
export const PRACTICE_COACH_V2_CUSTOM_CSS = `.practice-coach-v2-custom{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-custom .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-custom a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-custom a[href]:active{transform:translateY(2px)}
.practice-coach-v2-custom a:focus-visible,
.practice-coach-v2-custom button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-custom .coach-path-grid,
  .practice-coach-v2-custom [style*="grid-template-columns: minmax(0, 1fr)"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-custom h1{font-size:36px !important}
}`;

export const PRACTICE_COACH_V2_CUSTOM_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<nav aria-label="Breadcrumb" style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #5A5E66">
<a href="/practicev2" style="color: #4A4E57; text-decoration: none">Practice</a><span aria-hidden="true">/</span><span aria-current="page" style="color: #16181D; font-weight: 600">Custom deck</span>
</nav>
<div style="display: flex; flex-direction: column; gap: 10px">
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 48px; line-height: 1; letter-spacing: -0.03em">Build a custom deck</h1>
<p style="margin: 0; font-size: 17px; color: #4A4E57">Pick the lessons you want to drill. Answers still count toward your schedule and daily goal.</p>
</div>

<div style="display: grid; grid-template-columns: minmax(0, 1fr) 400px; gap: 24px; align-items: start">

<section aria-labelledby="pick-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 22px">
<div style="display: flex; justify-content: space-between; align-items: center; gap: 16px">
<h2 id="pick-title" style="margin: 0; font-size: 20px; font-weight: 600">Foundations <span style="font-weight: 400; font-size: 14px; color: #5A5E66">· 6 lessons · 32 cards</span></h2>
<label style="display: flex; align-items: center; gap: 10px; height: 44px; font-size: 14px; font-weight: 600"><input type="checkbox" style="width: 20px; height: 20px; accent-color: #2E4BDB"> Select all</label>
</div>
<div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap">
<span style="font-size: 14px; color: #4A4E57">Quick picks</span>
<button type="button" aria-pressed="true" style="height: 40px; padding: 0 14px; border-radius: 999px; border: 2px solid #2E4BDB; background: #F3F5FF; font-family: inherit; font-size: 14px; font-weight: 600; color: #1F3BB8">Needs work</button>
<button type="button" aria-pressed="false" style="height: 40px; padding: 0 14px; border-radius: 999px; border: 2px solid #E2DED3; background: #FFFFFF; font-family: inherit; font-size: 14px; color: #16181D">Has due cards</button>
<button type="button" aria-pressed="false" style="height: 40px; padding: 0 14px; border-radius: 999px; border: 2px solid #E2DED3; background: #FFFFFF; font-family: inherit; font-size: 14px; color: #16181D">Not started</button>
</div>

<div style="display: flex; flex-direction: column; gap: 10px">
<span style="font-family: var(--font-plex-mono), monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">Bits</span>
<label style="display: flex; align-items: center; gap: 16px; padding: 14px 16px; border-radius: 14px; border: 2px solid #E2DED3; background: #FFFFFF">
<input type="checkbox" style="width: 20px; height: 20px; accent-color: #2E4BDB; flex-shrink: 0">
<span style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">1 · What is a bit?</span><span style="font-size: 13px; color: #4A4E57">6 cards · 1 due</span></span>
<span aria-hidden="true" style="width: 160px; display: flex; gap: 2px; height: 10px"><span style="flex: 1 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 3 1 0; background: #3F5BDE"></span><span style="flex: 2 1 0; border-radius: 0 4px 4px 0; background: #1A2F96"></span></span>
</label>
<label style="display: flex; align-items: center; gap: 16px; padding: 14px 16px; border-radius: 14px; border: 2px solid #E2DED3; background: #FFFFFF">
<input type="checkbox" style="width: 20px; height: 20px; accent-color: #2E4BDB; flex-shrink: 0">
<span style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">2 · Counting in binary</span><span style="font-size: 13px; color: #4A4E57">5 cards · 2 due</span></span>
<span aria-hidden="true" style="width: 160px; display: flex; gap: 2px; height: 10px"><span style="flex: 3 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 2 1 0; border-radius: 0 4px 4px 0; background: #3F5BDE"></span></span>
</label>
<label style="display: flex; align-items: center; gap: 16px; padding: 14px 16px; border-radius: 14px; border: 2px solid #E2DED3; background: #FFFFFF">
<input type="checkbox" style="width: 20px; height: 20px; accent-color: #2E4BDB; flex-shrink: 0">
<span style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">3 · Bytes and hex</span><span style="font-size: 13px; color: #4A4E57">6 cards · 1 due</span></span>
<span aria-hidden="true" style="width: 160px; display: flex; gap: 2px; height: 10px"><span style="flex: 3 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 2 1 0; background: #3F5BDE"></span><span style="flex: 1 1 0; border-radius: 0 4px 4px 0; background: #1A2F96"></span></span>
</label>
</div>

<div style="display: flex; flex-direction: column; gap: 10px">
<span style="font-family: var(--font-plex-mono), monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">Logic</span>
<label style="display: flex; align-items: center; gap: 16px; padding: 14px 16px; border-radius: 14px; border: 2px solid #2E4BDB; background: #F3F5FF">
<input type="checkbox" checked="" style="width: 20px; height: 20px; accent-color: #2E4BDB; flex-shrink: 0">
<span style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px"><span style="display: flex; align-items: center; gap: 10px"><span style="font-size: 16px; font-weight: 600">4 · Boolean logic</span><span style="padding: 2px 8px; border-radius: 999px; background: #FDE7DA; color: #9A3412; font-size: 12px; font-weight: 600">Needs work</span></span><span style="font-size: 13px; color: #4A4E57">5 cards · 2 due</span></span>
<span aria-hidden="true" style="width: 160px; display: flex; gap: 2px; height: 10px"><span style="flex: 3 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 1 1 0; background: #3F5BDE"></span><span style="flex: 1 1 0; border-radius: 0 4px 4px 0; background: #1A2F96"></span></span>
</label>
<label style="display: flex; align-items: center; gap: 16px; padding: 14px 16px; border-radius: 14px; border: 2px solid #2E4BDB; background: #F3F5FF">
<input type="checkbox" checked="" style="width: 20px; height: 20px; accent-color: #2E4BDB; flex-shrink: 0">
<span style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px"><span style="display: flex; align-items: center; gap: 10px"><span style="font-size: 16px; font-weight: 600">5 · Logic gates</span><span style="padding: 2px 8px; border-radius: 999px; background: #FDE7DA; color: #9A3412; font-size: 12px; font-weight: 600">Needs work</span></span><span style="font-size: 13px; color: #4A4E57">6 cards · 2 due</span></span>
<span aria-hidden="true" style="width: 160px; display: flex; gap: 2px; height: 10px"><span style="flex: 3 1 0; border-radius: 4px 0 0 4px; background: #7F95F0"></span><span style="flex: 3 1 0; border-radius: 0 4px 4px 0; background: #3F5BDE"></span></span>
</label>
</div>

<div style="display: flex; flex-direction: column; gap: 10px">
<span style="font-family: var(--font-plex-mono), monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">First principles</span>
<label style="display: flex; align-items: center; gap: 16px; padding: 14px 16px; border-radius: 14px; border: 2px solid #E2DED3; background: #FFFFFF">
<input type="checkbox" style="width: 20px; height: 20px; accent-color: #2E4BDB; flex-shrink: 0">
<span style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px"><span style="display: flex; align-items: center; gap: 10px"><span style="font-size: 16px; font-weight: 600">6 · Thinking from first principles</span><span style="padding: 2px 8px; border-radius: 999px; background: #ECE9E0; color: #4A4E57; font-size: 12px; font-weight: 600">Not started</span></span><span style="font-size: 13px; color: #4A4E57">4 cards · none seen yet</span></span>
<span aria-hidden="true" style="width: 160px; display: flex; gap: 2px; height: 10px"><span style="flex: 1 1 0; border-radius: 4px; background: #BAC6FA"></span></span>
</label>
</div>

<div style="display: flex; gap: 16px; font-size: 13px; color: #4A4E57">
<span style="display: flex; align-items: center; gap: 6px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #BAC6FA"></span>New</span>
<span style="display: flex; align-items: center; gap: 6px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #7F95F0"></span>Learning</span>
<span style="display: flex; align-items: center; gap: 6px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #3F5BDE"></span>Solid</span>
<span style="display: flex; align-items: center; gap: 6px"><span style="width: 10px; height: 10px; border-radius: 3px; background: #1A2F96"></span>Mastered</span>
</div>
</section>

<aside aria-labelledby="deck-title" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 22px">
<div style="display: flex; flex-direction: column; gap: 4px">
<h2 id="deck-title" style="margin: 0; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #5A5E66">Your deck</h2>
<span style="font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 44px; line-height: 1.05">11 cards</span>
<span style="font-size: 14px; color: #4A4E57">From 2 lessons · Boolean logic, Logic gates</span>
</div>

<fieldset style="margin: 0; padding: 0; border: 0; display: flex; flex-direction: column; gap: 8px">
<legend style="padding: 0; margin-bottom: 8px; font-size: 15px; font-weight: 600">Which cards</legend>
<label style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 14px; border-radius: 12px; border: 2px solid #E2DED3; font-size: 14px"><input type="radio" name="which" style="width: 18px; height: 18px; accent-color: #2E4BDB">All cards<span style="margin-left: auto; font-family: var(--font-plex-mono), monospace; color: #4A4E57">11</span></label>
<label style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 14px; border-radius: 12px; border: 2px solid #2E4BDB; background: #F3F5FF; font-size: 14px; font-weight: 600"><input type="radio" name="which" checked="" style="width: 18px; height: 18px; accent-color: #2E4BDB">Weak cards only<span style="margin-left: auto; font-family: var(--font-plex-mono), monospace; font-weight: 500">6</span></label>
<label style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 14px; border-radius: 12px; border: 2px solid #E2DED3; font-size: 14px"><input type="radio" name="which" style="width: 18px; height: 18px; accent-color: #2E4BDB">Due cards only<span style="margin-left: auto; font-family: var(--font-plex-mono), monospace; color: #4A4E57">4</span></label>
</fieldset>

<fieldset style="margin: 0; padding: 0; border: 0; display: flex; flex-direction: column; gap: 8px">
<legend style="padding: 0; margin-bottom: 8px; font-size: 15px; font-weight: 600">Formats</legend>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">
<label style="display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: 14px"><input type="checkbox" checked="" style="width: 18px; height: 18px; accent-color: #2E4BDB">Choices</label>
<label style="display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: 14px"><input type="checkbox" checked="" style="width: 18px; height: 18px; accent-color: #2E4BDB">Flashcards</label>
<label style="display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: 14px"><input type="checkbox" checked="" style="width: 18px; height: 18px; accent-color: #2E4BDB">Cloze</label>
<label style="display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: 14px"><input type="checkbox" checked="" style="width: 18px; height: 18px; accent-color: #2E4BDB">Short answer</label>
</div>
</fieldset>

<div style="display: flex; flex-direction: column; gap: 10px; margin-top: 4px">
<a href="/practicev2/session" style="display: flex; align-items: center; justify-content: center; gap: 12px; height: 60px; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; margin-bottom: 5px">Start 6 cards
<kbd style="height: 24px; box-sizing: border-box; padding: 0 7px; display: inline-flex; align-items: center; border: 1px solid #9DB43A; border-bottom-width: 2px; border-radius: 6px; background: #E8F7A6; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none">Enter</kbd></a>
<button type="button" style="height: 48px; border-radius: 14px; border: 2px solid #D5D0C3; background: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 600; color: #16181D">Save as a deck</button>
</div>
</aside>

</div>
</div>`;
