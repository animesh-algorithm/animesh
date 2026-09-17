// SDK verification deliberately bypasses the server-only marker used by Next modules.
import { Client } from "@notionhq/client";
import { DATA_SOURCE_ID, publicPosts } from "../lib/model";
import type { Page } from "../lib/model";
if (!process.env.NOTION_TOKEN) {
  console.error("NOTION_TOKEN is not configured.");
  process.exitCode = 1;
} else {
  try {
    const client = new Client({
      auth: process.env.NOTION_TOKEN,
      retry: { maxRetries: 2, maxRetryDelayMs: 5000 },
      timeoutMs: 15000,
      logger: () => {},
    });
    let cursor: string | undefined;
    const pages: Page[] = [];
    do {
      const r = await client.dataSources.query({
        data_source_id: DATA_SOURCE_ID,
        page_size: 100,
        start_cursor: cursor,
      });
      pages.push(
        ...(r.results.filter((p) => "properties" in p) as unknown as Page[]),
      );
      cursor = r.has_more ? (r.next_cursor ?? undefined) : undefined;
    } while (cursor);
    const posts = publicPosts(pages);
    console.log(
      JSON.stringify({
        sourceAccessible: true,
        entries: pages.length,
        validPublished: posts.length,
      }),
    );
    for (const p of posts) {
      const counts: Record<string, number> = {};
      async function read(id: string, depth = 0) {
        if (depth > 30) throw new Error("Depth limit");
        let cursor: string | undefined;
        do {
          const r = await client.blocks.children.list({
            block_id: id,
            page_size: 100,
            start_cursor: cursor,
          });
          for (const b of r.results) {
            if ("type" in b) {
              counts[b.type] = (counts[b.type] ?? 0) + 1;
              if (b.has_children) await read(b.id, depth + 1);
            }
          }
          cursor = r.has_more ? (r.next_cursor ?? undefined) : undefined;
        } while (cursor);
      }
      await read(p.id);
      console.log(JSON.stringify({ article: p.slug, blockTypes: counts }));
    }
  } catch {
    console.error(
      "Live Notion verification failed; check app token, read capability and source sharing.",
    );
    process.exitCode = 1;
  }
}
