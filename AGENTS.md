# AGENTS.md

## Repository map

This public monorepo contains five independently designed and deployed products:

- `apps/portfolio`: the personal portfolio at `www.animesh.cc`, including `/`, `/ask`, `/api/chat`, `/api/chat/session`, and `/resume.pdf`.
- `apps/hire`: the consulting and inquiry site, including `/` and `/api/inquiries`.
- `apps/links`: public redirects at `link.animesh.cc`, port 3002.
- `apps/admin`: private Google-owner link management at `admin.animesh.cc`, port 3003; owns Supabase migrations.
- `apps/blog`: independent Notion-backed writing at `blog.animesh.cc`, port 3004; owns its Google preview authentication and media.
- `packages`: intentionally empty except for a placeholder. Do not create a shared package without an explicit product or architectural decision.

Read the nearest application-level `AGENTS.md` and its referenced design, content, and architecture documents before changing an application. The nearest instructions win for application-specific work.

## Architectural rules

- Use bounded SVG or CSS icons for interface decoration across all apps. Do not use emoji or Unicode pictographs as UI icons. Give icons explicit width and height, prevent flex stretching or shrinking, and check their rendered size on mobile and desktop. Preserve emoji that are intentional user-authored content or test data.

- Preserve the two applications as independent products. Do not merge their package names, React versions, Next.js configurations, content models, visual systems, or deployment settings.
- Do not extract shared UI, styling, Ask infrastructure, authentication, CMS, data storage, or speculative future applications.
- A root change may orchestrate existing app commands, but must not alter product behavior.
- App-specific dependencies belong to the owning app. Root development dependencies are limited to workspace orchestration.
- Keep environment files and secrets app-local. Never commit `.env`, `.env.local`, `.vercel`, credentials, or provider output containing secret values.
- Portfolio owns port 3000 in local development. Hire owns port 3001. Production build and start behavior remain app-local.
- Preserve Portfolio's dynamic `/`, Ask routes, server-sent chat responses, retrieval/source mapping, privacy controls, rate limiting, and session deletion.
- Preserve Hire's prerendered `/`, inquiry validation, spam controls, provider fallback, delivery, and acknowledgement behavior.
- Do not redesign, refactor, upgrade, or clean up either application as part of workspace maintenance unless a migration-caused blocker proves a minimal app change is necessary.
- Keep generated artifacts out of unrelated commits and restore tracked generated files if validation rewrites them unintentionally.

## Required validation

Use Node 24 and the repository-pinned pnpm version. Run filtered app checks and the equivalent root Turbo checks. Validate production route output, all five local development ports, responsive behavior at 375/768/1024/1440 CSS pixels, keyboard focus, reduced motion, assets, console output, and horizontal overflow.

Treat live integration checks as explicit preview actions. Never print secrets, reassign production domains, or deploy to production while validating a migration.
