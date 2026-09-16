import type { Directory, Summary, LinkRecord } from "../lib/types";
import { indiaTime, shortUrl } from "../lib/presentation";
import { LinkForm } from "./link-form";
import { LinkActions } from "./link-actions";
function RankedLinks({ title, rows }: { title: string; rows: LinkRecord[] }) {
  return (
    <section className="panel ranked">
      <h2>{title}</h2>
      {rows.length ? (
        <ol>
          {rows.map((row) => (
            <li key={row.id}>
              <a href={`/links/${row.id}`}>
                <strong>{row.title || row.slug}</strong>
                <span>
                  {row.slug}
                  {row.deleted_at ? " · Deleted" : ""}
                </span>
              </a>
              <b>
                {row.lifetime_count.toLocaleString()}
                <small>
                  {title.includes("recent")
                    ? indiaTime(row.last_click_at)
                    : "clicks"}
                </small>
              </b>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty">No links to show yet.</p>
      )}
    </section>
  );
}
export function DirectoryView({
  data,
  totals,
  params,
}: {
  data: Directory;
  totals: Summary;
  params: URLSearchParams;
}) {
  const page = Number(params.get("page") || 1),
    size = Number(params.get("size") || 25),
    pages = Math.max(1, Math.ceil(data.total / size));
  const href = (next: number) => {
    const p = new URLSearchParams(params);
    p.set("page", String(next));
    return `/links?${p}`;
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">LINK MANAGEMENT</span>
          <h1>Every link, in view.</h1>
          <p>Create, keep track, and see where your links go.</p>
        </div>
        <a className="button" href="#create">
          Create link <span aria-hidden="true">+</span>
        </a>
      </div>
      <section className="metrics" aria-label="Global link summary">
        {[
          ["Total links", totals.total],
          ["Active", totals.active],
          ["Deleted", totals.deleted],
          ["Recorded clicks", totals.clicks],
          ["Native", totals.native],
          ["Migrated", totals.migrated],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{Number(value).toLocaleString()}</strong>
          </div>
        ))}
      </section>
      <div className="two-columns">
        <RankedLinks title="Top five active links" rows={totals.top} />
        <RankedLinks title="Five most recently clicked" rows={totals.recent} />
      </div>
      <section className="panel directory">
        <div className="section-heading">
          <h2>
            Link directory <span className="count">{data.total}</span>
          </h2>
          <a className="quiet" href={`/api/links/export?${params}`}>
            Export all matching CSV ↓
          </a>
        </div>
        <form className="filters" action="/links">
          <div className="search">
            <label htmlFor="search">Search links</label>
            <input
              id="search"
              name="search"
              placeholder="Path, title, or destination"
              maxLength={256}
              defaultValue={params.get("search") || ""}
            />
          </div>
          {[
            [
              "status",
              "Status",
              [
                ["active", "Active"],
                ["deleted", "Deleted"],
                ["all", "All"],
              ],
              "active",
            ],
            [
              "source",
              "Source",
              [
                ["all", "All sources"],
                ["native", "Native"],
                ["migrated", "Migrated"],
              ],
              "all",
            ],
            [
              "sort",
              "Sort by",
              [
                ["created", "Created"],
                ["slug", "Path"],
                ["title", "Title"],
                ["clicks", "Clicks"],
                ["last_click", "Last click"],
              ],
              "created",
            ],
            [
              "direction",
              "Order",
              [
                ["desc", "Descending"],
                ["asc", "Ascending"],
              ],
              "desc",
            ],
            [
              "size",
              "Rows",
              [
                ["25", "25"],
                ["50", "50"],
                ["100", "100"],
                ["200", "200"],
                ["500", "500"],
              ],
              "25",
            ],
          ].map(([name, label, options, fallback]) => (
            <div key={String(name)}>
              <label htmlFor={String(name)}>{String(label)}</label>
              <select
                id={String(name)}
                name={String(name)}
                defaultValue={params.get(String(name)) || String(fallback)}
              >
                {(options as string[][]).map(([value, text]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button className="secondary">Apply</button>
        </form>
        <div
          className="table-scroll"
          role="region"
          aria-label="Link directory table"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Link / Destination</th>
                <th scope="col">Source</th>
                <th scope="col">Clicks</th>
                <th scope="col">Last click</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id}>
                  <td className="url-cell">
                    <a className="row-title" href={`/links/${row.id}`}>
                      {row.title || row.slug}
                    </a>
                    <span className="slug">
                      /{row.slug}{" "}
                      {row.deleted_at && <em className="badge">Deleted</em>}
                    </span>
                    <span className="destination">{row.destination}</span>
                  </td>
                  <td>
                    <span className="badge">{row.source}</span>
                    {row.migration_source_domain && (
                      <small>{row.migration_source_domain}</small>
                    )}
                  </td>
                  <td className="numeric">
                    {row.lifetime_count.toLocaleString()}
                  </td>
                  <td>{indiaTime(row.last_click_at)}</td>
                  <td>
                    <LinkActions url={shortUrl(row.slug)} id={row.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data.rows.length && (
            <p className="empty">No links match these filters.</p>
          )}
        </div>
        <nav className="pagination" aria-label="Directory pages">
          <span>
            {data.total
              ? `${(page - 1) * size + 1}–${Math.min(page * size, data.total)} of ${data.total}`
              : "0 links"}{" "}
            · Page {page} of {pages}
          </span>
          <div>
            {page > 1 && (
              <a className="button secondary" href={href(page - 1)}>
                Previous
              </a>
            )}
            {page < pages && (
              <a className="button secondary" href={href(page + 1)}>
                Next
              </a>
            )}
          </div>
        </nav>
      </section>
      <section id="create" className="panel create-panel">
        <span className="eyebrow">MAKE A CONNECTION</span>
        <h2>A new short link</h2>
        <p>Choose a destination. The path stays yours, even after deletion.</p>
        <LinkForm />
      </section>
    </>
  );
}
