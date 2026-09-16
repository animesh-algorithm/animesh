import "server-only";

import { site } from "@/content/site";

export function getBookingDestination() {
  const configuredUrl = process.env.NEXT_PUBLIC_BOOKING_URL || site.bookingUrl;
  let calUrl: URL | null = null;
  try {
    const candidate = configuredUrl ? new URL(configuredUrl) : null;
    if (candidate?.protocol === "https:" && (candidate.hostname === "cal.com" || candidate.hostname.endsWith(".cal.com"))) {
      calUrl = candidate;
    }
  } catch {
    calUrl = null;
  }
  const subject = encodeURIComponent("Call request — Hire Animesh");
  const body = encodeURIComponent("Hi Animesh,\n\nI’d like to book a call about:\n\nA few times that could work for me:\n");

  if (calUrl) {
    const embedUrl = new URL(calUrl);
    embedUrl.searchParams.set("embed", "true");
    embedUrl.searchParams.set("theme", "light");
    return { configured: true as const, href: calUrl.toString(), embedHref: embedUrl.toString() };
  }

  return {
    configured: false as const,
    href: `mailto:${site.email}?subject=${subject}&body=${body}`,
    embedHref: null,
  };
}
