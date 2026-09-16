# Hire Animesh

Freelance and consulting website for Animesh Sharma. The site will help startup
founders and operations leaders understand what Animesh can build, review real
work, understand engagements and pricing, check availability, and start a
qualified conversation.

This is intentionally separate from the personal portfolio. It should feel like
a small, highly capable independent product studio centered on one operator.

## Status

The first local application release is implemented as a responsive, single-page
Next.js site with:

- an offer-led hero and visible availability
- deep homepage stories for four verified projects
- services organized around client problems
- a concise working process
- transparent starting prices
- a validated Resend-backed inquiry form with an email fallback

Content and commercial values marked provisional in `CONTENT.md` still require
confirmation before production launch. Hosting, domain setup, and live Resend
delivery are intentionally not configured yet.

## Project documents

- [AGENTS.md](AGENTS.md) — canonical rules for anyone working in this repo
- [CLAUDE.md](CLAUDE.md) — Claude entry point and instruction precedence
- [DESIGN.md](DESIGN.md) — original Notion-inspired visual system
- [ARCHITECTURE.md](ARCHITECTURE.md) — technical boundaries and planned structure
- [CONTENT.md](CONTENT.md) — verified facts and provisional commercial content
- [ROADMAP.md](ROADMAP.md) — staged implementation plan
- [SKILL.md](SKILL.md) — project workflow entry point

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Server Components by default
- CSS custom properties and plain CSS for the visual system
- Zod for shared content and inquiry validation
- Resend for inquiry delivery
- Vitest for unit and route tests

Exact dependency versions are recorded in `package.json` and the lockfile.

## Repository state

Git is initialized on `main`. No hosted remote is configured yet. Do not create
or change a remote unless the user explicitly requests it.
