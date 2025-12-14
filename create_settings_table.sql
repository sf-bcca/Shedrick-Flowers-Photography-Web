-- Updated settings table creation with auto-updating timestamp
-- Run this in Supabase SQL Editor

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_title TEXT,
    site_description TEXT,
    logo_url TEXT,
    contact_email TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Insert default row
INSERT INTO settings (id, site_title, site_description, contact_email)
VALUES (1, 'Lens & Light', '', 'admin@lensandlight.com')
ON CONFLICT (id) DO NOTHING;

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql' SET search_path = '';

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read settings" ON settings;
DROP POLICY IF EXISTS "Authenticated users can update settings" ON settings;
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON settings;

-- Allow anyone to read settings
CREATE POLICY "Anyone can read settings"
ON settings
FOR SELECT
USING (true);

-- Allow authenticated users to update settings
CREATE POLICY "Authenticated users can update settings"
ON settings
FOR UPDATE
TO authenticated
USING (id = 1)
WITH CHECK (id = 1);

-- Allow authenticated users to insert settings (for upsert)
CREATE POLICY "Authenticated users can insert settings"
ON settings
FOR INSERT
TO authenticated
WITH CHECK (id = 1);
