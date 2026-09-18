import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/index";
import { getPublicPosts, fixtureMode } from "@/lib/content";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const { q } = await searchParams;
  return {
    title: `${tag} articles`,
    description: `Notes and articles about ${tag} by Animesh Sharma.`,
    alternates: { canonical: `/tags/${encodeURIComponent(tag)}` },
    robots: q || fixtureMode() ? { index: false, follow: true } : undefined,
  };
}
export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { tag } = await params;
  const { q } = await searchParams;
  const posts = await getPublicPosts();
  if (!posts.some((p) => p.tags.includes(tag))) notFound();
  return (
    <BlogIndex
      posts={posts}
      tag={tag}
      q={typeof q === "string" ? q.slice(0, 200) : ""}
    />
  );
}
