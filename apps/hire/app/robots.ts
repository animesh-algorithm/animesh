import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const preview = process.env.VERCEL_ENV === "preview";
  return { rules: { userAgent: "*", allow: preview ? undefined : "/", disallow: preview ? ["/"] : ["/api/"] }, sitemap: "https://hire.animesh.cc/sitemap.xml" };
}
