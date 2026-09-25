import { AnalyticsProvider } from "@/components/analytics-provider";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionDirector } from "@/components/motion/motion-director";
import { site } from "@/content/site";
import "@/styles/globals.css";

const homepageDescription = "Animesh Sharma works with founders to turn product ideas and messy workflows into shipped software. Explore his work, services, pricing, and ways to start a project.";

export const metadata: Metadata = {
  metadataBase: new URL("https://hire.animesh.cc"),
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : { index: true, follow: true },
  title: {
    default: `${site.name} — Product studio for useful software`,
    template: `%s — ${site.name}`,
  },
  description: homepageDescription,
  applicationName: site.name,
  authors: [{ name: site.person }],
  creator: site.person,
  openGraph: {
    type: "website",
    siteName: site.name,
    url: "/",
    title: `${site.name} — Product studio for useful software`,
    description: homepageDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Product studio for useful software`,
    description: homepageDescription,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Hire Animesh — From messy to shipped." }],
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <MotionDirector />
        <div className="v2-app-frame"><SiteHeader /><div className="v2-page-frame">{children}<SiteFooter /></div></div>
      </body>
    </html>
  );
}
