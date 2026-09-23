import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatAskActivity,
  readAskActivityMailConfiguration,
  sendAskActivityEmail,
} from "../lib/chat/activity-mail";

afterEach(() => {
  vi.unstubAllEnvs();
});

const activity = {
  name: "<Ada> & Co",
  email: "ada@example.com",
  question: "Can you explain <Gradly> & the shortener?",
  consent: "no_store" as const,
  submittedAt: "2026-09-22T12:00:00.000Z",
};

describe("Ask activity email", () => {
  it("requires all server-side configuration values", () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("ASK_ACTIVITY_FROM_EMAIL", "Ask <ask@example.com>");
    vi.stubEnv("ASK_ACTIVITY_TO_EMAIL", "");
    expect(readAskActivityMailConfiguration()).toBeNull();

    vi.stubEnv("ASK_ACTIVITY_TO_EMAIL", "owner@example.com");
    expect(readAskActivityMailConfiguration()).toEqual({
      apiKey: "test-key",
      from: "Ask <ask@example.com>",
      to: "owner@example.com",
    });
  });

  it("formats question-only text and escapes HTML", () => {
    const message = formatAskActivity(activity);
    expect(message.subject).toBe("New Ask Animesh question");
    expect(message.text).toContain(activity.question);
    expect(message.text).toContain("Chat history not saved");
    expect(message.html).toContain("&lt;Gradly&gt; &amp; the shortener?");
    expect(message.html).toContain("&lt;Ada&gt; &amp; Co");
    expect(message.html).not.toContain("<Gradly>");
  });

  it("posts the notification to Resend", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const result = await sendAskActivityEmail(activity, {
      apiKey: "test-key",
      from: "Ask <ask@example.com>",
      to: "owner@example.com",
    }, fetcher);

    expect(result).toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledOnce();
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.headers.Authorization).toBe("Bearer test-key");
    const body = JSON.parse(options.body);
    expect(body.to).toEqual(["owner@example.com"]);
    expect(body.reply_to).toBe("ada@example.com");
    expect(body.text).toContain(activity.question);
    expect(body.text).not.toContain("assistant");
  });

  it("formats the contact notification without a question", () => {
    const message = formatAskActivity({ name: "Ada", email: "ada@example.com", consent: "no_store", submittedAt: activity.submittedAt });
    expect(message.subject).toBe("New Ask Animesh visitor");
    expect(message.text).toContain("Email: ada@example.com");
    expect(message.text).not.toContain("Question:");
  });

  it("returns the provider status for a rejected request", async () => {
    const result = await sendAskActivityEmail(activity, {
      apiKey: "test-key",
      from: "Ask <ask@example.com>",
      to: "owner@example.com",
    }, vi.fn().mockResolvedValue(new Response(null, { status: 429 })));

    expect(result).toEqual({ ok: false, status: 429 });
  });
});
