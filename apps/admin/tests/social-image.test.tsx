import { expect, test } from "vitest";
import Image, { alt, contentType, size } from "../app/opengraph-image";

test("share image renders a compact 1200 by 630 PNG with descriptive alt text", async () => {
  const response = await Image();
  const bytes = Buffer.from(await response.arrayBuffer());
  expect(contentType).toBe("image/png");
  expect(alt.length).toBeGreaterThan(30);
  expect(size).toEqual({ width: 1200, height: 630 });
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  expect(bytes.length).toBeLessThan(1_000_000);
});
