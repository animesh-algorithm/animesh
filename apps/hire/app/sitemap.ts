import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.VERCEL_ENV === "preview") return [];
  return ["https://hire.animesh.cc/", "https://hire.animesh.cc/privacy"].map((url) => ({ url }));
}
