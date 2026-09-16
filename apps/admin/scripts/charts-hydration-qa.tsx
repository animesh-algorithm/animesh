import assert from "node:assert/strict";
import { createServer } from "node:http";
import { build } from "esbuild";
import { chromium } from "playwright";
import { renderToString } from "react-dom/server";
import { Trend, WorldMap } from "../components/charts";

async function main() {
  const rows = Array.from({ length: 121 }, (_, index) => ({
    interval: `2026-09-10T${String(index).padStart(3, "0")}`,
    clicks: index % 3,
  }));
  const geography = [{ country: "IN", latitude: 19.07, longitude: 72.87, clicks: 780 }];
  const zero = [{ interval: "2026-09-10T00:00:00", clicks: 0 }];
  const html = renderToString(
    <><Trend rows={zero} /><Trend rows={rows} /><Trend rows={[]} /><WorldMap rows={geography} /></>,
  );
  const bundle = await build({
    stdin: {
      contents: `import { hydrateRoot } from "react-dom/client";
        import { Trend, WorldMap } from "./components/charts";
        hydrateRoot(document.getElementById("root"),
          <><Trend rows={${JSON.stringify(zero)}} /><Trend rows={${JSON.stringify(rows)}} /><Trend rows={[]} /><WorldMap rows={${JSON.stringify(geography)}} /></>,
          { onRecoverableError(error) { console.error(error); } });
        requestAnimationFrame(() => requestAnimationFrame(() => { document.body.dataset.hydrated = "true"; }));`,
      resolveDir: process.cwd(),
      loader: "tsx",
    },
    bundle: true,
    write: false,
    platform: "browser",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"development"' },
  });
  const server = createServer((request, response) => {
    if (request.url === "/client.js") {
      response.setHeader("Content-Type", "text/javascript");
      response.end(bundle.outputFiles[0].text);
    } else {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root">${html}</div><script src="/client.js"></script></body></html>`);
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert(address && typeof address === "object");
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.QA_CHROME_EXECUTABLE ? { executablePath: process.env.QA_CHROME_EXECUTABLE } : {}),
  });
  try {
    for (const width of [375, 768, 1024, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.goto(`http://127.0.0.1:${address.port}`);
      await page.waitForFunction(() => document.body.dataset.hydrated === "true");
      assert.deepEqual(errors, [], `Chart hydration errors at ${width}`);
      assert.equal(await page.locator("svg title").first().textContent(), "2026-09-10T00:00:00 IST: 0 clicks");
      await page.close();
    }
    console.log("SSR chart hydration passed at 375/768/1024/1440px.");
  } finally {
    await browser.close();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
