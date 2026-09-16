import { AnalyticsProvider } from "@/components/analytics-provider";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AvailabilityDock } from "@/components/availability/availability-dock";
import { MotionDirector } from "@/components/motion/motion-director";
import { site } from "@/content/site";
import { getBookingDestination } from "@/lib/booking";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Product, automation, and internal tools`,
    template: `%s — ${site.name}`,
  },
  description: site.hero.support,
  applicationName: site.name,
  authors: [{ name: site.person }],
  creator: site.person,
  openGraph: {
    type: "website",
    title: `${site.name} — Product, automation, and internal tools`,
    description: site.hero.support,
  },
  twitter: {
    card: "summary",
    title: `${site.name} — Product, automation, and internal tools`,
    description: site.hero.support,
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const booking = getBookingDestination();
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <MotionDirector />
        {children}
        <AvailabilityDock bookingHref={booking.href} configured={booking.configured} />
      </body>
    </html>
  );
}
