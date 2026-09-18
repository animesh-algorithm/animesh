import type { Metadata } from "next";
export const metadata: Metadata = {
  metadataBase: new URL("https://link.animesh.cc"),
  openGraph: { title: "Animesh · Links", description: "A shorter way there. Small links, clear destinations.", type: "website", url: "/" },
  twitter: {
    card: "summary_large_image",
    title: "Animesh · Links",
    description: "A shorter way there. Small links, clear destinations.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Animesh · Links — A shorter way there. Small links, clear destinations." }],
  },
  title: "Animesh · Links",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", margin: 0, color: "#272331" }}>
        {children}
      </body>
    </html>
  );
}
