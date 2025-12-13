-- Create testimonials table if it doesn't exist
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

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so they can be displayed on the website)
CREATE POLICY "Public can view testimonials"
ON testimonials
FOR SELECT
USING (true);

-- Allow authenticated users to insert, update, delete (Admin management)
CREATE POLICY "Authenticated users can manage testimonials"
ON testimonials
FOR ALL
USING (auth.role() = 'authenticated');
