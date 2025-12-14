import { createClient } from '@supabase/supabase-js';
import { PortfolioItem, BlogPost, ServiceTier } from '../types';

// Access environment variables using Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Missing Supabase URL or Key. Check .env file and RESTART terminal.");
    // Prevent crash by providing a dummy client or valid-but-useless one if possible, 
    // OR just let it throw but give a better error message in the console.
}

// Ensure we don't crash the entire app if keys are missing (common during setup)
export const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey)
    : createClient('https://placeholder.supabase.co', 'placeholder'); // Fallback to prevent 'URL required' throw


// --- Generic CRUD Wrappers (Direct Supabase Calls) ---

export const fetchData = async (table: 'portfolio' | 'blog' | 'services') => {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) {
        console.error(`Error fetching ${table}:`, error);
        return [];
    }
    return data || [];
};

export const createItem = async (table: 'portfolio' | 'blog' | 'services', item: any) => {
    // Remove ID if present to let DB auto-increment or gen UUID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...dataToInsert } = item;
    return await supabase.from(table).insert([dataToInsert]).select();
};

export const updateItem = async (table: 'portfolio' | 'blog' | 'services', id: string, updates: any) => {
    return await supabase.from(table).update(updates).eq('id', id);
};

export const deleteItem = async (table: 'portfolio' | 'blog' | 'services', id: string) => {
    return await supabase.from(table).delete().eq('id', id);
};

export const fetchPostById = async (id: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase.from('blog').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
    return data;
};

export const fetchRelatedPosts = async (currentPostId: string, category: string): Promise<BlogPost[]> => {
    let relatedPosts: BlogPost[] = [];
    const LIMIT = 3;

    // 1. Fetch posts with the same category, excluding current post
    const { data: categoryData, error: categoryError } = await supabase
        .from('blog')
        .select('*')
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

        // We use not.in to exclude current post and already fetched related posts
        // Note: Supabase JS library syntax for 'not.in' might be filter('id', 'not.in', '(' + list + ')') or similar depending on version,
        // but .not('id', 'in', '(' + existingIds.join(',') + ')') is standard.
        // Actually, Supabase JS uses .not('column', 'operator', value). Operator 'in' expects array in ().
        // Safer way is .not('id', 'in', existingIds) if the library supports array directly, which v2 does.

        const { data: recentData, error: recentError } = await supabase
            .from('blog')
            .select('*')
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
