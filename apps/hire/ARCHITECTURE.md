# Architecture

## Goals

- Ship a fast, accessible consulting website with minimal client JavaScript.
- Keep claims, prices, availability, and projects easy to audit and edit.
- Isolate third-party inquiry delivery from presentation code.
- Support future case-study routes and calendar-backed availability without
  prematurely implementing them.

## Planned stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Server Components by default
- CSS custom properties and plain CSS for the design system
- Zod for content and request validation
- Resend behind a server-only mail adapter
- Vitest for validation and route behavior

When the app is scaffolded, use the versions installed by the package manager
and read `node_modules/next/dist/docs/` before relying on framework conventions.

## Boundaries

```text
app/
  layout.tsx                 metadata, fonts, global shell
  page.tsx                   homepage composition only
  api/inquiries/route.ts     HTTP boundary for inquiry submission
components/
  layout/                    header, shell, footer
  sections/                  homepage section compositions
  visuals/                   original project and workflow diagrams
  inquiry/                   small client form boundary
content/
  site.ts                    identity, navigation, metadata
  projects.ts                verified project stories
  services.ts                service and engagement copy
  commercial.ts              provisional pricing and availability
lib/
  content/                   shared schemas and content validation
  inquiries/                 payload schema, abuse checks, mail adapter
styles/
  tokens.css                 semantic design tokens
  globals.css                reset, base rules, shared utilities
tests/
  content.test.ts
  inquiry-route.test.ts
```

This is a responsibility map, not a requirement to create every file before it
has real content.

## Rendering model

- The homepage and content sections are Server Components.
- Only the motion director, deliberate micro-interactions, and inquiry form state
  may cross a `"use client"` boundary.
- Project diagrams should prefer semantic HTML and inline SVG with accessible
  names. Decorative SVG must be hidden from assistive technology.
- The initial site is statically renderable except for `POST /api/inquiries`.

## Content model

Use readonly typed records validated at module load or in tests:

```ts
type AvailabilityState = "available" | "limited" | "booked";

interface Project {
  slug: string;
  name: string;
  summary: string;
  problem: readonly string[];
  built: readonly string[];
  decisions: readonly string[];
  outcome?: readonly string[];
  links: readonly ProjectLink[];
  accent: ProjectAccent;
}

interface Engagement {
  slug: "sprint" | "build" | "embedded";
  name: string;
  startingPriceUsd: number;
  priceSuffix?: string;
  bestFor: string;
  included: readonly string[];
  notIncluded: readonly string[];
  provisional: boolean;
}

interface Availability {
  activeProjects: number; // validated integer from 0 to 2
}
```

Derive AvailabilityState and its public label from activeProjects: 0 means
Available, 1 means Limited availability, and 2 means Booked. Show the confirmed
capacity of 1–2 projects per month; maintain the count manually in content.
Do not model speculative fields until content needs them. Dedicated case-study
routes can reuse `Project` later.

## Inquiry flow

1. The client validates required shape for immediate feedback.
2. `POST /api/inquiries` treats the browser payload as untrusted and validates
   it again.
3. Abuse checks reject a filled honeypot, implausibly fast submission, oversized
   fields, and invalid payloads.
4. A server-only adapter sends the normalized message through Resend and then
   sends a brief acknowledgement copy to the submitter.
5. The route returns a small structured result without provider internals.
6. On configuration or delivery failure, the UI preserves the form state and
   offers `hello.animeshsharma@gmail.com` as the fallback.

Initial fields: name, work email, company, project summary, approximate budget,
and desired timing. Do not persist submissions in the first release.

Environment variables:

```text
RESEND_API_KEY=
INQUIRY_FROM_EMAIL=
INQUIRY_TO_EMAIL=hello.animeshsharma@gmail.com
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_BOOKING_URL= # public https://cal.com/... event URL only
```

Provide an `.env.example`; never commit real values.

## Failure behavior

- Content validation failure: fail the build with a precise local error.
- Missing Resend configuration: endpoint returns a safe configuration result;
  UI offers direct email.
- Provider failure: log a server-side request identifier, return a generic
  delivery error, and keep the user's text in the form.
- Acknowledgement-only failure: log a server-side request identifier and still
  accept the inquiry so the submitter is not encouraged to duplicate the brief.
- JavaScript unavailable: contact email and core content remain usable.
- Missing project media: use an honest diagram grounded in the actual project
  flow or architecture, never a fabricated screenshot.

## Security and privacy

- Validate and length-limit every public input.
- Escape content in generated email HTML and include a plain-text version.
- Do not log full inquiry bodies or email addresses in normal production logs.
- Add platform rate limiting only when a deployment target is selected; do not
  claim the honeypot is full rate limiting.
- Keep Resend and all secrets server-only.

## Testing and delivery gates

- Unit-test content schemas and inquiry normalization.
- Route-test valid submission, acknowledgement delivery, each validation class,
  missing configuration, and provider failure with the adapter mocked.
- Browser-check keyboard use, live error announcements, reduced motion, and
  responsive behavior at 375, 768, 1024, and 1440 px.
- Run lint, typecheck, tests, and production build.
- Live Resend delivery is a separate integration check and must be reported as
  untested until credentials and a verified sender exist.

## Deferred decisions

Do not implement these in the first release without a new decision:

- CMS or database
- dedicated case-study routes
- calendar API or live availability synchronization; a configured Cal.com event
  embed with external-link and direct-email fallbacks is implemented without
  fabricating availability
- dynamic availability
- persistent lead storage or CRM integration
- authentication or admin editing

## Optional PostHog analytics

`lib/analytics` owns a typed allowlisted adapter.
`components/analytics-provider.tsx` initializes analytics and sampled replay by
default when configured, without a consent prompt. Content sections remain
Server Components. Missing configuration disables capture. `/privacy` discloses
analytics and replay separately from product consent.

Use one US Cloud project for both apps, with `app` and `environment` properties.
App-local public variables are documented in `.env.example` and included in Turbo
build hashing. All four must be explicitly configured; local development is off.
Preview uses `NEXT_PUBLIC_POSTHOG_ENVIRONMENT=preview`; production enablement and
deployment remain separate. Direct ingestion is `https://us.i.posthog.com`.

Replay masks inputs, blocks `[data-private]` regions
and iframes, excludes console/network contents, and samples 20% of eligible
sessions. SDK-generated event properties are filtered; replay URL strings are
redacted before capture. Do not add free-text properties, identity calls, chat IDs,
provider errors, or server-side analytics to existing API responses.

Failures never block product flows. Interaction annotations use fixed semantic
labels, not link text. Ask chat-storage consent remains independent.

Cloud setup and launch verification: see `POSTHOG.md`.

## V2 route map

`app/page.tsx` is the concise Home route. `app/work`, `app/services`,
`app/services/mvp-development`, `app/services/saas-web-apps`,
`app/services/ai-products-features`, `app/services/mobile-apps`,
`app/pricing`, `app/about`, and `app/contact` render dedicated pages. The root
layout owns persistent navigation and footer. Existing inquiry API, booking
adapter, analytics/privacy boundary, and typed content remain app-local.
Engagement prices and exact availability values marked provisional in `CONTENT.md`
stay in the content model for review but are omitted from rendered v2 pages.
The confirmed $2,000 USD scoped MVP service minimum is published separately.
