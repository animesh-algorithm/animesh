import Link from "next/link";
import { authConfigured } from "../lib/auth";
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  return (
    <main id="main" className="login">
      <span className="eyebrow">ANIMESH / OPERATIONS</span>
      <div className="login-mark" aria-hidden="true">
        ↗
      </div>
      <h1>
        Your links.
        <br />A clear view.
      </h1>
      <p>A private workspace for short links and the journeys they start.</p>
      {params.error && (
        <p className="notice" role="alert">
          Access denied. Only the configured Google owner can enter.
        </p>
      )}
      {!authConfigured() && (
        <p className="notice">
          Setup required: configure Supabase and the private owner settings to
          enable sign-in.
        </p>
      )}
      <form action="/auth/login" method="post">
        <button disabled={!authConfigured()}>
          Continue with Google <span aria-hidden="true">↗</span>
        </button>
      </form>
      <Link className="quiet" href="/links">
        Open workspace
      </Link>
      <p className="fine">Owner access only · No public link creation</p>
    </main>
  );
}
