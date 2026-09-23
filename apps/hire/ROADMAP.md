# Roadmap

## Phase 0 — Foundation (current)

- [x] Initialize local Git repository
- [x] Define project, agent, design, architecture, and content documents
- [x] Record verified and provisional content separately
- [ ] Review and confirm provisional commercial values
- [ ] Choose final public name and domain

## Phase 1 — Application foundation (complete)

- Scaffold Next.js 16 with TypeScript, App Router, ESLint, and test scripts.
- Read the installed Next.js documentation before implementing framework APIs.
- Add semantic tokens, reset, typography, page shell, and accessible primitives.
- Add typed and validated content modules.
- Establish metadata, favicon, social metadata, and environment example.

Exit criteria: lint, typecheck, tests, and an empty production build pass.

## Phase 2 — Homepage narrative (complete)

- Build header, hero, availability, and original workflow visual.
- Build four varied editorial project stories using verified content.
- Build service, process, and engagement-pricing compositions.
- Build the availability and inquiry conclusion plus footer.
- Add deliberate responsive behavior and reduced-motion variants.

Exit criteria: the full page works at 375, 768, 1024, and 1440 px, has no
horizontal overflow, and remains understandable without animation.

## Phase 3 — Inquiry delivery (implemented locally)

- Implement shared validation and abuse checks.
- Add the server-only Resend adapter and inquiry route.
- Add accessible client states without losing entered data on failure.
- Keep direct email available when delivery is unconfigured or unavailable.

Exit criteria: route tests pass and one live delivery is verified separately
with real credentials and a verified sender.

Route tests pass. Live delivery remains pending until Resend credentials and a
verified sender are supplied.

## Phase 4 — Content and launch QA

- Replace or explicitly confirm every provisional value.
- Review confidentiality and factual accuracy of all project stories.
- Add approved authentic media or final original diagrams.
- Run keyboard, screen-reader smoke, contrast, responsive, performance, and SEO
  checks.
- Run lint, typecheck, tests, and production build.
- Configure hosting and domain only after the user chooses them.

## Phase 3.5 — Conversion and motion pass (implemented locally)

- Add a persistent, continuously pulsing availability control with an explicit
  manual-data label elsewhere on the page.
- Add an optional Cal.com event embed, external-calendar link, and direct-email fallback.
- Expand every project diagram into a distinct animated workflow visual.
- Rework pricing into scannable engagement panels with a principles strip.
- Add a situational fit comparison and source-constrained FAQ.
- Remove the public state and country from the rendered identity.

## Later, only when requested

- Dedicated case-study routes
- Calendar-backed availability or first-party scheduling
- Analytics and conversion measurement
- CMS or authenticated editing
- CRM or persistent lead storage
- Additional project stories and testimonials

## Hire v2

- [x] Archive the pre-v2 implementation, including the VisaFile edit, in the
  `hire-v1` Git tag.
- [x] Introduce six public routes and persistent desktop navigation.
- [x] Keep provisional price and exact availability values off public pages.
- [ ] Approve commercial figures and current availability before publishing them.
- [ ] Validate live inquiry delivery and booking after deployment configuration.
