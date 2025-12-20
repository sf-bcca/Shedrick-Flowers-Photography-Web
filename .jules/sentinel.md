## 2024-05-23 - Information Disclosure (Blog Drafts)
**Vulnerability:** The `blog` table's RLS policy allowed public access to all rows (`USING (true)`), and the frontend `fetchData` function fetched all posts regardless of status. This meant "Draft" posts were visible to anyone visiting the blog page or inspecting network requests.
**Learning:** "Application-level filtering" (comment found in schema) is not a security control. Always enforce data visibility constraints at the database level (RLS) and the data access layer.
**Prevention:**
1. Use RLS policies that strictly enforce `status = 'Published'` for public roles.
2. Create specific data fetching functions (e.g., `fetchPublishedBlogPosts`) that include `.eq('status', 'Published')` to prevent accidental exposure and improve query performance.

## 2025-12-17 - Insecure Database Policies (Drafts & Comments)
**Vulnerability:** The `blog` table relied on application-side filtering for drafts (`USING (true)`), and the `comments` table lacked RLS entirely, potentially exposing all comments and PII (emails) to the public.
**Learning:** SQL schemas should be treated as the source of truth for security. Comments like "Application level filtering" are red flags. Empty table definitions in schemas often imply missing security policies.
**Prevention:**
1. Default to `ENABLE ROW LEVEL SECURITY` for all tables immediately upon creation.
2. Define explicit policies for every table, even if "unused" or "internal only".
3. Use strict conditions (`status = 'Published'`, `status = 'approved'`) in RLS `USING` clauses.

## 2025-12-25 - Hardcoded Secrets & Missing Validation (Contact Form)
**Vulnerability:** A Web3Forms access key was hardcoded in `src/pages/Contact.tsx`. Additionally, the contact form lacked input length validation (`maxLength`), exposing the backend to potential DoS or spam payloads.
**Learning:** "Public" keys (like form service tokens) should still be managed as environment variables to facilitate rotation and prevent accidental exposure of more sensitive keys. Frontend validation is the first line of defense against abuse.
**Prevention:**
1. Always use `import.meta.env` for external service keys.
2. Enforce `maxLength` on all user inputs (especially textareas) to prevent large payload attacks.

## 2025-12-19 - Nginx Security Headers
**Vulnerability:** Missing standard security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) in the Nginx configuration, leaving the application vulnerable to Clickjacking and MIME sniffing.
**Learning:** Default Nginx configurations for SPAs typically prioritize functionality over security. Hardening headers must be explicitly added.
**Prevention:**
1. Add `add_header` directives with the `always` parameter in `nginx.conf`.
2. Explicitly define `X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff`.

## 2025-12-20 - Unsafe SQL Query Construction
**Vulnerability:** The `fetchRelatedPosts` function manually constructed a Postgres tuple string for the `IN` filter (e.g., `.not('id', 'in', \`(${ids})\`)`), mimicking SQL injection patterns. While currently using trusted data (UUIDs), this pattern is brittle and risky if inputs change.
**Learning:** Supabase/PostgREST clients support array arguments for `in` filters directly. Manual string construction for SQL-like syntax is unnecessary and dangerous.
**Prevention:**
1. Always use the client library's native parameter binding (e.g., `.not('id', 'in', array)`).
2. Avoid string interpolation in database query builders.
