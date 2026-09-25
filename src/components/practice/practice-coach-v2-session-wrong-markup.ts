/** Coach screen body (no mock chrome) — 18-session-wrong-answer-desktop.html */
export const PRACTICE_COACH_V2_SESSION_WRONG_CSS = `.practice-coach-v2-session-wrong{
  color:#16181D;
  font-family:var(--font-hanken),system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
  max-width:100%;
  background:transparent;
  padding:0;
  box-sizing:border-box;
}
.practice-coach-v2-session-wrong .coach-main{
  min-width:0;
  max-width:100%;
}
.practice-coach-v2-session-wrong sc-raw-table{display:table}
.practice-coach-v2-session-wrong sc-raw-thead{display:table-header-group}
.practice-coach-v2-session-wrong sc-raw-tbody{display:table-row-group}
.practice-coach-v2-session-wrong sc-raw-tr{display:table-row}
.practice-coach-v2-session-wrong sc-raw-th,
.practice-coach-v2-session-wrong sc-raw-td{display:table-cell}
.practice-coach-v2-session-wrong a[href]:hover{filter:brightness(.97)}
.practice-coach-v2-session-wrong a[href]:active{transform:translateY(2px)}
.practice-coach-v2-session-wrong a:focus-visible,
.practice-coach-v2-session-wrong button:focus-visible{
  outline:3px solid #5A74E6;
  outline-offset:3px;
}
@media (max-width:1279px){
  .practice-coach-v2-session-wrong .coach-path-grid,
  .practice-coach-v2-session-wrong [style*="grid-template-columns: minmax(0, 1fr)"]{
    grid-template-columns:1fr !important;
  }
}
@media (max-width:639px){
  .practice-coach-v2-session-wrong h1{font-size:36px !important}
}`;

export const PRACTICE_COACH_V2_SESSION_WRONG_HTML = `<div class="coach-main" style="padding: 0; display: flex; flex-direction: column; gap: 32px">
<div style="width: 760px; display: flex; flex-direction: column; gap: 24px">
<div style="display: flex; align-items: center; gap: 10px">
<span style="padding: 5px 11px; border-radius: 999px; background: #E3E8FF; color: #1F3BB8; font-size: 13px; font-weight: 600">Short answer</span>
<span style="font-size: 14px; color: #5A5E66">Foundations · Boolean logic</span>
</div>
<h1 style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 700; font-size: 40px; line-height: 1.2">What is <span style="font-family: var(--font-plex-mono), monospace; font-weight: 500">1 AND 0</span>?</h1>
<label style="display: flex; flex-direction: column; gap: 8px; font-size: 14px; color: #4A4E57">Your answer
<input type="text" value="1" readonly="" aria-invalid="true" style="height: 60px; box-sizing: border-box; padding: 0 18px; border-radius: 14px; border: 2px solid #C2410C; background: #FFF4EE; font-family: var(--font-plex-mono), monospace; font-size: 22px; color: #16181D; text-decoration: line-through"></label>
</div>
<section aria-live="polite" aria-labelledby="wr-title" style="background: #FDE7DA; border-top: 2px solid #F4B596; padding: 28px 48px 32px; display: flex; justify-content: center">
<div style="width: 760px; display: flex; flex-direction: column; gap: 22px">
<div style="display: flex; gap: 32px; align-items: flex-start">
<div style="flex-grow: 1; display: flex; gap: 16px; align-items: flex-start">
<span style="width: 48px; height: 48px; flex-shrink: 0; border-radius: 50%; background: #9A3412; color: #FFFFFF; display: flex; align-items: center; justify-content: center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></span>
<div style="display: flex; flex-direction: column; gap: 8px">
<h2 id="wr-title" style="margin: 0; font-family: var(--font-bricolage), sans-serif; font-weight: 800; font-size: 26px; color: #7C2D12">Not quite — the answer is <span style="font-family: var(--font-plex-mono), monospace; font-weight: 500; color: #16181D">0</span></h2>
<p style="margin: 0; font-size: 15px; line-height: 1.5; color: #4A1D0A">AND outputs 1 only when both inputs are 1. One input here is 0, so the result is 0.</p>
<span style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #7C2D12"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path></svg>This card comes back before the session ends.</span>
</div>
</div>
<sc-raw-table aria-label="AND truth table" style="border-collapse: separate; border-spacing: 0; background: #FFFFFF; border: 2px solid #F4B596; border-radius: 12px; font-family: var(--font-plex-mono), monospace; font-size: 14px; flex-shrink: 0; overflow: hidden">
<sc-raw-thead><sc-raw-tr style="color: #7C2D12; font-size: 12px"><sc-raw-th scope="col" style="padding: 8px 14px; font-weight: 500">A</sc-raw-th><sc-raw-th scope="col" style="padding: 8px 14px; font-weight: 500">B</sc-raw-th><sc-raw-th scope="col" style="padding: 8px 14px; font-weight: 500">A AND B</sc-raw-th></sc-raw-tr></sc-raw-thead>
<sc-raw-tbody style="text-align: center">
<sc-raw-tr><sc-raw-td style="padding: 4px 14px">0</sc-raw-td><sc-raw-td style="padding: 4px 14px">0</sc-raw-td><sc-raw-td style="padding: 4px 14px">0</sc-raw-td></sc-raw-tr>
<sc-raw-tr><sc-raw-td style="padding: 4px 14px">0</sc-raw-td><sc-raw-td style="padding: 4px 14px">1</sc-raw-td><sc-raw-td style="padding: 4px 14px">0</sc-raw-td></sc-raw-tr>
<sc-raw-tr style="background: #FDE7DA; font-weight: 500"><sc-raw-td style="padding: 4px 14px">1</sc-raw-td><sc-raw-td style="padding: 4px 14px">0</sc-raw-td><sc-raw-td style="padding: 4px 14px">0</sc-raw-td></sc-raw-tr>
<sc-raw-tr><sc-raw-td style="padding: 4px 14px 8px">1</sc-raw-td><sc-raw-td style="padding: 4px 14px 8px">1</sc-raw-td><sc-raw-td style="padding: 4px 14px 8px">1</sc-raw-td></sc-raw-tr>
</sc-raw-tbody>
</sc-raw-table>
</div>
<div style="display: flex; justify-content: flex-end; align-items: center; gap: 16px">
<button type="button" style="height: 48px; padding: 0 14px; border: 0; background: transparent; font-family: inherit; font-size: 14px; font-weight: 600; color: #7C2D12; text-decoration: underline">Typo? Count it as correct</button>
<a href="/practicev2/session/flashcard" style="display: flex; align-items: center; justify-content: center; gap: 12px; height: 56px; width: 220px; border-radius: 16px; background: #9A3412; box-shadow: 0 5px 0 #6B230B; color: #FFFFFF; font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; margin-bottom: 5px">Got it
<kbd style="height: 24px; box-sizing: border-box; padding: 0 7px; display: inline-flex; align-items: center; border: 1px solid #C2410C; border-bottom-width: 2px; border-radius: 6px; background: #7C2D12; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none; color: #FFFFFF">Enter</kbd></a>
</div>
</div>
</section>
</div>`;
