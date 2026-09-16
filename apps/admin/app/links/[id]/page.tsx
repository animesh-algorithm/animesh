import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerPage } from "../../../lib/auth";
import { getLink, analytics } from "../../../lib/database";
import { InputError, validateId } from "../../../lib/validation";
import { LinkForm } from "../../../components/link-form";
import { LinkActions } from "../../../components/link-actions";
import { AnalyticsView } from "../../../components/analytics";
import { indiaTime, shortUrl } from "../../../lib/presentation";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireOwnerPage();
  const { id } = await params;
  try {
    validateId(id);
  } catch {
    notFound();
  }
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams))
    if (typeof value === "string") query.set(key, value);
  if (
    !["overview", "audience", "traffic", "events"].includes(
      query.get("tab") || "overview",
    )
  )
    query.set("tab", "overview");
  let link;
  try {
    link = await getLink(id);
  } catch (error) {
    if (error instanceof InputError && error.status === 404) notFound();
    throw error;
  }
  const data = await analytics(id, query),
    url = shortUrl(link.slug);
  return (
    <>
      <Link className="breadcrumb" href="/links">← All links</Link>
      <div className="page-heading detail-heading">
        <div>
          <div className="detail-badges"><span className={`badge badge-${link.source}`}>{link.source}</span>{link.deleted_at && <span className="badge badge-deleted">Deleted</span>}</div>
          <h1 className="detail-title">{link.title || link.slug}</h1>
          <div className="short-link-cluster"><a className="short-url" href={url} target="_blank" rel="noopener noreferrer">{url}</a><LinkActions url={url} id={link.id} prominent /></div>
          <p className="fine">Created {indiaTime(link.created_at)}{link.migration_source_domain ? ` · Migrated from ${link.migration_source_domain}` : ""}{link.deleted_at ? ` · Deleted ${indiaTime(link.deleted_at)}` : ""}</p>
        </div>
      </div>
      <section className="panel settings-card">
        <div className="section-heading"><div><span className="eyebrow">LINK SETTINGS</span><h2>Destination and title</h2></div><span className="immutable-note">/{link.slug} · permanent</span></div>
        <LinkForm link={link} />
      </section>
      <AnalyticsView data={data} id={id} params={query} />
    </>
  );
}
