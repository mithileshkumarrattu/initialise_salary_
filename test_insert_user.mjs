import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twtrcynbwevqlqavaeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQyMTI4MywiZXhwIjoyMDk4OTk3MjgzfQ.0x92Cf_f4FUY23OzGYduzcDc563kLcnhRBx5ZpSreI4'; // SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const userId = 'cc483b4e-c266-4cc0-9ac4-ec8af54b5dd7'; // ID from auth
  const orgId = '318b7b8b-703a-46f0-bba1-7145a2caa088'; // any UUID
  const deptId = 'd892019d-7db1-4c6e-8ff5-6c7c1a8a25c1'; // any UUID
  
  const { data, error } = await supabase.from('users').insert({
    id: userId,
    email: 'test5@test.com',
    name: 'Test User',
    role: 'admin',
    organization_id: orgId,
    department_id: deptId,
    status: 'active',
    progress_percentage: 0,
    token_balance: 0,
    loan_balance: 0,
  });
  
  console.log('Insert result:', { data, error });
}

run();
