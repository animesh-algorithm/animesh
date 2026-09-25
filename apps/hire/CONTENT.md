# Content Source of Truth

## Rules

- `Verified` means the fact exists in an approved source or was supplied by the
  user and may be published.
- `Provisional` means it is a working suggestion authorized for the initial
  build but must be confirmed before production launch.
- `Unknown` means omit it or ask; never fill it with plausible copy.
- Do not turn an inference into a metric, testimonial, client claim, or outcome.
- Use “I,” not “we,” unless a real team is involved.

## Identity — verified

- Name: Animesh Sharma
- Email: `hello.animeshsharma@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/animeshsharma42`
- GitHub: `https://github.com/animesh-algorithm`
- X: `https://x.com/animesh_algo`
- Positioning: engineer, product person, automation obsessive, and problem solver
- Works across: engineering, product, and operations
- Strengths: ambiguity, automation, and getting things shipped

Public working name: **Hire Animesh**. This is provisional until domain and final
brand naming are chosen.

## Audience and offer — provisional

Primary audience: startup founders and operations leaders who need a senior
operator-builder to take a messy product or workflow problem through to shipped
software.

Suggested hero:

> I build the systems your team keeps working around.

Suggested support:

> Products, AI automation, and internal tools for teams whose important work has
> outgrown spreadsheets, handoffs, and “we'll fix it later.”

Approved Hire v2 homepage hero copy:

- Eyebrow: **For founders who want to ship**
- Headline A: **Got an idea sitting in a Notion doc?**
- Headline B: **Your idea probably doesn’t need an agency.**
- Support: **I work with founders to turn ideas, messy workflows, and unfinished products into software that ships.**
- Actions: **Talk to Animesh** and **Show, don’t tell**

Service areas:

1. Product and MVP builds
2. AI and workflow automation
3. Internal tools and integrations

These are initial framing, not final promises or exhaustive service definitions.

### MVP development — confirmed service offer

- Primary audience: nontechnical founders taking an idea to a usable first product.
- I provide product direction, agree a scoped first version, build and launch a web or mobile product as appropriate, and hand over its source code.
- The client provides UI designs. If needed, I can refer an independent designer; UI design is not included in my MVP build.
- The scoped MVP service starts at **$2,000 USD**. Final price depends on the agreed features and platform. This is a service minimum, distinct from the provisional End-to-End Build engagement price below.
- Later changes and ongoing support are scoped and quoted separately. No delivery timeline or revision count is promised.

### Other service pages — provisional copy

- `/services/saas-web-apps`, `/services/ai-products-features`, and `/services/mobile-apps` use editable working copy in `content/service-pages.ts`.
- Their fit, process, deliverables, FAQ, and handoff descriptions are illustrative scope discussions, not fixed inclusions or commercial commitments.
- No starting price, delivery timeline, or revision count is published for these services. Final scope, responsibilities, third-party costs, and quote are agreed for each inquiry.

## Engagements — provisional

| Engagement | Starting price | Initial intent |
| --- | ---: | --- |
| Focused Sprint | $2,500 | Discovery, prototype, or technical direction |
| End-to-End Build | $8,000 | Scoped product, automation, or internal system |
| Embedded Support | $4,000/month | Ongoing product and engineering support |

Working scope boundaries are also provisional:

- Focused Sprint covers problem framing, scope definition, a prototype or
  technical direction, and a decision-ready next step. It does not cover full
  production implementation or ongoing delivery after the sprint.
- End-to-End Build covers a defined product, automation, or internal system,
  product and engineering execution, and a working handoff with known
  constraints. It does not cover an open-ended backlog or ongoing embedded
  support after handoff.
- Embedded Support covers ongoing product and engineering execution, priority
  shaping, and direct embedded collaboration. It does not provide a separate
  multi-person delivery team or unbounded work outside agreed priorities.

Do not add timelines, hour allocations, revision counts, or guarantees until
they are confirmed.

## Availability

- Capacity: 1–2 projects per month.
- Manually maintained active-project count: 1 by default.
- Public status: 0 active projects → Available; 1 → Limited availability; 2 → Booked.
- Show the capacity, but do not publish the active-project count or imply a guaranteed start date.

Availability is manually maintained. Do not describe it as live, calendar-backed,
or real-time until such an integration exists.

