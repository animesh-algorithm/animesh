---
name: hire-animesh-website
description: Builds and reviews the Hire Animesh consulting website using its original Notion-inspired design system, verified content, conversion goals, and engineering constraints. Use for homepage, project-story, services, pricing, availability, inquiry-form, responsive, accessibility, or architecture work in this repository.
---

# Hire Animesh Website

## Workflow

1. Read `../../../AGENTS.md` completely.
2. Read the task-relevant root documents:
   - visual work: `../../../DESIGN.md`
   - architecture or integrations: `../../../ARCHITECTURE.md`
   - copy, claims, pricing, or availability: `../../../CONTENT.md`
   - milestone selection: `../../../ROADMAP.md`
3. Inspect the implementation and Git state.
4. Briefly name the files to change and why.
5. Make the smallest coherent change.
6. Verify the change against the relevant quality gates.

## Non-negotiables

- Never invent missing proof, metrics, clients, testimonials, or outcomes.
- Keep provisional content identifiable in the content source of truth.
- Translate Notion marketing principles into an original composition; do not
  copy its layouts, assets, characters, interface, or copy.
- Prefer Server Components and narrow client boundaries.
- Preserve unrelated user work.
- Report actual validation performed and distinguish it from live integration
  behavior that was not tested.

## UI verification

- Check 375, 768, 1024, and 1440 px layouts.
- Measure document and body horizontal overflow.
- Test keyboard focus and reduced-motion behavior.
- Run lint, typecheck, relevant tests, and a production build.
