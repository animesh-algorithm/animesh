# Animesh Platform

Public pnpm/Turborepo workspace for Animesh Sharma's two independent websites.

## Workspace

- `apps/portfolio` — personal portfolio and Ask Animesh, served locally on port 3000. Vercel root: `apps/portfolio`.
- `apps/hire` — consulting site and inquiry flow, served locally on port 3001. Vercel root: `apps/hire`.
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

`pnpm dev` starts Portfolio at `http://localhost:3000` and Hire at `http://localhost:3001`.

## Environment ownership

Keep environment files inside the application that owns them; never create a root environment file.

- Portfolio owns OpenAI, vector-store, Upstash, chat-consent, and chat-rate-limit settings. Start from `apps/portfolio/.env.example`.
- Hire owns Resend, inquiry sender/recipient, public site URL, and booking URL settings. Start from `apps/hire/.env.example`.

Vercel environment values and scopes remain attached to each existing project. Do not copy values between projects or commit local environment files.
