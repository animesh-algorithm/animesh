# Portfolio architecture

The homepage remains dynamic; Ask APIs, streaming, retrieval, session deletion and separate chat consent remain app-local.

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
