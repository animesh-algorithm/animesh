import type { MetadataRoute } from "next";
import { ORIGIN } from "@/lib/model";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: process.env.VERCEL_ENV === "preview" ? undefined : "/",
      disallow:
        process.env.VERCEL_ENV === "preview"
          ? ["/"]
          : ["/preview", "/api/", "/media/", "/*?q=", "/*?tag="],
    },
    sitemap: `${ORIGIN}/sitemap.xml`,
  };
}
