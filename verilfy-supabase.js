// verify-supabase.js
const { createClient } = require('@supabase/supabase-js');

// 1. Setup the client using the environment variables Jules has access to
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using Service Role to ensure we can read everything for the test

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  console.log('🔄 Attempting to connect to Supabase...');

  // 2. Simple query: List all tables (internal Supabase check)
  // This is a generic query that works on any Supabase instance
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('*')
    .limit(1);

  // Note: If you have existing tables, you can change 'information_schema.tables'
  // to a real table name like 'users' or 'profiles' for a better test.

  if (error) {
    console.error('❌ Connection Failed:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Connection Successful!');
    console.log('   Supabase responded with data, confirming keys are valid.');
  }
}

verifyConnection();