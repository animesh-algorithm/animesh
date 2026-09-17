/** Inspection snapshot only. This converter is never used for live Notion content. */
import MarkdownIt from "markdown-it";
import { writeFileSync } from "node:fs";
import articles from "../fixtures/articles.json";
import type { Block, RichText } from "../lib/model";
import type Token from "markdown-it/lib/token.mjs";
const md = new MarkdownIt({ html: false });
let serial = 0;
function inline(tokens: Token[] = []) {
  const text: RichText[] = [];
  const annotations: NonNullable<RichText["annotations"]> = {};
  let href: string | undefined;
  for (const t of tokens) {
    if (t.type === "strong_open" || t.type === "strong_close")
      annotations.bold = t.type.endsWith("open");
    else if (t.type === "em_open" || t.type === "em_close")
      annotations.italic = t.type.endsWith("open");
    else if (t.type === "s_open" || t.type === "s_close")
      annotations.strikethrough = t.type.endsWith("open");
    else if (t.type === "link_open") href = t.attrGet("href") ?? undefined;
    else if (t.type === "link_close") href = undefined;
    else if (t.type !== "image")
      text.push({
        plain_text: ["softbreak", "hardbreak"].includes(t.type)
          ? "\n"
          : t.content,
        href,
        annotations: { ...annotations, code: t.type === "code_inline" },
      });
  }
  return text;
}
function convert(content: string, pageId: string): Block[] {
  content = content
    .replace(/<callout[^>]*>\n([\s\S]*?)<\/callout>/g, (_, s: string) =>
      s
        .trim()
        .split("\n")
        .map((l) => "> " + l.trim())
        .join("\n"),
    )
    .replace(/<\/?(?:span|details|summary|toggle)[^>]*>/g, "");
  const tokens = md.parse(content, {});
  const roots: Block[] = [];
  const stack: Block[][] = [roots];
  const lists: string[] = [];
  let current: Block | undefined;
  let pendingHeading = 2;
  const block = (type: string, data: Block["data"] = {}): Block => ({
    id: `${pageId.slice(0, 24)}${(++serial).toString(16).padStart(8, "0")}`,
    type,
    data,
    children: [],
  });
  for (const t of tokens) {
    if (t.type === "heading_open") pendingHeading = Number(t.tag.slice(1));
    if (["bullet_list_open", "ordered_list_open"].includes(t.type))
      lists.push(
        t.type === "bullet_list_open"
          ? "bulleted_list_item"
          : "numbered_list_item",
      );
    else if (["bullet_list_close", "ordered_list_close"].includes(t.type))
      lists.pop();
    else if (t.type === "list_item_open" || t.type === "blockquote_open") {
      const b = block(
        t.type === "blockquote_open"
          ? "quote"
          : (lists.at(-1) ?? "bulleted_list_item"),
      );
      stack.at(-1)!.push(b);
      stack.push(b.children);
      current = b;
    } else if (t.type === "list_item_close" || t.type === "blockquote_close") {
      stack.pop();
      current = undefined;
    } else if (t.type === "inline") {
      const previous = tokens[tokens.indexOf(t) - 1];
      for (const image of t.children?.filter((c) => c.type === "image") ?? []) {
        const url = image.attrGet("src") ?? "";
        stack.at(-1)!.push(
          block("image", {
            type: "external",
            external: { url },
            caption: image.content ? [{ plain_text: image.content }] : [],
          }),
        );
      }
      const rich = inline(t.children ?? []);
      if (!rich.length) continue;
      if (
        current &&
        !current.data.rich_text?.length &&
        previous?.type !== "heading_open"
      )
        current.data.rich_text = rich;
      else
        stack
          .at(-1)!
          .push(
            block(
              previous?.type === "heading_open"
                ? `heading_${Math.min(3, pendingHeading)}`
                : "paragraph",
              { rich_text: rich },
            ),
          );
    } else if (t.type === "fence")
      stack.at(-1)!.push(
        block("code", {
          rich_text: [{ plain_text: t.content.replace(/\n$/, "") }],
          language: t.info.trim(),
        }),
      );
    else if (t.type === "hr") stack.at(-1)!.push(block("divider"));
  }
  return roots;
}
const result = articles.map((a) => ({
  id: a.id,
  title: a.title,
  slug: a.slug,
  description: a.description,
  published: true,
  tags: JSON.parse(a.tags) as string[],
  createdAt: new Date(a.createdAt).toISOString(),
  updatedAt: new Date(a.createdAt).toISOString(),
  thumbnail: false,
  blocks: convert(a.content, a.id),
  readingMinutes: 1,
}));
writeFileSync(
  new URL("../fixtures/posts.json", import.meta.url),
  JSON.stringify(result, null, 2) + "\n",
);
