import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twtrcynbwevqlqavaeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQyMTI4MywiZXhwIjoyMDk4OTk3MjgzfQ.0x92Cf_f4FUY23OzGYduzcDc563kLcnhRBx5ZpSreI4'; // SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.rpc('get_users_columns'); // doesn't exist probably
  
  // instead let's just insert an empty record to get the full error, or we can use fetch on the REST API to get the OpenAPI spec
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
  const json = await res.json();
  const usersDef = json.definitions.users;
  console.log(JSON.stringify(usersDef.properties, null, 2));
}

run();
