import type { Metadata } from "next";
import Link from "next/link";
import { ORIGIN } from "@/lib/model";
import { SiteFooter } from "@/components/footer";
import { MotionExperience } from "@/components/motion-experience";
import "@fontsource-variable/outfit";
import "./globals.css";
export const metadata: Metadata = {
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  twitter: { card: "summary_large_image", title: "Animesh — Notes & rabbit holes", description: "Notes on building things, understanding how they work, and finding a little perspective along the way.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Animesh — Notes & rabbit holes." }] },
  metadataBase: new URL(ORIGIN),
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : undefined,
  title: {
    default: "Animesh — Notes & rabbit holes",
    template: "%s · Animesh",
  },
  description:
    "Notes on building things, understanding how they work, and finding a little perspective along the way.",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { type: "website", siteName: "Animesh", title: "Animesh — Notes & rabbit holes", description: "Notes on building things, understanding how they work, and finding a little perspective along the way.", url: "/" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionExperience />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="masthead" href="/">
            animesh<span aria-hidden="true">✳</span>
            <small>THE BLOG</small>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/">Writing</Link>
            <a href="https://www.animesh.cc">About me ↗</a>
            <Link className="rss-link" href="/rss.xml">
              RSS ↗
            </Link>
          </nav>
        </header>
        <main id="main" className="shell">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
