import Link from "next/link";
import { Blocks } from "./blocks";
import { PostList } from "./index";
import {
  headings,
  headingId,
  plain,
  displayDate,
  relatedPosts,
  mediaPath,
  type Post,
} from "@/lib/model";
import { ArticleImage } from "./article-image";
import { ArticleArtwork } from "./artwork";
export function Article({
  post,
  posts = [],
  preview = false,
}: {
  post: Post;
  posts?: Post[];
  preview?: boolean;
}) {
  const toc = headings(post.blocks);
  const related = relatedPosts(posts, post);
  return (
    <>
      {preview && (
        <p className="preview-banner">
          Private preview · {post.published ? "Published" : "Draft"} · visible
          only to the owner
        </p>
      )}
      <header className="article-header article-cloud-header">
        <ArticleArtwork />
        <div className="article-header-content">
          <Link className="back-link" href={preview ? "/preview" : "/"}>
            ← {preview ? "Preview directory" : "All writing"}
          </Link>
          <ul className="post-tags">
            {post.tags.map((t) => (
              <li key={t}>
                {preview ? (
                  <span>{t}</span>
                ) : (
                  <Link href={`/tags/${encodeURIComponent(t)}`}>{t}</Link>
                )}
              </li>
            ))}
          </ul>
          <h1>{post.title}</h1>
          <p className="post-meta">
            Animesh Sharma <span aria-hidden="true">·</span>
            <time dateTime={post.createdAt}>{displayDate(post.createdAt)}</time>
            <span aria-hidden="true">·</span>
            {post.readingMinutes} min read
          </p>
        </div>
      </header>
      <div className="reading-layout">
        <article className="prose" aria-label={post.title}>
          {post.thumbnail && (
            <figure>
              <ArticleImage
                src={mediaPath(post.id, "thumbnail", preview)}
                alt={`Cover for ${post.title}`}
                animated={false}
              />
            </figure>
          )}
          <Blocks blocks={post.blocks} pageId={post.id} preview={preview} />
          <div className="article-end">
            <span aria-hidden="true">✳</span>
            <p>Thanks for reading.</p>
            <Link href="https://www.animesh.cc">More about Animesh ↗</Link>
          </div>
        </article>
        {toc.length > 0 && (
          <nav className="toc" aria-label="On this page">
            <details open>
              <summary>On this page</summary>
              <ol>
                {toc.map((b) => (
                  <li className={`toc-${b.type}`} key={b.id}>
                    <a href={`#${headingId(b)}`}>{plain(b.data.rich_text)}</a>
                  </li>
                ))}
              </ol>
            </details>
          </nav>
        )}
      </div>
      {related.length > 0 && (
        <section className="related">
          <p className="eyebrow">FOLLOW THE THREAD</p>
          <h2>You might also like</h2>
          <PostList posts={related} />
        </section>
      )}
    </>
  );
}
