import "server-only";
import { Client } from "@notionhq/client";
import {
  DATA_SOURCE_ID,
  sameId,
  validId,
  type Page,
  type Block,
  type BlockData,
} from "./model";
export class NotionUnavailable extends Error {
  constructor(public readonly status?: number) {
    super("The writing archive is temporarily unavailable.");
  }
}
export class NotionRepository {
  constructor(
    private client = new Client({
      auth: process.env.NOTION_TOKEN,
      retry: false,
      timeoutMs: 15000,
      notionVersion: "2025-09-03",
      logger: () => {},
      fetch: (url, init) => fetch(url, { ...init, cache: "no-store" }),
    }),
    private pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms)),
  ) {}
  async retry<T>(fn: () => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        return await fn();
      } catch (e) {
        const error = e as { status?: number; headers?: Headers };
        if (
          attempt === 3 ||
          ![429, 500, 502, 503, 504, 529].includes(error.status ?? 0)
        )
          throw new NotionUnavailable(error.status);
        const retryAfter = Number(error.headers?.get?.("retry-after"));
        await this.pause(
          Math.min(
            5000,
            Math.max(
              300 * 2 ** attempt,
              Number.isFinite(retryAfter) ? retryAfter * 1000 : 0,
            ),
          ),
        );
      }
    }
    throw new NotionUnavailable();
  }
  async pages(publishedOnly = true): Promise<Page[]> {
    const pages: Page[] = [];
    let cursor: string | undefined;
    do {
      const result = await this.retry(() =>
        this.client.dataSources.query({
          data_source_id: DATA_SOURCE_ID,
          page_size: 100,
          start_cursor: cursor,
          ...(publishedOnly
            ? { filter: { property: "published", checkbox: { equals: true } } }
            : {}),
        }),
      );
      pages.push(
        ...(result.results.filter(
          (p) => "properties" in p,
        ) as unknown as Page[]),
      );
      cursor = result.has_more ? (result.next_cursor ?? undefined) : undefined;
    } while (cursor);
    return pages.filter((p) =>
      sameId(p.parent?.data_source_id, DATA_SOURCE_ID),
    );
  }
  async page(id: string): Promise<Page | null> {
    if (!validId(id)) return null;
    const p = await this.retry(() =>
      this.client.pages.retrieve({ page_id: id }),
    ).catch((error) => {
      if (error instanceof NotionUnavailable && error.status === 404)
        return null;
      throw error;
    });
    if (!p) return null;
    if (
      !("properties" in p) ||
      p.archived ||
      p.in_trash ||
      !("data_source_id" in p.parent) ||
      !sameId(p.parent.data_source_id, DATA_SOURCE_ID)
    )
      return null;
    return p as unknown as Page;
  }
  async blocks(id: string, depth = 0): Promise<Block[]> {
    if (depth > 30) throw new NotionUnavailable();
    const blocks: Block[] = [];
    let cursor: string | undefined;
    do {
      const result = await this.retry(() =>
        this.client.blocks.children.list({
          block_id: id,
          page_size: 100,
          start_cursor: cursor,
        }),
      );
      for (const raw of result.results) {
        if (!("type" in raw)) continue;
        const data = (raw as unknown as Record<string, BlockData>)[raw.type];
        blocks.push({
          id: raw.id,
          type: raw.type,
          has_children: raw.has_children,
          data,
          children: raw.has_children
            ? await this.blocks(raw.id, depth + 1)
            : [],
        });
      }
      cursor = result.has_more ? (result.next_cursor ?? undefined) : undefined;
    } while (cursor);
    return blocks;
  }
}
export const notion = new NotionRepository();
