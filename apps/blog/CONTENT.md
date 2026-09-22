# Content contract

Only My Blog Posts is read. Fields: title (title), slug/description (rich_text), published (checkbox), tags (multi_select), thumbnail (files), createdAt (date; created_time still accepted). No schema writes. Dates/order use createdAt, not migration time. Descriptions are shortened for the index only. Legacy br markers become line breaks; arbitrary HTML is displayed as text.

Public entries require published=true, a nonempty title, a valid date and a lowercase hyphenated unique slug. Conflicts exclude every conflicting public entry, with fixed, sanitized diagnostics. Draft slugs do not conflict with published entries. Reserved route names are excluded. Reading estimates include recursively retrieved block text at 220 words/minute.

Inspection fixtures were read through the Notion connector on 2026-09-17. They include all seven published articles and original slugs. Connector markup is converted only for development QA; live rendering uses API block objects. Uploaded signed URLs have been replaced with fixture.invalid references and an explicitly labeled illustration. External GIF references remain original. This is not a live synchronization or production fallback.

See fixtures/README.md for known snapshot differences. Never treat older technical articles as updated guidance or edit their wording as part of rendering fixes.
