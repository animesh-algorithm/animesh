# AGENTS.md

## Project

This is Animesh Sharma's freelance and consulting website: a place for potential
clients to understand what he builds, see detailed examples of his work,
understand how engagements work, view pricing, check availability, and start a
qualified conversation.

This is separate from the personal portfolio. The portfolio is about Animesh's
professional identity and networking; this site is specifically about working
with him.

Optimize for:

- converting relevant visitors into qualified conversations
- demonstrating capability through real work
- explaining services and engagements clearly
- making pricing transparent
- communicating availability without fabricating live data
- making contact frictionless

The site must feel like a small, highly capable independent product studio, not
a traditional freelancer portfolio or agency template.

## Sources of truth

Read these before making a related change:

1. `AGENTS.md` for project-wide rules
2. `CONTENT.md` for factual and commercial claims
3. `DESIGN.md` for visual decisions
4. `ARCHITECTURE.md` for technical boundaries
5. `ROADMAP.md` for delivery order

If documents conflict, `AGENTS.md` wins. Do not silently resolve conflicts;
update the narrower document as part of the same coherent change.

## Design direction

Use Notion's public marketing website as the primary design reference. Extract
principles rather than copying layouts, illustrations, assets, icons, graphics,
characters, interactions, or copy.

The result must be recognizably original: creative, colorful, tactile, human,
editorial, and product-oriented. Prefer bold flat color, warm neutral surfaces,
large expressive typography, strong black outlines, generous whitespace,
asymmetrical compositions, product diagrams, and occasional hand-drawn details.

The recurring visual idea is **problem -> system -> shipped**: loose, drawn
connectors turn messy workflows into structured product diagrams.

Avoid:

- generic freelance, agency, developer, or SaaS aesthetics
- gradient-heavy dark pages, glassmorphism, and glow effects
- generic bento grids and repetitive rounded cards
- skill bars, technology-logo walls, and terminal gimmicks
- generic stock illustration or floating technology icons
- decorative motion without purpose
- three identical SaaS pricing cards
- cloning Notion's current page or product interface

## Content rules

Writing must be concise, specific, confident, direct, and human. Show capability
through work rather than adjectives.

Never invent accomplishments, metrics, testimonials, clients, outcomes,
availability, prices, project details, or links. `CONTENT.md` distinguishes
verified facts from provisional values. Provisional values may be used during
development but must be confirmed before production launch.

Use “I,” not “we,” unless a real team is involved. Technology should support the
story rather than become the story.

Work is the strongest proof. Project presentations should explain the problem,
previous workflow, what was built, relevant decisions, constraints, and known
outcomes through visual storytelling rather than walls of text.

Services describe problems Animesh can solve, not a list of technologies.

## Engineering rules

- Follow the installed Next.js version's local documentation before coding.
- Use TypeScript and descriptive types; avoid `any`.
- Prefer Server Components. Keep `"use client"` boundaries small and justified.
- Keep content separate from presentation and validate it at module boundaries.
- Reuse coherent primitives; do not abstract prematurely.
- Do not install a dependency when platform or existing tools solve the problem.
- Split responsibilities when a file approaches roughly 300–500 lines.
- Keep third-party services behind narrow server-only adapters.
- Never expose secrets or provider error details to the browser.
- Preserve user-owned work and avoid unrelated refactors.

Before editing:

1. Inspect the existing implementation and Git state.
2. Read the relevant project documents.
3. Briefly list the files to be changed and why.
4. Make the smallest coherent change.

## UI and accessibility

Build a coherent token-driven system for color, typography, spacing, radii,
borders, shadows, motion, status, and responsive behavior.

Every interface must work intentionally on mobile, tablet, laptop, and large
desktop. Use semantic HTML, valid heading order, accessible names, visible focus
states, sufficient contrast, meaningful alternative text, and touch targets that
do not depend on hover. Respect `prefers-reduced-motion`.

Hire should make prominent use of motion as visitors move through it. Give the
hero, editorial chapters, project proof, service steps, and calls to action
distinct entrance and scroll behavior, with staggered detail where it helps the
story. Add tactile hover and focus feedback. Keep motion app-local, responsive,
and purposeful; content must be visible without JavaScript and immediately
visible when reduced motion is preferred. Keep a small amount of continuous
motion in existing workflow illustrations and accents so the site feels alive
even when idle; pause it when the tab is hidden. Avoid floating technology icons
or movement that obscures copy and controls.
New Hire pages and sections should inherit this motion system by default. Use
semantic `main`, `section`, and `article` elements so the app-wide motion
director can reveal them; use `data-reveal` for a smaller element that needs its
own entrance. Check the new page at mobile and desktop widths with reduced
motion before considering it complete.

Do not make every section `heading + paragraph + cards + CTA`. Design the whole
page as an editorial composition with rhythm, contrast, whitespace, imagery,
and deliberate variation.

## Availability, pricing, and booking

Availability is useful status, not a decorative green dot. It begins as a
manually maintained typed value and may later use booking or calendar data.

Pricing should read like productized engagements and remain easy to compare,
without defaulting to generic pricing cards.

Do not create fake scheduling. The first release uses a real inquiry form with
Resend when configured and always retains a direct email fallback.

## Quality gates

Before completing implementation work:

- compare the result with `DESIGN.md`
- verify responsive layout at 375, 768, 1024, and 1440 CSS pixels
- check document and body width for horizontal overflow
- verify keyboard navigation, focus, contrast, and reduced motion
- run linting, type checking, relevant tests, and a production build
- remove dead code introduced by the change
- distinguish static/local validation from untested live integrations

Do not silence errors simply to make checks pass. The result must feel designed,
distinctive, useful, fast, and intentional.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
