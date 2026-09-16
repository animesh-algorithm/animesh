import { requireOwner } from "./auth";
import {
  createWithRetry,
  InputError,
  validateId,
  validateSlug,
  validateTitle,
  validateDestination,
  directoryParams,
  analyticsParams,
} from "./validation";
import type { LinkRecord, Directory, Summary, Analytics } from "./types";
export async function directory(
  params: URLSearchParams,
  exportAll = false,
): Promise<Directory> {
  const { client } = await requireOwner();
  const { data, error } = await client.rpc("link_directory", {
    ...directoryParams(params),
    p_export: exportAll,
  });
  if (error) throw new Error("directory_failed");
  return data;
}
export async function summary(): Promise<Summary> {
  const { client } = await requireOwner();
  const { data, error } = await client.rpc("link_summary");
  if (error) throw new Error("summary_failed");
  return data;
}
export async function getLink(id: string): Promise<LinkRecord> {
  const { client } = await requireOwner();
  const { data, error } = await client
    .from("links")
    .select("*")
    .eq("id", validateId(id))
    .maybeSingle();
  if (error) throw new Error("lookup_failed");
  if (!data) throw new InputError("Link not found.", 404);
  return data;
}
export async function analytics(
  id: string,
  params: URLSearchParams,
): Promise<Analytics> {
  const { client } = await requireOwner();
  const { data, error } = await client.rpc("link_analytics", {
    p_link_id: validateId(id),
    ...analyticsParams(params),
  });
  if (error) throw new Error("analytics_failed");
  return data;
}
export async function createLink(body: Record<string, unknown>) {
  const { client, user } = await requireOwner();
  if (
    Object.keys(body).some(
      (key) => !["slug", "destination", "title"].includes(key),
    )
  )
    throw new InputError("Unexpected link fields.");
  const destination = validateDestination(body.destination),
    title = validateTitle(body.title),
    custom =
      body.slug === undefined || body.slug === ""
        ? undefined
        : validateSlug(body.slug);
  return createWithRetry<LinkRecord>(
    async (slug) =>
      client
        .from("links")
        .insert({ slug, destination, title, creator: user.id })
        .select("*")
        .single(),
    custom,
  );
}
export async function editLink(id: string, body: Record<string, unknown>) {
  const { client } = await requireOwner();
  if (
    Object.keys(body).some((k) => !["destination", "title"].includes(k)) ||
    !Object.keys(body).length
  )
    throw new InputError("Only destination and title can be edited.");
  const update: Record<string, unknown> = {};
  if ("destination" in body)
    update.destination = validateDestination(body.destination);
  if ("title" in body) update.title = validateTitle(body.title);
  const { data, error } = await client
    .from("links")
    .update(update)
    .eq("id", validateId(id))
    .is("deleted_at", null)
    .select("*")
    .maybeSingle();
  if (error) throw new Error("edit_failed");
  if (!data) throw new InputError("Active link not found.", 404);
  return data as LinkRecord;
}
export async function deleteLink(id: string, body: Record<string, unknown>) {
  const { client } = await requireOwner();
  if (body.confirm !== true || Object.keys(body).some((k) => k !== "confirm"))
    throw new InputError("Confirm soft deletion.");
  const { data, error } = await client
    .from("links")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", validateId(id))
    .is("deleted_at", null)
    .select("*")
    .maybeSingle();
  if (error) throw new Error("delete_failed");
  if (!data) throw new InputError("Active link not found.", 404);
  return data as LinkRecord;
}
