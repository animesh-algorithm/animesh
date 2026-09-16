import { createHmac } from "node:crypto";
import { isIP } from "node:net";
export function collectMetadata(
  headers: Headers,
  trusted = process.env.VERCEL === "1",
  secret = process.env.CLICK_HASH_SECRET,
) {
  const ip = trusted ? headers.get("x-vercel-forwarded-for")?.trim() : null;
  const ip_hash =
    ip && isIP(ip) && secret && secret.length >= 32
      ? createHmac("sha256", secret).update(ip).digest("hex")
      : null;
  const ua = (headers.get("user-agent") || "").slice(0, 4096);
  const is_bot =
    /bot|crawler|spider|slurp|preview|headless|facebookexternalhit|WhatsApp|curl|wget/i.test(
      ua,
    );
  const device = !ua
    ? "Unknown"
    : /ipad|tablet/i.test(ua)
      ? "Tablet"
      : /mobile|iphone|android/i.test(ua)
        ? "Mobile"
        : "Desktop";
  const browser = !ua
    ? "Unknown"
    : /edg\//i.test(ua)
      ? "Edge"
      : /opr\//i.test(ua)
        ? "Opera"
        : /chrome|crios/i.test(ua)
          ? "Chrome"
          : /firefox|fxios/i.test(ua)
            ? "Firefox"
            : /safari/i.test(ua)
              ? "Safari"
              : "Unknown";
  const os = /iphone|ipad/i.test(ua)
    ? "iOS"
    : /android/i.test(ua)
      ? "Android"
      : /windows/i.test(ua)
        ? "Windows"
        : /macintosh|mac os/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Unknown";
  const geo = (key: string, max: number) => {
    if (!trusted) return "Unknown";
    try {
      return (
        decodeURIComponent(headers.get(key) || "Unknown").slice(0, max) ||
        "Unknown"
      );
    } catch {
      return "Unknown";
    }
  };
  const coord = (key: string, bound: number) => {
    const raw = trusted ? headers.get(key) : null;
    if (!raw?.trim()) return null;
    const value = Number(raw);
    return Number.isFinite(value) && Math.abs(value) <= bound ? value : null;
  };
  let referrer_domain = "Direct / Unknown";
  try {
    const ref = new URL(headers.get("referer") || "");
    if (["http:", "https:"].includes(ref.protocol))
      referrer_domain = ref.hostname.slice(0, 253);
  } catch {
    /* Missing metadata is expected. */
  }
  return {
    ip_hash,
    country: geo("x-vercel-ip-country", 100),
    city: geo("x-vercel-ip-city", 200),
    latitude: coord("x-vercel-ip-latitude", 90),
    longitude: coord("x-vercel-ip-longitude", 180),
    device,
    browser,
    os,
    referrer_domain,
    is_bot,
  };
}
