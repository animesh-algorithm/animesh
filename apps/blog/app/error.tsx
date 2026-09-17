"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="unavailable">
      <h1>Back in a little while.</h1>
      <p>The archive is temporarily unavailable.</p>
      <button onClick={reset}>Try again</button>
    </section>
  );
}
