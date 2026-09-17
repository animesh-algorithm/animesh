import { Fragment, type ReactNode } from "react";
import { codeToTokens, bundledLanguages, type BundledLanguage } from "shiki";
import { RichText } from "./rich-text";
import { CopyButton } from "./copy-button";
import { ArticleImage } from "./article-image";
import { headingId, plain, safeLink, mediaPath, type Block } from "@/lib/model";
function language(value = "text") {
  const aliases: Record<string, string> = {
    "plain text": "text",
    javascript: "jsx",
    typescript: "tsx",
    shell: "bash",
  };
  return aliases[value] ?? value;
}
async function Code({ block }: { block: Block }) {
  const code = plain(block.data.rich_text);
  const lang = language(block.data.language);
  const supported = Object.hasOwn(bundledLanguages, lang);
  const result = supported
    ? await codeToTokens(code, {
        lang: lang as BundledLanguage,
        theme: "github-light-high-contrast",
      })
    : null;
  return (
    <figure className="code-block">
      <div className="code-toolbar">
        <span>{block.data.language ?? "text"}</span>
        <CopyButton code={code} />
      </div>
      <pre tabIndex={0} aria-label={`${block.data.language ?? "Text"} code`}>
        <code>
          {result
            ? result.tokens.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && "\n"}
                  {line.map((t, j) => (
                    <span key={j} style={{ color: t.color }}>
                      {t.content}
                    </span>
                  ))}
                </Fragment>
              ))
            : code}
        </code>
      </pre>
      {!!block.data.caption?.length && (
        <figcaption>
          <RichText text={block.data.caption} />
        </figcaption>
      )}
    </figure>
  );
}
export async function Blocks({
  blocks,
  pageId,
  preview = false,
}: {
  blocks: Block[];
  pageId: string;
  preview?: boolean;
}) {
  const output: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i],
      d = b.data;
    const child = () => (
      <Blocks blocks={b.children} pageId={pageId} preview={preview} />
    );
    if (["bulleted_list_item", "numbered_list_item"].includes(b.type)) {
      const group = [b];
      while (blocks[i + 1]?.type === b.type) group.push(blocks[++i]);
      const Tag = b.type === "bulleted_list_item" ? "ul" : "ol";
      output.push(
        <Tag key={b.id}>
          {group.map((item) => (
            <li key={item.id}>
              <RichText text={item.data.rich_text} />
              <Blocks
                blocks={item.children}
                pageId={pageId}
                preview={preview}
              />
            </li>
          ))}
        </Tag>,
      );
      continue;
    }
    let node: ReactNode;
    switch (b.type) {
      case "paragraph":
        node = (
          <>
            <p>
              <RichText text={d.rich_text} />
            </p>
            {child()}
          </>
        );
        break;
      case "heading_1":
      case "heading_2":
      case "heading_3": {
        const Tag =
          b.type === "heading_1" ? "h2" : b.type === "heading_2" ? "h3" : "h4";
        node = (
          <>
            <Tag id={headingId(b)}>
              <RichText text={d.rich_text} />
            </Tag>
            {child()}
          </>
        );
        break;
      }
      case "quote":
        node = (
          <blockquote>
            <RichText text={d.rich_text} />
            {child()}
          </blockquote>
        );
        break;
      case "callout":
        node = (
          <aside className="callout">
            <span aria-hidden="true">{d.icon?.emoji ?? "↗"}</span>
            <div>
              <RichText text={d.rich_text} />
              {child()}
            </div>
          </aside>
        );
        break;
      case "code":
        node = <Code block={b} />;
        break;
      case "image": {
        const url = d.file?.url ?? d.external?.url ?? "";
        const alt = plain(d.caption);
        node = (
          <figure>
            <ArticleImage
              src={mediaPath(pageId, b.id, preview)}
              alt={alt || "Article illustration"}
              animated={/\.gif(?:\?|$)/i.test(url)}
            />
            {alt && (
              <figcaption>
                <RichText text={d.caption} />
              </figcaption>
            )}
          </figure>
        );
        break;
      }
      case "divider":
        node = <hr />;
        break;
      case "toggle":
        node = (
          <details>
            <summary>
              <RichText text={d.rich_text} />
            </summary>
            {child()}
          </details>
        );
        break;
      case "to_do":
        node = (
          <div className="todo">
            <span aria-label={d.checked ? "Completed" : "Incomplete"}>
              {d.checked ? "☑" : "☐"}
            </span>{" "}
            <RichText text={d.rich_text} />
            {child()}
          </div>
        );
        break;
      case "table":
        node = (
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Article table"
          >
            <table>
              <tbody>
                {b.children.map((row, index) => (
                  <tr key={row.id}>
                    {row.data.cells?.map((cell, j) => {
                      const Tag =
                        (d.has_column_header && index === 0) ||
                        (d.has_row_header && j === 0)
                          ? "th"
                          : "td";
                      return (
                        <Tag
                          key={j}
                          scope={
                            Tag === "th"
                              ? d.has_column_header && index === 0
                                ? "col"
                                : "row"
                              : undefined
                          }
                        >
                          <RichText text={cell} />
                        </Tag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;
      case "column_list":
      case "column":
      case "synced_block":
        node = child();
        break;
      case "equation":
        node = <p className="equation">{d.expression}</p>;
        break;
      case "table_of_contents":
        node = null;
        break;
      default: {
        const href = safeLink(d.url ?? d.external?.url);
        node = (
          <>
            {href ? (
              <p>
                <a href={href} rel="noopener noreferrer">
                  {plain(d.caption) || "Open linked content"} ↗
                </a>
              </p>
            ) : (
              <p className="unsupported">
                This {b.type.replaceAll("_", " ")} cannot be displayed.
              </p>
            )}
            {child()}
          </>
        );
      }
    }
    output.push(<Fragment key={b.id}>{node}</Fragment>);
  }
  return output;
}
