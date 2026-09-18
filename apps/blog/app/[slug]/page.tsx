import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPosts, fixtureMode } from "@/lib/content";
import { Article } from "@/components/article";
import { ORIGIN, excerpt, mediaPath } from "@/lib/model";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getPublicPosts()).find((p) => p.slug === slug);
  if (!p) return { title: "Article not found", robots: { index: false } };
  return {
    title: p.title,
    description: excerpt(p.description, 160),
    alternates: { canonical: `/${p.slug}` },
    robots: fixtureMode() ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: p.title,
      description: excerpt(p.description, 160),
      url: `/${p.slug}`,
      publishedTime: p.createdAt,
      modifiedTime: p.updatedAt,
      authors: ["Animesh Sharma"],
      tags: p.tags,
      images: p.thumbnail ? [mediaPath(p.id, "thumbnail")] : ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: excerpt(p.description, 160),
      images: p.thumbnail ? [mediaPath(p.id, "thumbnail")] : ["/opengraph-image"],
    },
  };
}
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getPublicPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: "Animesh Sharma",
      url: "https://www.animesh.cc",
    },
    image: `${ORIGIN}${post.thumbnail ? mediaPath(post.id, "thumbnail") : "/opengraph-image"}`,
    url: `${ORIGIN}/${post.slug}`,
    mainEntityOfPage: `${ORIGIN}/${post.slug}`,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />
      <Article post={post} posts={posts} />
    </>
  );
}
