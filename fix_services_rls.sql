-- Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view services)
CREATE POLICY "Public can view services"
ON services
FOR SELECT
USING (true);

-- Allow authenticated users to manage services (insert, update, delete)
CREATE POLICY "Authenticated users can manage services"
ON services
FOR ALL
USING (auth.role() = 'authenticated');
