import { randomInt } from "node:crypto";
export class InputError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
const reserved = new Set([
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
export function validateSlug(value: unknown): string {
  const slug =
    typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
      ? value.slice(1)
      : value;
  if (
    typeof slug !== "string" ||
    slug.length < 1 ||
    slug.length > 256 ||
    !/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/.test(slug) ||
    slug.split("/").some((s) => s === "." || s === "..") ||
    reserved.has(slug.split("/")[0].toLowerCase())
  )
    throw new InputError(
      "Use 1–256 characters: letters, digits, _, ., -, and nested / paths. Empty or reserved segments are not allowed.",
    );
  return slug;
}
export function validateDestination(value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length > 8192 ||
    /[\u0000-\u0020\u007f]/.test(value)
  )
    throw new InputError(
      "Enter an absolute HTTP or HTTPS URL without whitespace.",
    );
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new InputError("Enter an absolute HTTP or HTTPS URL.");
  }
  if (
    !/^https?:\/\//i.test(value) ||
    !["http:", "https:"].includes(url.protocol) ||
    !url.hostname ||
    url.username ||
    url.password
  )
    throw new InputError(
      "HTTP or HTTPS URLs without embedded credentials are required.",
    );
  const own = new URL(process.env.LINKS_ORIGIN || "https://link.animesh.cc")
    .hostname;
  if ([own, "link.animesh.cc"].includes(url.hostname.replace(/\.$/, "")))
    throw new InputError(
      "A destination cannot point to the short-link hostname.",
    );
  return url.toString();
}
export function validateTitle(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || [...value].length > 256)
    throw new InputError("Title must be at most 256 characters.");
  return value;
}
export function generatedSlug() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 8 }, () => chars[randomInt(chars.length)]).join(
    "",
  );
}
export async function createWithRetry<T>(
  insert: (
    slug: string,
  ) => Promise<{ data: T | null; error: { code?: string } | null }>,
  custom?: string,
  generate = generatedSlug,
): Promise<T> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const slug = custom || generate();
    const result = await insert(slug);
    if (!result.error && result.data) return result.data;
    if (result.error?.code === "23505") {
      if (custom) throw new InputError("This slug is already reserved.", 409);
      continue;
    }
    throw new Error("link_create_failed");
  }
  throw new InputError("Could not allocate a slug. Please retry.", 503);
}
export function validateId(id: string) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    throw new InputError("Invalid link ID.");
  return id;
}
export const sizes = [25, 50, 100, 200, 500];
export function directoryParams(params: URLSearchParams) {
  const search = (params.get("search") || "").slice(0, 256),
    status = params.get("status") || "active",
    source = params.get("source") || "all",
    sort = params.get("sort") || "created",
    direction = params.get("direction") || "desc",
    page = Number(params.get("page") || 1),
    size = Number(params.get("size") || 25);
  if (
    !["active", "deleted", "all"].includes(status) ||
    !["native", "migrated", "all"].includes(source) ||
    !["created", "slug", "title", "clicks", "last_click"].includes(sort) ||
    !["asc", "desc"].includes(direction) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 1000000 ||
    !sizes.includes(size)
  )
    throw new InputError("Invalid directory filters.");
  return {
    p_search: search,
    p_status: status,
    p_source: source,
    p_sort: sort,
    p_direction: direction,
    p_page: page,
    p_size: size,
  };
}
export function analyticsParams(params: URLSearchParams) {
  const range = params.get("range") || "7d",
    page = Number(params.get("page") || 1),
    size = Number(params.get("size") || 50);
  const end = params.get("end") || new Date().toISOString();
  if (
    !["24h", "7d", "30d", "90d", "all"].includes(range) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 1000000 ||
    !sizes.includes(size) ||
    !Number.isFinite(Date.parse(end)) ||
    Date.parse(end) > Date.now() + 60000
  )
    throw new InputError("Invalid analytics range.");
  return {
    p_range: range,
    p_page: page,
    p_size: size,
    p_end: new Date(end).toISOString(),
  };
}
