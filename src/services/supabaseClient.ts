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

// --- Cache Variables ---
let settingsCache: Settings | null = null;
let settingsPromise: Promise<Settings | null> | null = null;

// --- Generic CRUD Wrappers (Direct Supabase Calls) ---

/**
 * Fetch global site settings with caching and request deduplication.
 *
 * @performance Optimization:
 * - Implements the Singleton pattern for settings retrieval.
 * - Deduplicates simultaneous requests from multiple components (Header, Footer, Home) using a shared promise.
 * - Caches the result in memory to prevent redundant network calls during the session.
 *
 * @returns {Promise<Settings | null>} The settings object or null if error.
 */
export const fetchSettings = async (): Promise<Settings | null> => {
    // Return in-memory cache if available
    if (settingsCache) return settingsCache;

    // Return existing promise if request is in flight (deduplication)
    if (settingsPromise) return settingsPromise;

    settingsPromise = (async () => {
        const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (error) {
            console.error("Error fetching settings:", error);
            settingsPromise = null;
            return null;
        }
        settingsCache = data;
        settingsPromise = null;
        return data;
    })();

    return settingsPromise;
};

/**
 * Fetch all records from a specified table.
 *
 * @param table - The name of the table to fetch from (e.g., 'portfolio', 'blog', 'services').
 * @returns {Promise<any[]>} A promise that resolves to an array of records sorted by 'created_at' in descending order.
 *
 * @remarks
 * Returns a generic array `any[]`. The consumer is responsible for casting the result to the appropriate
 * interface (e.g., `as PortfolioItem[]`). If an error occurs, it logs to the console and returns an empty array.
 */
export const fetchData = async (table: 'portfolio' | 'blog' | 'services', select = '*', limit?: number) => {
    let query = supabase.from(table).select(select).order('created_at', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;
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
 * @performance Optimization:
 * - Selects only necessary metadata ('id', 'title', 'category', 'date', 'image', 'excerpt').
 * - Excludes the potentially large 'content' field (rich text HTML) to reduce network payload.
 * - Used primarily for list views (Blog Home, Related Posts).
 *
 * @returns {Promise<BlogPost[]>} List of published blog posts sorted by date.
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
 *
 * @param table - The target database table (e.g., 'portfolio', 'blog').
 * @param item - The data object to insert.
 * @returns {Promise<any>} The response from Supabase, containing `data` (the inserted row) or `error`.
 *
 * @remarks
 * This function automatically strips the `id` field from the input object before insertion,
 * allowing the database to generate a new UUID or auto-incrementing ID.
 * It uses `.select()` to return the inserted record immediately.
 */
export const createItem = async (table: 'portfolio' | 'blog' | 'services', item: any) => {
    // Remove ID if present to let DB auto-increment or gen UUID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...dataToInsert } = item;
    return await supabase.from(table).insert([dataToInsert]).select();
};

/**
 * Update an existing record by its ID.
 *
 * @param table - The target database table.
 * @param id - The UUID (or unique identifier) of the record to update.
 * @param updates - An object containing only the fields to be updated (partial update).
 * @returns {Promise<any>} The response from Supabase.
 */
export const updateItem = async (table: 'portfolio' | 'blog' | 'services', id: string, updates: any) => {
    return await supabase.from(table).update(updates).eq('id', id);
};

/**
 * Delete a record by its ID.
 *
 * @param table - The target database table.
 * @param id - The UUID (or unique identifier) of the record to delete.
 * @returns {Promise<any>} The response from Supabase.
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
 * Fetch related blog posts based on category with a smart fallback strategy.
 *
 * @logic
 * 1. **Primary Strategy**: Attempt to find up to 3 'Published' posts in the same category, excluding the current post.
 * 2. **Fallback Strategy**: If fewer than 3 category matches are found, fill the remaining slots with the most recent 'Published' posts from any category (excluding the current post and those already selected).
 *
 * @security Strictly filters for `status = 'Published'` to ensure drafts are never leaked in related suggestions.
 *
 * @param currentPostId - The UUID of the post currently being viewed (to exclude it from results).
 * @param category - The category of the current post.
 * @returns {Promise<BlogPost[]>} Array of related blog posts (always returns up to 3 items if content exists).
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
            .not('id', 'in', existingIds) // Use array for secure parameter binding
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
