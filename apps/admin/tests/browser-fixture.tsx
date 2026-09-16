import Link from "next/link";
// Standalone loopback-only QA fixture, never imported by Next.js routes.
import { createRoot } from "react-dom/client";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { DirectoryView } from "../components/directory";
import { AnalyticsView } from "../components/analytics";
import { LinkForm } from "../components/link-form";
import { LinkActions } from "../components/link-actions";
import type { LinkRecord, Analytics, Summary } from "../lib/types";
const link: LinkRecord = {
  id: "22222222-2222-4222-8222-222222222222",
  slug: "Launch/notes.v1",
  title: "Product launch notes",
  destination: "https://example.com/" + "a-long-destination-path/".repeat(12),
  creator: "fixture",
  created_at: "2026-09-01T12:00:00Z",
  updated_at: "2026-09-01T12:00:00Z",
  deleted_at: null,
  source: "native",
  migration_source_domain: null,
  lifetime_count: 1240,
  last_click_at: "2026-09-17T12:00:00Z",
};
const rows = Array.from({ length: 25 }, (_, i) => ({
  ...link,
  id: `22222222-2222-4222-8222-${String(i).padStart(12, "0")}`,
  slug: i === 2 ? "long-path/" + "a".repeat(240) : `projects/notes-${i}`,
  title:
    i === 2
      ? "A very long title " + "useful detail ".repeat(12)
      : [
          "Launch notes",
          "A thoughtful project",
          "Research archive",
          "September update",
        ][i % 4],
  source: i % 3 === 0 ? ("migrated" as const) : ("native" as const),
  migration_source_domain: i % 3 === 0 ? "old.example" : null,
  deleted_at: i % 5 === 0 ? "2026-09-16T12:00:00Z" : null,
}));
const totals: Summary = {
  total: 1230,
  active: 1120,
  deleted: 110,
  native: 900,
  migrated: 330,
  clicks: 27104,
  top: rows.slice(0, 5),
  recent: rows.slice(5, 10),
};
const analytics: Analytics = {
  clicks: 1106,
  unique: 84,
  bots: 32,
  prior: 0,
  lifetime: 1240,
  lastClick: link.last_click_at,
  trends: Array.from({ length: 30 }, (_, i) => ({
    interval: `2026-08-${String(i + 1).padStart(2, "0")}T00:00:00`,
    clicks: (i * 37) % 97,
  })),
  peak: { interval: "2026-08-13T00:00:00", clicks: 96 },
  dimensions: [
    ["country", "IN", 780],
    ["country", "US", 220],
    ["country", "Unknown", 106],
    ["city", "Mumbai · IN", 780],
    ["city", "New York · US", 220],
    ["city", "Unknown · Unknown", 106],
    ["device", "Mobile", 900],
    ["device", "Desktop", 206],
    ["browser", "Chrome", 780],
    ["browser", "Safari", 326],
    ["os", "Android", 780],
    ["os", "iOS", 326],
    ["referrer", "example.com", 860],
    ["referrer", "Direct / Unknown", 246],
  ].map(([key, value, clicks]) => ({
    key: String(key),
    value: String(value),
    clicks: Number(clicks),
  })),
  heatmap: Array.from({ length: 168 }, (_, i) => ({
    day: Math.floor(i / 24),
    hour: i % 24,
    clicks: (i * 3) % 13,
  })),
  geography: [
    { country: "IN", latitude: 19.07, longitude: 72.87, clicks: 780 },
    { country: "US", latitude: 40.7, longitude: -74, clicks: 220 },
    { country: "Unknown", latitude: null, longitude: null, clicks: 106 },
  ],
  events: Array.from({ length: 50 }, (_, i) => ({
    id: `fixture-${i}`,
    occurred_at: "2026-09-17T12:00:00Z",
    city: i % 3 ? "Mumbai" : "Unknown",
    country: i % 3 ? "IN" : "Unknown",
    device: "Mobile",
    browser: "Chrome",
    os: "Android",
    referrer_domain: "example.com",
    is_bot: i % 5 === 0,
  })),
  page: 1,
  size: 50,
  end: "2026-09-17T12:00:00Z",
  start: "2026-09-10T12:00:00Z",
};
const params = new URLSearchParams(location.search);
const router = {
  bfcacheId: "fixture",
  back: () => history.back(),
  forward: () => history.forward(),
  refresh: () => location.reload(),
  push: (url: string) => location.assign(url),
  replace: (url: string) => location.replace(url),
  prefetch: async () => {},
  hmrRefresh: () => {},
};
const login = location.pathname === "/";
const error = location.pathname === "/error";
const detail = !login && !error && location.pathname !== "/links";
const empty = params.get("state") === "empty";
createRoot(document.getElementById("root")!).render(
  <AppRouterContext.Provider value={router}>
    <a className="skip" href="#main">
      Skip to content
    </a>
    {login ? (
      <main id="main" className="login-shell">
        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-brand"><span className="brand-mark">a<span>.</span></span><span>Link operations</span></div>
          <div className="login-copy"><span className="eyebrow">PRIVATE WORKSPACE</span><h1 id="login-title">Your links.<br />A clear view.</h1><p>A private workspace for short links and the journeys they start.</p></div>
          <p className="notice notice-error" role="alert">Access denied. Only the configured Google owner can enter.</p>
          <form><button className="login-button" type="button"><span className="google-mark" aria-hidden="true">G</span>Continue with Google</button></form>
          <div className="login-footer"><Link className="quiet" href="/links">Open workspace</Link><span>Owner access only · No public link creation</span></div>
        </section>
      </main>
    ) : (
      <>
        <header className="shell-header">
          <div className="shell-left">
            <Link className="brand" href="/links">a<span>.</span></Link>
            <nav aria-label="Main"><Link href="/links" aria-current="page">Links</Link></nav>
            <span className="workspace-context"><i aria-hidden="true">A</i> Animesh workspace</span>
          </div>
          <div className="owner-controls"><span className="owner-identity"><i aria-hidden="true">A</i><span>owner@example.com</span></span><button className="text-button">Sign out</button></div>
        </header>
        <main className="workspace" id="main">
      {error ? (
        <section className="panel error-state"><span className="error-glyph" aria-hidden="true">!</span><h1>Workspace unavailable</h1><p>The database may need configuration, or the session may have expired.</p><div className="state-actions"><button>Try again</button><Link className="button secondary" href="/">Sign in</Link></div></section>
      ) : detail ? (
        <>
          <Link href="/links" className="breadcrumb">← All links</Link>
          <div className="page-heading detail-heading">
            <div>
              <div className="detail-badges"><span className="badge badge-native">native</span></div>
              <h1 className="detail-title">Product launch notes</h1>
              <div className="short-link-cluster"><a className="short-url" href="https://link.animesh.cc/Launch/notes.v1">https://link.animesh.cc/Launch/notes.v1</a><LinkActions prominent id={link.id} url="https://link.animesh.cc/Launch/notes.v1" /></div>
            </div>
          </div>
          <section className="panel settings-card">
            <div className="section-heading"><div><span className="eyebrow">LINK SETTINGS</span><h2>Destination and title</h2></div><span className="immutable-note">/Launch/notes.v1 · permanent</span></div>
            <LinkForm link={link} />
          </section>
          <AnalyticsView data={empty ? { ...analytics, clicks: 0, lifetime: 0, unique: 0, trends: [], dimensions: [], heatmap: [], geography: [], events: [], peak: null, lastClick: null } : analytics} id={link.id} params={params} />
        </>
      ) : (
        <DirectoryView
          data={empty ? { total: 0, rows: [] } : { total: 1230, rows }}
          totals={empty ? { ...totals, total: 0, active: 0, deleted: 0, native: 0, migrated: 0, clicks: 0, top: [], recent: [] } : totals}
          params={params}
        />
      )}
        </main>
        <footer className="shell-footer"><span>Isolated fixture · No production data</span><span>Asia/Kolkata · Best-effort collection</span></footer>
      </>
    )}
  </AppRouterContext.Provider>,
);
