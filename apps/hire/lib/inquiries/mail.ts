import type { Inquiry } from "@/lib/inquiries/schema";

export interface MailConfiguration {
  apiKey: string;
  from: string;
  to: string;
}

export type MailResult = { ok: true } | { ok: false; status?: number };

export function readMailConfiguration(): MailConfiguration | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL;
  const to = process.env.INQUIRY_TO_EMAIL;

  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export function formatInquiry(inquiry: Inquiry) {
  const entries = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Company", inquiry.company],
    ["Budget", inquiry.budget],
    ["Timing", inquiry.timing],
    ["What needs to be built or fixed", inquiry.summary],
  ] as const;

  return {
    subject: `New inquiry from ${inquiry.name} at ${inquiry.company}`,
    text: entries.map(([label, value]) => `${label}:\n${value}`).join("\n\n"),
    html: entries.map(([label, value]) => `<p><strong>${label}</strong><br>${escapeHtml(value).replaceAll("\n", "<br>")}</p>`).join(""),
  };
}

export async function sendInquiryEmail(
  inquiry: Inquiry,
  configuration: MailConfiguration,
  fetcher: typeof fetch = fetch,
): Promise<MailResult> {
  const message = formatInquiry(inquiry);
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${configuration.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: configuration.from,
      to: [configuration.to],
      reply_to: inquiry.email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  return response.ok ? { ok: true } : { ok: false, status: response.status };
}
