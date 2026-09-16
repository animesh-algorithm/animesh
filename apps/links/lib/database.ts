import postgres from "postgres";
import type { ResolvedLink } from "./redirect";
import type { collectMetadata } from "./metadata";
let client: ReturnType<typeof postgres> | undefined;
function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("database_not_configured");
  if (!client)
    client = postgres(url, {
      max: 3,
      prepare: false,
      ssl: "require",
      connect_timeout: 5,
      idle_timeout: 20,
      connection: { statement_timeout: 5000 },
    });
  return client;
}
export async function resolveLink(
  slug: string,
): Promise<ResolvedLink | undefined> {
  const rows = await database()<
    ResolvedLink[]
  >`select * from public.resolve_link(${slug})`;
  return rows[0];
}
export async function recordClick(
  id: string,
  linkId: string,
  timestamp: string,
  metadata: ReturnType<typeof collectMetadata>,
) {
  const db = database();
  await db`select public.record_click(${id}::uuid, ${linkId}::uuid, ${timestamp}::timestamptz, ${db.json(metadata)}::jsonb)`;
}
