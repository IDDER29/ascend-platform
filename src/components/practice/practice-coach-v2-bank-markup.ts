/** Coach screen body (no mock chrome) — 07-card-bank-desktop.html */
export const PRACTICE_COACH_V2_BANK_CSS = `.practice-coach-v2-bank{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-bank .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-bank *,
.practice-coach-v2-bank *::before,
.practice-coach-v2-bank *::after{
  box-sizing:border-box;
}
.practice-coach-v2-bank .coach-bank-card-list{
  max-width:100%;
}
.practice-coach-v2-bank .coach-bank-table{
  table-layout:auto;
}
.practice-coach-v2-bank .coach-bank-search input{
  min-width:0;
}
.practice-coach-v2-bank a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-bank a[href]:active{transform:translateY(2px)}
.practice-coach-v2-bank a:focus-visible,
.practice-coach-v2-bank button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-bank .coach-path-grid,
  .practice-coach-v2-bank [style*="grid-template-columns: minmax(0, 1fr)"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-bank h1{font-size:36px !important}
  .practice-coach-v2-bank .coach-bank-hero{
    align-items:flex-start !important;
    flex-direction:column;
  }
  .practice-coach-v2-bank .coach-bank-search{
    width:100% !important;
  }
  .practice-coach-v2-bank .coach-bank-strength{
    margin-left:0 !important;
    max-width:100%;
    overflow-x:auto;
  }
  .practice-coach-v2-bank .coach-bank-card-list{
    overflow-x:auto !important;
  }
  .practice-coach-v2-bank .coach-bank-table{
    min-width:940px;
  }
}`;

export const PRACTICE_COACH_V2_BANK_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<nav aria-label="Breadcrumb" style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #5A5E66">
<a href="/practicev2" style="color: #4A4E57; text-decoration: none">Practice</a><span aria-hidden="true">/</span><span aria-current="page" style="color: #16181D; font-weight: 600">Card bank</span>
</nav>
<div class="coach-bank-hero" style="display: flex; justify-content: space-between; align-items: flex-end; gap: 24px">
<div style="display: flex; flex-direction: column; gap: 10px">
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 48px; line-height: 1; letter-spacing: -0.03em">Card bank</h1>
<p style="margin: 0; font-size: 17px; color: #4A4E57">Every card you've unlocked, how well you know it, and when it comes back.</p>
</div>
<span style="font-family: var(--font-plex-mono), monospace; font-size: 14px; color: #4A4E57">32 cards · 8 due today</span>
</div>

<div class="coach-bank-filters" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap">
<label class="coach-bank-search" style="display: flex; align-items: center; gap: 10px; width: 340px; height: 48px; box-sizing: border-box; padding: 0 14px; border-radius: 12px; border: 2px solid #E2DED3; background: #FFFFFF">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A5E66" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>
<span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)">Search cards</span>
<input type="search" placeholder="Search cards" style="flex-grow: 1; border: 0; outline: none; background: transparent; font-family: inherit; font-size: 15px; color: #16181D"></label>
<label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4A4E57">Lesson
<select style="height: 48px; padding: 0 12px; border-radius: 12px; border: 2px solid #E2DED3; background: #FFFFFF; font-family: inherit; font-size: 14px; color: #16181D"><option>All lessons</option></select></label>
<label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4A4E57">Format
<select style="height: 48px; padding: 0 12px; border-radius: 12px; border: 2px solid #E2DED3; background: #FFFFFF; font-family: inherit; font-size: 14px; color: #16181D"><option>All formats</option></select></label>
<div class="coach-bank-strength" role="group" aria-label="Strength" style="display: flex; gap: 4px; padding: 4px; border-radius: 12px; background: #ECE9E0; margin-left: auto">
<button type="button" aria-pressed="true" style="height: 40px; padding: 0 12px; border: 0; border-radius: 9px; background: #FFFFFF; box-shadow: 0 1px 3px rgba(22,24,29,0.12); font-family: inherit; font-size: 13px; font-weight: 600; color: #16181D">All 32</button>
<button type="button" aria-pressed="false" style="height: 40px; padding: 0 12px; border: 0; border-radius: 9px; background: transparent; font-family: inherit; font-size: 13px; color: #4A4E57">New 4</button>
<button type="button" aria-pressed="false" style="height: 40px; padding: 0 12px; border: 0; border-radius: 9px; background: transparent; font-family: inherit; font-size: 13px; color: #4A4E57">Learning 13</button>
<button type="button" aria-pressed="false" style="height: 40px; padding: 0 12px; border: 0; border-radius: 9px; background: transparent; font-family: inherit; font-size: 13px; color: #4A4E57">Solid 11</button>
<button type="button" aria-pressed="false" style="height: 40px; padding: 0 12px; border: 0; border-radius: 9px; background: transparent; font-family: inherit; font-size: 13px; color: #4A4E57">Mastered 4</button>
</div>
</div>

