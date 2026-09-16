import { api } from "../../../lib/http";
import { authClient } from "../../../lib/auth";
import { originAllowed } from "../../../lib/auth-policy";
import { InputError } from "../../../lib/validation";
export function POST(request: Request) {
  return api(async () => {
    if (!originAllowed(request)) throw new InputError("Invalid origin.", 403);
    const client = await authClient();
    await client.auth.signOut();
    return new Response(null, {
      status: 303,
      headers: { Location: "/", "Cache-Control": "private, no-store" },
    });
  });
}
