import { it, expect } from "vitest";
import { renderToReadableStream, renderToStaticMarkup } from "react-dom/server";
import { Blocks } from "../components/blocks";
import { RichText } from "../components/rich-text";
import { block } from "./helpers";
async function html(element: React.ReactNode) {
  const stream = await renderToReadableStream(element);
  await stream.allReady;
  return new Response(stream).text();
}
it("renders nested lists, headings, quotes, callouts, toggles and tables", async () => {
  const blocks = [
    block("heading_2", { rich_text: [{ plain_text: "Overview" }] }),
    block("bulleted_list_item", { rich_text: [{ plain_text: "Outer" }] }, [
      block("numbered_list_item", { rich_text: [{ plain_text: "Inner" }] }),
    ]),
    block("callout", {
      rich_text: [{ plain_text: "Note" }],
      icon: { emoji: "💡" },
    }),
    block("quote", { rich_text: [{ plain_text: "Quote" }] }),
    block("toggle", { rich_text: [{ plain_text: "Expand" }] }, [
      block("paragraph", { rich_text: [{ plain_text: "Hidden text" }] }),
    ]),
    block("table", { has_column_header: true }, [
      block("table_row", { cells: [[{ plain_text: "Column" }]] }),
      block("table_row", { cells: [[{ plain_text: "Value" }]] }),
    ]),
  ];
  const result = await html(<Blocks blocks={blocks} pageId={"a".repeat(32)} />);
  expect(result).toContain("<ul>");
  expect(result).toContain("<ol>");
  expect(result).toContain("<details>");
  expect(result).toContain("<blockquote>");
  expect(result).toContain('scope="col"');
  expect(result).toContain('class="callout"');
  expect(result).toContain("Hidden text");
});
it("escapes CMS text and unsafe links, retaining formatting", () => {
  const result = renderToStaticMarkup(
    <RichText
      text={[
        {
          plain_text: "<script>alert(1)</script><br>line",
          href: "javascript:alert(1)",
          annotations: { bold: true, italic: true },
        },
      ]}
    />,
  );
  expect(result).toContain("&lt;script&gt;");
  expect(result).not.toContain("href=");
  expect(result).toContain("<strong>");
  expect(result).toContain("<br/>");
});
it("highlights code as tokens with copy controls and safe text", async () => {
  const result = await html(
    <Blocks
      blocks={[
        block("code", {
          language: "javascript",
          rich_text: [{ plain_text: 'const x = "<script>";' }],
        }),
      ]}
      pageId={"a".repeat(32)}
    />,
  );
  expect(result).toContain("Copy code");
  expect(result).toContain("&lt;script&gt;");
  expect(result).toContain("color:");
  expect(result).toContain('tabindex="0"');
});
it("renders embeds as safe links and rejects iframe/script execution", async () => {
  const result = await html(
    <Blocks
      blocks={[
        block("embed", { url: "https://example.com/video" }),
        block("embed", { url: "javascript:alert(1)" }),
      ]}
      pageId={"a".repeat(32)}
    />,
  );
  expect(result).toContain('href="https://example.com/video"');
  expect(result).not.toContain("<iframe");
  expect(result).not.toContain("javascript:");
});
