import { describe, it, expect, vi, beforeEach } from "vitest";
const mock = vi.hoisted(() => ({ user: vi.fn(), rpc: vi.fn(), from: vi.fn() }));
vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser: mock.user },
    rpc: mock.rpc,
    from: mock.from,
  }),
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [], set: () => {} }),
}));
import { requireOwner } from "../lib/auth";
import { GET as directoryApi, POST } from "../app/api/links/route";
import { GET as exportApi } from "../app/api/links/export/route";
import { GET as analyticsApi } from "../app/api/links/[id]/analytics/route";
import { GET as qrApi } from "../app/api/links/[id]/qr/route";
import { jsonBody } from "../lib/http";
const user = {
  id: "owner",
  email: "owner@example.com",
  email_confirmed_at: "2026-01-01",
  app_metadata: { provider: "google" },
  identities: [{ provider: "google" }],
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://isolated.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "public-test-key");
  vi.stubEnv("ADMIN_ORIGIN", "https://admin.animesh.cc");
  vi.stubEnv("OWNER_USER_ID", "owner");
  vi.stubEnv("OWNER_GOOGLE_EMAIL", "owner@example.com");
});
describe("server verification and direct API access", () => {
  it("rejects expired sessions before database access", async () => {
    mock.user.mockResolvedValue({
      data: { user: null },
      error: { message: "expired" },
    });
    await expect(requireOwner()).rejects.toMatchObject({ status: 401 });
    const request = new Request("https://admin.animesh.cc/api/links");
    for (const call of [
      () => directoryApi(request),
      () => exportApi(request),
      () => analyticsApi(request, { params: Promise.resolve({ id: "a" }) }),
      () => qrApi(request, { params: Promise.resolve({ id: "a" }) }),
    ]) {
      const response = await call();
      expect(response.status).toBe(401);
      expect(response.headers.get("Cache-Control")).toContain("no-store");
    }
    expect(mock.rpc).not.toHaveBeenCalled();
    expect(mock.from).not.toHaveBeenCalled();
  });
  it("denies unauthorized Google accounts and missing configuration", async () => {
    mock.user.mockResolvedValue({
      data: { user: { ...user, email: "other@example.com" } },
      error: null,
    });
    expect(
      (await directoryApi(new Request("https://admin.animesh.cc/api/links")))
        .status,
    ).toBe(403);
    vi.stubEnv("OWNER_USER_ID", "");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(
      (await directoryApi(new Request("https://admin.animesh.cc/api/links")))
        .status,
    ).toBe(503);
    expect(mock.rpc).not.toHaveBeenCalled();
    log.mockRestore();
  });
  it("blocks cross-origin mutations even with a valid owner session", async () => {
    mock.user.mockResolvedValue({ data: { user }, error: null });
    const response = await POST(
      new Request("https://admin.animesh.cc/api/links", {
        method: "POST",
        headers: {
          origin: "https://evil.example",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination: "https://example.com" }),
      }),
    );
    expect(response.status).toBe(403);
    expect(mock.from).not.toHaveBeenCalled();
  });
  it("bounds bodies and rejects malformed JSON/type", async () => {
    const headers = {
      origin: "https://admin.animesh.cc",
      "Content-Type": "application/json",
    };
    await expect(
      jsonBody(
        new Request("https://admin.animesh.cc/api", {
          method: "POST",
          headers,
          body: "x".repeat(20000),
        }),
      ),
    ).rejects.toMatchObject({ status: 413 });
    await expect(
      jsonBody(
        new Request("https://admin.animesh.cc/api", {
          method: "POST",
          headers,
          body: "[]",
        }),
      ),
    ).rejects.toMatchObject({ status: 400 });
    await expect(
      jsonBody(
        new Request("https://admin.animesh.cc/api", {
          method: "POST",
          headers: { ...headers, "Content-Type": "text/plain" },
          body: "{}",
        }),
      ),
    ).rejects.toMatchObject({ status: 415 });
  });
});
