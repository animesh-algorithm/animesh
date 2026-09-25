import { AnalyticsProvider } from "@/components/analytics-provider";
import type { Metadata } from "next";
import { AskAnimeshProvider } from "@/components/ask-animesh";
import "./globals.css";

const homepageDescription = "Animesh Sharma is a product engineer building AI products, full-stack software, and automation. Explore selected projects and the thinking behind them.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.animesh.cc"),
  authors: [{ name: "Animesh Sharma", url: "https://www.animesh.cc/about" }],
  creator: "Animesh Sharma",
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : { index: true, follow: true },
  title: "Animesh Sharma — Engineer, product & AI automation",
  description: homepageDescription,
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
