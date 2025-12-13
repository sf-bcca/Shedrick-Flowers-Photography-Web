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
