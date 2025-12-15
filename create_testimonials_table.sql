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

-- Create optimized RLS policies (no overlapping policies)
-- Public read access
CREATE POLICY "Anyone can view testimonials"
ON testimonials
FOR SELECT
USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert testimonials"
ON testimonials
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update testimonials"
ON testimonials
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete testimonials"
ON testimonials
FOR DELETE
TO authenticated
USING (true);
