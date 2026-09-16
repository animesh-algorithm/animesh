import { authClient } from "../../../lib/auth";
import { originAllowed } from "../../../lib/auth-policy";
import { privateHeaders } from "../../../lib/http";
export async function POST(request: Request) {
  if (!originAllowed(request))
    return new Response("Access denied", {
      status: 403,
      headers: privateHeaders,
    });
  try {
    const client = await authClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.ADMIN_ORIGIN}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error || !data.url) throw new Error();
    return new Response(null, {
      status: 303,
      headers: { ...privateHeaders, Location: data.url },
    });
  } catch {
    return new Response(
      "Authentication unavailable. Configure the private owner and Supabase settings.",
      { status: 503, headers: privateHeaders },
    );
  }
}
