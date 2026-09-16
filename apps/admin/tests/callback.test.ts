import { beforeEach, describe, expect, it, vi } from "vitest";
const mock = vi.hoisted(() => ({
  exchange: vi.fn(),
  getUser: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("../lib/auth", () => ({
  authClient: async () => ({
    auth: {
      exchangeCodeForSession: mock.exchange,
      getUser: mock.getUser,
      signOut: mock.signOut,
    },
  }),
}));
import { GET } from "../app/auth/callback/route";
const owner = {
  id: "owner",
  email: "owner@example.com",
  email_confirmed_at: "2026-01-01",
  app_metadata: { provider: "google" },
  identities: [{ provider: "google" }],
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("OWNER_USER_ID", owner.id);
  vi.stubEnv("OWNER_GOOGLE_EMAIL", owner.email);
  vi.stubEnv("ADMIN_ORIGIN", "http://localhost:3003");
  mock.exchange.mockResolvedValue({ error: null });
  mock.getUser.mockResolvedValue({ data: { user: owner }, error: null });
  mock.signOut.mockResolvedValue({ error: null });
});
describe("OAuth callback", () => {
  it("verifies the owner through the client that exchanged the code", async () => {
    const response = await GET(new Request("http://localhost:3003/auth/callback?code=test"));
    expect(response.headers.get("Location")).toBe("http://localhost:3003/links");
    expect(mock.getUser).toHaveBeenCalledOnce();
    expect(mock.signOut).not.toHaveBeenCalled();
  });
  it("rejects mismatched owners and logs only comparison results", async () => {
    mock.getUser.mockResolvedValue({ data: { user: { ...owner, id: "other" } }, error: null });
    const log = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const response = await GET(new Request("http://localhost:3003/auth/callback?code=test"));
      expect(response.headers.get("Location")).toBe("/?error=access");
      expect(mock.signOut).toHaveBeenCalledOnce();
      expect(log).toHaveBeenCalledWith("oauth_owner_rejected", {
        idMatches: false, emailMatches: true, emailVerified: true,
        googleProvider: true, googleIdentity: true,
      });
      expect(JSON.stringify(log.mock.calls)).not.toContain(owner.email);
    } finally { log.mockRestore(); }
  });
  it("fails closed on code exchange and session verification errors", async () => {
    const log = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      mock.exchange.mockResolvedValueOnce({ error: new Error("private") });
      expect((await GET(new Request("http://localhost:3003/auth/callback?code=test"))).headers.get("Location")).toBe("/?error=access");
      expect(mock.getUser).not.toHaveBeenCalled();
      mock.getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error("private") });
      expect((await GET(new Request("http://localhost:3003/auth/callback?code=test"))).headers.get("Location")).toBe("/?error=access");
      expect(mock.signOut).toHaveBeenCalledOnce();
      expect(JSON.stringify(log.mock.calls)).not.toContain("private");
    } finally { log.mockRestore(); }
  });
});
