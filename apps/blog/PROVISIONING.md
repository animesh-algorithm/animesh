# Provisioning and launch

## Local

Use Node 24 and pnpm 10.34.5. From the repository root: pnpm install --frozen-lockfile, then pnpm --filter animesh-blog dev. Port 3004 belongs to blog.

Copy .env.example to .env.local inside this app. For a credential-free inspection use BLOG_FIXTURES=true with pnpm --filter animesh-blog dev. This switch is ignored in production, including next build and next start. The seven-article snapshot is labeled in development; it must not be used as a deployment source.

## Notion

Create an internal read-only integration with Read content capability only; share My Blog Posts with it. Set NOTION_TOKEN in blog-local environment. The connector used to inspect articles is not an app token. Do not share the Projects source. The source ID is hardcoded to 96f42452-2d7e-458b-9a09-497b1b08bef4.

Run pnpm --filter animesh-blog verify:notion after configuring .env.local. It prints only counts, block types and sanitized statuses; never credentials or signed media URLs. Review all seven articles against their Notion pages and load uploaded media after its original URL expiry.

## Owner Google OAuth

Create a dedicated Google OAuth Web client. Set AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET (a fresh random value), and the exact Google BLOG_OWNER_EMAIL. Use a stable Vercel preview hostname to register the exact callback https://PREVIEW-HOST/api/auth/callback/google. Register http://localhost:3004/api/auth/callback/google for local testing. Set AUTH_URL to the current app URL. Set AUTH_TRUST_HOST=true only on trusted Vercel hosting; use false otherwise with a canonical AUTH_URL.

Verify /preview with the owner, a different Google account, and logged out. Owner must see directory/drafts; other accounts must be rejected. Open a draft media URL in an incognito window: it must return 404 with private,no-store and noindex. Confirm preview HTML never appears in RSS/sitemap/public search. Do not weaken email checks or add a credential bypass for QA.

## Fonts

Outfit is bundled via @fontsource-variable/outfit, with its SIL OFL license retained in public/fonts/Outfit-LICENSE.txt. Obtain authorized Cubano webfont files and the matching redistribution/web embedding license. Place them in public/fonts and add a local @font-face named Cubano only after reviewing those terms. The current deliberate display fallback is bold Outfit. Do not download unlicensed font copies.

## Vercel preview

Create an independent Vercel project named animesh-blog with repository root directory apps/blog, Next.js framework, Node 24, install command pnpm install --frozen-lockfile and build command pnpm build. Enable access to workspace files outside the root directory when requested. Configure this app's env variables for Preview only. BLOG_ORIGIN should remain https://blog.animesh.cc for production canonical URLs; an isolated preview may override it to the stable preview URL. Keep preview deployments protected from indexing/access through Vercel deployment protection until reviewed.

Deploy a preview with Vercel's UI or, from apps/blog, `pnpm dlx vercel deploy --target preview` (explicit preview target). Register its stable Google callback and verify live CMS, media, owner authentication and rejection. Required commands: pnpm --filter animesh-blog lint/typecheck/test/build (each separately), followed by pnpm lint/typecheck/test/build at the root. QA requires installed Google Chrome (or replace the script’s channel with an installed Playwright Chromium). QA: BLOG_FIXTURES=true pnpm --filter animesh-blog dev, then pnpm --filter animesh-blog qa:browser.

Production deployment and attaching blog.animesh.cc are separate actions. No existing project/domain should be reassigned. Launch only after live CMS and OAuth verification plus licensed Cubano provisioning, or an explicit decision to retain the fallback.

References: https://developers.notion.com/guides/data-apis/retrieving-files and https://authjs.dev/getting-started/providers/google.

## Provisioning status (2026-09-17)

The independent `animesh-blog` project exists in `animeshs-projects-c0bef823`, with root `apps/blog`, Next.js, Node 24, frozen pnpm install and app-local build. No custom domain was attached. Both first-deployment attempts were classified as production, including the explicit `--target preview` attempt; they were removed. There is no retained deployment. Do not retry blindly: resolve the platform's first-deployment behavior before creating a preview. Repository Git integration and stable OAuth callback remain provisioning steps after the code is committed and pushed.

Live Notion, uploaded media expiry and Google owner sign-in are unverified because app credentials were deliberately deferred. Cubano remains the documented Outfit display fallback. Development fixture inspection is available locally on port 3004.

## Connecting the local reader

The existing ignored `.env.local` has all blog configuration keys; credential entries are blank until supplied privately. Create an internal Notion connection for this workspace with Read content only, copy its token into NOTION_TOKEN, and grant it access to My Blog Posts through the database’s Add connections menu. Run `pnpm --filter animesh-blog verify:notion`. After it succeeds, change BLOG_FIXTURES to false and restart the blog development server. The snapshot banner disappears when fixture mode is disabled. Google OAuth credentials are required separately for owner previews; the public reader only needs the Notion token.

Thumbnails are read from the existing files property and shown wherever available in archive and related lists. Inspection fixtures currently have no thumbnails; live thumbnail fidelity remains a credential-dependent check.
