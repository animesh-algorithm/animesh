import { build } from "esbuild";
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
import QRCode from "qrcode";
async function main() {
  const output = mkdtempSync(join(tmpdir(), "animesh-links-qa-"));
  const bundle = await build({
    entryPoints: ["tests/browser-fixture.tsx"],
    bundle: true,
    write: false,
    platform: "browser",
    format: "iife",
    jsx: "automatic",
    define: {
      "process.env": JSON.stringify({
        NODE_ENV: "production",
        LINKS_ORIGIN: "https://link.animesh.cc",
      }),
      "process.env.NODE_ENV": '"production"',
      "process.env.LINKS_ORIGIN": '"https://link.animesh.cc"',
    },
  });
  const css = readFileSync("app/globals.css");
  const qrPng = await QRCode.toBuffer("https://link.animesh.cc/fixture", { width: 768, margin: 4 });
  const server = createServer((request, response) => {
    if (/^\/api\/links\/[^/]+\/qr$/.test(request.url || "")) {
      response.setHeader("Content-Type", "image/png");
      response.setHeader("Content-Disposition", 'attachment; filename="link-qr.png"');
      response.end(qrPng);
      return;
    }
    if (request.url === "/fixture.js") {
      response.setHeader("Content-Type", "text/javascript");
      response.end(bundle.outputFiles[0].text);
      return;
    }
    if (request.url === "/fixture.css") {
      response.setHeader("Content-Type", "text/css");
      response.end(css);
      return;
    }
    if (request.url === "/favicon.ico") {
      response.writeHead(204).end();
      return;
    }
    response.setHeader("Content-Type", "text/html");
    response.end(
      '<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Isolated link operations fixture</title><link rel="stylesheet" href="/fixture.css"></head><body><div id="root"></div><script src="/fixture.js"></script></body></html>',
    );
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert(address && typeof address === "object");
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  const checks: unknown[] = [];
  const baselineIssues: string[] = [];
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.env.QA_CHROME_EXECUTABLE
        ? { executablePath: process.env.QA_CHROME_EXECUTABLE }
        : {}),
    });
    for (const width of [375, 768, 1024, 1440]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error")
          errors.push(`${message.text()} ${message.location().url}`);
      });
      for (const path of [
        "/",
        "/links",
        "/links?state=empty",
        "/error",
        "/links/fixture?tab=overview",
        "/links/fixture?tab=overview&state=empty",
        "/links/fixture?tab=audience",
        "/links/fixture?tab=traffic",
        "/links/fixture?tab=events",
      ]) {
        await page.goto(`http://127.0.0.1:${address.port}${path}`);
        await page
          .locator("h1")
          .waitFor({ timeout: 10000 })
          .catch((error) => {
            throw new Error(`${path}: ${errors.join("; ") || error.message}`);
          });
        await page.evaluate(() => document.fonts.ready);
        const dimensions = await page.evaluate(() => ({
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          viewport: innerWidth,
          overflow: Array.from(document.querySelectorAll("body *"))
            .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
            .slice(0, 12)
            .map((el) => ({
              tag: el.tagName,
              class: el.className,
              right: el.getBoundingClientRect().right,
              overflow: getComputedStyle(el).overflow,
            })),
          charts: Array.from(document.querySelectorAll("svg")).map((el) => ({
            width: el.getBoundingClientRect().width,
            parent: el.parentElement!.getBoundingClientRect().width,
          })),
        }));
        assert(
          dimensions.document <= width && dimensions.body <= width,
          `Overflow at ${width} ${path}: ${JSON.stringify(dimensions)}`,
        );
        assert(dimensions.charts.every((c) => c.width <= c.parent + 1));
        assert.equal(
          await page.evaluate(
            () => getComputedStyle(document.documentElement).scrollBehavior,
          ),
          "auto",
        );
        await page.keyboard.press("Tab");
        assert.equal(
          await page.locator(":focus").textContent(),
          "Skip to content",
        );
        assert.notEqual(
          await page
            .locator(":focus")
            .evaluate((el) => getComputedStyle(el).outlineStyle),
          "none",
        );
        if (path === "/links") {
          const create = page.getByRole("button", { name: "Create link" });
          await create.click();
          const createDialog = page.getByRole("dialog", {
            name: "Create a short link",
          });
          await createDialog.waitFor();
          await page.waitForFunction(
            () => document.activeElement?.id === "destination",
          );
          assert.equal(
            await page.evaluate(() => document.activeElement?.id),
            "destination",
            "Create dialog must focus Destination URL",
          );
          await page.keyboard.press("Shift+Tab");
          assert.equal(
            await createDialog.evaluate((dialog) =>
              dialog.contains(document.activeElement),
            ),
            true,
            "Create dialog must contain keyboard focus",
          );
          await page.keyboard.press("Escape");
          await createDialog.waitFor({ state: "hidden" });
          assert.equal(
            await create.evaluate((element) => element === document.activeElement),
            true,
            "Create dialog must restore trigger focus",
          );
          const firstCopy = page.getByRole("button", { name: "Copy short link" }).first();
          const iconAlignment = await page
            .locator(".link-actions")
            .first()
            .locator(".icon-button")
            .evaluateAll((controls) =>
              controls.map((control) => {
                const controlBounds = control.getBoundingClientRect();
                const iconBounds = control.querySelector("svg")!.getBoundingClientRect();
                return {
                  x:
                    iconBounds.left + iconBounds.width / 2 -
                    (controlBounds.left + controlBounds.width / 2),
                  y:
                    iconBounds.top + iconBounds.height / 2 -
                    (controlBounds.top + controlBounds.height / 2),
                };
              }),
            );
          assert(
            iconAlignment.every(
              ({ x, y }) => Math.abs(x) <= 0.5 && Math.abs(y) <= 0.5,
            ),
            `Action icons must be centered: ${JSON.stringify(iconAlignment)}`,
          );
          await firstCopy.focus();
          await page.keyboard.press("Tab");
          await page.keyboard.press("Shift+Tab");
          await page.getByRole("tooltip", { name: "Copy link" }).waitFor();
          await firstCopy.click();
          await page.locator("[role=status]").filter({ hasText: /Copied|unavailable/ }).waitFor();
          if (width < 768) {
            const filters = page.locator(".mobile-filters");
            assert.equal(await filters.getAttribute("open"), null);
            await filters.locator("summary").click();
            assert.notEqual(await filters.getAttribute("open"), null);
          }
        }
        if (path === "/links" || path === "/links/fixture?tab=overview") {
          const qrTrigger = page.getByRole("button", { name: "Show QR code" }).first();
          await qrTrigger.focus();
          await page.keyboard.press("Enter");
          const qrDialog = page.getByRole("dialog", { name: "QR code", exact: true });
          await qrDialog.waitFor();
          const image = qrDialog.getByRole("img");
          await image.waitFor();
          assert.equal(await image.evaluate((img) => (img as HTMLImageElement).naturalWidth), 768);
          assert.match(await qrDialog.getByRole("link", { name: "Download PNG" }).getAttribute("href") || "", /^\/api\/links\/[^/]+\/qr$/);
          const bounds = await qrDialog.evaluate((el) => ({ width: el.clientWidth, scroll: el.scrollWidth, right: el.getBoundingClientRect().right }));
          assert(bounds.scroll <= bounds.width && bounds.right <= width, "QR dialog must fit the viewport");
          await page.keyboard.press("Tab");
          assert(await qrDialog.evaluate((el) => el.contains(document.activeElement)), "QR dialog must contain focus");
          await page.keyboard.press("Escape");
          await qrDialog.waitFor({ state: "hidden" });
          await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Show QR code");
          if (width === 375 || width === 1440) {
            await qrTrigger.click();
            await qrDialog.getByRole("img").waitFor();
            await page.screenshot({ path: join(output, `${width}-${path === "/links" ? "directory" : "detail"}-qr.png`) });
            await qrDialog.getByRole("button", { name: "Close", exact: true }).click();
          }
        }
        if (path === "/links/fixture?tab=overview") {
          const deleteTrigger = page.getByRole("button", { name: "Delete link" });
          await deleteTrigger.click();
          const deleteDialog = page.getByRole("dialog", { name: "Delete this link?" });
          await deleteDialog.waitFor();
          await page.waitForFunction(
            () => document.activeElement?.textContent?.trim() === "Cancel",
          );
          assert.equal(
            await page.evaluate(() => document.activeElement?.textContent?.trim()),
            "Cancel",
            "Delete dialog must initially focus Cancel",
          );
          await page.keyboard.press("Escape");
          await deleteDialog.waitFor({ state: "hidden" });
          assert.equal(
            await deleteTrigger.evaluate((element) => element === document.activeElement),
            true,
            "Delete dialog must restore trigger focus",
          );
        }
        await page
          .locator(":focus")
          .evaluate((el) => (el as HTMLElement).blur());
        if (width === 375 || width === 1440)
          await page.screenshot({
            path: join(
              output,
              `${width}-${
                path === "/"
                  ? "login"
                  : path === "/links"
                    ? "directory"
                    : path === "/links?state=empty"
                      ? "directory-empty"
                      : path === "/error"
                        ? "error"
                        : path.split("tab=")[1]
              }.png`,
            ),
            fullPage: true,
          });
        checks.push({ width, path, ...dimensions });
      }
      await page.goto(`http://127.0.0.1:${address.port}/links`);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });
      const enlarged = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        viewport: innerWidth,
      }));
      assert(
        enlarged.document <= width && enlarged.body <= width,
        `200% text overflow at ${width}: ${JSON.stringify(enlarged)}`,
      );
      checks.push({ width, path: "/links (200% text)", ...enlarged });
      assert.deepEqual(errors, [], `Fixture console errors at ${width}`);
      await page.close();
    }
    // Validate real development pages and their assets, without bypassing authentication.
    for (const port of [3000, 3001, 3002, 3003]) {
      const page = await browser.newPage({ reducedMotion: "reduce" });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (message) => {
        if (message.type() === "error")
          errors.push(`${message.text()} ${message.location().url}`);
      });
      for (const width of [375, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        const response = await page.goto(`http://localhost:${port}`);
        assert.equal(response?.status(), 200, `Port ${port}`);
        await page.locator("h1").first().waitFor();
        const dims = await page.evaluate(() => ({
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          viewport: innerWidth,
        }));
        assert(
          dims.document <= width && dims.body <= width,
          `Port ${port} overflow ${JSON.stringify(dims)}`,
        );
        const broken = await page.evaluate(() =>
          Array.from(document.images)
            .filter((img) => img.complete && img.naturalWidth === 0)
            .map((img) => img.getAttribute("src")),
        );
        assert.deepEqual(broken, [], `Port ${port} missing image assets`);
        await page.keyboard.press("Tab");
        assert.notEqual(
          await page
            .locator(":focus")
            .evaluate((el) => getComputedStyle(el).outlineStyle),
          "none",
          `Port ${port} keyboard focus`,
        );
        checks.push({ port, width, ...dims });
      }
      if ([3000, 3001].includes(port)) {
        const favicon = await page.request.get(
          `http://localhost:${port}/favicon.ico`,
        );
        if (favicon.status() === 404)
          baselineIssues.push(
            `Port ${port}: pre-existing /favicon.ico returns 404`,
          );
      }
      const unexpected = errors.filter((error) => {
        if (
          [3000, 3001].includes(port) &&
          error.includes(`http://localhost:${port}/favicon.ico`) &&
          error.includes("404")
        ) {
          baselineIssues.push(error);
          return false;
        }
        return true;
      });
      assert.deepEqual(unexpected, [], `Port ${port} console errors`);
      if (port === 3003) {
        await page.goto("http://localhost:3003/links");
        assert(
          new URL(page.url()).pathname === "/",
          "Anonymous requests must not enter Admin",
        );
        const response = await page.request.get(
          "http://localhost:3003/api/links",
        );
        assert(
          [401, 503].includes(response.status()),
          "Anonymous API access must be denied",
        );
      }
      await page.close();
    }
    for (const issue of new Set(baselineIssues))
      console.warn(`Existing baseline issue: ${issue}`);
    writeFileSync(
      join(output, "checks.json"),
      JSON.stringify({ checks, baselineIssues }, null, 2),
    );
    console.log(
      `Browser QA passed (${checks.length} views). Artifacts: ${output}`,
    );
  } finally {
    await browser?.close();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
