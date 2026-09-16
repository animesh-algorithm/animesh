import type { LinkRecord } from "./types";
export function csvCell(value: unknown) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text))
    text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}
export function linksCsv(rows: LinkRecord[]) {
  const keys = [
    "id",
    "slug",
    "destination",
    "title",
    "source",
    "migration_source_domain",
    "creator",
    "created_at",
    "updated_at",
    "deleted_at",
    "lifetime_count",
    "last_click_at",
  ] as const;
  return (
    "\uFEFF" +
    [
      keys.map(csvCell).join(","),
      ...rows.map((row) => keys.map((k) => csvCell(row[k])).join(",")),
    ].join("\r\n") +
    "\r\n"
  );
}
