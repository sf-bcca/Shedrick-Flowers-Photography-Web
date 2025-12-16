## 2024-05-23 - Information Disclosure (Blog Drafts)
**Vulnerability:** The `blog` table's RLS policy allowed public access to all rows (`USING (true)`), and the frontend `fetchData` function fetched all posts regardless of status. This meant "Draft" posts were visible to anyone visiting the blog page or inspecting network requests.
**Learning:** "Application-level filtering" (comment found in schema) is not a security control. Always enforce data visibility constraints at the database level (RLS) and the data access layer.
**Prevention:**
1. Use RLS policies that strictly enforce `status = 'Published'` for public roles.
2. Create specific data fetching functions (e.g., `fetchPublishedBlogPosts`) that include `.eq('status', 'Published')` to prevent accidental exposure and improve query performance.
