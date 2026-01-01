import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Connection Verification Script
 *
 * This script is used to verify that the local environment is correctly configured
 * to connect to the Supabase instance. It checks for the presence of environment
 * variables and attempts a test query against the 'settings' table.
 *
 * Usage:
 * node --env-file=.env verify-supabase.js
 */

// Support both VITE_ prefixed variables (for client) and standard ones
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const web3FormsKey = process.env.VITE_WEB3FORMS_ACCESS_KEY || process.env.WEB3FORMS_ACCESS_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
  console.error('   Ensure you are running with: node --env-file=.env verify-supabase.js');
  process.exit(1);
}

// Check for optional but recommended variables
if (!web3FormsKey) {
  console.warn('⚠️  Warning: VITE_WEB3FORMS_ACCESS_KEY is missing.');
  console.warn('   The Contact form will not be able to send emails.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  console.log('🔄 Attempting to connect to Supabase...');

  const { data, error } = await supabase
    .from('settings')
    .select('site_title')
    .limit(1);

  if (error) {
    console.error('❌ Connection Failed:', error.message);
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log(`✅ Supabase Connection Successful: ${data[0].site_title}`);
  } else {
    console.log('✅ Supabase Connection Successful: Connected, but settings table is empty.');
  }
}

verifyConnection();
