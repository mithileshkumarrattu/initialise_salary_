import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twtrcynbwevqlqavaeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQyMTI4MywiZXhwIjoyMDk4OTk3MjgzfQ.0x92Cf_f4FUY23OzGYduzcDc563kLcnhRBx5ZpSreI4'; // SUPABASE_SERVICE_ROLE_KEY from .env
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching users...");
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }
  
  let unconfirmed = 0;
  for (const user of usersData.users) {
    if (!user.email_confirmed_at) {
      console.log(`Confirming user: ${user.email} (${user.id})`);
      const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
        email_confirm: true
      });
      if (error) {
        console.error(`Failed to confirm ${user.email}:`, error);
      } else {
        console.log(`Confirmed ${user.email}!`);
        unconfirmed++;
      }
    }
  }
  
  if (unconfirmed === 0) {
    console.log("No unconfirmed users found.");
  } else {
    console.log(`Confirmed ${unconfirmed} users.`);
  }
}

run();
