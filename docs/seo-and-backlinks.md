# Search visibility and earned links

The public search surfaces are www.animesh.cc (professional identity), hire.animesh.cc (consulting), and blog.animesh.cc (writing). Keep those search intents and visual systems independent. Admin, owner previews, development fixtures, and redirect operations remain excluded. API routes are not landing pages.

## Technical implementation

Portfolio and Hire now serve app-local /sitemap.xml and /robots.txt. Public pages have canonical URLs, titles, descriptions, social images, and schema describing the visible person/service. Blog retains its published-only article/tag sitemap, article canonicals and BlogPosting schema, with tag descriptions and static image compression added. Blog public media can be crawled; owner media remains noindex and private/no-store. One primary heading is retained when the Portfolio Ask drawer opens. Article heading rendering prevents skipped levels without changing Notion wording or IDs.

Existing lowercase hyphenated article slugs are validated at publication. Preserve published URLs and createdAt dates; do not rename them for speculative SEO gains. Any future rename needs a permanent redirect, plus updates to canonical, sitemap, and inbound internal links.

Portfolio's consulting link now leads to Hire. Public footers connect writing, portfolio, consulting and privacy where relevant. Thumbnails alongside article titles intentionally use empty alt text to avoid repeating the same link label. Article images use their authored Notion captions; missing captions still need a human description of the actual image rather than invented text. Portfolio/Hire visuals are native SVG/HTML rather than large raster photos. New share images render as 1200×630 PNGs through Next's ImageResponse.

HTTP requests to all five live domains were checked on 2026-09-18: each redirected to HTTPS and the HTTPS response sent HSTS. HTTPS enforcement is already provided by Vercel.

## Search Console handoff

The `animesh.cc` DNS Domain property was inspected on 2026-09-18. Search Console reports Animesh Sharma as a verified owner and says the property was added that day. Performance, indexing, crawl and Core Web Vitals reports are still processing. Search Console also reports no live `robots.txt`, consistent with the new Portfolio and Hire routes still awaiting deployment.

The optional `GOOGLE_SITE_VERIFICATION` metadata support remains available for URL-prefix properties, but the verified Domain property already covers all protocols and subdomains.

The Blog sitemap is already live. After deploying this branch, verify the first two URLs resolve successfully and submit all three if they are not already listed:

- https://www.animesh.cc/sitemap.xml
- https://hire.animesh.cc/sitemap.xml
- https://blog.animesh.cc/sitemap.xml

Inspect the homepages and representative article/tag URLs. Confirm Google's selected canonical, rendered content, indexing eligibility, and crawl status. Keep private routes out of submissions. Check the field Core Web Vitals report after enough real traffic: p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Local screenshots/builds cannot certify these field metrics.

## 90-day earned backlinks plan

| Period | Work | Destination | Evidence to collect |
| --- | --- | --- | --- |
| Weeks 1–2 | Update owned GitHub profile and relevant project READMEs with a factual author link and demo explanation. Check LinkedIn website links. | Portfolio homepage | Live referring URL and working target |
| Weeks 2–4 | Publish one source-backed engineering breakdown of VisaFile's persisted job flow and human-controlled browser checkpoints. Include diagrams and constraints; omit unsupported speed claims. | Blog article, linking to project source and Portfolio | Publication URL, referral clicks, relevant referring domains |
| Weeks 4–6 | Publish a reusable automation pattern or small open-source utility supported by real code. Contribute a relevant improvement upstream and follow maintainers' contributor-link policy. | Repository and associated Blog explanation | Accepted contribution and editorial mentions |
| Weeks 6–8 | Prepare a factual Gradly Links case study for Hire using approved commercial copy and verified savings. Ask an existing collaborator for an optional attribution link only after authorizing outreach. | Hire work section or a future substantive case study | Approved attribution, referring URL, qualified inquiries |
| Weeks 8–12 | Share useful technical explanations in communities where you already participate; answer the actual question before linking. Propose a guest technical article to a relevant engineering publication after authorizing outreach. | The most relevant Blog article | Editorial acceptance, useful referral traffic, new relevant domains |

Start with two strong articles rather than thin pages for every keyword. Portfolio owns the name/identity intent; Hire owns product engineering and workflow automation engagements; Blog owns each article's concrete technical question. Link articles to the work they explain using descriptive text. These are proposed content topics, not newly verified accomplishments.

Track opportunities in a sheet with source URL, topic, destination, relevance, relationship, status, published date and referral outcomes. Review monthly in Search Console's Links and Performance reports. Prioritize relevant editorial links and qualified visits; do not buy links, automate unsolicited messages, build link exchanges, or promise ranking outcomes. Outreach is planned, not sent.

References: [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap submission](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals).
