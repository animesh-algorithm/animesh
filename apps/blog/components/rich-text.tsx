import { Fragment, type ReactNode } from "react";
import { breaks, safeLink, type RichText as Text } from "@/lib/model";
export function RichText({ text = [] }: { text?: Text[] }) {
  return text.map((t, i) => {
    let node: ReactNode = breaks(t.plain_text ?? t.text?.content ?? "")
      .split("\n")
      .map((line, j) => (
        <Fragment key={j}>
          {j > 0 && <br />}
          {line}
        </Fragment>
      ));
    const a = t.annotations;
    if (a?.code) node = <code>{node}</code>;
    if (a?.bold) node = <strong>{node}</strong>;
    if (a?.italic) node = <em>{node}</em>;
    if (a?.strikethrough) node = <s>{node}</s>;
    if (a?.underline) node = <u>{node}</u>;
    const color = a?.color;
    const allowedColors = [
      "gray",
      "brown",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "pink",
      "red",
    ];
    if (color && allowedColors.includes(color.replace(/_background$/, "")))
      node = <span className={`notion-${color}`}>{node}</span>;
    const href = safeLink(t.href ?? t.text?.link?.url);
    return (
      <Fragment key={i}>
        {href ? (
          <a href={href} rel="noopener noreferrer">
            {node}
          </a>
        ) : (
          node
        )}
      </Fragment>
    );
  });
}
