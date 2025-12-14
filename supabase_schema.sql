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

-- Table: blog
CREATE TABLE IF NOT EXISTS blog (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    image TEXT NOT NULL,
    excerpt TEXT,
    content TEXT, -- Assumed content field for rich text
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: services
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    features TEXT[], -- Array of strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: settings
CREATE TABLE IF NOT EXISTS settings (
    id BIGINT PRIMARY KEY DEFAULT 1, -- Single row for global settings
    site_title TEXT,
    site_description TEXT,
    logo_url TEXT,
    contact_email TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Initialize default settings row
INSERT INTO settings (id, site_title, site_description)
VALUES (1, 'Shedrick Flowers Photography', 'Capturing moments in time.')
ON CONFLICT (id) DO NOTHING;

-- Table: comments
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    post_id UUID REFERENCES blog(id) ON DELETE CASCADE, -- Assuming comments are linked to blog posts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- RLS Policies for testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view testimonials"
ON testimonials
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage testimonials"
ON testimonials
FOR ALL
USING (auth.role() = 'authenticated');

-- Storage Bucket: images
-- Note: You must create a storage bucket named 'images' in the Supabase dashboard manually if it doesn't exist.
-- Set appropriate RLS policies to allow public read and authenticated upload.
