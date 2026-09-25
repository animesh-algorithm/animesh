import type { Metadata } from "next";
import { BlogIndex } from "@/components/index";
import { getPublicPosts, fixtureMode } from "@/lib/content";
export const dynamic = "force-dynamic";
const structuredData = [{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.animesh.cc/about#person",
  name: "Animesh Sharma",
  url: "https://www.animesh.cc/about",
  jobTitle: "Product Engineer",
  description: "Product engineer working across software, AI, and automation.",
  sameAs: [
    "https://www.linkedin.com/in/animeshsharma42",
    "https://github.com/animesh-algorithm",
    "https://x.com/animesh_algo",
  ],
}, {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://blog.animesh.cc/#website",
  name: "Animesh",
  url: "https://blog.animesh.cc/",
}];
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}): Promise<Metadata> {
  const { q, tag } = await searchParams;
  return {
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName: "Animesh", title: "Animesh — Notes & rabbit holes", description: "Read Animesh Sharma's notes on building software, exploring ideas, and understanding how things work. Browse articles, experiments, and reflections from his writing archive.", url: "/" },
    twitter: { card: "summary_large_image", title: "Animesh — Notes & rabbit holes", description: "Read Animesh Sharma's notes on building software, exploring ideas, and understanding how things work. Browse articles, experiments, and reflections from his writing archive.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Animesh — Notes & rabbit holes." }] },
    robots:
      q || tag || fixtureMode() ? { index: false, follow: true } : undefined,
  };
}
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;
  const posts = await getPublicPosts().catch(() => null);
  if (!posts)
    return (
      <section className="unavailable">
        <p className="eyebrow">THE WRITING ARCHIVE</p>
        <h1>Back in a little while.</h1>
        <p>The archive is temporarily unavailable. Please try again soon.</p>
      </section>
    );
  return (
    <>
      {!q && !tag && !fixtureMode() && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      )}
      {fixtureMode() && (
        <p className="fixture-banner">
          Development inspection snapshot · live Notion is not connected
        </p>
      )}
      <BlogIndex
        posts={posts}
        q={typeof q === "string" ? q.slice(0, 200) : ""}
        tag={typeof tag === "string" ? tag : ""}
      />
    </>
  );
}
