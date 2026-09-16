# Links
Read docs/architecture.md, docs/design.md and docs/deployment.md before changes.
Independent redirect application, port 3002. No public management APIs or analytics readers.
Only the restricted links_runtime PostgreSQL credential belongs here.
Never persist raw IP, full user agent, or referrer query strings. Redirects must survive analytics failures.
