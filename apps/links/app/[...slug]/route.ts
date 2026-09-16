import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { resolveLink, recordClick } from "../../lib/database";
import { collectMetadata } from "../../lib/metadata";
import { validSlug, redirectResult } from "../../lib/redirect";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noCache = {
  "Cache-Control": "no-store, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};
async function handle(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
  count: boolean,
) {
  const { slug: parts } = await context.params;
  const slug = parts.join("/");
  if (!validSlug(slug))
    return new Response(count ? "Link not found" : null, {
      status: 404,
      headers: noCache,
    });
  try {
    const link = await resolveLink(slug);
    const result = redirectResult(link, new URL(request.url).searchParams);
    if (result.location && link) {
      if (count) {
        const eventId = randomUUID();
        const timestamp = new Date().toISOString();
        const metadata = collectMetadata(request.headers);
        after(async () => {
          try {
            await recordClick(eventId, link.id, timestamp, metadata);
          } catch {
            console.error("analytics_write_failed", { eventId });
          }
        });
      }
      return new Response(null, {
        status: 302,
        headers: { ...noCache, Location: result.location },
      });
    }
    return new Response(count ? result.message : null, {
      status: result.status,
      headers: noCache,
    });
  } catch {
    console.error("redirect_lookup_failed");
    return new Response(count ? "Links are temporarily unavailable" : null, {
      status: 503,
      headers: { ...noCache, "Retry-After": "30" },
    });
  }
}
export function GET(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handle(request, context, true);
}
export function HEAD(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handle(request, context, false);
}
