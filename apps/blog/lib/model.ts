export const DATA_SOURCE_ID = "96f42452-2d7e-458b-9a09-497b1b08bef4";
export const ORIGIN = process.env.BLOG_ORIGIN || "https://blog.animesh.cc";
export type RichText = {
  plain_text?: string;
  text?: { content: string; link?: { url: string } | null };
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
};
export type FileRef = {
  type: "external" | "file";
  external?: { url: string };
  file?: { url: string; expiry_time?: string };
  name?: string;
};
export type BlockData = {
  rich_text?: RichText[];
  caption?: RichText[];
  language?: string;
  url?: string;
  type?: string;
  external?: { url: string };
  file?: { url: string; expiry_time?: string };
  cells?: RichText[][];
  has_column_header?: boolean;
  has_row_header?: boolean;
  icon?: { type?: string; emoji?: string };
  checked?: boolean;
  expression?: string;
};
export type Block = {
  id: string;
  type: string;
  has_children?: boolean;
  children: Block[];
  data: BlockData;
};
export type Property = {
  type?: string;
  title?: RichText[];
  rich_text?: RichText[];
  checkbox?: boolean;
  multi_select?: { name: string }[];
  files?: FileRef[];
  created_time?: string;
  date?: { start?: string | null; end?: string | null; time_zone?: string | null };
};
export type Page = {
  id: string;
  object?: string;
  archived?: boolean;
  in_trash?: boolean;
  parent?: { type?: string; data_source_id?: string };
  properties: Record<string, Property>;
  last_edited_time?: string;
};
export type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  thumbnail: boolean;
  blocks: Block[];
  readingMinutes: number;
};
export const plain = (r: RichText[] = []) =>
  r.map((t) => t.plain_text ?? t.text?.content ?? "").join("");
export const breaks = (s: string) => s.replace(/<br\s*\/?\s*>/gi, "\n");
export function safeLink(value?: string | null): string | undefined {
  if (!value || /[\u0000-\u001f\u007f]/.test(value)) return;
  try {
    const u = new URL(value);
    if (
      ["https:", "http:", "mailto:"].includes(u.protocol) &&
      !u.username &&
      !u.password
    )
      return u.href;
  } catch {
    /* Invalid URL is plain text. */
  }
}
export const validId = (id: string) =>
  /^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(
    id,
  );
export const sameId = (a?: string, b?: string) =>
  !!a &&
  !!b &&
  a.replaceAll("-", "").toLowerCase() === b.replaceAll("-", "").toLowerCase();
const reserved = new Set([
  "preview",
  "api",
  "tags",
  "media",
  "rss.xml",
  "sitemap.xml",
  "robots.txt",
  "favicon.ico",
]);
export const validSlug = (slug: string) =>
  slug.length <= 180 &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) &&
  !reserved.has(slug);
export function mapPage(p: Page): Post {
  const v = p.properties;
  const createdAt =
    v.createdAt?.created_time ?? v.createdAt?.date?.start ?? "";
  return {
    id: p.id,
    title: plain(v.title?.title),
    slug: plain(v.slug?.rich_text),
    description: breaks(plain(v.description?.rich_text)),
    published: v.published?.checkbox === true && !p.archived && !p.in_trash,
    tags: (v.tags?.multi_select ?? []).map((t) => t.name),
    createdAt,
    updatedAt: p.last_edited_time ?? createdAt,
    thumbnail: !!v.thumbnail?.files?.length,
    blocks: [],
    readingMinutes: 1,
  };
}
export function publicPosts(
  pages: Page[],
  diagnostic: (reason: string) => void = () => {},
): Post[] {
  const posts = pages.map(mapPage).filter((p) => p.published);
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.slug, (counts.get(p.slug) ?? 0) + 1);
  return posts
    .filter((p) => {
      const ok =
        !!p.title.trim() &&
        validSlug(p.slug) &&
        counts.get(p.slug) === 1 &&
        Number.isFinite(Date.parse(p.createdAt));
      if (!ok) diagnostic("Excluded invalid or conflicting published entry");
      return ok;
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
export function walk(blocks: Block[]): Block[] {
  return blocks.flatMap((b) => [b, ...walk(b.children)]);
}
export function readingMinutes(blocks: Block[]) {
  return Math.max(
    1,
    Math.ceil(
      walk(blocks)
        .map(
          (b) =>
            plain(b.data.rich_text) +
            " " +
            (b.data.cells ?? []).map((c) => plain(c)).join(" "),
        )
        .join(" ")
        .split(/\s+/)
        .filter(Boolean).length / 220,
    ),
  );
}
export const headingId = (block: Block) => `heading-${block.id}`;
export const headings = (blocks: Block[]) =>
  walk(blocks).filter((b) => /^heading_[123]$/.test(b.type));
export function filterPosts(posts: Post[], q = "", tag = "") {
  const query = q.trim().toLocaleLowerCase();
  return posts.filter(
    (p) =>
      (!tag || p.tags.includes(tag)) &&
      (!query ||
        `${p.title} ${p.description}`.toLocaleLowerCase().includes(query)),
  );
}
export function relatedPosts(posts: Post[], post: Post) {
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .filter((p) => p.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Date.parse(b.post.createdAt) - Date.parse(a.post.createdAt),
    )
    .slice(0, 3)
    .map((p) => p.post);
}
export const excerpt = (s: string, n = 210) =>
  s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";
export const displayDate = (d: string) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(d));
export function mediaPath(
  pageId: string,
  blockId: string,
  preview = false,
  still = false,
) {
  return `/media/${pageId}/${blockId}?${new URLSearchParams({ ...(preview ? { preview: "1" } : {}), ...(still ? { still: "1" } : {}) })}`;
}
