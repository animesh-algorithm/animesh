import { it, expect, vi } from "vitest";
import { permittedMediaUrl, expiresSoon, downloadImage } from "../lib/media";
it("detects expired and near-expiry signed files", () => {
  expect(
    expiresSoon({
      type: "file",
      file: { url: "https://file.notion.so/a", expiry_time: "2020-01-01" },
    }),
  ).toBe(true);
  expect(
    expiresSoon({
      type: "external",
      external: { url: "https://media.tenor.com/a.gif" },
    }),
  ).toBe(false);
});
it("blocks private and unapproved destinations", () => {
  for (const url of [
    "http://media.tenor.com/a.gif",
    "https://127.0.0.1/x",
    "https://file.notion.so.evil.com/x",
    "https://user:pass@file.notion.so/x",
    "https://file.notion.so:123/x",
  ])
    expect(permittedMediaUrl(url)).toBeNull();
  expect(permittedMediaUrl("https://file.notion.so/image.png")).toBeTruthy();
});
it("rejects redirects to unapproved hosts and active content", async () => {
  const redirect = vi.fn().mockResolvedValue(
    new Response(null, {
      status: 302,
      headers: { location: "https://localhost/private" },
    }),
  );
  await expect(
    downloadImage("https://file.notion.so/image", false, redirect),
  ).rejects.toThrow("redirect");
  const html = vi.fn().mockResolvedValue(
    new Response("<script>x</script>", {
      headers: { "content-type": "text/html" },
    }),
  );
  await expect(
    downloadImage("https://file.notion.so/image", false, html),
  ).rejects.toThrow("format");
});
it("turns an animation into a first-frame PNG", async () => {
  const gif = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64",
  );
  const fetcher = vi
    .fn()
    .mockResolvedValue(
      new Response(gif, { headers: { "content-type": "image/gif" } }),
    );
  const result = await downloadImage(
    "https://media.tenor.com/a.gif",
    true,
    fetcher,
  );
  expect(result.type).toBe("image/png");
  expect(Buffer.from(result.bytes).subarray(1, 4).toString()).toBe("PNG");
  expect(fetcher.mock.calls[0][1].cache).toBe("no-store");
});

it("compresses oversized static images without changing animation responses", async () => {
  const { default: sharp } = await import("sharp");
  const png = await sharp({ create: { width: 2400, height: 1200, channels: 3, background: "#f7f5f0" } }).png().toBuffer();
  const fetcher = vi.fn().mockResolvedValue(new Response(png, { headers: { "content-type": "image/png" } }));
  const result = await downloadImage("https://file.notion.so/image", false, fetcher);
  const dimensions = await sharp(result.bytes).metadata();
  expect(dimensions.width).toBe(1600);
  expect(result.type).toBe("image/webp");
  expect(result.bytes.length).toBeLessThan(png.length);
});
