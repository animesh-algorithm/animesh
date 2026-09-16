import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/inquiries/route";
import { formatInquiry } from "@/lib/inquiries/mail";

const validPayload = () => ({
  name: "A Founder",
  email: "founder@example.com",
  company: "Example Labs",
  summary: "We need to replace a manual operations workflow with a focused internal tool.",
  budget: "$8,000–$20,000",
  timing: "Within 1–2 months",
  website: "",
  startedAt: Date.now() - 2_000,
});

const request = (body: unknown) => new Request("http://localhost/api/inquiries", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/inquiries", () => {
  it("returns field errors for an invalid payload", async () => {
    const response = await POST(request({ ...validPayload(), email: "not-an-email", summary: "short" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.code).toBe("invalid");
    expect(body.fieldErrors).toMatchObject({ email: expect.any(String), summary: expect.any(String) });
  });

  it.each([
    ["honeypot", { website: "spam.example" }],
    ["implausibly fast", { startedAt: Date.now() }],
    ["future timestamp", { startedAt: Date.now() + 10_000 }],
  ])("blocks %s submissions", async (_label, override) => {
    const response = await POST(request({ ...validPayload(), ...override }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ code: "blocked" });
  });

  it("offers the safe fallback when delivery is unconfigured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("INQUIRY_FROM_EMAIL", "");
    vi.stubEnv("INQUIRY_TO_EMAIL", "");

    const response = await POST(request(validPayload()));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ code: "unconfigured" });
  });

  it("sends a normalized inquiry without exposing provider details", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("INQUIRY_FROM_EMAIL", "Website <inquiries@example.com>");
    vi.stubEnv("INQUIRY_TO_EMAIL", "hello@example.com");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(request(validPayload()));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true, code: "sent" });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).not.toContain("test-key");
  });

  it("returns a generic failure when the provider rejects delivery", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("INQUIRY_FROM_EMAIL", "Website <inquiries@example.com>");
    vi.stubEnv("INQUIRY_TO_EMAIL", "hello@example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("provider details", { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(request(validPayload()));
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body).toMatchObject({ code: "delivery_failed" });
    expect(JSON.stringify(body)).not.toContain("provider details");
  });
});

describe("inquiry email formatting", () => {
  it("escapes browser input in HTML", () => {
    const message = formatInquiry({ ...validPayload(), name: "<script>alert(1)</script>" });
    expect(message.html).not.toContain("<script>");
    expect(message.html).toContain("&lt;script&gt;");
  });
});
