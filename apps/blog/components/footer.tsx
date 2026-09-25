import Link from "next/link";
import { FooterArtwork } from "./artwork";
import { getPublicPosts } from "@/lib/content";
import { ArrowUpRightIcon, SparkIcon } from "./icons";

export async function SiteFooter() {
  const posts = await getPublicPosts().catch(() => []);
  const categoryCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      categoryCounts.set(tag, (categoryCounts.get(tag) ?? 0) + 1);
    }
  }
  const categories = [...categoryCounts]
    .sort(([a, aCount], [b, bCount]) => bCount - aCount || a.localeCompare(b))
    .slice(0, 8);

  return (
    <footer className="site-footer">
      <FooterArtwork />
      <div className="footer-content">
        <section className="footer-intro" aria-labelledby="footer-brand">
          <Link className="footer-brand" id="footer-brand" href="/">
            animesh <SparkIcon className="brand-icon" />
          </Link>
          <p>The writing archive of Animesh Sharma. A notebook with the occasional rabbit hole.</p>
          <small>© {new Date().getFullYear()} Animesh Sharma</small>
        </section>

        {categories.length > 0 && (
          <nav className="footer-categories" aria-labelledby="footer-topics">
            <h2 id="footer-topics">Topics</h2>
            <ul>
              {categories.map(([category, count]) => (
                <li key={category}>
                  <Link href={`/tags/${encodeURIComponent(category)}`}>
                    {category} <span>{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className="footer-nav" aria-labelledby="footer-read">
          <h2 id="footer-read">Read</h2>
          <ul>
            <li>
              <Link href="/">All writing</Link>
            </li>
            <li>
              <Link href="/rss.xml">RSS feed <ArrowUpRightIcon /></Link>
            </li>
          </ul>
        </nav>

        <nav className="footer-nav" aria-labelledby="footer-elsewhere">
          <h2 id="footer-elsewhere">Elsewhere</h2>
          <ul>
            <li>
              <a href="https://www.animesh.cc">Portfolio <ArrowUpRightIcon /></a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/animeshsharma42">
                LinkedIn <ArrowUpRightIcon />
              </a>
            </li>
            <li>
              <a href="https://github.com/animesh-algorithm">GitHub <ArrowUpRightIcon /></a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
