# Agent Context & Documentation

## Tech Stack
*   **Frontend**: React (v19), Vite, Tailwind CSS (CDN)
*   **Routing**: React Router v7
*   **Backend**: Supabase (PostgreSQL, Auth, Storage)
*   **State Management**: React Context / Hooks
*   **Icons**: Lucide React
*   **Rich Text**: @tiptap/react
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
    content TEXT, -- Rich text content (HTML)
    status TEXT DEFAULT 'Draft', -- 'Draft' or 'Published'
    tags TEXT[] DEFAULT '{}',
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
    id INTEGER PRIMARY KEY DEFAULT 1, -- Single row for global settings
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
    CONSTRAINT single_row_check CHECK (id = 1)
);

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
```
