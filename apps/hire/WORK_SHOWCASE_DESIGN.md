# Work showcase design decisions

This is the working reference for project visuals on Hire v2 Home (`/`) and Work (`/work`). It records the user's decisions across the recent VisaFile, Gradly Health Insurance, Gradly Mobile App, Gradly Immigration, AI Claims Adjudication, and AI Insurance Concierge work. Read this with `AGENTS.md`, `DESIGN.md`, and `CONTENT.md`; the latter remains the authority for published facts and example values.

## Shared visual language

- Show the product or workflow, not a generic illustration. Use real screenshots when supplied or safely captured. When drawing a plausible interface, label it as a **concept** or **illustrative example** in the visible caption.
- Keep Hire's outer editorial system: paper and lilac fields, ink outlines, restrained cobalt and project accents, subtle drafting grids, deliberate curves, and clear project copy. A product's **inner** screen follows that product's own design language. Do not repaint a Gradly portal or a VisaFile screenshot to look like the Hire site.
- Frame desktop web interfaces inside a compact Mac-style browser window: rounded window, narrow title/address bar, and red/yellow/green window controls. Keep the product header and enough screen content visible to recognize the product. Set the window on a fine drafting grid when it helps the visual read as a designed showcase.
- Frame mobile app flows inside proportionate Apple iPhone-style devices, with a consistent screen ratio, restrained status/island and home-indicator details, and enough room for the actual workflow. Use a Mac-style window for a processing terminal. Do not stretch phone screens to fill a card.
- Keep the media beside the story copy on `/work` where space allows. The compact Home treatment is a useful size reference: visuals should not become a full-page infographic or consume far more space than VisaFile. Stack naturally at narrower widths. Details inside a scaled screenshot may become small; preserving the whole composition matters more than making every small label readable.
- Home and `/work` show the same full project ledger and project-specific visuals, including the Experiments chapter and three-part claims flow. Keep the numbered editorial presentation and lilac chapter surface on both routes.
- Keep responsive behavior intentional at 375, 768, 1024, and 1440 CSS px. Check both document and body for horizontal overflow, legibility of the main idea, keyboard focus, and reduced motion. Animation should explain a state change; reduced-motion users should see the completed information.

## Brand and asset reuse

Use saved source assets instead of typing or redrawing a near-match logo. Keep brand marks in product headers where they belong; do not stamp them onto every card.

| Asset | Use |
| --- | --- |
| `public/images/gradly.svg` | Official Gradly SVG from `https://app.gradly.us/logo/gradly.svg`; use for Gradly marks in drawn product UI, including the Concierge header and Mobile App showcase. |
| `public/images/gradly-logo-card.png` | Historical reference asset. **Do not put it on the Concierge plan card**; the user explicitly removed that placement. |
| `public/images/gradly-immigration-home.png` | User-supplied Gradly Immigration website image; use the current single Mac-window presentation. |
| `public/images/gradly-insurance-hero.png` | User-supplied public insurance homepage screenshot, including its full header/hero, in the Health collage. |
| `public/images/gradly-mobile-reference.png` | User-supplied eight-screen Mobile App artwork. Use its design language and screen content to guide the remaining redraws. |
| `public/images/gradly-mobile-signin.svg` | User-supplied Sign In screen SVG; show this directly in the first phone. |
| `public/images/gradly-mobile-home.png` | User-supplied Home screen artwork; show this directly in the middle phone. |
| `public/images/gradly-mobile-providers.svg` | User-supplied Find Providers screen SVG; show this directly in the third phone. |
| `public/images/gradly-member.jpg` | Member tools capture, reused in the Health collage and Concierge dashboard. |
| `public/images/gradly-operations-concept.png` | **Illustrative** operations dashboard with positive example figures and rising charts. Never present those figures as measured Gradly results. |
| `public/images/visafile-hero.jpg` | VisaFile website capture in its Mac window. |

These paths are relative to `apps/hire`. The images under `public/images` are reusable files; the temporary clipboard paths from chat are not source assets.

## Project-specific decisions

### Experiments: Sortify and Crate

Place these in a clearly labeled Experiments chapter after the main Work stories. Use settled captures of each public site's full header and hero inside the shared compact Mac window. Sortify's lavender music illustration and Crate's cream, purple, and photo collage remain their own product designs; Hire supplies only the outer drafting surface and editorial story. Identify each image as a public homepage capture. Do not infer results or completed signed-in workflows from the hero.

### VisaFile

Show the actual website header and hero, including the product message and sample intake surface, inside one Mac window on a drafting grid. Keep it compact next to its story on `/work`. It is the size/composition reference for other desktop product visuals.

### Gradly Health Insurance

