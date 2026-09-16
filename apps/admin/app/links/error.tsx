"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="panel error-state">
      <span className="error-glyph" aria-hidden="true">!</span>
      <h1>Workspace unavailable</h1>
      <p>
        The database may need configuration, or the session may have expired.
      </p>
      <div className="state-actions"><button onClick={reset}>Try again</button><Link className="button secondary" href="/">Sign in</Link></div>
    </section>
  );
}
