export type LinkRecord = {
  id: string;
  slug: string;
  destination: string;
  title: string | null;
  creator: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  source: "native" | "migrated";
  migration_source_domain: string | null;
  lifetime_count: number;
  last_click_at: string | null;
};
export type Directory = { total: number; rows: LinkRecord[] };
export type Summary = {
  total: number;
  active: number;
  deleted: number;
  native: number;
  migrated: number;
  clicks: number;
  top: LinkRecord[];
  recent: LinkRecord[];
};
export type ClickEvent = {
  id: string;
  occurred_at: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  referrer_domain: string;
  is_bot: boolean;
};
export type Analytics = {
  clicks: number;
  unique: number;
  bots: number;
  prior: number | null;
  lifetime: number;
  lastClick: string | null;
  trends: { interval: string; clicks: number }[];
  peak: { interval: string; clicks: number } | null;
  dimensions: { key: string; value: string; clicks: number }[];
  heatmap: { day: number; hour: number; clicks: number }[];
  geography: {
    country: string;
    latitude: number | null;
    longitude: number | null;
    clicks: number;
  }[];
  events: ClickEvent[];
  page: number;
  size: number;
  end: string;
  start: string | null;
};
