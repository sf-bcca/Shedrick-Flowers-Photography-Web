import { createClient } from '@supabase/supabase-js';

// Support both VITE_ prefixed variables (for client) and standard ones
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
  console.error('   Ensure you are running with: node --env-file=.env verify-supabase.js');
  process.exit(1);
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
