# Design and content

Admin is a light, dense link-operations workspace influenced by the clarity and compact rhythm of contemporary link-management dashboards. It remains an Animesh-owned product: the `a.` mark, original copy, product scope, icons, and visual implementation are local. Rebrandly trademarks, artwork, logos, and copy are not used.

## Visual system

- Near-black (`#17181c`) carries primary text and default actions. Electric cobalt (`#175cff`) marks navigation, primary creation, active analytics, links, focus-adjacent emphasis, and chart trends.
- The application workspace is pale blue-lilac (`#f3f4ff`). White surfaces use thin cool-gray rules, restrained one-pixel shadows, and 10–12px radii. Modal surfaces use 14px radii.
- Purple, teal, pink, and yellow are status colors only. They distinguish migrated, active/native, deleted/error, and summary categories without becoming decorative page themes.
- Typography uses the existing system stack. Headings are compact and direct; control and table labels use small, strong text for repeat-workflow scanning. No font dependency is introduced.
- Interface icons are app-local outline SVG components. Familiar icon-only actions always include semantic labels, visible hover/focus tooltips, and status announcements where state changes.

## Density and hierarchy

The authenticated shell is a 60px horizontal navigation bar containing the `a.` product mark, active Links destination, workspace context, and owner/sign-out controls. The first useful directory viewport contains the concise title, Create link action, six compact metrics, one filter toolbar, and dense records. Rankings follow the directory.

Desktop records show title, short URL, destination, source, click count, last click, and copy/open/QR actions. The short URL and destination truncate visually but remain available to assistive technology and wrap on narrow layouts. Detail pages prioritize identity and the short-link action cluster, followed by settings and analytics.

## Responsive behavior

- Below 1100px, metrics become a 3×2 grid and the desktop filter toolbar wraps deliberately.
- Below 768px, workspace gutters tighten, records become stacked two-column cards, and all filters move into a native disclosure panel. The top navigation remains horizontal; secondary workspace/owner text is removed while the destination and sign-out action remain available.
- Page-level horizontal overflow is forbidden. Event tables and the hourly heatmap retain explicitly labeled, keyboard-focusable internal scroll regions because their data needs fixed columns.
- Charts are fluid inside their surfaces. Validate document, body, chart, table-card, and dialog bounds at 375, 768, 1024, and 1440 CSS pixels and at 200% text enlargement.

## Interaction states

Controls have distinct default, hover, active, disabled, and visible focus states. Primary actions use cobalt or near-black; secondary actions remain white with gray rules. Successful saves use a teal status surface, request failures use pink, and loading uses a labeled reduced-motion-safe progress state. Empty and route-error states pair concise recovery copy with a direct next action.

Creation and deletion use native modal dialogs. Creation initially focuses Destination URL. Deletion initially focuses Cancel. The browser contains focus within an open modal; Escape, Cancel, close, and backdrop interaction dismiss it and restore focus to the trigger. Deletion remains a separate danger action and states that the path is permanently reserved.

Copy announces success or failure through a polite live region. Tooltips appear on hover and keyboard focus but never replace accessible names. Reduced-motion preferences disable all transitions and animation.

## Analytics and content rules

Overview, Audience, Traffic, and Events retain their existing query-string behavior, range selection, pagination, calculations, and disclosures. Trends and breakdown bars use shared cobalt chart tokens; heatmaps use cobalt intensity; geography stays muted so recorded locations lead visually. Every chart retains an accessible text alternative or data table.

Never imply verified human visits. Display Unknown metadata, estimated visitors, India timezone, included bots, and best-effort recording explicitly. Do not fabricate commercial content or production data.
