import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://admin.animesh.cc"),
  openGraph: { title: "Animesh · Link operations", description: "Private link operations workspace.", type: "website", url: "/" },
  twitter: {
    card: "summary_large_image",
    title: "Animesh · Link operations",
    description: "Private link operations workspace.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Animesh · Link operations — Private link operations workspace." }],
  },
  title: "Animesh · Link operations",
  description: "Private link operations",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
