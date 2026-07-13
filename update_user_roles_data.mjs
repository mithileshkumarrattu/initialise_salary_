import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twtrcynbwevqlqavaeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQyMTI4MywiZXhwIjoyMDk4OTk3MjgzfQ.0x92Cf_f4FUY23OzGYduzcDc563kLcnhRBx5ZpSreI4'; // SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function updateRoleData() {
  console.log("Fetching all users from public.users...");
  const { data: users, error: userError } = await supabaseAdmin.from('users').select('id, email');
  if (userError) {
    console.error("Error fetching users:", userError);
    return;
  }
  
  if (!users || users.length === 0) {
    console.log("No users found.");
    return;
  }
  
  console.log(`Found ${users.length} users. Updating role to DIRECTOR for all test users...`);

  for (const user of users) {
    console.log(`Updating ${user.email}...`);
    // default everyone to DIRECTOR for now since they are all signup/test accounts
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ role: 'DIRECTOR' })
      .eq('id', user.id);
      
    if (updateError) {
      console.error(`Failed to update ${user.email}:`, updateError.message);
    } else {
      console.log(`Successfully updated ${user.email}`);
    }
  }
  
  console.log("All done!");
}

updateRoleData();
