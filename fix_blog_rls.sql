-- Enable RLS on the blog table
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view published posts (or all posts, filtering handled in app usually, but let's be safe)
-- For now, let's allow public read of all posts, as draft filtering happens in the UI query.
-- Adjust this if you want strict backend enforcement for drafts.
CREATE POLICY "Public can view all blog posts"
ON blog
FOR SELECT
USING (true);

-- Policy to allow authenticated users to do everything (Insert, Update, Delete)
CREATE POLICY "Authenticated users can manage blog posts"
ON blog
FOR ALL
USING (auth.role() = 'authenticated');
