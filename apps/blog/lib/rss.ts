import { ORIGIN, type Post } from "./model";
export const xml = (s: string) =>
  s
    .replace(
      /[<>&"']/g,
      (c) =>
        ({
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          '"': "&quot;",
          "'": "&apos;",
        })[c]!,
    )
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
export function rss(posts: Post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>Animesh — Notes &amp; rabbit holes</title><link>${xml(ORIGIN)}</link><description>Notes on building things and understanding how they work.</description><language>en</language><atom:link href="${xml(ORIGIN)}/rss.xml" rel="self" type="application/rss+xml"/>${posts
    .filter((p) => p.published)
    .map(
      (p) =>
        `<item><title>${xml(p.title)}</title><link>${xml(ORIGIN)}/${p.slug}</link><guid isPermaLink="true">${xml(ORIGIN)}/${p.slug}</guid><description>${xml(p.description)}</description><dc:creator>Animesh Sharma</dc:creator><pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>${p.tags.map((t) => `<category>${xml(t)}</category>`).join("")}</item>`,
    )
    .join("")}</channel></rss>`;
}
