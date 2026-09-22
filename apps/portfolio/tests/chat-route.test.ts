import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { handleChat, type ChatDependencies } from "../lib/chat/handler";

function request() {
  return new NextRequest("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.12",
    },
    body: JSON.stringify({
      sessionId: "a".repeat(24),
      sessionToken: "b".repeat(43),
      consent: "no_store",
      consentVersion: "v1",
      messages: [{ role: "user", text: "What did you build at Gradly?" }],
    }),
  });
}

function dependencies(overrides: Partial<ChatDependencies> = {}): ChatDependencies {
  const ai = {
    moderate: vi.fn().mockResolvedValue(false),
    classify: vi.fn().mockResolvedValue("in_scope"),
    hasEvidence: vi.fn().mockResolvedValue(true),
    streamAnswer: vi.fn().mockResolvedValue({
      deltas: (async function* () {
        yield "I built ";
        yield "systems.";
      })(),
      sources: vi.fn().mockResolvedValue([
        { id: "website", label: "Website", href: "/#work" },
      ]),
    }),
  };
  return {
    ai: ai as never,
    rateLimiter: { check: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }) } as never,
    sessionStore: { save: vi.fn(), delete: vi.fn() } as never,
    rateLimitSalt: "test-salt",
    ...overrides,
  };
}

describe("POST /api/chat core", () => {
  it("does not email an invalid request", async () => {
    const notify = vi.fn();
    const invalidRequest = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });

    const response = await handleChat(
      invalidRequest,
      dependencies({ activityNotifier: { notify } }),
    );

    expect(response.status).toBe(400);
    expect(notify).not.toHaveBeenCalled();
  });

  it("emails the latest question once for an accepted request", async () => {
    const notify = vi.fn().mockResolvedValue({ ok: true });
    const deps = dependencies({ activityNotifier: { notify } });

    await (await handleChat(request(), deps)).text();

    expect(notify).toHaveBeenCalledOnce();
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({
      question: "What did you build at Gradly?",
      consent: "no_store",
    }));
    expect(notify.mock.calls[0][0]).not.toHaveProperty("sessionId");
    expect(notify.mock.calls[0][0]).not.toHaveProperty("messages");
  });

  it("streams meta, text, trusted sources, and done", async () => {
    const deps = dependencies();
    const response = await handleChat(request(), deps);
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain("event: meta");
    expect(body).toContain("I built ");
    expect(body).toContain("Website");
    expect(body).toContain("event: done");
    expect(deps.ai!.moderate).toHaveBeenCalledWith(
      "user: What did you build at Gradly?",
    );
    expect(deps.ai!.classify).toHaveBeenCalledWith(
      "user: What did you build at Gradly?",
    );
  });

  it("classifies the full bounded conversation", async () => {
    const deps = dependencies();
    const conversationRequest = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sessionId: "a".repeat(24),
        sessionToken: "b".repeat(43),
        consent: "no_store",
        consentVersion: "v1",
        messages: [
          { role: "user", text: "First question" },
          { role: "assistant", text: "Earlier answer" },
          { role: "user", text: "Follow up" },
        ],
      }),
    });

    await (await handleChat(conversationRequest, deps)).text();

    const transcript =
      "user: First question\nassistant: Earlier answer\nuser: Follow up";
    expect(deps.ai!.moderate).toHaveBeenCalledWith(transcript);
    expect(deps.ai!.classify).toHaveBeenCalledWith(transcript);
  });

  it("streams the full answer but persists at most 4000 assistant characters", async () => {
    const save = vi.fn();
    const deps = dependencies({ sessionStore: { save } as never });
    (deps.ai!.streamAnswer as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue({
      deltas: (async function* () {
        yield "a".repeat(3_000);
        yield "b".repeat(3_000);
      })(),
      sources: vi.fn().mockResolvedValue([]),
    });
    const persistentRequest = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sessionId: "a".repeat(24),
        sessionToken: "b".repeat(43),
        consent: "persist_30d",
        consentVersion: "v1",
        messages: [{ role: "user", text: "Tell me more." }],
      }),
    });

    const body = await (await handleChat(persistentRequest, deps)).text();

    expect(body).toContain("b".repeat(1_000));
    const saved = save.mock.calls[0]?.[0].messages;
    expect(saved.at(-1).role).toBe("assistant");
    expect(saved.at(-1).text).toHaveLength(4_000);
    expect(saved.at(-1).text).toBe(`${"a".repeat(3_000)}${"b".repeat(1_000)}`);
  });

  it("returns a grounded abstention when retrieval has no evidence", async () => {
    const deps = dependencies();
    (deps.ai!.hasEvidence as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(false);
    const body = await (await handleChat(request(), deps)).text();
    expect(body).toContain("don’t have enough information");
    expect(body).not.toContain("I built systems");
  });

  it.each(["unrelated", "prompt_injection", "unsafe", "needs_clarification"])(
    "handles the %s refusal category without retrieval",
    async (classification) => {
      const deps = dependencies();
      (deps.ai!.classify as ReturnType<typeof vi.fn>) = vi
        .fn()
        .mockResolvedValue(classification);
      const body = await (await handleChat(request(), deps)).text();
      expect(body).toContain("event: done");
      expect(deps.ai!.hasEvidence).not.toHaveBeenCalled();
    },
  );

  it("emails a question that receives a refusal", async () => {
    const notify = vi.fn().mockResolvedValue({ ok: true });
    const deps = dependencies({ activityNotifier: { notify } });
    (deps.ai!.classify as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue("unrelated");

    await (await handleChat(request(), deps)).text();

    expect(notify).toHaveBeenCalledOnce();
  });

  it("keeps chat available when activity email delivery throws", async () => {
    const notify = vi.fn().mockRejectedValue(new Error("provider secret"));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await handleChat(
      request(),
      dependencies({ activityNotifier: { notify } }),
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("event: done");
    expect(consoleError).toHaveBeenCalledWith(
      "Ask activity email delivery failed",
      expect.objectContaining({ requestId: expect.any(String) }),
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain("provider secret");
    consoleError.mockRestore();
  });

  it("sanitizes an OpenAI timeout", async () => {
    const deps = dependencies();
    (deps.ai!.moderate as ReturnType<typeof vi.fn>) = vi
      .fn()
      .mockRejectedValue(new Error("secret upstream timeout detail"));
    const response = await handleChat(request(), deps);
    const body = await response.text();
    expect(response.status).toBe(503);
    expect(body).toContain("unavailable right now");
    expect(body).not.toContain("secret upstream");
  });

  it("emits a sanitized error for a malformed upstream stream", async () => {
    const deps = dependencies();
    (deps.ai!.streamAnswer as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue({
      deltas: (async function* () {
        yield "Partial";
        throw new Error("malformed event");
      })(),
      sources: vi.fn(),
    });
    const body = await (await handleChat(request(), deps)).text();
    expect(body).toContain("generation_failed");
    expect(body).not.toContain("malformed event");
  });

  it("returns 429 with retry guidance", async () => {
    const notify = vi.fn();
    const response = await handleChat(
      request(),
      dependencies({
        activityNotifier: { notify },
        rateLimiter: {
          check: vi.fn().mockResolvedValue({ allowed: false, retryAfterSeconds: 42 }),
        } as never,
      }),
    );
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("42");
    expect(notify).not.toHaveBeenCalled();
  });

  it("fails closed when Redis rate limiting fails", async () => {
    const response = await handleChat(
      request(),
      dependencies({
        rateLimiter: {
          check: vi.fn().mockRejectedValue(new Error("redis down")),
        } as never,
      }),
    );
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("redis down");
  });
});
