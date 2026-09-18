import type { MetadataRoute } from "next";
import { getPublicPosts } from "@/lib/content";
import { ORIGIN } from "@/lib/model";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.VERCEL_ENV === "preview") return [];
  const posts = await getPublicPosts();
  return [
    { url: ORIGIN },
    ...posts.map((p) => ({
      url: `${ORIGIN}/${p.slug}`,
      lastModified: p.updatedAt,
    })),
    ...[...new Set(posts.flatMap((p) => p.tags))].map((t) => ({
      url: `${ORIGIN}/tags/${encodeURIComponent(t)}`,
    })),
  ];
}
