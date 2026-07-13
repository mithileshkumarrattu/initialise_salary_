import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twtrcynbwevqlqavaeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQyMTI4MywiZXhwIjoyMDk4OTk3MjgzfQ.0x92Cf_f4FUY23OzGYduzcDc563kLcnhRBx5ZpSreI4'; // SUPABASE_SERVICE_ROLE_KEY

async function run() {
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
  const json = await res.json();
  console.log(Object.keys(json.definitions));
}

run();
