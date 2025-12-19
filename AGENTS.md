# Agent Context & Documentation

## Tech Stack

- **Frontend**: React (v19), Vite, Tailwind CSS (CDN)
- **Routing**: React Router v7
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context / Hooks
- **Icons**: Lucide React, Material Symbols (Google Fonts)
- **Rich Text**: @tiptap/react
- **Language**: TypeScript

## Database Schema (Supabase)

The following SQL schema represents the current structure of the Supabase database.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: portfolio
CREATE TABLE IF NOT EXISTS portfolio (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    "marginTop" BOOLEAN DEFAULT FALSE,
    "marginTopInverse" BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on portfolio
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view portfolio"
ON portfolio
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Authenticated users can manage portfolio"
ON portfolio
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Table: blog
CREATE TABLE IF NOT EXISTS blog (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    image TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    status TEXT DEFAULT 'Draft',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on blog
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage blog posts"
ON blog
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view published blog posts"
ON blog
FOR SELECT
TO anon
USING (status = 'Published');

-- Table: services
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage services"
ON services
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view services"
ON services
FOR SELECT
TO anon
USING (true);

-- Table: settings
-- Global configuration for the site
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_title TEXT,
    site_description TEXT,
    logo_url TEXT,
    hero_image_url TEXT,
    avatar_url TEXT,
    favicon_url TEXT,
    about_photo_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_address_street TEXT,
    contact_address_city TEXT,
    contact_address_state TEXT,
    contact_address_zip TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Initialize default settings row
INSERT INTO settings (id, site_title, site_description, contact_email)
VALUES (1, 'Shedrick Flowers Photography', 'Capturing moments in time.', 'shedrick@shedrickflowers.com')
ON CONFLICT (id) DO NOTHING;

-- Auto-update updated_at for settings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
ON settings
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can update settings"
ON settings
FOR UPDATE
TO authenticated
USING (id = 1)
WITH CHECK (id = 1);

CREATE POLICY "Authenticated users can insert settings"
ON settings
FOR INSERT
TO authenticated
WITH CHECK (id = 1);

-- Table: comments
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    post_id UUID REFERENCES blog(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert comments"
ON comments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can view approved comments"
ON comments
FOR SELECT
USING (status = 'approved');

CREATE POLICY "Authenticated users can manage comments"
ON comments
FOR ALL
USING (auth.role() = 'authenticated');

-- Table: testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_name TEXT NOT NULL,
    subtitle TEXT,
    quote TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view testimonials"
ON testimonials
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage testimonials"
ON testimonials
FOR ALL
USING (auth.role() = 'authenticated');

-- Table: contact_submissions
-- Stores contact form submissions from website visitors
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    date_preference DATE,
    shoot_type TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on contact_submissions
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit (INSERT)
CREATE POLICY "Anyone can submit contact form"
ON contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view submissions
CREATE POLICY "Authenticated users can view submissions"
ON contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update submissions
CREATE POLICY "Authenticated users can update submissions"
ON contact_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Storage Bucket Policies (SQL representation)
-- Note: These policies assume a bucket named 'images' exists.
-- You must create the bucket in Supabase Dashboard -> Storage.

-- Allow authenticated uploads to 'images' bucket
-- CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow public reads from 'images' bucket
-- CREATE POLICY "Allow public reads" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated updates/deletes
-- CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated updates" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
```
