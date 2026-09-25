import type { Metadata } from "next";
import { BlogIndex } from "@/components/index";
import { getPublicPosts, fixtureMode } from "@/lib/content";
export const dynamic = "force-dynamic";
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
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}): Promise<Metadata> {
  const { q, tag } = await searchParams;
  return {
    alternates: { canonical: "/" },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />
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
