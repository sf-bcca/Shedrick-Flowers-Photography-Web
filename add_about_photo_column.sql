-- Add about_photo_url column to settings table
-- Run this in Supabase SQL Editor

ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_photo_url TEXT;

-- Update the comment for documentation
COMMENT ON COLUMN settings.about_photo_url IS 'URL to the photo displayed on the About page';
