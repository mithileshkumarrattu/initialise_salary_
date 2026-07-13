import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twtrcynbwevqlqavaeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MjEyODMsImV4cCI6MjA5ODk5NzI4M30.BpFTV4II4b-29hkTaoVCkgW85zOArTc471GBSXrkLOM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Attempting login...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test5@test.com',
    password: 'password123'
  });
  
  if (error) {
    console.error("Login failed:", error.message);
  } else {
    console.log("Login success! User ID:", data.user.id);
  }
}

run();
