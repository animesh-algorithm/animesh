import { isAuthenticatedOwner } from "@/lib/session";
import { getPublicPosts, getPreviewPost, fixtureMode } from "@/lib/content";
import { notion } from "@/lib/notion";
import { blockFile, fileUrl, downloadImage, expiresSoon } from "@/lib/media";
import { validId, sameId } from "@/lib/model";
export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
};
export async function GET(
  request: Request,
  { params }: { params: Promise<{ pageId: string; blockId: string }> },
) {
  const { pageId, blockId } = await params;
  const query = new URL(request.url).searchParams;
  const preview = query.get("preview") === "1";
  const reject = () =>
    new Response("Media unavailable", { status: 404, headers });
  if (!validId(pageId) || (blockId !== "thumbnail" && !validId(blockId)))
    return reject();
  try {
    if (preview && !(await isAuthenticatedOwner())) return reject();
    if (!preview && !(await getPublicPosts()).some((p) => sameId(p.id, pageId)))
      return reject();
    // Fresh membership and file objects on EVERY request. Signed URLs never enter public markup.
    const page = fixtureMode() ? null : await notion.page(pageId);
    if (
      !fixtureMode() &&
      (!page || (!preview && !page.properties.published?.checkbox))
    )
      return reject();
    const readFile = async () => {
      if (blockId === "thumbnail") return page?.properties.thumbnail?.files?.[0];
      if (!fixtureMode()) return notion.imageFile(pageId, blockId);
      const post = await getPreviewPost(pageId);
      return post ? blockFile(post, blockId) : undefined;
    };
    let file = await readFile();
    if (!file) return reject();
    if (fixtureMode() && fileUrl(file)?.startsWith("https://fixture.invalid/"))
      return new Response(
        await (
          await import("node:fs/promises")
        ).readFile(`${process.cwd()}/public/fixture-image.svg`),
        { headers: { ...headers, "Content-Type": "image/svg+xml" } },
      );
    // Retrieval normally refreshes expiry; retry a near-expired object once before fetching.
    if (expiresSoon(file)) {
      if (blockId === "thumbnail")
        file = (await notion.page(pageId))?.properties.thumbnail?.files?.[0];
      else {
        file = await readFile();
      }
    }
    const url = fileUrl(file);
    if (!url) return reject();
    let image;
    try {
      image = await downloadImage(url, query.get("still") === "1");
    } catch {
      // A signed URL may expire between retrieval and download.
      if (file?.type !== "file") return reject();
      const refreshed =
        blockId === "thumbnail"
          ? (await notion.page(pageId))?.properties.thumbnail?.files?.[0]
          : await readFile();
      const next = fileUrl(refreshed);
      if (!next) return reject();
      image = await downloadImage(next, query.get("still") === "1");
    }
    return new Response(image.bytes as BodyInit, {
      headers: { ...headers, "X-Robots-Tag": preview ? "noindex, nofollow" : "index, follow", "Content-Type": image.type },
    });
  } catch {
    return reject();
  }
}
