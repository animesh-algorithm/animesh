# Design Direction

## Intent

Create an original, editorial product-studio website that makes complex problem
solving feel clear, tangible, and approachable. The first viewport must answer:
what Animesh builds, who it is for, and whether a conversation is possible.

The visual reference is [Notion's public marketing site](https://www.notion.com/),
reviewed on 2026-09-16. The reference is directional, not a template.

## What to learn from Notion

Notion's current marketing page uses a disciplined navigation bar, oversized
black typography, short supporting copy, clear action hierarchy, large product
visuals, generous whitespace, restrained blue and warm-yellow accents, and
small illustrated interruptions. Deeper sections alternate direct statements,
product proof, use cases, and trust signals.

Carry forward these principles:

- one dominant idea per viewport
- typography as the main compositional material
- large real product or workflow visuals beneath concise claims
- warm neutral space punctuated by intentional flat color
- playful illustration used as punctuation, not wallpaper
- strong hierarchy with very little decorative chrome
- clear proof immediately after an ambitious claim

Do not copy Notion's hero construction, pill-highlight treatment, face drawings,
product screenshots, navigation labels, iconography, characters, or copy.

## Original identity

### Creative concept: messy to shipped

Loose hand-drawn lines enter sections as tangled problems, pass through a bold
outlined “system,” and leave as straight, ordered paths. Use this motif in the
hero, project diagrams, process, and inquiry transition with restraint.

It should feel like a smart workshop notebook becoming production software.

### Composition

- Use wide editorial fields rather than a universal card grid.
- Alternate text-led spreads, full-width diagrams, split narratives, and dense
  proof strips.
- Let project sections have distinct accent colors while sharing typography,
  borders, grid, and spacing.
- Use asymmetry at large widths but preserve a clear reading order on mobile.
- Avoid placing every object inside a bordered container.

## Foundations

These are starting tokens, not final CSS names or immutable brand decisions.

### Color

| Role | Initial value | Use |
| --- | --- | --- |
| Paper | `#F7F5F0` | Primary page background |
| Ink | `#191919` | Text, outlines, diagrams |
| White | `#FFFFFF` | High-contrast surfaces |
| Cobalt | `#2F6BFF` | Primary action and product engineering |
| Butter | `#FFD66B` | Highlight and process |
| Coral | `#FF785A` | Automation and urgency |
| Lilac | `#B7A6FF` | AI systems |
| Mint | `#79D3A6` | Availability and completion |
| Muted ink | `#62605B` | Secondary copy only |

All color pairs must pass WCAG 2.2 AA for their actual text size. Mint is not a
default text color on paper.

### Typography

- Use a bold grotesk or system sans for display and interface typography.
- Use a readable humanist sans or the same family at calmer weights for body.
- Do not depend on a proprietary font until licensing and delivery are clear.
- Display type should be large but bounded with `clamp()` and tested for long
  words at 320–375 px widths.
- Keep body measure near 60–70 characters.

Initial responsive scale:

| Token | Range |
| --- | --- |
| Display | `clamp(3rem, 8vw, 7.5rem)` |
| H2 | `clamp(2.25rem, 5vw, 5rem)` |
| H3 | `clamp(1.5rem, 2.5vw, 2.5rem)` |
| Lead | `clamp(1.125rem, 1.6vw, 1.5rem)` |
| Body | `1rem` to `1.125rem` |

### Geometry

- Base outline: 2 px ink; 3 px for expressive large shapes.
- Favor soft, asymmetric curves on editorial panels, project framing, pricing,
  and conversion surfaces. Reserve squared geometry for data-dense diagrams,
  tables, and fields where structure needs to stay explicit.
- Shadows: hard offset or very soft elevation, never glowing.
- Spacing follows an 8 px base with deliberate editorial exceptions expressed
  as named section tokens.
- Page width should use a fluid shell with a readable maximum near 1440 px.
- Section curves overlap the outgoing surface instead of occupying a separate
  band, and one global normal-blend grain layer keeps texture density consistent
  across light, dark, and colored chapters.

### Motion

- Use 150–250 ms transitions for controls and 350–600 ms for section reveals.
- Motion may explain state, drawing order, or transformation from messy to
  structured.
- Persistent animation is limited to the compact availability pulse and small
  explanatory diagram loops. Infinite motion pauses when the document is hidden
  and is removed entirely for reduced-motion preferences.
- Reduced motion must remove drawing and reveal choreography without hiding
  information.

## Page composition

### Header

Keep it compact and calm: wordmark, Work, Services, Pricing, availability, and
one “Start a conversation” action. Collapse to an accessible menu only when the
links no longer fit. The paper header should flow directly into the hero without
an ornamental separator; grain continues across both surfaces.

### Hero

The Hire v2 homepage uses the approved founder-focused eyebrow, one of the two
approved headline options in `CONTENT.md`, chosen randomly on each reload, the supplied support copy, and the
actions “Talk to Animesh” and “Show, don’t tell.”

Pair it with a short explanation for startup founders and operators, one primary
inquiry action, one work link, and a large original workflow illustration. Show
availability as useful text, not only color.

### Work

Use [WORK_SHOWCASE_DESIGN.md](WORK_SHOWCASE_DESIGN.md) for the detailed Home and
Work project-media decisions, reusable assets, device frames, and current
project-specific corrections.

Present the documented projects as substantial editorial stories. Each needs:

- the painful or manual starting condition
- what was built
- a diagram or authentic product media
- verified decisions or constraints
- verified outcome only when available
- relevant service connection

Use a different composition for featured and supporting stories. Do not repeat
the same card component four times. Use a light lilac chapter surface so the
work reads as a new editorial field rather than an extension of the hero.

Hire v2 uses authentic Gradly captures for the public insurance hero and member
self-service tools. The third visual is an illustrative operations dashboard
concept with fictional example metrics. Present them as three Mac-style windows
on a lilac drafting grid, and label the concept so its figures cannot be
mistaken for actual results.

Gradly Immigration shows the user-supplied website screenshot, including the
student journey preview, in one Mac-style browser window on a cool drafting
surface. Its caption identifies the photographed product interface.

AI Insurance Concierge uses the existing Gradly member-app capture directly:
a white and pale lavender canvas, navy type, generous rounded tool panels,
pastel circular icons, and blue pill actions. The surrounding illustrative
dashboard follows the supplied full-page reference with a Gradly logo, header,
coverage summary, quick links, and plan documents. The chat sits at the lower
right of a Mac-style window with a visible open/close toggle, begins with a member
coverage question, shows brief progress states, and reveals a scripted answer.
The caption identifies the example member details and card path as illustrative.
Reduced-motion users see the complete answer immediately.

### Services and process

Organize services by client problem. Use diagrams and annotated examples rather
than technology badges. Show the process as a transformation, not a generic
four-step timeline.

### Pricing

Use three vertically structured engagement panels with strong typographic prices,
one clearly emphasized core engagement, fit cues, a supporting principles strip,
and a separate fit comparison. The inspiration is the scannable sequence on
Launchcraft's pricing page, including its plan -> principles -> comparison -> FAQ
-> booking rhythm. Keep Animesh's own prices, scope boundaries, voice, and visual
identity rather than importing another studio's claims or plan details.

### Fit, FAQ, and booking

Follow pricing with a candid situational comparison, editorial FAQ rows, and a
high-contrast booking panel. The persistent availability control should remain
visible at every scroll position and connect directly to the booking path. When
a public Cal.com event URL is configured, the schedule may be embedded below the
booking panel; keep an external-calendar link and email fallback visible.

### Availability and inquiry

Bring availability, fit guidance, form, and direct email into one conclusion.
The form should feel calm and conversational, with errors next to fields and a
clear status announcement.

## Interaction states

Every control must define default, hover, focus-visible, active, disabled,
loading, success, and error where applicable. Hover may add delight but cannot
reveal required information. Focus indicators must remain visible on every
surface and may not rely on color alone.

## Responsive rules

- Mobile reading order is the semantic DOM order.
- Editorial overlaps must collapse before they cause clipping or reordering.
- Diagrams may simplify at narrow widths but must retain their meaning.
- Navigation, pricing, and form controls must work at 320 px without horizontal
  scrolling.
- Measure both `documentElement.scrollWidth` and `body.scrollWidth` during QA.

## Anti-pattern check

Reject a direction if it could plausibly be sold as a generic agency template,
if every section is a card grid, if decoration overwhelms project proof, or if
removing the accent colors makes every section structurally identical.

## V2 multipage composition

The existing logo, paper/ink/cobalt palette, type, diagrams, and project accent
colors remain the visual system. Desktop navigation is a persistent left sidebar;
smaller screens use the compact, keyboard-accessible disclosure menu. The pages
are Home, Work, Services, Pricing, About, and Contact. Home carries the short
product-build offer and two direct paths. The full project ledger now owns Work,
service process owns Services, engagements and comparison own Pricing, and the
inquiry form owns Contact. This route structure supersedes the single-page
composition and header sections above. LaunchCraft informed navigation clarity
and route structure only; its visual assets and claims are not used.

## V2 visual refinement

The persistent sidebar uses an ink surface against paper content, with navigation,
direct booking and message actions, and concise project information. Exact
availability is a manually maintained status derived from the active-project count;
show the confirmed 1–2 projects per month capacity without publishing the count
or a delivery date. The original
HireAnimesh wordmark stays on one line in its Arial/Helvetica heavy face and keeps
its amber pulsing dot at the upper right of the name; the pulse stops when reduced
motion is preferred. Body and display typography use Avenir Next where available,
then Segoe UI or system sans; the scale is smaller and calmer. Work uses neutral
wireframe media placeholders where authentic project images are unavailable. VisaFile
uses a capture of the public site's header and hero inside a Mac-style window
on a drafting grid. Home
previews work, services, engagement shapes, direct working style, FAQ, and contact
so mobile visitors can evaluate the offer without opening the menu. The compact
header keeps booking visible beside an icon-only navigation disclosure.
Paper sections use a faint, static drafting grid in the page background to
extend the wireframe language beyond Work media. Colored chapters cover the grid
so the page retains its editorial rhythm and readable copy.
