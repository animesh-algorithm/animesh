import type { MetadataRoute } from "next";
import { experiments, projects } from "@/content/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.VERCEL_ENV === "preview") return [];
  return ["/", "/work", ...[...projects, ...experiments].map(({ slug }) => `/work/${slug}`), "/services", "/services/mvp-development", "/services/saas-web-apps", "/services/ai-products-features", "/services/mobile-apps", "/pricing", "/about", "/contact", "/privacy"].map((path) => ({ url: `https://hire.animesh.cc${path}` }));
}
