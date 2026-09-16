import type { Inquiry } from "@/lib/inquiries/schema";

export interface MailConfiguration {
  apiKey: string;
  from: string;
  to: string;
}

export type MailResult = { ok: true } | { ok: false; status?: number };

interface EmailMessage {
  to: readonly string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

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

export function formatAcknowledgement(inquiry: Inquiry) {
  const text = [
    `Hi ${inquiry.name},`,
    "Thanks for sending the brief. I received it and will review what you shared.",
    "Here is a copy of the details:",
    `Company: ${inquiry.company}`,
    `Budget: ${inquiry.budget}`,
    `Timing: ${inquiry.timing}`,
    "",
    inquiry.summary,
    "",
    "Best,",
    "Animesh",
  ].join("\n\n");

  const html = [
    `<p>Hi ${escapeHtml(inquiry.name)},</p>`,
    "<p>Thanks for sending the brief. I received it and will review what you shared.</p>",
    "<p>Here is a copy of the details:</p>",
    "<ul>",
    `<li><strong>Company:</strong> ${escapeHtml(inquiry.company)}</li>`,
    `<li><strong>Budget:</strong> ${escapeHtml(inquiry.budget)}</li>`,
    `<li><strong>Timing:</strong> ${escapeHtml(inquiry.timing)}</li>`,
    "</ul>",
    `<p>${escapeHtml(inquiry.summary).replaceAll("\n", "<br>")}</p>`,
    "<p>Best,<br>Animesh</p>",
  ].join("");

  return {
    subject: "I received your brief",
    text,
    html,
  };
}

async function sendEmail(
  message: EmailMessage,
  configuration: MailConfiguration,
  fetcher: typeof fetch = fetch,
): Promise<MailResult> {
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${configuration.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: configuration.from,
      to: message.to,
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  return response.ok ? { ok: true } : { ok: false, status: response.status };
}

export async function sendInquiryEmail(
  inquiry: Inquiry,
  configuration: MailConfiguration,
  fetcher: typeof fetch = fetch,
): Promise<MailResult> {
  const message = formatInquiry(inquiry);
  return sendEmail({
    to: [configuration.to],
    replyTo: inquiry.email,
    subject: message.subject,
    text: message.text,
    html: message.html,
  }, configuration, fetcher);
}

export async function sendAcknowledgementEmail(
  inquiry: Inquiry,
  configuration: MailConfiguration,
  fetcher: typeof fetch = fetch,
): Promise<MailResult> {
  const message = formatAcknowledgement(inquiry);
  return sendEmail({
    to: [inquiry.email],
    subject: message.subject,
    text: message.text,
    html: message.html,
  }, configuration, fetcher);
}
