import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.VERCEL_ENV === "preview") return [];
  return ["/", "/work", "/services", "/services/mvp-development", "/services/saas-web-apps", "/services/ai-products-features", "/services/mobile-apps", "/pricing", "/about", "/contact", "/privacy"].map((path) => ({ url: `https://hire.animesh.cc${path}` }));
}
