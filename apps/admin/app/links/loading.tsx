export default function Loading() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <div><strong>Loading workspace</strong><span>Preparing your links and analytics…</span></div>
    </div>
  );
}
