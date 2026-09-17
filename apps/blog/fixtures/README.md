# Development inspection snapshots

All seven My Blog Posts pages were inspected through the connector, with no writes. articles.json retains sanitized connector body text; posts.json is a generated, app-local block fixture. Regenerate with `pnpm --filter animesh-blog exec tsx scripts/generate-fixtures.ts`.

The connector returns Markdown rather than API blocks. The fixture converter preserves text, code, inline formatting, headings, lists and image locations; callouts become quotes and uploaded images get labeled placeholders. This is useful for reader QA but cannot establish live block fidelity. Live API renderer separately covers callouts, tables, toggles, nested blocks and formatted captions with explicit unit fixtures. No signed uploaded URL is retained. No synthetic draft is presented as real content.

Inspected articles: Clustering Cookbook; useMemo; Dragon Ball/Imposter Syndrome; useLayoutEffect; useEffect; useState; Next.js/Tailwind setup. All were published, with valid unique slugs. React language names use JSX highlighting so the existing examples remain legible. Original code is neither executed nor repaired.
