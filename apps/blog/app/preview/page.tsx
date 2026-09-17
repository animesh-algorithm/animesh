import Link from "next/link";
import { isAuthenticatedOwner } from "@/lib/session";
import { getPreviewDirectory } from "@/lib/content";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function PreviewDirectory() {
  if (!(await isAuthenticatedOwner())) notFound();
  const posts = await getPreviewDirectory();
  return (
    <section className="preview-directory">
      <p className="eyebrow">OWNER ONLY</p>
      <h1>The preview notebook.</h1>
      <p>All entries in My Blog Posts. Drafts stay private.</p>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <Link href={`/preview/${p.id}`}>{p.title || "Untitled"}</Link>
            <span>{p.published ? "Published" : "Draft"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
