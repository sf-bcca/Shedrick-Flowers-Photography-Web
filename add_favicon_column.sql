-- Add favicon_url column to settings table
-- Run this in Supabase SQL Editor

ALTER TABLE settings ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- Update the comment for documentation
COMMENT ON COLUMN settings.favicon_url IS 'URL to the site favicon image';
