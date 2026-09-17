import { it, expect, vi } from "vitest";
import { Client } from "@notionhq/client";
import { NotionRepository, NotionUnavailable } from "../lib/notion";
import { DATA_SOURCE_ID } from "../lib/model";
const row = {
  id: "a".repeat(32),
  properties: {},
  parent: { data_source_id: DATA_SOURCE_ID },
};
it("paginates source rows, follows empty pages, and enforces source membership", async () => {
  const query = vi
    .fn()
    .mockResolvedValueOnce({ results: [], has_more: true, next_cursor: "next" })
    .mockResolvedValueOnce({
      results: [row, { ...row, parent: { data_source_id: "different" } }],
      has_more: false,
    });
  const client = { dataSources: { query } } as unknown as Client;
  expect(await new NotionRepository(client).pages()).toEqual([row]);
  expect(query.mock.calls[1][0].start_cursor).toBe("next");
  expect(query.mock.calls[0][0].filter).toEqual({
    property: "published",
    checkbox: { equals: true },
  });
});
it("recursively paginates nested blocks", async () => {
  const list = vi
    .fn()
    .mockResolvedValueOnce({
      results: [
        {
          id: "one",
          type: "toggle",
          toggle: { rich_text: [] },
          has_children: true,
        },
      ],
      has_more: true,
      next_cursor: "next",
    })
    .mockResolvedValueOnce({
      results: [
        {
          id: "nested",
          type: "paragraph",
          paragraph: { rich_text: [{ plain_text: "child" }] },
          has_children: false,
        },
      ],
      has_more: false,
    })
    .mockResolvedValueOnce({
      results: [
        {
          id: "two",
          type: "heading_2",
          heading_2: { rich_text: [] },
          has_children: false,
        },
      ],
      has_more: false,
    });
  const blocks = await new NotionRepository({
    blocks: { children: { list } },
  } as unknown as Client).blocks("page");
  expect(blocks.map((b) => b.id)).toEqual(["one", "two"]);
  expect(blocks[0].children[0].data.rich_text?.[0].plain_text).toBe("child");
  expect(list.mock.calls[2][0].start_cursor).toBe("next");
});
it("bounds rate-limit retries and hides provider details", async () => {
  const pause = vi.fn().mockResolvedValue(undefined);
  const repo = new NotionRepository({} as Client, pause);
  const request = vi.fn().mockRejectedValue({
    status: 429,
    headers: new Headers({ "retry-after": "300" }),
    body: "secret",
  });
  await expect(repo.retry(request)).rejects.toThrow(NotionUnavailable);
  expect(request).toHaveBeenCalledTimes(4);
  expect(pause).toHaveBeenCalledTimes(3);
  expect(pause.mock.calls.every((c) => c[0] <= 5000)).toBe(true);
});
it("does not retry permission failures", async () => {
  const request = vi.fn().mockRejectedValue({ status: 403, body: "secret" });
  await expect(
    new NotionRepository({} as Client).retry(request),
  ).rejects.toThrow("temporarily unavailable");
  expect(request).toHaveBeenCalledTimes(1);
});
it("rejects cross-source, trashed and invalid preview pages", async () => {
  const retrieve = vi
    .fn()
    .mockResolvedValue({ ...row, parent: { data_source_id: "other" } });
  const repo = new NotionRepository({
    pages: { retrieve },
  } as unknown as Client);
  expect(await repo.page("a".repeat(32))).toBeNull();
  expect(await repo.page("invalid")).toBeNull();
  expect(retrieve).toHaveBeenCalledTimes(1);
});
it("returns 404 membership failure for an inaccessible page without retrying", async () => {
  const retrieve = vi
    .fn()
    .mockRejectedValue({ status: 404, body: "sensitive provider body" });
  const repo = new NotionRepository({
    pages: { retrieve },
  } as unknown as Client);
  expect(await repo.page("a".repeat(32))).toBeNull();
  expect(retrieve).toHaveBeenCalledTimes(1);
});
