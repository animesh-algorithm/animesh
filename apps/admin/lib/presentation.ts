import type { Analytics } from "./types";
export function indiaTime(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
export function comparison(clicks: number, prior: number | null) {
  if (prior === null) return "No comparison for all time";
  if (prior === 0) return "No prior clicks";
  const change = ((clicks - prior) / prior) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}% vs preceding period`;
}
export function textSummary(data: Analytics) {
  if (!data.clicks) return "No recorded clicks in this period.";
  const top = (key: string) =>
    data.dimensions
      .filter((d) => d.key === key)
      .sort((a, b) => b.clicks - a.clicks || a.value.localeCompare(b.value))[0];
  return `${data.clicks.toLocaleString()} recorded clicks from approximately ${data.unique.toLocaleString()} visitors. ${top("device")?.value || "Unknown"} is the most recorded device; ${top("referrer")?.value || "Direct / Unknown"} is the leading referrer. ${data.bots.toLocaleString()} requests were classified as bots.`;
}
export function shortUrl(slug: string) {
  return `${process.env.LINKS_ORIGIN || "https://link.animesh.cc"}/${slug}`;
}
