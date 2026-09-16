import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Analytics } from "../lib/types";
export function Trend({ rows }: { rows: Analytics["trends"] }) {
  const step = Math.max(1, Math.ceil(rows.length / 120));
  const sampled = Array.from(
    { length: Math.ceil(rows.length / step) },
    (_, i) => ({
      interval: rows[i * step].interval,
      clicks: rows
        .slice(i * step, i * step + step)
        .reduce((sum, row) => sum + row.clicks, 0),
    }),
  );
  const max = Math.max(1, ...sampled.map((row) => row.clicks)),
    width = 760,
    height = 200,
    barWidth = width / Math.max(1, sampled.length);
  return (
    <figure className="chart">
      <svg
        viewBox={`0 0 ${width} ${height + 24}`}
        role="img"
        aria-label={`Recorded click trend with ${sampled.length} intervals. Highest plotted interval: ${max} clicks.`}
      >
        <line x1="0" x2={width} y1={height} y2={height} stroke="var(--chart-grid)" />
        {sampled.map((row, i) => (
          <rect
            key={row.interval}
            x={i * barWidth + 1}
            y={height - (row.clicks / max) * (height - 12)}
            width={Math.max(1, barWidth - 2)}
            height={(row.clicks / max) * (height - 12)}
            fill="var(--chart-cobalt)"
          >
            <title>
              {`${row.interval} IST${step > 1 ? ` · ${step} buckets grouped` : ""}: ${row.clicks} clicks`}
            </title>
          </rect>
        ))}
      </svg>
      <figcaption>
        <span>{rows[0]?.interval.replace("T", " ") || "No events"}</span>
        <span>{rows.at(-1)?.interval.replace("T", " ") || ""} · IST</span>
      </figcaption>
      <details>
        <summary>View trend data</summary>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Trend data"
        >
          <table>
            <thead>
              <tr>
                <th>Interval (IST)</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.interval}>
                  <td>{row.interval.replace("T", " ")}</td>
                  <td>{row.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
export function Heatmap({ rows }: { rows: Analytics["heatmap"] }) {
  const max = Math.max(1, ...rows.map((row) => row.clicks));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <>
      <p className="fine">
        Hour of day × weekday · Asia/Kolkata · darker means more recorded clicks
      </p>
      <div
        className="heat-scroll"
        tabIndex={0}
        role="region"
        aria-label="Hourly heatmap"
      >
        <table className="heatmap">
          <thead>
            <tr>
              <th>Day</th>
              {Array.from({ length: 24 }, (_, h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, d) => (
              <tr key={day}>
                <th scope="row">{day}</th>
                {Array.from({ length: 24 }, (_, h) => {
                  const count =
                    rows.find((r) => r.day === d && r.hour === h)?.clicks || 0;
                  return (
                    <td
                      key={h}
                      style={{
                        background: `color-mix(in srgb, var(--chart-cobalt) ${count ? 12 + (82 * count) / max : 4}%, white)`,
                        color: count / max > 0.5 ? "white" : "var(--ink)",
                      }}
                    >
                      <span>{count}</span>
                      <span className="sr-only">
                        {" "}
                        clicks, {day} at {h}:00 IST
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export function WorldMap({ rows }: { rows: Analytics["geography"] }) {
  const projection = geoNaturalEarth1().fitExtent(
      [
        [8, 8],
        [752, 370],
      ],
      { type: "Sphere" },
    ),
    path = geoPath(projection);
  const topology = world as unknown as Topology<{
    countries: GeometryCollection;
  }>;
  const countries = feature(topology, topology.objects.countries);
  return (
    <figure className="world-map">
      <svg
        viewBox="0 0 760 380"
        role="img"
        aria-label="Approximate recorded click locations on a world map"
      >
        <path d={path({ type: "Sphere" }) || ""} fill="var(--map-ocean)" />
        {countries.features.map((country, i) => (
          <path
            key={i}
            d={path(country) || ""}
            fill="var(--map-land)"
            stroke="var(--surface)"
            strokeWidth="0.5"
          />
        ))}
        {rows
          .filter((row) => row.latitude !== null && row.longitude !== null)
          .map((row) => {
            const point = projection([row.longitude!, row.latitude!]);
            return (
              point && (
                <circle
                  key={row.country}
                  cx={point[0]}
                  cy={point[1]}
                  r={Math.min(18, 4 + Math.sqrt(row.clicks))}
                  fill="var(--chart-cobalt)"
                  fillOpacity="0.65"
                >
                  <title>
                    {`${row.country}: ${row.clicks} clicks · approximate location`}
                  </title>
                </circle>
              )
            );
          })}
      </svg>
      <figcaption className="fine">
        Approximate country centroids from available request metadata. Unknown
        locations are counted in the rankings below. Map: Natural Earth, public
        domain.
      </figcaption>
    </figure>
  );
}
export function Breakdown({
  title,
  rows,
  total,
}: {
  title: string;
  rows: Analytics["dimensions"];
  total: number;
}) {
  return (
    <section className="panel breakdown">
      <h3>{title}</h3>
      {rows.length ? (
        <ol>
          {rows.map((row) => (
            <li key={row.value}>
              <div>
                <span>{row.value}</span>
                <b>
                  {row.clicks.toLocaleString()}{" "}
                  <small>
                    {total ? ((row.clicks / total) * 100).toFixed(1) : "0.0"}%
                  </small>
                </b>
              </div>
              <div className="bar-track" aria-hidden="true">
                <span
                  style={{
                    width: `${total ? (row.clicks / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty">No recorded data.</p>
      )}
    </section>
  );
}
