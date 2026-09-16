export const RESERVED = new Set([
  "_next",
  "api",
  "auth",
  ".well-known",
  "favicon.ico",
  "icon.svg",
  "_not-found",
  "robots.txt",
  "sitemap.xml",
]);
export function validSlug(slug: string) {
  return (
    slug.length > 0 &&
    slug.length <= 256 &&
    /^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/.test(slug) &&
    !slug.split("/").some((s) => s === "." || s === "..") &&
    !RESERVED.has(slug.split("/")[0].toLowerCase())
  );
}
export function forwardQuery(destination: string, incoming: URLSearchParams) {
  const target = new URL(destination);
  const existing = new Set(target.searchParams.keys());
  for (const [key, value] of incoming)
    if (!existing.has(key)) target.searchParams.append(key, value);
  return target.toString();
}
export type ResolvedLink = {
  id: string;
  destination: string | null;
  deleted: boolean;
};
export function redirectResult(
  link: ResolvedLink | undefined,
  query: URLSearchParams,
) {
  if (!link) return { status: 404, message: "Link not found" };
  if (link.deleted)
    return { status: 410, message: "This link has been deleted" };
  if (!link.destination) throw new Error("invalid_lookup");
  const target = new URL(link.destination);
  const ownHost = new URL(process.env.LINKS_ORIGIN || "https://link.animesh.cc")
    .hostname;
  if (
    !["http:", "https:"].includes(target.protocol) ||
    target.username ||
    target.password ||
    [ownHost, "link.animesh.cc"].includes(target.hostname.replace(/\.$/, ""))
  )
    throw new Error("invalid_destination");
  return { status: 302, location: forwardQuery(target.toString(), query) };
}