Show the core ecosystem as **three** Mac-window surfaces: public insurance plans, member app, and internal operations. Use the supplied insurance homepage image rather than an enrollment form, and keep the real member tools visible. The operations surface is a generated concept, visibly captioned as such. Arrange the collage within a compact 4:3-ish media area beside the text on `/work`; keep all three windows present. Home may use its own card composition without being affected by Work-only sizing changes.

### Gradly Immigration

Use the supplied website image in **one** Mac-style window, matching the pattern of VisaFile and Gradly Health. Earlier drawn website and student-journey concepts were superseded by the supplied screenshot. Preserve the correct Gradly mark visible in that image; do not recreate a lookalike wordmark. The cool drafting surface distinguishes this project while the image remains the proof.

### Gradly Links

Keep its project story in the same Home and Work system. The Work visual is an illustrative redraw of the public Supreme Plus analytics view inside a Mac-style window. Give the geographic map, country and city breakdowns, and click metrics visual priority; keep the link list as narrow context. Mask member-link paths and identifying details. The public `link.gradly.us/usc-supreme-plus` path may remain visible. Use the saved Gradly logo, label the observed figures as a snapshot, and identify any invented chart data as illustrative rather than a measured outcome.

### AI Claims Adjudication

Tell the sequence with two iPhone-style screens and one Mac-style processing terminal: (1) file a claim with a bill and banking details, (2) watch automated review, (3) see a processed-claim receipt. On desktop, the three parts stay inline, including on the Home card; use a full-width card if needed. Keep phones proportionate, with compact screens and no decorative navigation that steals space from the claim content.

The app screens follow the supplied Gradly mobile UI reference: white screens, navy type, fine borders, cobalt actions, compact headers, and appropriate bottom navigation if it fits. The terminal may be dark or follow Hire's visual language, but it uses Mac window controls. Show review stages **one at a time**: active stage loads, becomes a tick, then the next appears. Finish with “Claim processed” as stage eight. The `$88.58` claim and `12 seconds` are illustrative example values, not measured performance; show the receipt/email message as part of the example. Reduced motion shows the complete sequence.

### AI Insurance Concierge

Use the **member portal dashboard reference**, not a generic insurance landing page. The Mac window should expose the Gradly logo in the dashboard header, support/profile area, coverage summary, compact plan card, quick links, member tools, and plan documents. Keep the side rail hidden so the dashboard content has more space, and keep the "Dashboard" heading out of the illustration. Follow the supplied member-portal palette and geometry: pale lavender background, white generous rounded panels, navy text, blue pill actions, and pastel accents. The example member name **Hal Jordan** appears in the UI.

The small plan card sits inline with the coverage summary. It contains **Gradly Supreme Plus**, **$0 deductible**, **100% coinsurance**, **$5,000 out-of-pocket maximum**, and **valid till Aug 15, 2026**. The Gradly mark is in the dashboard header, **not on the card**. The member portal screenshot remains a supporting part of the dashboard.

Keep the Concierge chat widget open at the bottom right initially, with its round open/close toggle icon still visible. Start with a simple member-aware question such as “When does my coverage end?” Show a few short checking/thinking states, then reveal a concise answer with a ChatGPT-like typing effect and the illustrative card path `link.gradly.us/card-123`. The current scripted reply uses past tense because the example date has passed. A closed state can reveal more dashboard; the toggle must reopen it. Replay is available. Reduced motion should show the full answer without typing.

This is a **scripted concept**. Hal, the plan terms, date, and card path are example data, not a verified member record or live coverage lookup. Its caption must make that distinction clear. On `/work`, use the same compact side-by-side presentation as Home rather than a full-width demo.

## Before adding or revising a showcase

1. Check the current `content/projects.ts`, `CONTENT.md`, image assets, and the existing Home and Work compositions. New screenshots and user corrections supersede older generated concepts.
2. Identify whether the visual is a capture, user-supplied reference, or illustrative concept. Caption it accordingly; do not invent metrics, account records, or outcomes.
3. Reuse the correct saved brand asset and the relevant product's inner design system. Preserve the Hire outer frame and project-specific composition.
4. Check the rendered result on **both** routes at the four responsive widths above. Confirm the essential story, images, window/device proportions, animation states, focus, reduced motion, and lack of horizontal overflow.

### Gradly Mobile App (2026-09-24 correction)

The eight-screen user-supplied artwork at `public/images/gradly-mobile-reference.png` guides this showcase. Show the supplied Sign In, Home, and Find Providers assets directly in the three phones; the Sign In SVG replaces the illustrative redraw. Keep the three complete screens inside a compact side-by-side Work visual. Restore the subtle drafting grid behind the devices without adding noise grain. Match the iPhone frame, status island, system indicators, and home indicator to the Claim Journey illustration. Treat sample account details and claim timing as illustrative; do not publish the artwork's figures, testimonial, or store badges as verified outcomes.
