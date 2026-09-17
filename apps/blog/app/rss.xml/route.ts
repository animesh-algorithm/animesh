import { getPublicPosts } from "@/lib/content";
import { rss } from "@/lib/rss";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return new Response(rss(await getPublicPosts()), {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response("Archive unavailable", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
