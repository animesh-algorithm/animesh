import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.VERCEL_ENV === "preview") return [];
  return ["/", "/work", "/services", "/pricing", "/about", "/contact", "/privacy"].map((path) => ({ url: `https://hire.animesh.cc${path}` }));
}
