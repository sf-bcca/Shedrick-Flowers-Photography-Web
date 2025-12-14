-- Fix Supabase Performance Warnings for testimonials table
-- Run this in Supabase SQL Editor to optimize RLS policies

-- Drop existing overlapping policies
DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;

-- Create optimized non-overlapping policies
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
