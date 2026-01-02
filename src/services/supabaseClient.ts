import { createClient } from '@supabase/supabase-js';
import { PortfolioItem, BlogPost, ServiceTier, Settings } from '../types';

// Access environment variables using Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Missing Supabase URL or Key. Check .env file and RESTART terminal.");
}

/**
 * Global Supabase Client Instance
 * Handles connection to Supabase backend for database, auth, and storage.
 *
 * @remarks
 * This client is initialized with credentials from environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
 * If these variables are missing (e.g., during build time or misconfiguration), it falls back to a
 * placeholder client ('https://placeholder.supabase.co') to prevent the application from crashing immediately
 * on import. This allows the UI to render error messages gracefully instead of white-screening.
 */
export const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey)
    : createClient('https://placeholder.supabase.co', 'placeholder');

// --- Generic CRUD Wrappers (Direct Supabase Calls) ---

/**
 * Fetch global site settings (row ID 1).
 *
 * @returns {Promise<Settings | null>} The settings object or null if error.
 */
export const fetchSettings = async (): Promise<Settings | null> => {
  // Simple in-memory cache could go here if needed, but react-query is better.
  // For now, we just fetch.
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
  return data as Settings;
};

/**
 * Fetch all records from a specified table.
 *
 * @param table - The name of the table to fetch from (e.g., 'portfolio', 'blog', 'services').
 * @param select - Optional comma-separated string of columns to select (default: '*').
 * @returns {Promise<any[]>} A promise that resolves to an array of records sorted by 'created_at' in descending order.
 */
export const fetchData = async (table: 'portfolio' | 'blog' | 'services', select = '*') => {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${table}:`, error);
    return [];
  }
  return data || [];
};

/**
 * Fetch only published blog posts for public display.
 * Prevents drafts from being exposed to the client and optimizes payload size.
 *
 * @returns {Promise<BlogPost[]>} List of published blog posts sorted by date.
 */
export const fetchPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  // We exclude 'content' to make the list payload smaller
  const { data, error } = await supabase
    .from('blog')
    .select('id, title, category, date, image, excerpt, tags, status, created_at')
    .eq('status', 'Published')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  return data as BlogPost[];
};

/**
 * Create a new record in the specified table.
 *
 * @param table - The target database table.
 * @param item - The data object to insert.
 * @returns {Promise<any>} The response from Supabase, containing `data` (the inserted row).
 * @throws Will throw an error if the insertion fails.
 */
export const createItem = async (table: 'portfolio' | 'blog' | 'services', item: any) => {
  // If the item doesn't have an ID, we could generate one or let DB do it.
  // Supabase defaults usually handle UUID generation if configured.
  const { data, error } = await supabase
    .from(table)
    .insert([item])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

/**
 * Update an existing record by its ID.
 *
 * @param table - The target database table.
 * @param id - The UUID of the record to update.
 * @param updates - An object containing the fields to update.
 * @returns {Promise<any>} The response from Supabase.
 * @throws Will throw an error if the update fails.
 */
export const updateItem = async (table: 'portfolio' | 'blog' | 'services', id: string, updates: any) => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

/**
 * Delete a record by its ID.
 *
 * @param table - The target database table.
 * @param id - The UUID of the record to delete.
 * @throws Will throw an error if the deletion fails.
 */
export const deleteItem = async (table: 'portfolio' | 'blog' | 'services', id: string) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

/**
 * Fetch a single blog post by its ID.
 * @param id - The UUID of the blog post.
 * @returns {Promise<BlogPost | null>} The blog post data or null if error/not found.
 */
export const fetchPostById = async (id: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase.from('blog').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
    return data;
};

/**
 * Fetch related blog posts based on category with a smart fallback strategy.
 *
 * @param currentPostId - The UUID of the post currently being viewed.
 * @param category - The category of the current post.
 * @returns {Promise<BlogPost[]>} Array of related blog posts (up to 3).
 */
export const fetchRelatedPosts = async (currentPostId: string, category: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog')
    .select('id, title, category, date, image, excerpt, status')
    .eq('category', category)
    .eq('status', 'Published')
    .neq('id', currentPostId)
    .limit(3);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
  return data as BlogPost[];
};
