import { it, expect, vi, beforeEach } from "vitest";
import { isOwner, allowedGoogleProfile } from "../lib/owner";
const mock = vi.hoisted(() => ({
  auth: vi.fn(),
  public: vi.fn(),
  preview: vi.fn(),
  page: vi.fn(),
}));
vi.mock("../auth", () => ({ auth: mock.auth }));
vi.mock("../lib/content", () => ({
  getPublicPosts: mock.public,
  getPreviewPost: mock.preview,
  fixtureMode: () => false,
}));
vi.mock("../lib/notion", () => ({ notion: { page: mock.page } }));
import { GET } from "../app/media/[pageId]/[blockId]/route";
const id = "a".repeat(32),
  blockId = "b".repeat(32);
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("BLOG_OWNER_EMAIL", "owner@example.com");
  vi.stubEnv("AUTH_SECRET", "test-only-secret");
});
it("uses an exact configured owner and verified Google email", () => {
  expect(isOwner("owner@example.com")).toBe(true);
  expect(isOwner("Owner@example.com")).toBe(false);
  expect(isOwner("other@example.com")).toBe(false);
  expect(isOwner("owner@example.com", "")).toBe(false);
  expect(
    allowedGoogleProfile({ email: "owner@example.com", email_verified: false }),
  ).toBe(false);
  expect(
    allowedGoogleProfile({ email: "owner@example.com", email_verified: true }),
  ).toBe(true);
});
it("rejects draft media without owner before reading source content", async () => {
  mock.auth.mockResolvedValue({ user: { email: "other@example.com" } });
  const response = await GET(
    new Request(`https://test/media/${id}/${blockId}?preview=1`),
    { params: Promise.resolve({ pageId: id, blockId }) },
  );
  expect(response.status).toBe(404);
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(mock.preview).not.toHaveBeenCalled();
  expect(mock.public).not.toHaveBeenCalled();
  expect(mock.page).not.toHaveBeenCalled();
});
it("rejects public media absent from published archive", async () => {
  mock.public.mockResolvedValue([]);
  const response = await GET(
    new Request(`https://test/media/${id}/${blockId}`),
    { params: Promise.resolve({ pageId: id, blockId }) },
  );
  expect(response.status).toBe(404);
  expect(mock.page).not.toHaveBeenCalled();
});
it("rejects unpublished media even while old archive entry is cached", async () => {
  mock.public.mockResolvedValue([{ id }]);
  mock.page.mockResolvedValue({
    properties: { published: { checkbox: false } },
  });
  const response = await GET(
    new Request(`https://test/media/${id}/${blockId}`),
    { params: Promise.resolve({ pageId: id, blockId }) },
  );
  expect(response.status).toBe(404);
  expect(mock.preview).not.toHaveBeenCalled();
});
it("refreshes a signed media URL after an expired download", async () => {
  const future = new Date(Date.now() + 3600000).toISOString();
  const post = (url: string) => ({
    id,
    blocks: [
      {
        id: blockId,
        type: "image",
        data: { type: "file", file: { url, expiry_time: future } },
        children: [],
      },
    ],
  });
  mock.public.mockResolvedValue([{ id }]);
  mock.page.mockResolvedValue({
    properties: { published: { checkbox: true } },
  });
  mock.preview
    .mockResolvedValueOnce(post("https://file.notion.so/expired.png"))
    .mockResolvedValueOnce(post("https://file.notion.so/refreshed.png"));
  const { default: sharp } = await import("sharp");
  const image = await sharp({ create: { width: 4, height: 4, channels: 3, background: "white" } }).png().toBuffer();
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(new Response(null, { status: 403 }))
    .mockResolvedValueOnce(
      new Response(image, {
        headers: { "content-type": "image/png" },
      }),
    );
  vi.stubGlobal("fetch", fetcher);
  const response = await GET(
    new Request(`https://test/media/${id}/${blockId}`),
    { params: Promise.resolve({ pageId: id, blockId }) },
  );
  expect(response.status).toBe(200);
  expect(mock.preview).toHaveBeenCalledTimes(2);
  expect(fetcher.mock.calls[1][0]).toBe("https://file.notion.so/refreshed.png");
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  vi.unstubAllGlobals();
});
it("rejects a block that does not belong to the authorized page", async () => {
  mock.public.mockResolvedValue([{ id }]);
  mock.page.mockResolvedValue({
    properties: { published: { checkbox: true } },
  });
  mock.preview.mockResolvedValue({ id, blocks: [] });
  expect(
    (
      await GET(new Request(`https://test/media/${id}/${blockId}`), {
        params: Promise.resolve({ pageId: id, blockId }),
      })
    ).status,
  ).toBe(404);
});
