-- Add hero_image_url and avatar_url columns to settings table
-- Run this in Supabase SQL Editor

-- Add the hero_image_url column
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- Add the avatar_url column
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comments to document the columns
COMMENT ON COLUMN settings.hero_image_url IS 'URL of the hero image displayed on the home page';
COMMENT ON COLUMN settings.avatar_url IS 'URL of the avatar photo displayed on the home page';
