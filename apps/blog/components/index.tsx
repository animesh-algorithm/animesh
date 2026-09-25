import Link from "next/link";
import { PostThumbnail } from "./post-thumbnail";
import { Artwork } from "./artwork";
import { ArrowUpRightIcon, CloseIcon, SparkIcon } from "./icons";
import { filterPosts, excerpt, displayDate, type Post } from "@/lib/model";
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="post-list">
      {posts.map((p) => (
        <article className="post-row" key={p.id}>
          {p.thumbnail && <PostThumbnail id={p.id} slug={p.slug} title={p.title} />}
          <div className="post-row-copy">
          <p className="post-meta">
            <span>By Animesh Sharma</span>
            <span aria-hidden="true">·</span>
            <time dateTime={p.createdAt}>{displayDate(p.createdAt)}</time>
            <span aria-hidden="true">·</span>
            {p.readingMinutes} min read
          </p>
          <h2>
            <Link href={`/${p.slug}`}>
              {p.title}
              <span className="post-arrow" aria-hidden="true">
                <ArrowUpRightIcon />
              </span>
            </Link>
          </h2>
          <p className="description">{excerpt(p.description)}</p>
          <ul className="post-tags" aria-label="Article topics">
            {p.tags.slice(0, 4).map((t) => (
              <li key={t}>
                <Link href={`/tags/${encodeURIComponent(t)}`}>{t}</Link>
              </li>
            ))}
          </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
export function BlogIndex({
  posts,
  q = "",
  tag = "",
}: {
  posts: Post[];
  q?: string;
  tag?: string;
}) {
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const filtered = filterPosts(posts, q, tag);
  const tagLink = (t: string) =>
    t
      ? `/tags/${encodeURIComponent(t)}${q ? `?q=${encodeURIComponent(q)}` : ""}`
      : `/${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  return (
    <>
      <section className="intro">
        <div className="intro-content">
          <p className="eyebrow">THE OCCASIONAL FIELD NOTE</p>
          <h1>
            {tag ? (
              <>
                Filed under
                <br />
                <span>{tag}</span>
              </>
            ) : (
              <>
                A little curiosity.
                <br />
                <span>A lot to write about.</span>
              </>
            )}
          </h1>
          <p className="intro-copy">
            Notes on building things, understanding how they work,
            <br className="desktop-break" /> and finding a little perspective
            along the way.
          </p>
        </div>
        <Artwork />
      </section>
      <div className="index-layout">
        <section aria-label="Articles">
          <form
            className="search"
            action={tag ? `/tags/${encodeURIComponent(tag)}` : "/"}
            role="search"
          >
            <label htmlFor="search">Search the archive</label>
            <div>
              <input
                type="search"
                id="search"
                name="q"
                defaultValue={q}
                placeholder="A hook, an idea, a rabbit hole…"
                maxLength={200}
              />
              <button type="submit" aria-label="Search articles">
                Search <ArrowUpRightIcon />
              </button>
            </div>
          </form>
          <details className="mobile-topics">
            <summary>Browse topics{tag ? `: ${tag}` : ""}</summary>
            <ul>
              <li>
                <Link href={tagLink("")}>All writing</Link>
              </li>
              {tags.map((t) => (
                <li key={t}>
                  <Link
                    href={tagLink(t)}
                    aria-current={tag === t ? "page" : undefined}
                  >
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
          <div className="results-bar">
            <h2>
              {q
                ? `Results for “${q}”`
                : tag
                  ? "The topic archive"
                  : "All writing"}
            </h2>
            <span aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            </span>
          </div>
          {(q || tag) && (
            <Link className="clear-filter" href="/">
              Clear search and filters <CloseIcon />
            </Link>
          )}
          {filtered.length ? (
            <PostList posts={filtered} />
          ) : (
            <p className="empty">
              No articles found. Try another word or topic.
            </p>
          )}
        </section>
        <aside className="topics">
          <h2>A few rabbit holes</h2>
          <p>Follow a thread.</p>
          <ul>
            <li>
              <Link href={tagLink("")} aria-current={!tag ? "page" : undefined}>
                All writing <span>{posts.length}</span>
              </Link>
            </li>
            {tags.map((t) => (
              <li key={t}>
                <Link
                  href={tagLink(t)}
                  aria-current={tag === t ? "page" : undefined}
                >
                  {t}
                  <span>{posts.filter((p) => p.tags.includes(t)).length}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="sidebar-note">
            <SparkIcon className="sidebar-note-icon" />
            <p>
              Good questions tend to lead
              <br />
              to interesting places.
            </p>
            <Link href="/rss.xml">
              Follow via RSS <ArrowUpRightIcon />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
