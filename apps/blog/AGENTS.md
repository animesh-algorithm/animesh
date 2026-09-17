# Animesh blog

Read DESIGN.md, CONTENT.md, ARCHITECTURE.md and PROVISIONING.md before changing this app.

This app owns port 3004 and blog.animesh.cc. Keep dependencies, credentials, authentication, Notion content mapping, styling and media app-local. Do not share them with the other products.

Preserve original article wording, slugs and createdAt dates. Read only My Blog Posts (96f42452-2d7e-458b-9a09-497b1b08bef4). Never modify the Projects database or CMS schema. Notion content must never execute HTML, scripts or React code.

Every preview page and media request must authorize the exact Google owner, verify source membership and remain uncached. Public content must pass publication and slug validation. Never put drafts or signed Notion URLs into public caches.

Use Node 24 and pinned pnpm. Run lint, typecheck, test, build and equivalent root Turbo checks. Browser QA covers all seven fixtures at 375/768/1024/1440, keyboard, reduced motion, media controls and code/table overflow. Fixture mode is explicitly development-only. Report live integration verification separately. Production deployment and domain attachment require a separate user instruction.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
