import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isOwner } from "./auth-policy";
export class AccessError extends Error {
  constructor(public status: number) {
    super("Access denied");
  }
}
export function authConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.ADMIN_ORIGIN &&
    process.env.OWNER_USER_ID &&
    process.env.OWNER_GOOGLE_EMAIL,
  );
}
export async function authClient() {
  if (!authConfigured()) throw new AccessError(503);
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll(values) {
          try {
            for (const { name, value, options } of values)
              jar.set(name, value, options);
          } catch {
            /* Proxy handles refresh for Server Components. */
          }
        },
      },
    },
  );
}
export async function requireOwner() {
  const client = await authClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new AccessError(401);
  if (!isOwner(data.user)) throw new AccessError(403);
  return { client, user: data.user };
}
export async function requireOwnerPage() {
  try {
    return await requireOwner();
  } catch (error) {
    if (error instanceof AccessError) redirect("/?error=access");
    throw error;
  }
}
