import { DATA_SOURCE_ID, type Page, type Block } from "../lib/model";
export const page = (slug = "hello", published = true): Page => ({
  id: "a".repeat(32),
  parent: { data_source_id: DATA_SOURCE_ID },
  properties: {
    title: { title: [{ plain_text: "Hello <script>" }] },
    slug: { rich_text: [{ plain_text: slug }] },
    description: { rich_text: [{ plain_text: "A React guide & notes" }] },
    published: { checkbox: published },
    tags: { multi_select: [{ name: "react" }] },
    createdAt: { created_time: "2023-02-01T00:00:00Z" },
  },
});
export const block = (
  type: string,
  data: Block["data"] = {},
  children: Block[] = [],
): Block => ({ id: "b".repeat(32), type, data, children });
