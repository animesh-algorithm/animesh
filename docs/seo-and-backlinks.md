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

### Branded identity audit — 2026-09-25

- The Portfolio homepage serves a `Person` node with `@id` `https://www.animesh.cc/#person` and the owner-confirmed LinkedIn, GitHub, and X profiles in `sameAs`.
- Hire `/about` and the Blog homepage were deployed to their existing production projects on September 25. Live HTML now serves one matching `Person` node on each of the three identity pages, with the confirmed `sameAs` URLs. A live Blog article's `BlogPosting.author` references the same `@id`. The deployments were made from the local worktree and still need to be preserved in Git history.
- All three live home/about routes returned HTTP 200 with canonical links and visible name text. Each live `/robots.txt` and `/sitemap.xml` returned HTTP 200; the sitemaps contained 3 Portfolio, 11 Hire, and 39 Blog URLs. This replaces the older pending-robots observation above for the current live state.
- Search Console's `animesh.cc` Domain property became accessible later on September 25. Its Web Performance report covers September 16–23: 39 total impressions, 0 clicks, and an average position of 8.8 across all queries, all attributed to the Portfolio homepage. The exact query `Animesh Sharma` has 0 impressions and 0 clicks, so it has no measured position; the `animesh` query has 16 impressions and 0 clicks. These are small, early samples, not a stable rank baseline. General web search results showed other people with the same name. Do not infer rank changes from schema validation alone.
- Search Console's page indexing report (last updated September 21) lists one indexed URL, the Portfolio homepage, last crawled September 18. Hire `/about` and the Blog homepage were both reported as unknown to Google on September 25; neither had a referring sitemap detected. All three submitted sitemaps still showed `Couldn't fetch`, last attempted September 18. Direct requests now return HTTP 200, `application/xml`, and parse as valid XML with 3, 11, and 39 URLs respectively; Search Console's Blog sitemap detail gives no more specific cause than `Sitemap could not be read`. September 25 live URL tests found both Hire `/about` and the Blog homepage available to Google and eligible for indexing. Eligibility does not mean either URL is indexed.
- On September 25, Search Console acknowledged resubmission of all three existing sitemaps and indexing requests for the Portfolio homepage, Hire `/about`, and the Blog homepage. The sitemap table immediately still reported `Couldn't fetch`, with September 25 submission dates and zero discovered pages; processing success remains unverified. The indexing requests were added to a priority crawl queue, not indexed immediately.
- Local lint, typecheck, and build passed across the five apps. The root test run still fails on unrelated Portfolio knowledge-manifest and Hire content assertions; resolve those separately before using the full test suite as a release gate.

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
