import { describe, it, expect, vi, beforeEach } from "vitest";
import { validSlug, forwardQuery, redirectResult } from "../lib/redirect";
import { collectMetadata } from "../lib/metadata";
const mocks = vi.hoisted(() => ({
  resolve: vi.fn(),
  record: vi.fn(),
  tasks: [] as (() => Promise<void>)[],
}));
vi.mock("../lib/database", () => ({
  resolveLink: mocks.resolve,
  recordClick: mocks.record,
}));
vi.mock("next/server", () => ({
  after: (fn: () => Promise<void>) => mocks.tasks.push(fn),
}));
import { GET, HEAD } from "../app/[...slug]/route";
const context = { params: Promise.resolve({ slug: ["Launch", "notes.v1"] }) };
beforeEach(() => {
  vi.clearAllMocks();
  mocks.tasks.length = 0;
});
describe("redirect contract", () => {
  it("accepts case-sensitive nested paths and rejects traversal/infrastructure", () => {
    for (const slug of ["AbC", "launch/notes.v1", "a_b-c", "A".repeat(256)])
      expect(validSlug(slug)).toBe(true);
    for (const slug of [
      "",
      "/a",
      "a/",
      "a//b",
      "a/../b",
      "a/./b",
      "api/x",
      "icon.svg",
      "_not-found",
      "_NEXT/x",
      ".well-known/a",
      "a?b",
      "a%2Fb",
      "a".repeat(257),
    ])
      expect(validSlug(slug)).toBe(false);
  });
  it("forwards absent keys, duplicates and fragments without replacing destination params", () => {
    expect(
      forwardQuery(
        "https://example.com/p?a=own#part",
        new URLSearchParams("a=new&b=1&b=2&empty="),
      ),
    ).toBe("https://example.com/p?a=own&b=1&b=2&empty=#part");
  });
  it("keeps status semantics and rejects invalid destinations", () => {
    expect(redirectResult(undefined, new URLSearchParams()).status).toBe(404);
    expect(
      redirectResult(
        { id: "x", destination: null, deleted: true },
        new URLSearchParams(),
      ).status,
    ).toBe(410);
    for (const dest of [
      "javascript:alert(1)",
      "https://link.animesh.cc/a",
      "https://link.animesh.cc./a",
      "https://user:pass@example.com/",
    ])
      expect(() =>
        redirectResult(
          { id: "x", destination: dest, deleted: false },
          new URLSearchParams(),
        ),
      ).toThrow();
  });
  it("returns uncached 302 before best-effort idempotent recording", async () => {
    mocks.resolve.mockResolvedValue({
      id: "abc",
      destination: "https://example.com/?q=own#part",
      deleted: false,
    });
    const response = await GET(
      new Request("http://localhost:3002/Launch/notes.v1?q=new&a=1"),
      context,
    );
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "https://example.com/?q=own&a=1#part",
    );
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(mocks.resolve).toHaveBeenCalledWith("Launch/notes.v1");
    expect(mocks.record).not.toHaveBeenCalled();
    expect(mocks.tasks).toHaveLength(1);
    mocks.record.mockRejectedValue(new Error("secret provider error"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await mocks.tasks[0]();
    expect(mocks.record.mock.calls[0][0]).toMatch(/^[0-9a-f-]{36}$/);
    expect(log).toHaveBeenCalledWith(
      "analytics_write_failed",
      expect.objectContaining({ eventId: expect.any(String) }),
    );
    expect(JSON.stringify(log.mock.calls)).not.toContain("secret");
    log.mockRestore();
  });
  it("HEAD redirects but never records clicks", async () => {
    mocks.resolve.mockResolvedValue({
      id: "abc",
      destination: "https://example.com/",
      deleted: false,
    });
    const response = await HEAD(
      new Request("http://localhost:3002/Launch/notes.v1", { method: "HEAD" }),
      context,
    );
    expect(response.status).toBe(302);
    expect(await response.text()).toBe("");
    expect(mocks.tasks).toHaveLength(0);
  });
  it("observes immediate edits and deletion with fresh lookups", async () => {
    mocks.resolve
      .mockResolvedValueOnce({
        id: "x",
        destination: "https://example.com/old",
        deleted: false,
      })
      .mockResolvedValueOnce({
        id: "x",
        destination: "https://example.com/new",
        deleted: false,
      })
      .mockResolvedValueOnce({ id: "x", destination: null, deleted: true })
      .mockResolvedValueOnce(undefined);
    expect(
      (await HEAD(new Request("http://localhost:3002/a"), context)).headers.get(
        "Location",
      ),
    ).toContain("/old");
    expect(
      (await HEAD(new Request("http://localhost:3002/a"), context)).headers.get(
        "Location",
      ),
    ).toContain("/new");
    expect(
      (await HEAD(new Request("http://localhost:3002/a"), context)).status,
    ).toBe(410);
    expect(
      (await GET(new Request("http://localhost:3002/a"), context)).status,
    ).toBe(404);
  });
  it("lookup failure returns 503 without leaking database text", async () => {
    mocks.resolve.mockRejectedValue(new Error("credentials"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await GET(new Request("http://localhost:3002/a"), context);
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("credentials");
    expect(mocks.tasks).toHaveLength(0);
    log.mockRestore();
  });
});
describe("privacy", () => {
  it("ignores spoofed geography/IP outside Vercel, keeps only referrer hostname", () => {
    const headers = new Headers({
      "x-vercel-forwarded-for": "203.0.113.4",
      "x-vercel-ip-country": "IN",
      referer: "https://example.com/private?token=secret",
      "user-agent": "Mozilla/5.0 Chrome/100.0 Linux",
    });
    const metadata = collectMetadata(headers, false, "s".repeat(32));
    expect(metadata.ip_hash).toBeNull();
    expect(metadata.country).toBe("Unknown");
    expect(metadata.referrer_domain).toBe("example.com");
    expect(JSON.stringify(metadata)).not.toMatch(/token|Mozilla|203\.0/);
  });
  it("hashes stable trusted IPs, excludes missing/invalid IPs and classifies bots", () => {
    const headers = new Headers({
      "x-vercel-forwarded-for": "203.0.113.4",
      "x-vercel-ip-country": "IN",
      "x-vercel-ip-city": "New%20Delhi",
      "x-vercel-ip-latitude": "91",
      "user-agent": "Googlebot",
    });
    const first = collectMetadata(headers, true, "s".repeat(32));
    expect(first.ip_hash).toHaveLength(64);
    expect(first.ip_hash).toBe(
      collectMetadata(headers, true, "s".repeat(32)).ip_hash,
    );
    expect(first.is_bot).toBe(true);
    expect(first.city).toBe("New Delhi");
    expect(first.latitude).toBeNull();
    headers.set("x-vercel-forwarded-for", "not an IP");
    expect(collectMetadata(headers, true, "s".repeat(32)).ip_hash).toBeNull();
    expect(collectMetadata(new Headers(), true).ip_hash).toBeNull();
  });
});
