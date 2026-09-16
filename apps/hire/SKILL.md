---
name: hire-animesh-website
description: Builds and reviews the Hire Animesh consulting website using its original Notion-inspired design system, verified content, conversion goals, and engineering constraints. Use for homepage, project-story, services, pricing, availability, inquiry-form, responsive, accessibility, or architecture work in this repository.
---

# Hire Animesh Website

## Start here

1. Read `AGENTS.md` completely.
2. Read only the task-relevant documents: `DESIGN.md`, `ARCHITECTURE.md`,
   `CONTENT.md`, and `ROADMAP.md`.
3. Inspect the current implementation and Git status.
4. Briefly name the files you intend to change and why.
5. Make the smallest coherent change and verify it proportionally.

## Working rules

- Treat `CONTENT.md` as the claim ledger. Never invent missing proof.
- Treat `DESIGN.md` as direction, not a component catalog. Compose whole pages.
- Extract Notion's principles; never copy its assets, layouts, characters, or
  copy.
- Prefer Server Components and content-driven rendering.
- Keep interactive client boundaries narrow and accessible.
- Reuse tokens and primitives once a pattern exists.
- Do not add a dependency for a small visual flourish.

## UI review loop

1. Confirm the first viewport communicates offer, audience, proof, and status.
2. Compare hierarchy, rhythm, and color against `DESIGN.md`.
3. Verify 375, 768, 1024, and 1440 px layouts.
4. Check text fit and document/body horizontal overflow.
5. Test keyboard focus and reduced motion.
6. Run lint, typecheck, tests, and production build.

## Completion report

State:

- files changed and the user-visible outcome
- checks run and their actual results
- provisional content used
- live integrations not tested
- intentionally deferred work
