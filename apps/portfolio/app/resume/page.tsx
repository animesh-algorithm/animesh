import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

const description = "Read Animesh Sharma’s résumé covering product engineering, AI, automation, and experience at Gradly.";
const title = "Résumé — Animesh Sharma";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/resume" },
  openGraph: { title, description, url: "/resume" },
  twitter: { title, description },
};

export default function ResumePage() {
  return <main id="top" className="profile-page">
    <SiteHeader home={false} />
    <section className="profile-hero chapter chapter-paper">
      <div className="shell">
        <p className="eyebrow">RÉSUMÉ</p>
        <h1>Animesh Sharma’s résumé.</h1>
        <p>Product engineering, AI, automation, and the work behind them.</p>
        <a href="/resume.pdf">Open or download the PDF</a>
      </div>
    </section>
  </main>;
}
