import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { handleContact } from "../lib/chat/contact-handler";
import { contactRequestSchema, visitorContactSchema } from "../lib/chat/validation";
import { RateLimiter } from "../lib/chat/rate-limit";

const payload = {
  sessionId: "a".repeat(24),
  sessionToken: "b".repeat(43),
  consent: "no_store",
  consentVersion: "v1",
  contact: { name: " Ada Visitor ", email: " ADA@Example.com " },
};

function request(body: unknown = payload) {
  return new NextRequest("http://localhost/api/chat/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.12" },
    body: JSON.stringify(body),
  });
}

function dependencies() {
  const notify = vi.fn().mockResolvedValue({ ok: true });
  const check = vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
  return { notify, check, deps: { activityNotifier: { notify }, rateLimiter: { check } as never, rateLimitSalt: "test-salt" } };
}

describe("Ask contact submission", () => {
  it("normalizes valid details and rejects invalid or oversized details", () => {
    expect(visitorContactSchema.parse(payload.contact)).toEqual({ name: "Ada Visitor", email: "ada@example.com" });
    expect(contactRequestSchema.safeParse({ ...payload, contact: { name: " ", email: "bad" } }).success).toBe(false);
    expect(visitorContactSchema.safeParse({ name: "x".repeat(101), email: "ada@example.com" }).success).toBe(false);
  });

  it("sends exactly one contact notification after separate rate-limit checks", async () => {
    const { notify, check, deps } = dependencies();
    const response = await handleContact(request(), deps);
    expect(response.status).toBe(200);
    expect(notify).toHaveBeenCalledOnce();
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ name: "Ada Visitor", email: "ada@example.com", consent: "no_store" }));
    expect(notify.mock.calls[0][0]).not.toHaveProperty("question");
    expect(check).toHaveBeenCalledTimes(2);
    expect(check.mock.calls.every((call) => call[2] === "contact")).toBe(true);
  });

  it("does not notify for invalid or rate-limited submissions", async () => {
    const { notify, check, deps } = dependencies();
    expect((await handleContact(request({ ...payload, contact: { name: "", email: "bad" } }), deps)).status).toBe(400);
    expect(notify).not.toHaveBeenCalled();
    check.mockResolvedValue({ allowed: false, retryAfterSeconds: 42 });
    const response = await handleContact(request(), deps);
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("42");
    expect(notify).not.toHaveBeenCalled();
  });

  it("keeps contact submission usable without mail configuration and after provider failure", async () => {
    const { deps, notify } = dependencies();
    expect((await handleContact(request(), { ...deps, activityNotifier: null })).status).toBe(200);
    notify.mockRejectedValue(new Error("private provider detail"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await handleContact(request(), deps)).status).toBe(200);
    expect(JSON.stringify(error.mock.calls)).not.toContain("private provider detail");
    expect(JSON.stringify(error.mock.calls)).not.toContain("ada@example.com");
    error.mockRestore();
  });

  it("keeps contact submission usable after a provider rejection", async () => {
    const { deps, notify } = dependencies();
    notify.mockResolvedValue({ ok: false, status: 429 });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await handleContact(request(), deps)).status).toBe(200);
    expect(error).toHaveBeenCalledWith("Ask contact email delivery failed", expect.objectContaining({ providerStatus: 429 }));
    expect(JSON.stringify(error.mock.calls)).not.toContain("ada@example.com");
    error.mockRestore();
  });

  it("uses independent contact and question buckets", async () => {
    const values = new Map<string, number>();
    const redis = {
      incr: vi.fn(async (key: string) => {
        const next = (values.get(key) ?? 0) + 1;
        values.set(key, next);
        return next;
      }),
      expire: vi.fn(),
    };
    const limiter = new RateLimiter(redis as never);
    await limiter.check("same-identity", 0, "contact");
    await limiter.check("same-identity", 0, "question");
    expect([...values.keys()].filter((key) => key.includes(":contact:"))).toHaveLength(2);
    expect([...values.keys()].filter((key) => !key.includes(":contact:"))).toHaveLength(2);
  });
});
