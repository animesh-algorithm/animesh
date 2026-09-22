import "server-only";
import { unstable_cache } from "next/cache";
import { notion, NotionUnavailable } from "./notion";
import { publicPosts, mapPage, readingMinutes, sameId, walk } from "./model";
import type { Post } from "./model";
export const fixtureMode = () =>
  process.env.BLOG_FIXTURES === "true" && process.env.NODE_ENV !== "production";
async function fetchPublic(): Promise<Post[]> {
  if (!process.env.NOTION_TOKEN) throw new NotionUnavailable();
  const posts = publicPosts(await notion.pages(), (reason) =>
    console.warn(`[blog] ${reason}`),
  );
  for (const post of posts) {
    post.blocks = await notion.blocks(post.id);
    post.readingMinutes = readingMinutes(post.blocks);
    for (const b of walk(post.blocks)) {
      if (b.data.file)
        b.data.file = {
          url: /\.gif(?:\?|$)/i.test(b.data.file.url)
            ? "uploaded.gif"
            : "uploaded.image",
        };
    }
  }
  return posts;
}
const cachedPublic = unstable_cache(fetchPublic, ["blog-public-v2"], {
  revalidate: 300,
});
export async function getPublicPosts(): Promise<Post[]> {
  if (fixtureMode()) return (await import("./fixtures")).fixturePosts();
  return cachedPublic();
}
export async function getPreviewPost(id: string): Promise<Post | null> {
  // Caller MUST authorize first. No shared cache or public fallback in this path.
  if (fixtureMode())
    return (
      (await import("./fixtures"))
        .fixturePosts()
        .find((p) => sameId(p.id, id)) ?? null
    );
  const page = await notion.page(id);
  if (!page) return null;
  const post = mapPage(page);
  post.blocks = await notion.blocks(id);
  post.readingMinutes = readingMinutes(post.blocks);
  return post;
}
export async function getPreviewDirectory() {
  if (fixtureMode()) return (await import("./fixtures")).fixturePosts();
  return (await notion.pages(false))
    .map(mapPage)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
