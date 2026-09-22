import { it, expect, vi } from "vitest";
const mock = vi.hoisted(() => ({
  cache: vi.fn(
    (
      fn: () => Promise<unknown>,
      _key: string[],
      _options: { revalidate: number },
    ) => {
      void _key;
      void _options;
      return fn;
    },
  ),
  pages: vi.fn(),
  page: vi.fn(),
  blocks: vi.fn(),
}));
vi.mock("next/cache", () => ({ unstable_cache: mock.cache }));
vi.mock("../lib/notion", () => ({ notion: mock, NotionUnavailable: Error }));
import { page } from "./helpers";
it("keeps preview reads out of the public cache", async () => {
  vi.resetModules();
  const { getPreviewPost, getPublicPosts } = await import("../lib/content");
  vi.stubEnv("BLOG_FIXTURES", "false");
  vi.stubEnv("NOTION_TOKEN", "test");
  mock.page.mockResolvedValue(page("draft", false));
  mock.blocks.mockResolvedValue([]);
  mock.pages.mockResolvedValue([page()]);
  expect((await getPreviewPost("a".repeat(32)))?.published).toBe(false);
  expect(mock.pages).not.toHaveBeenCalled();
  expect(mock.cache.mock.calls[0][1]).toEqual(["blog-public-v2"]);
  expect(mock.cache.mock.calls[0][2]).toEqual({ revalidate: 300 });
  expect((await getPublicPosts()).map((p) => p.slug)).toEqual(["hello"]);
  expect(mock.pages).toHaveBeenCalledTimes(1);
});
