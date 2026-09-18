import "server-only";
import sharp from "sharp";
import { sameId, walk, type FileRef, type Post } from "./model";
const hosts = new Set([
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "s3.us-west-2.amazonaws.com",
  "s3-us-west-2.amazonaws.com",
  "secure.notion-static.com",
  "file.notion.so",
  "www.notion.so",
  "media.giphy.com",
  "media0.giphy.com",
  "media1.giphy.com",
  "media2.giphy.com",
  "media3.giphy.com",
  "media4.giphy.com",
  "media.tenor.com",
  "gifdb.com",
  "thumbs.gfycat.com",
]);
export function permittedMediaUrl(value: string) {
  try {
    const u = new URL(value);
    const extra = (process.env.BLOG_MEDIA_HOSTS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.port &&
      (hosts.has(u.hostname) || extra.includes(u.hostname))
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export const fileUrl = (file?: FileRef) =>
  file?.file?.url ?? file?.external?.url;
export function blockFile(post: Post, id: string): FileRef | undefined {
  const block = walk(post.blocks).find((b) => sameId(b.id, id));
  if (block?.type !== "image") return;
  return block.data as FileRef;
}
export function expiresSoon(file: FileRef, now = Date.now()) {
  return (
    file.type === "file" &&
    (!file.file?.expiry_time || Date.parse(file.file.expiry_time) < now + 60000)
  );
}
export async function downloadImage(
  url: string,
  still: boolean,
  fetcher: typeof fetch = fetch,
): Promise<{ bytes: Uint8Array; type: string }> {
  let location = permittedMediaUrl(url);
  if (!location) throw new Error("Unsupported media host");
  let response: Response | undefined;
  for (let redirect = 0; redirect < 4; redirect++) {
    response = await fetcher(location, {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });
    if (![301, 302, 303, 307, 308].includes(response.status)) break;
    location = permittedMediaUrl(
      new URL(response.headers.get("location") ?? "", location).href,
    );
    if (!location) throw new Error("Unsupported media redirect");
  }
  if (!response?.ok || !response.body) throw new Error("Media unavailable");
  const type = (response.headers.get("content-type") ?? "").split(";")[0];
  if (
    ![
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "image/avif",
    ].includes(type)
  )
    throw new Error("Unsupported image format");
  const limit = 20 * 1024 * 1024;
  const reader = response.body.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new Error("Image too large");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const bytes = Buffer.concat(chunks);
  if (still)
    return {
      bytes: await sharp(bytes, { animated: false, limitInputPixels: 40000000 })
        .png()
        .toBuffer(),
      type: "image/png",
    };
  // Keep animation intact; resize and compress static editorial images.
  if (type !== "image/gif" && ((await sharp(bytes, { limitInputPixels: 40000000 }).metadata()).pages ?? 1) <= 1) {
    const optimized = await sharp(bytes, { animated: false, limitInputPixels: 40000000 })
      .rotate().resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 }).toBuffer();
    if (optimized.length < bytes.length) return { bytes: optimized, type: "image/webp" };
  }
  return { bytes, type };
}
