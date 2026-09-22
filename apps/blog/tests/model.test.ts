import { describe, it, expect } from "vitest";
import {
  publicPosts,
  filterPosts,
  relatedPosts,
  safeLink,
  breaks,
  readingMinutes,
} from "../lib/model";
import { rss } from "../lib/rss";
import { fixturePosts } from "../lib/fixtures";
import { page, block } from "./helpers";
describe("publication contract", () => {
  it("excludes drafts, deleted pages, invalid titles, dates and unsafe/reserved slugs", () => {
    const empty = page("empty");
    empty.properties.title.title = [];
    const date = page("date");
    date.properties.createdAt.created_time = "bad";
    expect(
      publicPosts([
        page(),
        page("draft", false),
        { ...page("deleted"), archived: true },
        empty,
        date,
        ...["../secret", "preview", "Bad Slug", "tags", "a/b"].map((s) =>
          page(s),
        ),
      ]).map((p) => p.slug),
    ).toEqual(["hello"]);
  });
  it("excludes every conflicting public slug and ignores draft conflicts", () => {
    const diagnostics: string[] = [];
    expect(
      publicPosts([page(), page(), page("other"), page("other", false)], (s) =>
        diagnostics.push(s),
      ).map((p) => p.slug),
    ).toEqual(["other"]);
    expect(diagnostics).toEqual([
      "Excluded invalid or conflicting published entry",
      "Excluded invalid or conflicting published entry",
    ]);
  });
  it("keeps original dates and sorts newest first", () => {
    const old = page("old");
    old.properties.createdAt.created_time = "2020-01-01T00:00:00Z";
    expect(publicPosts([old, page()]).map((p) => p.slug)).toEqual([
      "hello",
      "old",
    ]);
  });
  it("accepts Notion date properties for createdAt", () => {
    const dated = page("dated");
    dated.id = "b".repeat(32);
    dated.properties.createdAt = {
      type: "date",
      date: { start: "2024-06-15T18:35:00.000+05:30" },
    };
    expect(publicPosts([dated]).map((p) => [p.slug, p.createdAt])).toEqual([
      ["dated", "2024-06-15T18:35:00.000+05:30"],
    ]);
  });
});
it("searches title and description with exact tag filters", () => {
  const posts = fixturePosts();
  expect(filterPosts(posts, "USEMEMO", "react")).toHaveLength(1);
  expect(filterPosts(posts, "useMemo", "motivation")).toHaveLength(0);
  expect(filterPosts(posts, "utility-first")).toHaveLength(1);
});
it("ranks related posts by shared tags and excludes current/unrelated", () => {
  const posts = fixturePosts();
  const target = posts.find((p) => p.slug.includes("usememo"))!;
  const result = relatedPosts(posts, target);
  expect(result).toHaveLength(3);
  expect(
    result.every(
      (p) => p.id !== target.id && p.tags.some((t) => target.tags.includes(t)),
    ),
  ).toBe(true);
});
it("permits safe protocols and converts only legacy br", () => {
  for (const s of [
    "javascript:alert(1)",
    "data:text/html,<script>",
    "//evil.test",
    "https://user:pass@site.test",
    "java\nscript:alert(1)",
  ])
    expect(safeLink(s)).toBeUndefined();
  expect(safeLink("https://example.com")).toBe("https://example.com/");
  expect(breaks("a<br>b<BR />c<script>x</script>")).toBe(
    "a\nb\nc<script>x</script>",
  );
});
it("counts nested text for reading time", () =>
  expect(
    readingMinutes([
      block("toggle", {}, [
        block("paragraph", {
          rich_text: [{ plain_text: "word ".repeat(500) }],
        }),
      ]),
    ]),
  ).toBe(3));
it("produces escaped RSS with original dates and published-only membership", () => {
  const post = publicPosts([page()])[0];
  const feed = rss([post, { ...post, slug: "draft", published: false }]);
  expect(feed).toContain("Hello &lt;script&gt;");
  expect(feed).toContain("&amp; notes");
  expect(feed).toContain("Wed, 01 Feb 2023");
  expect(feed).not.toContain("/draft");
});
it("contains seven inspected, unique source articles without signed URLs", () => {
  const posts = fixturePosts();
  expect(posts).toHaveLength(7);
  expect(new Set(posts.map((p) => p.slug)).size).toBe(7);
  expect(JSON.stringify(posts)).not.toMatch(/X-Amz-|Security-Token/);
});
