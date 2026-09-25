# Animesh Platform

Public pnpm/Turborepo workspace for Animesh Sharma's five independent applications.

## Workspace

- `apps/portfolio` — personal portfolio and Ask Animesh, served locally on port 3000. Vercel root: `apps/portfolio`.
- `apps/hire` — consulting site and inquiry flow, served locally on port 3001. Vercel root: `apps/hire`.
- `apps/links` — public short-link redirects on port 3002. Vercel root: `apps/links`.
- `apps/admin` — private Google-owner link operations on port 3003. Vercel root: `apps/admin`.
- `apps/blog` — Notion-backed writing and owner previews on port 3004. Vercel root: `apps/blog`. See [blog provisioning](apps/blog/PROVISIONING.md).
- `packages` — reserved for deliberately shared packages; none exist today.

The applications keep separate package names, React versions, configurations, content, styles, and deployment projects. This repository does not provide shared visual or product code.

## Commands

Use Node 24 and pnpm 10.34.5.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter animesh-portfolio knowledge:check
```

`pnpm dev` starts Portfolio at `http://localhost:3000`, Hire at `http://localhost:3001`, Links at `http://localhost:3002`, Admin at `http://localhost:3003`, and Blog at `http://localhost:3004`.

To run one app from the workspace root, use its package name as a filter. For example, `pnpm --filter hire-animesh dev` starts only Hire.

## Environment ownership

Keep environment files inside the application that owns them; never create a root environment file.

- Portfolio owns OpenAI, vector-store, Upstash, chat-consent, and chat-rate-limit settings. Start from `apps/portfolio/.env.example`.
- Blog owns a read-only Notion token and independent Google OAuth/owner configuration. Start from `apps/blog/.env.example`. For development snapshots, run `BLOG_FIXTURES=true pnpm --filter animesh-blog dev`.
- Hire owns Resend, inquiry sender/recipient, public site URL, and booking URL settings. Start from `apps/hire/.env.example`.

Vercel environment values and scopes remain attached to each existing project. Do not copy values between projects or commit local environment files.

Links and Admin use one dedicated Supabase project, with distinct database privileges. Start from their app-local `.env.example` files. See [provisioning and rollout](apps/admin/docs/deployment.md) for Google OAuth, migrations, owner configuration, restricted runtime credentials, backups and preview checks. Missing configuration denies private access. Production deployment and DNS activation are a separate launch step.

## About the creator

Created by [Animesh Sharma](https://animesh.cc). For product design and development work, visit [Hire Animesh](https://hire.animesh.cc).
