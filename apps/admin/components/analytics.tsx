import type { Analytics } from "../lib/types";
import { comparison, indiaTime, textSummary } from "../lib/presentation";
import { Trend, Heatmap, WorldMap, Breakdown } from "./charts";
export function AnalyticsView({
  data,
  id,
  params,
}: {
  data: Analytics;
  id: string;
  params: URLSearchParams;
}) {
  const tab = params.get("tab") || "overview",
    range = params.get("range") || "7d";
  const href = (changes: Record<string, string>) => {
    const p = new URLSearchParams(params);
    p.set("end", data.end);
    for (const [k, v] of Object.entries(changes)) p.set(k, v);
    return `/links/${id}?${p}`;
  };
  const dimensions = (key: string) =>
    data.dimensions.filter((row) => row.key === key);
  return (
    <section className="analytics">
      <div className="section-heading">
        <div>
          <span className="eyebrow">RECORDED ANALYTICS</span>
          <h2>Behind this link</h2>
        </div>
        <form method="get">
          <input type="hidden" name="tab" value={tab} />
          <label htmlFor="range" className="sr-only">
            Analytics period
          </label>
          <select id="range" name="range" defaultValue={range}>
            {[
              ["24h", "Last 24 hours"],
              ["7d", "Last 7 days"],
              ["30d", "Last 30 days"],
              ["90d", "Last 90 days"],
              ["all", "All time"],
            ].map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>{" "}
          <button className="secondary">Update</button>
        </form>
      </div>
      <nav className="tabs" aria-label="Analytics sections">
        {["overview", "audience", "traffic", "events"].map((value) => (
          <a
            key={value}
            aria-current={tab === value ? "page" : undefined}
            href={href({ tab: value, page: "1" })}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </a>
        ))}
      </nav>
      <p className="fine">
        Through {indiaTime(data.end)} · Asia/Kolkata · Includes bots ·
        Best-effort recording
      </p>
      {tab === "overview" && (
        <>
          <div className="metrics analytics-metrics">
            {[
              [
                "Period clicks",
                data.clicks.toLocaleString(),
                comparison(data.clicks, data.prior),
              ],
              [
                "Lifetime clicks",
                data.lifetime.toLocaleString(),
                "All recorded events",
              ],
              [
                "Estimated unique visitors",
                data.unique.toLocaleString(),
                "Distinct IP hashes; missing hashes excluded",
              ],
              ["Last click", indiaTime(data.lastClick), "Across all time"],
            ].map(([label, value, note]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{note}</small>
              </div>
            ))}
          </div>
          <p className="insight">{textSummary(data)}</p>
          <section className="panel">
            <div className="section-heading">
              <h3>Clicks over time</h3>
              <span className="fine">
                {range === "24h" ? "Hourly" : "Daily"} buckets
              </span>
            </div>
            <Trend rows={data.trends} />
            <p className="fine">
              {data.peak
                ? `Peak interval: ${data.peak.interval.replace("T", " ")} IST · ${data.peak.clicks} clicks`
                : "No peak interval yet."}
            </p>
          </section>
          <section className="panel">
            <h3>When clicks happen</h3>
            <Heatmap rows={data.heatmap} />
          </section>
        </>
      )}
      {tab === "audience" && (
        <>
          <section className="panel">
            <h3>Where clicks come from</h3>
            <WorldMap rows={data.geography} />
          </section>
          <div className="two-columns">
            <Breakdown
              title="Countries"
              rows={dimensions("country")}
              total={data.clicks}
            />
            <Breakdown
              title="Cities / Countries"
              rows={dimensions("city")}
              total={data.clicks}
            />
          </div>
          <div className="three-columns">
            <Breakdown
              title="Devices"
              rows={dimensions("device")}
              total={data.clicks}
            />
            <Breakdown
              title="Browsers"
              rows={dimensions("browser")}
              total={data.clicks}
            />
            <Breakdown
              title="Operating systems"
              rows={dimensions("os")}
              total={data.clicks}
            />
          </div>
        </>
      )}
      {tab === "traffic" && (
        <>
          <p className="insight">
            Referrers show domains only. Direct requests and unavailable
            referrers appear as Direct / Unknown.
          </p>
          <Breakdown
            title="Referrer domains"
            rows={dimensions("referrer")}
            total={data.clicks}
          />
        </>
      )}
      {tab === "events" && (
        <section className="panel">
          <div className="section-heading">
            <h3>Event history</h3>
            <span className="fine">
              {data.clicks.toLocaleString()} matching events
            </span>
          </div>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Recorded events"
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Time (IST)</th>
                  <th scope="col">Location</th>
                  <th scope="col">Device / Browser / OS</th>
                  <th scope="col">Referrer</th>
                  <th scope="col">Classification</th>
                </tr>
              </thead>
              <tbody>
                {data.events.map((event) => (
                  <tr key={event.id}>
                    <td>{indiaTime(event.occurred_at)}</td>
                    <td>
                      {event.city}
                      <small>{event.country}</small>
                    </td>
                    <td>
                      {event.device}
                      <small>
                        {event.browser} / {event.os}
                      </small>
                    </td>
                    <td>{event.referrer_domain}</td>
                    <td>
                      <span className="badge">
                        {event.is_bot ? "Bot" : "Unclassified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.events.length && (
              <p className="empty">No recorded events in this period.</p>
            )}
          </div>
          <nav className="pagination" aria-label="Event pages">
            <span>
              Page {data.page} of{" "}
              {Math.max(1, Math.ceil(data.clicks / data.size))}
            </span>
            <div>
              {data.page > 1 && (
                <a
                  className="button secondary"
                  href={href({ page: String(data.page - 1) })}
                >
                  Previous
                </a>
              )}
              {data.page * data.size < data.clicks && (
                <a
                  className="button secondary"
                  href={href({ page: String(data.page + 1) })}
                >
                  Next
                </a>
              )}
            </div>
          </nav>
          <form method="get">
            <input type="hidden" name="tab" value="events" />
            <input type="hidden" name="range" value={range} />
            <input type="hidden" name="end" value={data.end} />
            <label htmlFor="event-size">Events per page </label>
            <select id="event-size" name="size" defaultValue={data.size}>
              {[25, 50, 100, 200, 500].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>{" "}
            <button className="secondary">Apply</button>
          </form>
        </section>
      )}
    </section>
  );
}
