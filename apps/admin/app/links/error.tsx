"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="panel">
      <h1>Workspace unavailable</h1>
      <p>
        The database may need configuration, or the session may have expired.
      </p>
      <button onClick={reset}>Try again</button> <Link href="/">Sign in</Link>
    </section>
  );
}
