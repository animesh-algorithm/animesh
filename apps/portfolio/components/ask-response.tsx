import { Fragment, type ReactNode } from "react";

const bulletPattern = /^\s*[-*]\s+(.+)$/;
const boldPattern = /\*\*(.+?)\*\*/g;
const urlPattern = /https?:\/\/[^\s<]+/g;

function externalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function linkify(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(urlPattern)) {
    const index = match.index ?? 0;
    const url = externalUrl(match[0]);
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));
    nodes.push(
      url ? (
        <a href={url} key={`${keyPrefix}-${index}`} rel="noopener noreferrer" target="_blank">
          {match[0]}
        </a>
      ) : (
        match[0]
      ),
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function formatInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(boldPattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(...linkify(text.slice(lastIndex, index), `${keyPrefix}-text`));
    nodes.push(
      <strong key={`${keyPrefix}-bold-${index}`}>
        {linkify(match[1], `${keyPrefix}-bold-link`)}
      </strong>,
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(...linkify(text.slice(lastIndex), `${keyPrefix}-text`));
  return nodes;
}

export function AskResponse({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="ask-message-content">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const bullets = lines.map((line) => line.match(bulletPattern));

        if (bullets.every(Boolean)) {
          return (
            <ul key={`block-${blockIndex}`}>
              {bullets.map((bullet, lineIndex) => (
                <li key={`line-${lineIndex}`}>
                  {formatInline(bullet?.[1] ?? "", `block-${blockIndex}-line-${lineIndex}`)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`block-${blockIndex}`}>
            {lines.map((line, lineIndex) => (
              <Fragment key={`line-${lineIndex}`}>
                {lineIndex ? <br /> : null}
                {formatInline(line, `block-${blockIndex}-line-${lineIndex}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
