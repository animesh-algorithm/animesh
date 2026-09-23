# Portfolio architecture

The homepage remains dynamic; Ask APIs, streaming, retrieval, session deletion and separate chat consent remain app-local.

## Optional Ask activity email

`lib/chat/activity-mail.ts` sends the visitor's validated name and email when
provided, then includes them with every latest validated, rate-limit-accepted
question to the configured owner through Resend. The visitor email is Reply-To.
The contact endpoint has separate IP/session rate-limit buckets. Email never includes an answer,
previous messages, IP address, session identifier or token. Delivery runs alongside
moderation for questions and is best-effort: missing configuration or a provider failure never
blocks the chat response.

Enable it with the server-only `RESEND_API_KEY`, `ASK_ACTIVITY_FROM_EMAIL` and
`ASK_ACTIVITY_TO_EMAIL` variables. All three are required. The visitor disclosure
clarifies that these emails are separate from the choice to retain chat history for
30 days or only in the current browser tab. Contact details follow that browser
storage choice, are removed when a saved chat is deleted, and are excluded from
OpenAI input and Redis transcripts.

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
