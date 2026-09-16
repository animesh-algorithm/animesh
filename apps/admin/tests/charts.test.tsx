import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { Trend, WorldMap } from "../components/charts";

describe("server-rendered SVG titles", () => {
  it("renders a trend title as one text node without React separators", () => {
    const html = renderToString(
      <Trend rows={[{ interval: "2026-09-10T00:00:00", clicks: 0 }]} />,
    );
    expect(html).toContain(
      "<title>2026-09-10T00:00:00 IST: 0 clicks</title>",
    );
    expect(html.match(/<title>.*?<\/title>/g)?.every((title) => !title.includes("<!--"))).toBe(true);
  });

  it("preserves grouped bucket labels and summed click counts", () => {
    const rows = Array.from({ length: 121 }, (_, index) => ({
      interval: `bucket-${index}`,
      clicks: 2,
    }));
    const html = renderToString(<Trend rows={rows} />);
    expect(html).toContain("<title>bucket-0 IST · 2 buckets grouped: 4 clicks</title>");
    expect(html).toContain("<title>bucket-120 IST · 2 buckets grouped: 2 clicks</title>");
  });

  it("renders map titles as one text node", () => {
    const html = renderToString(
      <WorldMap rows={[{ country: "IN", latitude: 19.07, longitude: 72.87, clicks: 780 }]} />,
    );
    expect(html).toContain("<title>IN: 780 clicks · approximate location</title>");
  });
});
