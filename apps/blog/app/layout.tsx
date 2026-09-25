import type { Metadata } from "next";
import Link from "next/link";
import { ORIGIN } from "@/lib/model";
import { SiteFooter } from "@/components/footer";
import { MotionExperience } from "@/components/motion-experience";
import { ArrowUpRightIcon, SparkIcon } from "@/components/icons";
import "@fontsource-variable/outfit";
import "./globals.css";
const homepageDescription = "Read Animesh Sharma's notes on building software, exploring ideas, and understanding how things work. Browse articles, experiments, and reflections from his writing archive.";
export const metadata: Metadata = {
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  twitter: { card: "summary_large_image", title: "Animesh — Notes & rabbit holes", description: homepageDescription, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Animesh — Notes & rabbit holes." }] },
  metadataBase: new URL(ORIGIN),
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : undefined,
  title: {
    default: "Animesh — Notes & rabbit holes",
    template: "%s · Animesh",
  },
  description: homepageDescription,
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { type: "website", siteName: "Animesh", title: "Animesh — Notes & rabbit holes", description: homepageDescription, url: "/" },
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
            animesh<SparkIcon className="brand-icon" />
            <small>THE BLOG</small>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/">Writing</Link>
            <a href="https://www.animesh.cc">About me <ArrowUpRightIcon /></a>
            <Link className="rss-link" href="/rss.xml">
              RSS <ArrowUpRightIcon />
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
