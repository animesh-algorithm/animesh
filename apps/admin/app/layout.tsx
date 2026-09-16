import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
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
