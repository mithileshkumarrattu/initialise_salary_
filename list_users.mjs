import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twtrcynbwevqlqavaeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQyMTI4MywiZXhwIjoyMDk4OTk3MjgzfQ.0x92Cf_f4FUY23OzGYduzcDc563kLcnhRBx5ZpSreI4'; // SUPABASE_SERVICE_ROLE_KEY from .env
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }
  
  console.log(`Found ${usersData.users.length} users:`);
  for (const user of usersData.users) {
    console.log(`- Email: ${user.email}, Confirmed: ${!!user.email_confirmed_at}`);
  }
}

run();
