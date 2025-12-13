# Agent Context & Documentation

## Tech Stack
*   **Frontend**: React (v19), Vite, Tailwind CSS
*   **Routing**: React Router v7
*   **Backend**: Supabase (PostgreSQL, Auth, Storage)
*   **State Management**: React Context / Hooks
*   **Icons**: Lucide React
*   **Rich Text**: React Quill
*   **Language**: TypeScript

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

-- Storage Bucket: images
-- Note: You must create a storage bucket named 'images' in the Supabase dashboard manually if it doesn't exist.
-- Set appropriate RLS policies to allow public read and authenticated upload.
```
