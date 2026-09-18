import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { walk, plain, mediaPath } from "../lib/model";
import type { Post } from "../lib/model";
import posts from "../fixtures/posts.json";
const origin = process.env.BLOG_QA_ORIGIN ?? "http://localhost:3004";
const output = process.env.BLOG_QA_OUTPUT ?? "/tmp/animesh-blog-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const results: unknown[] = [];
const errors: string[] = [];
const consoleErrors: string[] = [];
const accessibility: unknown[] = [];
const assets: unknown[] = [];
const require = createRequire(import.meta.url);
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", ...posts.map((p) => `/${p.slug}`)]) {
      const response = await page.goto(origin + route, {
        waitUntil: "networkidle",
      });
      if (response?.status() !== 200) throw new Error(`Route failed ${route}`);
      const metrics = await page.evaluate(() => ({
        width: innerWidth,
        doc: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        code: [...document.querySelectorAll("pre")].map((e) => ({
          client: e.clientWidth,
          scroll: e.scrollWidth,
        })),
        tables: [...document.querySelectorAll(".table-scroll")].map((e) => ({
          client: e.clientWidth,
          scroll: e.scrollWidth,
        })),
      }));
      if (
        metrics.width !== width ||
        metrics.doc > width ||
        metrics.body > width
      )
        throw new Error(
          `Page overflow ${width} ${route}: ${JSON.stringify(metrics)}`,
        );
      results.push({ width, route, status: response?.status(), metrics });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .7) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(700);
      if (
        (width === 375 || width === 1440) &&
        (route === "/" ||
          route.includes("usememo") ||
          route.includes("dragon-ball"))
      ) {
        await page.addScriptTag({
          path: require.resolve("axe-core/axe.min.js"),
        });
        const report = await page.evaluate(async () => {
          const axe = (window as unknown as { axe: typeof import("axe-core") })
            .axe;
          return axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          });
        });
        accessibility.push({
          width,
          route,
          violations: report.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.html),
          })),
        });
        if (report.violations.length)
          throw new Error(
            `Accessibility failure ${route}: ${JSON.stringify(report.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ html: n.html, summary: n.failureSummary })) })))}`,
          );
      }
      if (
        route === "/" ||
        route.includes("usememo") ||
        route.includes("dragon-ball")
      )
        {
        // Settle one-time reveals before capturing a full-page visual artifact.
        if (route === "/") {
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .7) {
              window.scrollTo({ top: y, behavior: "instant" });
              await new Promise((resolve) => setTimeout(resolve, 80));
            }
            window.scrollTo({ top: 0, behavior: "instant" });
          });
          await page.waitForTimeout(700);
        }
        await page.screenshot({
          path: `${output}/${route === "/" ? "index" : route.includes("usememo") ? "react" : "dragon-ball"}-${width}.png`,
          fullPage: route === "/",
        });
        }
    }
  }
  await page.goto(origin);
  await page.waitForFunction(() => document.documentElement.dataset.motionReady === "true");
  const lastPost = page.locator(".post-list .post-row").last();
  await lastPost.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector(".post-list .post-row:last-child")?.classList.contains("is-revealed"));
  await page.waitForTimeout(700);
  if (await lastPost.evaluate((element) => getComputedStyle(element).opacity) !== "1")
    throw new Error("Scroll reveal did not settle");
  const progress = await page.locator(".reading-progress").evaluate((element) => getComputedStyle(element).transform);
  if (progress === "none" || progress.startsWith("matrix(0,")) throw new Error("Scroll progress failed");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(700);
  if (!await lastPost.evaluate((element) => element.classList.contains("is-revealed")))
    throw new Error("Scroll reveal repeated");
  await page.goto(origin);
  await page.locator("#search").fill("useMemo");
  await page.getByRole("button", { name: "Search articles" }).click();
  await page.waitForURL(/q=useMemo/);
  if ((await page.locator(".post-row").count()) !== 1)
    throw new Error("Search failed");
  await page.goto(origin + "/tags/react?q=useMemo");
  if ((await page.locator(".post-row").count()) !== 1)
    throw new Error("Tag search failed");
  await page.goto(origin);
  await page.keyboard.press("Tab");
  if ((await page.locator(":focus").textContent()) !== "Skip to content")
    throw new Error("Skip focus failed");
  await page.keyboard.press("Enter");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(origin + "/how-dragon-ball-helped-me-beat-imposter-syndrome");
  await page.waitForFunction(() => document.documentElement.dataset.motion === "static");
  const reduced = await page.evaluate(() => ({
    hidden: [...document.querySelectorAll<HTMLElement>(".prose > *")].some((element) => getComputedStyle(element).opacity !== "1"),
    cloud: getComputedStyle(document.querySelector(".cloud-layer")!).animationName,
    depth: getComputedStyle(document.querySelector(".cloud-layer")!).translate,
  }));
  if (reduced.hidden || reduced.cloud !== "none" || reduced.depth !== "none")
    throw new Error(`Reduced motion failed: ${JSON.stringify(reduced)}`);
  const images = page.locator(".article-image img");
  if ((await images.count()) !== 8)
    throw new Error("Reduced-motion GIF images missing");
  for (const image of await images.all()) {
    if (!(await image.getAttribute("src"))?.includes("still=1"))
      throw new Error("GIF did not defer animation");
  }
  if (await page.locator(".article-image button").count())
    throw new Error("Removed image controls still present");
  const react = (posts as Post[]).find((p) => p.slug.includes("usememo"))!;
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(origin + `/${react.slug}`);
  await page.getByRole("button", { name: "Copy code" }).first().click();
  if (
    (await page.evaluate(() => navigator.clipboard.readText())) !==
    plain(walk(react.blocks).find((b) => b.type === "code")?.data.rich_text)
  )
    throw new Error("Clipboard mismatch");
  const toc = page.locator(".toc a").first();
  const href = await toc.getAttribute("href");
  await toc.click();
  if (!href || (await page.locator(href).count()) !== 1)
    throw new Error("TOC link failed");
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => {
      document.querySelector("#overflow-fixture")?.remove();
      const fixture = document.createElement("div");
      fixture.id = "overflow-fixture";
      fixture.innerHTML =
        '<div class="table-scroll"><table><tr><td style="white-space:nowrap">' +
        "verylongcell".repeat(100) +
        "</td></tr></table></div><pre><code>" +
        "long-code-line".repeat(100) +
        "</code></pre>";
      document.querySelector(".prose")?.append(fixture);
    });
    const overflow = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      width: innerWidth,
      internal: [
        ...document.querySelectorAll(
          "#overflow-fixture pre,#overflow-fixture .table-scroll",
        ),
      ].map((e) => e.scrollWidth > e.clientWidth),
    }));
    if (overflow.doc > width || overflow.internal.some((v) => !v))
      throw new Error(
        `Synthetic code/table overflow failed ${width}: ${JSON.stringify(overflow)}`,
      );
  }
  const dragon = (posts as Post[]).find((p) => p.slug.includes("dragon-ball"))!;
  for (const b of walk(dragon.blocks).filter((b) => b.type === "image")) {
    const response = await page.request.get(
      origin + mediaPath(dragon.id, b.id, false, true),
      { timeout: 20000 },
    );
    assets.push({
      page: dragon.slug,
      block: b.id,
      host: new URL(
        b.data.external?.url ?? b.data.file?.url ?? "https://fixture.invalid",
      ).hostname,
      status: response.status(),
      type: response.headers()["content-type"],
    });
  }
  const rss = await page.request.get(origin + "/rss.xml");
  if (!rss.ok() || (await rss.text()).match(/<item>/g)?.length !== 7)
    throw new Error("RSS failed");
  const denied = await page.request.get(
    origin + `/media/${posts[0].id}/${posts[0].blocks[0].id}?preview=1`,
  );
  if (
    denied.status() !== 404 ||
    !denied.headers()["cache-control"]?.includes("no-store")
  )
    throw new Error("Draft media isolation failed");
  if (errors.length) throw new Error(`Browser errors: ${errors.join("; ")}`);
  await writeFile(
    `${output}/results.json`,
    JSON.stringify(
      {
        results,
        errors,
        consoleErrors,
        accessibility,
        assets,
        checks: [
          "search",
          "tag search",
          "keyboard skip",
          "reduced motion",
          "one-time scroll reveals",
          "scroll progress",
          "GIF play/pause",
          "RSS",
          "draft media rejection",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    `Passed ${results.length} responsive route checks plus reader interactions. Artifacts: ${output}`,
  );
} finally {
  await browser.close();
}