Display the availability label persistently in the interface. The visual pulse
communicates that the status is current and prominent; it does not mean the data
is live or calendar-backed.

## Booking

Verified public event URL: `https://cal.com/meet-animesh/30min`

- Provide the calendar on Home and Contact. Keep the inquiry form below it as
  the secondary contact path on both pages.
- Use `NEXT_PUBLIC_BOOKING_URL` only for a real public `cal.com` event URL.
- When configured, show the Cal.com schedule in-page as the primary contact action.
  Keep the inquiry form accessible as the secondary action.
- Until then, open an honest direct-email call request and keep the inquiry form
  available. Do not show invented time slots or imply calendar synchronization.

## Fit comparison and FAQ — provisional

The user supplied the fit-test heading and six comparison rows on 2026-09-24.
They compare typical agency process with working directly with Animesh, using
the approved $500 starting price. Present these as positioning, not measured
agency-wide outcomes or delivery guarantees.

FAQ answers may clarify the three engagement starting points, starting-price
status, service fit, manually maintained availability, and booking fallback.

## Projects — verified

### Experiments on Work

- Sortify and Crate appear in a separate Experiments chapter on `/work`, after the main project ledger.
- Their Mac-window images are captures of the public homepage heroes at `https://sortifi.vercel.app/` and `https://crate-nu-lilac.vercel.app/`, taken on 2026-09-24.
- Sortify presents a music-library and playlist direction; Crate presents a searchable private library for Instagram saves. The captures do not verify authenticated flows, imports, playlist publishing, or measured results.

### FivePoints public website showcase

- The public homepage at `https://five-points.netlify.app/` presents health plan paths for individuals, families, students, and employer groups. Its header and hero were captured for the Hire Work showcase in September 2026.
- The hero copy and design are shown as a site capture. This entry does not claim measured outcomes, current plan terms, or Animesh's specific contribution to the FivePoints product.

### VisaFile

- Title: DS-160, minus the suffering.
- Summary: The DS-160 can take hours of form-filling. VisaFile turns answers
  into an automated application run, stopping when user action is needed.
- Areas: automation, product, engineering
- Architecture: guided Next.js intake -> persisted application state -> API job
  -> separate Puppeteer/Chromium worker -> official CEAC form
- Human checkpoints: browser security checks, official CAPTCHA, and CEAC
  corrections remain user-controlled; automation resumes in the same session
- Demo: `https://youtu.be/IomQnHifsFU`
- GitHub: `https://github.com/animesh-algorithm/visafile`
- Unknown: measured completion-time reduction, usage, customers, revenue, and
  production scale

### Gradly Health Insurance

- The second Hire v2 project covers the core ecosystem: public insurance plan
  discovery (`insurance.gradly.us`), member tools (`app.gradly.us`), and internal
  operations (`dashboard.gradly.us`). The insurance and member screenshots are
  captured from live surfaces and exclude account records. The operations image
  is an illustrative concept inspired by the internal dashboard; its positive
  figures and charts are fictional and are not Gradly results.
- Verified in `apps/portfolio/public/resume.pdf`: Gradly's platform serves
  10K+ members across 25+ U.S. universities. Animesh integrated 5 insurance
  carrier partners. Across four sales cycles, annual premium volume grew from
  $1.2M to $2.4M and net revenue margin from approximately 12% to 35%.
- The premium and margin figures describe company outcomes during his tenure;
  they are not attributed solely to the pictured software.

### AI Insurance Concierge

- Hire v2 presents a scripted concept of a member-aware insurance chat in a
  Gradly-inspired portal. The displayed member, plan, coverage date, and card
  path are illustrative examples, not verified account records or a live lookup.
- The portal mockup combines the existing Gradly member-tools capture with an
  illustrative header, coverage summary, quick links, and document area based
  on the user-provided dashboard reference. Personal details in that reference
  are not reproduced.
- The illustrative card uses Gradly Supreme Plus, a $0 deductible, 100%
  coinsurance, a $5,000 out-of-pocket maximum, and an August 15, 2026 end date.
  Hal Jordan is the example member name. These are scripted example values,
  not verified member records or actual plan terms.
- Example question: “When does my coverage end?”
- Example reply: “Hi Hal, your Gradly Supreme Plus coverage ended on August 15,
  2026. You can view your insurance card at link.gradly.us/card-123.”
