-- Quick fix: Drop and recreate the settings table with all columns
-- Run this in Supabase SQL Editor

-- Drop the table completely
DROP TABLE IF EXISTS settings CASCADE;

-- Recreate with all columns including updated_at
CREATE TABLE settings (
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
VALUES (1, 'Lens & Light', '', 'admin@lensandlight.com');

-- Create auto-update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read settings"
ON settings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update settings"
ON settings FOR UPDATE TO authenticated
USING (id = 1) WITH CHECK (id = 1);

CREATE POLICY "Authenticated users can insert settings"
ON settings FOR INSERT TO authenticated
WITH CHECK (id = 1);
