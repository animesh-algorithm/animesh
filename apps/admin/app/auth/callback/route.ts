import { authClient } from "../../../lib/auth";
import { isOwner } from "../../../lib/auth-policy";
import { privateHeaders } from "../../../lib/http";
export async function GET(request: Request) {
  let stage = "callback";
  try {
    const code = new URL(request.url).searchParams.get("code");
    if (!code) throw new Error();
    const client = await authClient();
    stage = "code_exchange";
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) throw new Error();
    stage = "session_verification";
    const { data, error: verificationError } = await client.auth.getUser();
    if (verificationError || !data.user) {
      await client.auth.signOut();
      throw new Error();
    }
    stage = "owner_verification";
    if (!isOwner(data.user)) {
      // Log only comparison results, never identity values, cookies or tokens.
      console.warn("oauth_owner_rejected", {
        idMatches: data.user.id === process.env.OWNER_USER_ID,
        emailMatches:
          data.user.email?.toLowerCase() ===
          process.env.OWNER_GOOGLE_EMAIL?.toLowerCase(),
        emailVerified: Boolean(data.user.email_confirmed_at),
        googleProvider: data.user.app_metadata.provider === "google",
        googleIdentity: Boolean(
          data.user.identities?.some((identity) => identity.provider === "google"),
        ),
      });
      await client.auth.signOut();
      throw new Error();
    }
    return new Response(null, {
      status: 303,
      headers: {
        ...privateHeaders,
        Location: `${process.env.ADMIN_ORIGIN}/links`,
      },
    });
  } catch {
    console.warn("oauth_callback_failed", { stage });
    return new Response(null, {
      status: 303,
      headers: { ...privateHeaders, Location: "/?error=access" },
    });
  }
}
