import Link from "next/link";
import type { Directory, Summary, LinkRecord } from "../lib/types";
import { indiaTime, shortUrl } from "../lib/presentation";
import { CreateLinkDialog } from "./create-link-dialog";
import { DownloadIcon, SearchIcon } from "./interface-icons";
import { LinkActions } from "./link-actions";

function RankedLinks({ title, rows }: { title: string; rows: LinkRecord[] }) {
  const recent = title.includes("recently");
  return (
    <section className="panel ranked">
      <div className="ranked-heading">
        <h2>{title}</h2>
        <span className={`status-dot ${recent ? "teal" : "purple"}`} aria-hidden="true" />
      </div>
      {rows.length ? (
        <ol>
          {rows.map((row, index) => (
            <li key={row.id}>
              <span className="rank-number" aria-hidden="true">{index + 1}</span>
              <a href={`/links/${row.id}`}>
                <strong>{row.title || row.slug}</strong>
                <span>/{row.slug}{row.deleted_at ? " · Deleted" : ""}</span>
              </a>
              <b>
                {row.lifetime_count.toLocaleString()}
                <small>{recent ? indiaTime(row.last_click_at) : "clicks"}</small>
              </b>
            </li>
          ))}
        </ol>
      ) : (
        <div className="empty-state compact-empty"><span aria-hidden="true">↗</span><p>No links to show yet.</p></div>
      )}
    </section>
  );
}

function FilterForm({ params, mobile = false }: { params: URLSearchParams; mobile?: boolean }) {
  const selects = [
    ["status", "Status", [["active", "Active"], ["deleted", "Deleted"], ["all", "All"]], "active"],
    ["source", "Source", [["all", "All sources"], ["native", "Native"], ["migrated", "Migrated"]], "all"],
    ["sort", "Sort by", [["created", "Created"], ["slug", "Path"], ["title", "Title"], ["clicks", "Clicks"], ["last_click", "Last click"]], "created"],
    ["direction", "Order", [["desc", "Descending"], ["asc", "Ascending"]], "desc"],
    ["size", "Rows", [["25", "25"], ["50", "50"], ["100", "100"], ["200", "200"], ["500", "500"]], "25"],
  ] as const;
  return (
    <form className={`filters${mobile ? " mobile-filter-form" : ""}`} action="/links">
      <div className="search-field">
        <label htmlFor={mobile ? "mobile-search" : "search"}>Search links</label>
        <div className="input-with-icon">
          <SearchIcon />
          <input id={mobile ? "mobile-search" : "search"} name="search" placeholder="Path, title, or destination" maxLength={256} defaultValue={params.get("search") || ""} />
        </div>
      </div>
      {selects.map(([name, label, options, fallback]) => (
        <div className="filter-control" key={name}>
          <label htmlFor={`${mobile ? "mobile-" : ""}${name}`}>{label}</label>
          <select id={`${mobile ? "mobile-" : ""}${name}`} name={name} defaultValue={params.get(name) || fallback}>
            {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
          </select>
        </div>
      ))}
      <button className="secondary filter-submit">Apply</button>
    </form>
  );
}

export function DirectoryView({ data, totals, params }: { data: Directory; totals: Summary; params: URLSearchParams }) {
  const page = Number(params.get("page") || 1);
  const size = Number(params.get("size") || 25);
  const pages = Math.max(1, Math.ceil(data.total / size));
  const href = (next: number) => {
    const p = new URLSearchParams(params);
    p.set("page", String(next));
    return `/links?${p}`;
  };
  return (
    <>
      <div className="page-heading directory-heading">
        <div><span className="eyebrow">LINK MANAGEMENT</span><h1>Links</h1><p>Create, keep track, and see where your links go.</p></div>
        <CreateLinkDialog />
      </div>
      <section className="metrics" aria-label="Global link summary">
        {[
          ["Total links", totals.total, "cobalt"], ["Active", totals.active, "teal"], ["Deleted", totals.deleted, "pink"],
          ["Recorded clicks", totals.clicks, "purple"], ["Native", totals.native, "yellow"], ["Migrated", totals.migrated, "blue"],
        ].map(([label, value, tone]) => (
          <div key={label} className={`metric-${tone}`}><span>{label}</span><strong>{Number(value).toLocaleString()}</strong></div>
        ))}
      </section>
      <section className="panel directory">
        <div className="section-heading directory-titlebar">
          <h2>All links <span className="count">{data.total}</span></h2>
          <a className="export-link" href={`/api/links/export?${params}`}><DownloadIcon /> Export CSV</a>
        </div>
        <div className="desktop-filters"><FilterForm params={params} /></div>
        <details className="mobile-filters">
          <summary>Search and filters</summary>
          <FilterForm params={params} mobile />
        </details>
        <div className="table-scroll directory-scroll" role="region" aria-label="Link directory" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Link / Destination</th><th scope="col">Source</th><th scope="col">Clicks</th><th scope="col">Last click</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id} className={row.deleted_at ? "is-deleted" : undefined}>
                  <td className="url-cell" data-label="Link">
                    <a className="row-title" href={`/links/${row.id}`}>{row.title || row.slug}</a>
                    <a className="slug" href={shortUrl(row.slug)} target="_blank" rel="noopener noreferrer">{shortUrl(row.slug)}</a>
                    <span className="destination">{row.destination}</span>
                  </td>
                  <td data-label="Source"><span className={`badge badge-${row.source}`}>{row.source}</span>{row.deleted_at && <em className="badge badge-deleted">Deleted</em>}{row.migration_source_domain && <small>{row.migration_source_domain}</small>}</td>
                  <td className="numeric" data-label="Clicks">{row.lifetime_count.toLocaleString()}</td>
                  <td data-label="Last click">{indiaTime(row.last_click_at)}</td>
                  <td className="actions-cell" data-label="Actions"><LinkActions url={shortUrl(row.slug)} id={row.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data.rows.length && <div className="empty-state"><span aria-hidden="true">⌁</span><h3>No matching links</h3><p>Try a broader search or reset one of the filters.</p><Link className="button secondary" href="/links">Clear filters</Link></div>}
        </div>
        <nav className="pagination" aria-label="Directory pages">
          <span>{data.total ? `${(page - 1) * size + 1}–${Math.min(page * size, data.total)} of ${data.total}` : "0 links"}{` · Page ${page} of ${pages}`}</span>
          <div>{page > 1 && <a className="button secondary" href={href(page - 1)}>Previous</a>}{page < pages && <a className="button secondary" href={href(page + 1)}>Next</a>}</div>
        </nav>
      </section>
      <div className="two-columns rankings-grid"><RankedLinks title="Top five active links" rows={totals.top} /><RankedLinks title="Five most recently clicked" rows={totals.recent} /></div>
    </>
  );
}