- A real version must verify the member identity, coverage record, and card
  destination before answering. No production integration is claimed here.

### Gradly Mobile App showcase

- The user supplied an eight-screen visual reference for a student health insurance mobile app. Its screen sequence includes splash, onboarding, sign-in, home, claim filing, claim status, provider search, and help.
- The Hire showcase uses the user-supplied Sign In, Home, and Find Providers screen artwork. The original eight-screen artwork remains available as a reference; the supplied screens do not establish live account data or shipped status.
- The reference's numerical claims, testimonial, app-store availability, and plan details are not independently verified for this showcase and are not published as results.
- Unknown: Animesh's precise contribution to this specific mobile app, shipped status, usage, and measured outcomes.

### Gradly Links

- Title: The useful kind of short story.
- Summary: An internal Rebrandly alternative with a custom Gradly domain for
  managing branded short links.
- Verified domain: `link.gradly.us`
- Verified examples: `link.gradly.us/reimbursement-guide`,
  `link.gradly.us/usc-waiver-guide`, and `link.gradly.us/book-a-call`
- Verified outcome: saved the company about $400 per month
- Areas: internal tool, custom domains, engineering
- Unknown: usage scale and current production status

### Gradly Immigration

- Public reference: `https://gradly.us/` describes one app for international
  students moving to the U.S., from university selection through visa steps,
  health plans, banking, housing, and arrival essentials.
- The Hire visual uses a user-supplied screenshot of the Gradly Immigration
  homepage and its student journey preview in a Mac-style browser window.
- Unknown: Animesh's precise contribution to this product, measured product
  outcomes, and current availability of individual features. The project story
  describes the public product without assigning those claims to Animesh.

### AI Claims Adjudication

- Title: Upload the bill. We'll handle the rest.
- Summary: Users upload a medical bill and bank details; the app checks
  eligibility, sends reimbursement by ACH, and confirms it by email.
- Verified detail: payment lands in 1–2 business days
- Areas: AI, automation, payments
- Demo: `https://www.loom.com/share/b30c16086f2848efa91a0098af48d74c`
- Unknown: claim volume, accuracy, and monetary impact

## Inquiry copy — provisional

Ask for:

- name
- work email
- company
- what needs to be built or fixed
- approximate budget
- desired timing

The completion message and acknowledgement email may confirm receipt but must
not promise a response time until Animesh defines one. The acknowledgement may
include a copy of the submitted brief for the sender's records.

## Pre-launch content checklist

- [ ] Confirm public brand and domain
- [ ] Confirm hero and service positioning
- [ ] Confirm every engagement name and starting price
- [ ] Define included scope and typical timing for each engagement
- [ ] Confirm availability state, slot count, and start date
- [ ] Review project stories for confidential information
- [ ] Confirm all demo and social links
- [ ] Add authentic screenshots or approve original diagrams
- [ ] Define inquiry response expectation
- [ ] Configure and verify the public booking URL
- [ ] Confirm legal/privacy copy required for form submissions

## Hire v2 publication review (2026-09-23)

V2 leads with product and MVP builds. Automation and internal systems remain
service paths. The verified project descriptions above are reused on `/work`.
The VisaFile public project link in `content/projects.ts` is part of the v1
snapshot and remains in v2.

The engagement names and scope descriptions remain working guidance. No starting
price has been approved, so v2 omits all price amounts. The availability state
is manually maintained in content, and v2 shows its derived status and confirmed
monthly capacity. The site does not imply live calendar data. Service
copy explains areas of work without claiming a delivery time or guaranteed result.
Review these values before any later publication of exact numbers.

## Pricing update (2026-09-24)

The user supplied three public offers and starting prices for the pricing section:
Ship a Page from $500, Build a Product from $2,000, and Monthly Retainer from
$1,500 per month, in USD. The supplied offer copy and scope lists replace the
earlier provisional engagement examples above for public pricing. Final scope
and quote are agreed per inquiry; the starting prices are not fixed quotes.

The Monthly Retainer is now a fixed $2,000 USD per month. The two project
offers remain starting prices, with final quotes agreed after scoping.

The sidebar's "05 project stories" counts the five documented projects here;
it does not claim a lifetime number of products shipped. "Scoped together"
avoids publishing an unconfirmed timeline.
