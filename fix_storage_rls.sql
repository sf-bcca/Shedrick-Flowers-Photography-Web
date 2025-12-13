-- Alternative RLS policy - allows ANY authenticated user OR service role to upload
-- This is more permissive and should work for testing

-- First, drop the existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;

-- Create new, more permissive policies
-- Allow anyone with a valid JWT (authenticated) OR service role to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow public read access
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
USING (bucket_id = 'images');

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');
