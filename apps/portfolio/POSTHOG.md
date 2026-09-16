# PostHog setup and preview verification

Install uses stable `posthog-js`, independently owned by this app. Set app-local
`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`,
`NEXT_PUBLIC_POSTHOG_ENABLED=true` and `NEXT_PUBLIC_POSTHOG_ENVIRONMENT=preview`
only in an isolated preview. Defaults remain disabled; rebuild after changes.
Never commit environment values. Production deployment is a separate launch step.

Create one project in US Cloud with product analytics and session replay enabled.
Set server replay sampling to 20% as well as the client setting. Create dashboards
named Portfolio and Hire; filter each by `app=portfolio` or `app=hire` and
`environment=production`. Preview dashboards/queries must filter `environment=preview`.

Add pageview traffic over time, referring hostname, device/browser breakdown,
project_link_clicked grouped by project/category/placement, and contact clicks.
Portfolio: résumé clicks and Ask open → question submitted → response completed,
with a separate failure trend. Hire: inquiry started → submitted → succeeded,
with failure outcomes, plus booking clicks. Label inquiry success
**browser-observed API acceptance**. Label résumé and booking metrics **clicks**;
they cannot prove completed downloads or bookings.

Before enabling production, verify actual preview ingestion and replay:

- Fresh origin: analytics and sampled replay initialize without a consent prompt,
  including when an old rejected preference exists or localStorage is unavailable.
- Verify 20% replay sampling across eligible sessions.
- Navigate, back/forward and reload: one pageview per pathname transition.
- Enter synthetic sensitive text into Ask/inquiry/booking regions, including
  streamed responses and failure messages. Inspect decoded events and recordings:
  no text, emails, chat IDs, request headers/bodies, console details, query strings
  or fragments. Inspect rrweb meta URLs as well as event URLs.
- Ask save/no-save remains independent.
- Block ingestion: navigation, streaming and inquiry submission still work.
- Confirm event counts against actual successful, rejected and network-failed
  submissions and stream done/error events. Do not send live inquiries as QA.
- Verify widths 375/768/1024/1440, keyboard focus, reduced motion, assets, console
  output and document/body overflow. Check all four development ports.

US Cloud project [Portfolio and Hire](https://us.posthog.com/project/613351) is configured.
The account permits one free project, so its empty Default project was renamed.
Replay is enabled with 20% sampling; cloud console and network capture are off.
Dashboards: [Portfolio](https://us.posthog.com/project/613351/dashboard/2104792),
[Hire](https://us.posthog.com/project/613351/dashboard/2104797), each with eight charts
filtered to its app and production environment. Preview ingestion was observed from
isolated local production builds on ports 3100/3101; stored event URLs exclude
query strings/fragments and inquiry-start payloads exclude synthetic form text.
Final stored Ask events showed the fixed IP placeholder 0.0.0.0 and GeoIP disabled.
The app disables feature-flag evaluation while retaining remote recording config.
A temporary local build forced sampling for synthetic Ask/inquiry privacy QA; this
override was removed from source and build output after the check. The recorder and
remote config loaded without console errors. Two cloud recordings arrived (10/11
seconds); the default >5 active seconds filter hid these short synthetic sessions.
Removing that filter exposed them. Portfolio recording overview showed a clean
entry URL, referrer hostname only, no country enrichment, and disabled console/
network inspector panes. Playback remained blank in the browser, so sensitive-region
visual inspection and decoded snapshot inspection are not verified. Client and
cloud defaults remain 20%. Live recording
inspection and exhaustive chat/inquiry outcome verification remain launch gates.
Repository tests use a mock and cannot establish recording payload exclusions.

References: [Next.js integration](https://posthog.com/docs/libraries/next-js),
[replay privacy](https://posthog.com/docs/session-replay/privacy).
