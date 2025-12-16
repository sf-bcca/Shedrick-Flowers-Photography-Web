-- Fix Information Disclosure Vulnerability: Restrict public access to Published posts only

-- Drop potentially insecure policies (both names found in repo history)
DROP POLICY IF EXISTS "Public can view all blog posts" ON blog;
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog;

-- Create secure policy for public access
-- Only rows where status is 'Published' are visible to anonymous/public users
CREATE POLICY "Public can view published blog posts"
ON blog
FOR SELECT
USING (status = 'Published');

-- Ensure authenticated users (admins) can still manage everything
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog;

CREATE POLICY "Authenticated users can manage blog posts"
ON blog
FOR ALL
USING (auth.role() = 'authenticated');
