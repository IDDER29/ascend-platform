import "server-only";

/**
 * Sending email through Resend's HTTP API (no SDK). Configured by RESEND_API_KEY and EMAIL_FROM
 * (a sender on a domain verified in Resend, e.g. "Ascend <no-reply@ascend.example>").
 */
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(mail: { to: string; subject: string; text: string; html: string }): Promise<boolean> {
  if (!emailConfigured()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [mail.to], subject: mail.subject, text: mail.text, html: mail.html }),
    });
    if (!res.ok) console.error("[email] Resend refused the message:", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.error("[email] sending failed:", err);
    return false;
  }
}
