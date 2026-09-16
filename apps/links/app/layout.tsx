import type { Metadata } from "next";
export const metadata: Metadata = {
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
