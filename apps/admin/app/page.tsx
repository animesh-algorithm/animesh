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
    <main id="main" className="login-shell">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand" aria-label="Animesh link operations">
          <span className="brand-mark">a<span>.</span></span>
          <span>Link operations</span>
        </div>
        <div className="login-copy">
          <span className="eyebrow">PRIVATE WORKSPACE</span>
          <h1 id="login-title">Your links.<br />A clear view.</h1>
          <p>A private workspace for short links and the journeys they start.</p>
        </div>
        {params.error && <p className="notice notice-error" role="alert">Access denied. Only the configured Google owner can enter.</p>}
        {!authConfigured() && <p className="notice">Setup required: configure Supabase and the private owner settings to enable sign-in.</p>}
        <form action="/auth/login" method="post">
          <button className="login-button" disabled={!authConfigured()}>
            <span className="google-mark" aria-hidden="true">G</span>
            Continue with Google
          </button>
        </form>
        <div className="login-footer">
          <Link className="quiet" href="/links">Open workspace</Link>
          <span>Owner access only · No public link creation</span>
        </div>
      </section>
    </main>
  );
}
