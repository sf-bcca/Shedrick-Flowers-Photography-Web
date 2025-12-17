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
