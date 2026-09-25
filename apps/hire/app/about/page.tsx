import { AboutSection } from "@/components/sections/about-section";

export const metadata = { title: "About", description: "How Animesh Sharma works across product, engineering, and operations.", alternates: { canonical: "/about" } };

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.animesh.cc/#person",
  name: "Animesh Sharma",
  url: "https://www.animesh.cc",
  sameAs: [
    "https://www.linkedin.com/in/animeshsharma42",
    "https://github.com/animesh-algorithm",
    "https://x.com/animesh_algo",
  ],
};

export default function AboutPage() {
  return <main id="main-content">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />
    <AboutSection />
  </main>;
}
