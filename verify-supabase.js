import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment.');
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
