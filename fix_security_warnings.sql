-- Fix "Function Search Path Mutable" warning
-- Run this command in the Supabase SQL Editor to fix the warning on your existing database.
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