<section class="coach-bank-card-list" aria-label="Cards" style="background: #FFFFFF; border: 2px solid #E2DED3; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 20px; background: #16181D; color: #F6F4EE">
<span style="font-size: 14px"><strong style="font-weight: 600">2 selected</strong></span>
<div style="display: flex; gap: 8px">
<button type="button" style="height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid #4A4E57; background: transparent; font-family: inherit; font-size: 14px; color: #F6F4EE">Clear</button>
<a href="/practicev2/session" style="display: flex; align-items: center; height: 40px; padding: 0 16px; border-radius: 10px; background: #D7F26B; color: #16181D; font-size: 14px; font-weight: 700; text-decoration: none">Practice these 2</a>
</div>
</div>
<table class="coach-bank-table" style="width: 100%; border-collapse: collapse; font-size: 15px">
<thead>
<tr style="text-align: left; font-size: 12px; color: #5A5E66; text-transform: uppercase; letter-spacing: 0.06em; background: #F9F8F4">
<th scope="col" style="width: 56px; padding: 12px 0 12px 20px; font-weight: 500"><span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)">Select</span></th>
<th scope="col" style="padding: 12px 12px; font-weight: 500">Card</th>
<th scope="col" style="padding: 12px 12px; font-weight: 500">Format</th>
<th scope="col" style="padding: 12px 12px; font-weight: 500">Lesson</th>
<th scope="col" style="padding: 12px 12px; font-weight: 500">Strength</th>
<th scope="col" style="padding: 12px 12px; font-weight: 500">Next due ↑</th>
<th scope="col" style="padding: 12px 20px 12px 12px; font-weight: 500; text-align: right">Correct</th>
</tr>
</thead>
<tbody>

<tr style="border-top: 1px solid #ECE9E0; background: #F3F5FF">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" checked="" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500">How many different values can 3 bits represent?</td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Choices</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">Counting in binary</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span></span>Learning</span></td>
<td style="padding: 14px 12px; font-size: 14px; font-weight: 600; color: #9A3412">Today</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px">1/2</td>
</tr>

<tr style="border-top: 1px solid #ECE9E0; background: #F3F5FF">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" checked="" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500">What is <span style="font-family: var(--font-plex-mono), monospace">1 AND 0</span>?</td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Short answer</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">Boolean logic</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span></span>Learning</span></td>
<td style="padding: 14px 12px; font-size: 14px; font-weight: 600; color: #9A3412">Today</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px">0/1</td>
</tr>

<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500">What is <span style="font-family: var(--font-plex-mono), monospace">1 XOR 1</span>?</td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Short answer</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">Logic gates</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span></span>Learning</span></td>
<td style="padding: 14px 12px; font-size: 14px; font-weight: 600; color: #9A3412">Today</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px">0/1</td>
</tr>

<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500">Write 5 in binary.</td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Short answer</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">Counting in binary</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span></span>Learning</span></td>
<td style="padding: 14px 12px; font-size: 14px; font-weight: 600; color: #9A3412">Today</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px">1/2</td>
</tr>

<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500">A single bit can hold one of ___ values.</td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Cloze</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">What is a bit?</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span></span>Solid</span></td>
<td style="padding: 14px 12px; font-size: 14px; color: #4A4E57">Sat, Sep 26</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px">3/3</td>
</tr>

<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500">Which logic gate outputs 1 only when both inputs are 1?</td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Choices</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">Logic gates</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span></span>Solid</span></td>
<td style="padding: 14px 12px; font-size: 14px; color: #4A4E57">Sun, Sep 27</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px">3/3</td>
</tr>

<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500">Byte</td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Flashcard</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">Bytes and hex</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #3F5BDE"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span></span>Solid</span></td>
<td style="padding: 14px 12px; font-size: 14px; color: #4A4E57">Mon, Sep 28</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px">2/2</td>
</tr>

<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500">One hex digit stands for ___ bits.</td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Cloze</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">Bytes and hex</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #1A2F96"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #1A2F96"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #1A2F96"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #1A2F96"></span></span>Mastered</span></td>
<td style="padding: 14px 12px; font-size: 14px; color: #4A4E57">Sun, Oct 4</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px">4/4</td>
</tr>

<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500"><span style="font-family: var(--font-plex-mono), monospace">NOT 0</span></td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Flashcard</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">Boolean logic</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #1A2F96"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #1A2F96"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #1A2F96"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #1A2F96"></span></span>Mastered</span></td>
<td style="padding: 14px 12px; font-size: 14px; color: #4A4E57">Tue, Oct 6</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px">3/3</td>
</tr>

<tr style="border-top: 1px solid #ECE9E0">
<td style="padding: 14px 0 14px 20px"><input type="checkbox" aria-label="Select card" style="width: 18px; height: 18px; accent-color: #2E4BDB"></td>
<td style="padding: 14px 12px; font-weight: 500">What does it mean to reason from first principles?</td>
<td style="padding: 14px 12px"><span style="padding: 3px 9px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 12px; font-weight: 600">Flashcard</span></td>
<td style="padding: 14px 12px; color: #4A4E57; font-size: 14px">Thinking from first principles</td>
<td style="padding: 14px 12px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px"><span aria-hidden="true" style="display: flex; gap: 2px"><span style="width: 12px; height: 8px; border-radius: 2px; background: #BAC6FA"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span><span style="width: 12px; height: 8px; border-radius: 2px; background: #ECE9E0"></span></span>New</span></td>
<td style="padding: 14px 12px; font-size: 14px; color: #4A4E57">Not seen yet</td>
<td style="padding: 14px 20px 14px 12px; text-align: right; font-family: var(--font-plex-mono), monospace; font-size: 14px; color: #5A5E66">—</td>
</tr>

</tbody>
</table>
<div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-top: 1px solid #ECE9E0; font-size: 14px; color: #4A4E57">
<span>Showing 1–10 of 32</span>
<nav aria-label="Pagination" style="display: flex; gap: 8px">
<button type="button" disabled="" style="height: 44px; padding: 0 14px; border-radius: 10px; border: 2px solid #ECE9E0; background: #FFFFFF; font-family: inherit; font-size: 14px; color: #8A8D94">Previous</button>
<button type="button" style="height: 44px; padding: 0 14px; border-radius: 10px; border: 2px solid #D5D0C3; background: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 600; color: #16181D">Next</button>
</nav>
</div>
</section>
</div>`;
