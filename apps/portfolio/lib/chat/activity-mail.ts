import type { ConsentMode } from "./types";

export interface AskActivity {
  question: string;
  consent: ConsentMode;
  submittedAt: string;
}

export interface AskActivityNotifier {
  notify(activity: AskActivity): Promise<MailResult>;
}

export interface AskActivityMailConfiguration {
  apiKey: string;
  from: string;
  to: string;
}

export type MailResult = { ok: true } | { ok: false; status?: number };

export function readAskActivityMailConfiguration(): AskActivityMailConfiguration | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ASK_ACTIVITY_FROM_EMAIL;
  const to = process.env.ASK_ACTIVITY_TO_EMAIL;

  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export function formatAskActivity(activity: AskActivity) {
  const storageLabel = activity.consent === "persist_30d"
    ? "Saved for 30 days"
    : "Chat history not saved";

  return {
    subject: "New Ask Animesh question",
    text: [
      `Submitted: ${activity.submittedAt}`,
      `Chat setting: ${storageLabel}`,
      "Question:",
      activity.question,
    ].join("\n\n"),
    html: [
      `<p><strong>Submitted</strong><br>${escapeHtml(activity.submittedAt)}</p>`,
      `<p><strong>Chat setting</strong><br>${escapeHtml(storageLabel)}</p>`,
      `<p><strong>Question</strong><br>${escapeHtml(activity.question).replaceAll("\n", "<br>")}</p>`,
    ].join(""),
  };
}

export async function sendAskActivityEmail(
  activity: AskActivity,
  configuration: AskActivityMailConfiguration,
  fetcher: typeof fetch = fetch,
): Promise<MailResult> {
  const message = formatAskActivity(activity);
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${configuration.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: configuration.from,
      to: [configuration.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  return response.ok ? { ok: true } : { ok: false, status: response.status };
}

export function getAskActivityNotifier(): AskActivityNotifier | null {
  const configuration = readAskActivityMailConfiguration();
  if (!configuration) return null;

  return {
    notify: (activity) => sendAskActivityEmail(activity, configuration),
  };
}
