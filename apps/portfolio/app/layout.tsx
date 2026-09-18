import { AnalyticsProvider } from "@/components/analytics-provider";
import type { Metadata } from "next";
import { AskAnimeshProvider } from "@/components/ask-animesh";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.animesh.cc"),
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : { index: true, follow: true },
  title: "Animesh Sharma — Engineer, product & AI automation",
  openGraph: { type: "website", siteName: "Animesh Sharma", title: "Animesh Sharma — Engineering, AI & automation", description: "Products, AI systems, and automation built by Animesh Sharma.", url: "/" },
  twitter: { card: "summary_large_image", title: "Animesh Sharma — Engineering, AI & automation", description: "Products, AI systems, and automation built by Animesh Sharma.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Animesh Sharma — I figure things out. Then I build them." }] },
  description: "Animesh builds products, AI systems, and automation that solve hard, ambiguous problems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider />
        <AskAnimeshProvider>{children}</AskAnimeshProvider>
      </body>
    </html>
  );
}
