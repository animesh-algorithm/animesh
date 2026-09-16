import { describe, it, expect } from "vitest";
import QRCode from "qrcode";
import {
  validateSlug,
  validateTitle,
  validateDestination,
  generatedSlug,
  createWithRetry,
  directoryParams,
  analyticsParams,
} from "../lib/validation";
import { csvCell, linksCsv } from "../lib/csv";
import { isOwner, originAllowed } from "../lib/auth-policy";
import { comparison } from "../lib/presentation";
const owner = {
  id: "owner",
  email: "owner@example.com",
  email_confirmed_at: "2026-01-01",
  app_metadata: { provider: "google" },
  identities: [{ provider: "google" }],
};
describe("private access policy", () => {
  it("requires verified Google identity, both private identifiers, and configuration", () => {
    expect(isOwner(owner, "owner", "owner@example.com")).toBe(true);
    expect(isOwner(null, "owner", "owner@example.com")).toBe(false);
    expect(isOwner({ ...owner, app_metadata: { provider: "email", providers: ["email", "google"] } }, "owner", "owner@example.com")).toBe(true);
    expect(isOwner({ ...owner, app_metadata: { provider: "email", providers: ["email", "google"] }, identities: [{ provider: "email" }] }, "owner", "owner@example.com")).toBe(false);
    expect(isOwner(owner, "", "owner@example.com")).toBe(false);
    expect(
      isOwner({ ...owner, id: "intruder" }, "owner", "owner@example.com"),
    ).toBe(false);
    expect(
      isOwner(
        { ...owner, email: "other@example.com" },
        "owner",
        "owner@example.com",
      ),
    ).toBe(false);
    expect(
      isOwner(
        { ...owner, email_confirmed_at: undefined },
        "owner",
        "owner@example.com",
      ),
    ).toBe(false);
    expect(
      isOwner(
        { ...owner, identities: [{ provider: "email" }] },
        "owner",
        "owner@example.com",
      ),
    ).toBe(false);
    expect(
      isOwner(
        { ...owner, app_metadata: { provider: "email" } },
        "owner",
        "owner@example.com",
      ),
    ).toBe(false);
  });
  it("requires exact mutation origin and denies missing config/headers", () => {
    for (const origin of [
      "https://evil.example",
      "null",
      "https://admin.animesh.cc.evil",
      "",
    ])
      expect(
        originAllowed(
          new Request("https://admin.animesh.cc/api", { headers: { origin } }),
          "https://admin.animesh.cc",
        ),
      ).toBe(false);
    expect(
      originAllowed(
        new Request("https://admin.animesh.cc/api", {
          headers: { origin: "https://admin.animesh.cc" },
        }),
        "https://admin.animesh.cc",
      ),
    ).toBe(true);
    expect(originAllowed(new Request("http://localhost/api"), undefined)).toBe(
      false,
    );
  });
});
describe("link validation", () => {
  it("validates nested paths, lengths and titles", () => {
    expect(validateSlug("A_b/notes.v1-c")).toBe("A_b/notes.v1-c");
    expect(validateSlug("/coffee")).toBe("coffee");
    for (const slug of [
      "",
      "//a",
      "a/",
      "a//b",
      "a/../b",
      "auth/x",
      "icon.svg",
      "_not-found",
      "_next/test",
      "a".repeat(257),
    ])
      expect(() => validateSlug(slug)).toThrow();
    expect(validateTitle("")).toBeNull();
    expect(validateTitle("😀".repeat(256))).toHaveLength(512);
    expect(() => validateTitle("a".repeat(257))).toThrow();
  });
  it("rejects credentials, loop hosts, non-http and relative URLs", () => {
    expect(validateDestination("https://example.com/?a=1#part")).toBe(
      "https://example.com/?a=1#part",
    );
    for (const dest of [
      "javascript:alert(1)",
      "/relative",
      "https:example.com",
      "https://user:pass@example.com",
      "https://link.animesh.cc",
      "https://LINK.ANIMESH.CC./p",
      "https://link.animesh.cc:443/p",
      "https://example.com/\npath",
    ])
      expect(() => validateDestination(dest)).toThrow();
  });
  it("generates cryptographic eight-character paths and retries collisions", async () => {
    expect(generatedSlug()).toMatch(/^[A-Za-z0-9]{8}$/);
    let attempt = 0;
    const result = await createWithRetry(
      async (slug) =>
        ++attempt === 1
          ? { data: null, error: { code: "23505" } }
          : { data: slug, error: null },
      undefined,
      () => `Slug000${attempt}`,
    );
    expect(attempt).toBe(2);
    expect(result).toBe("Slug0001");
    await expect(
      createWithRetry(
        async () => ({ data: null, error: { code: "23505" } }),
        "reserved",
      ),
    ).rejects.toMatchObject({ status: 409 });
    await expect(
      createWithRetry(async () => ({ data: null, error: { code: "23505" } })),
    ).rejects.toMatchObject({ status: 503 });
  });
  it("checks paging, sorting and analytics range options", () => {
    expect(
      directoryParams(new URLSearchParams("size=500&status=all&sort=clicks"))
        .p_size,
    ).toBe(500);
    for (const q of [
      "size=1000",
      "page=0",
      "page=1.5",
      "sort=destination",
      "status=unknown",
      "source=bad",
    ])
      expect(() => directoryParams(new URLSearchParams(q))).toThrow();
    expect(analyticsParams(new URLSearchParams("range=all")).p_range).toBe(
      "all",
    );
    expect(() => analyticsParams(new URLSearchParams("range=1y"))).toThrow();
    expect(comparison(10, 0)).toBe("No prior clicks");
    expect(comparison(0, null)).toContain("all time");
    expect(comparison(15, 10)).toBe("+50.0% vs preceding period");
  });
});
describe("exports", () => {
  it("escapes commas/quotes/newlines and prevents formulas", () => {
    expect(csvCell('a,"b"\nc')).toBe('"a,""b""\nc"');
    for (const value of [
      "=cmd()",
      "+1",
      "-1",
      "@sum(A1)",
      "  =1",
      "\ttext",
      "\rtext",
    ])
      expect(csvCell(value)).toMatch(/^"'/);
    expect(linksCsv([])).toContain("migration_source_domain");
  });
  it("produces real downloadable PNG QR data", async () => {
    const png = await QRCode.toBuffer("https://link.animesh.cc/nested/path", {
      type: "png",
      width: 768,
      margin: 4,
      errorCorrectionLevel: "M",
    });
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(png.readUInt32BE(16)).toBe(768);
  });
});
