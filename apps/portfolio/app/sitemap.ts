import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.VERCEL_ENV === "preview") return [];
  return ["https://www.animesh.cc/", "https://www.animesh.cc/about", "https://www.animesh.cc/resume", "https://www.animesh.cc/ask", "https://www.animesh.cc/privacy"].map((url) => ({ url }));
}
