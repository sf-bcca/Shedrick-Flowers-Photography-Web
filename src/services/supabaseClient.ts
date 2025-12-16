import { createClient } from '@supabase/supabase-js';
import { PortfolioItem, BlogPost, ServiceTier } from '../types';

// Access environment variables using Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Missing Supabase URL or Key. Check .env file and RESTART terminal.");
}

/**
 * Global Supabase Client Instance
 * Handles connection to Supabase backend for database, auth, and storage.
 * Falls back to a placeholder client if keys are missing to prevent immediate crash.
 */
export const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey)
    : createClient('https://placeholder.supabase.co', 'placeholder');

// --- Generic CRUD Wrappers (Direct Supabase Calls) ---

/**
 * Fetch all records from a specified table.
 * @param table - The name of the table ('portfolio', 'blog', 'services').
 * @returns {Promise<any[]>} List of records sorted by creation date (descending).
 */
export const fetchData = async (table: 'portfolio' | 'blog' | 'services') => {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) {
        console.error(`Error fetching ${table}:`, error);
        return [];
    }
    return data || [];
};

/**
 * Fetch only published blog posts for public display.
 * Prevents drafts from being exposed to the client.
 * @returns {Promise<BlogPost[]>} List of published blog posts.
 */
export const fetchPublishedBlogPosts = async (): Promise<BlogPost[]> => {
    // Select specific fields to avoid fetching large 'content' field
    const { data, error } = await supabase
        .from('blog')
        .select('id, title, category, date, image, excerpt')
        .eq('status', 'Published')
        .order('date', { ascending: false }); // Use publish date for ordering

    if (error) {
        console.error('Error fetching published blog posts:', error);
        return [];
    }
    return data || [];
};

/**
 * Create a new record in the specified table.
 * @param table - The target table.
 * @param item - The data object to insert. Note: 'id' is automatically stripped to allow DB generation.
 * @returns {Promise<any>} The Supabase response object.
 */
export const createItem = async (table: 'portfolio' | 'blog' | 'services', item: any) => {
    // Remove ID if present to let DB auto-increment or gen UUID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...dataToInsert } = item;
    return await supabase.from(table).insert([dataToInsert]).select();
};

/**
 * Update an existing record.
 * @param table - The target table.
 * @param id - The UUID of the record to update.
 * @param updates - Object containing fields to update.
 * @returns {Promise<any>} The Supabase response object.
 */
export const updateItem = async (table: 'portfolio' | 'blog' | 'services', id: string, updates: any) => {
    return await supabase.from(table).update(updates).eq('id', id);
};

/**
 * Delete a record by ID.
 * @param table - The target table.
 * @param id - The UUID of the record to delete.
 * @returns {Promise<any>} The Supabase response object.
 */
export const deleteItem = async (table: 'portfolio' | 'blog' | 'services', id: string) => {
    return await supabase.from(table).delete().eq('id', id);
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
 * Fetch related blog posts based on category.
 * Logic:
 * 1. Tries to find up to 3 posts in the same category (excluding current post).
 * 2. If fewer than 3 found, fills the remaining slots with the most recent posts (excluding current & already found).
 *
 * @param currentPostId - The ID of the post currently being viewed.
 * @param category - The category of the current post.
 * @returns {Promise<BlogPost[]>} Array of related blog posts (max 3).
 */
export const fetchRelatedPosts = async (currentPostId: string, category: string): Promise<BlogPost[]> => {
    let relatedPosts: BlogPost[] = [];
    const LIMIT = 3;

    // 1. Fetch posts with the same category, excluding current post AND only Published
    const { data: categoryData, error: categoryError } = await supabase
        .from('blog')
        .select('id, title, category, date, image, excerpt')
        .eq('status', 'Published') // Security: Only show published posts
        .eq('category', category)
        .neq('id', currentPostId)
        .limit(LIMIT);

    if (categoryError) {
        console.error('Error fetching related posts (category):', categoryError);
    } else if (categoryData) {
        relatedPosts = categoryData;
    }

    // 2. If we don't have enough posts, fill with recent posts
    if (relatedPosts.length < LIMIT) {
        const remaining = LIMIT - relatedPosts.length;
        const existingIds = [currentPostId, ...relatedPosts.map(p => p.id)];

        const { data: recentData, error: recentError } = await supabase
            .from('blog')
            .select('id, title, category, date, image, excerpt')
            .eq('status', 'Published') // Security: Only show published posts
            .not('id', 'in', `(${existingIds.map(id => `"${id}"`).join(',')})`) // Format for Postgres IN
            .order('created_at', { ascending: false })
            .limit(remaining);

        if (recentError) {
            console.error('Error fetching related posts (recent fallback):', recentError);
        } else if (recentData) {
            relatedPosts = [...relatedPosts, ...recentData];
        }
    }

    return relatedPosts;
};
