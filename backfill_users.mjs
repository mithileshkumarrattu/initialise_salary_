import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twtrcynbwevqlqavaeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQyMTI4MywiZXhwIjoyMDk4OTk3MjgzfQ.0x92Cf_f4FUY23OzGYduzcDc563kLcnhRBx5ZpSreI4'; // SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function backfillUsers() {
  console.log("Fetching auth users...");
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  if (authError) {
    console.error("Error fetching auth users:", authError);
    return;
  }
  const authUsers = authData.users;

  console.log("Fetching public users...");
  const { data: publicUsers, error: pubError } = await supabaseAdmin.from('users').select('id');
  if (pubError) {
    console.error("Error fetching public users:", pubError);
    return;
  }
  const publicUserIds = new Set(publicUsers.map(u => u.id));

  const missingUsers = authUsers.filter(u => !publicUserIds.has(u.id));
  console.log(`Found ${missingUsers.length} users in auth that are missing from public.users.`);

  for (const user of missingUsers) {
    console.log(`Backfilling user: ${user.email} (${user.id})`);
    
    // 1. Create organization
    const orgId = crypto.randomUUID();
    const orgRes = await fetch(`${supabaseUrl}/rest/v1/organizations`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ id: orgId, name: `${user.user_metadata?.full_name || 'User'}'s Org`, type: "COLLEGE" })
    });
    if (!orgRes.ok) console.error("Org creation error:", await orgRes.text());

    // 2. Create department
    const deptId = crypto.randomUUID();
    const deptRes = await fetch(`${supabaseUrl}/rest/v1/departments`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ id: deptId, organization_id: orgId, name: "Main Department" })
    });
    if (!deptRes.ok) console.error("Dept creation error:", await deptRes.text());

    // 3. Create role
    const roleId = crypto.randomUUID();
    const roleRes = await fetch(`${supabaseUrl}/rest/v1/roles`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        id: roleId,
        organization_id: orgId,
        name: "DIRECTOR", // default to DIRECTOR
        is_system_role: true
      })
    });
    if (!roleRes.ok) console.error("Role creation error:", await roleRes.text());

    // 4. Create user profile
    const userRes = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
        organization_id: orgId,
        department_id: deptId,
        progress_percentage: 0,
        token_balance: 0,
        loan_balance: 0,
      })
    });
    if (!userRes.ok) console.error("User profile creation error:", await userRes.text());

    // 5. Assign role
    const userRoleRes = await fetch(`${supabaseUrl}/rest/v1/user_roles`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        user_id: user.id,
        role_id: roleId
      })
    });
    if (!userRoleRes.ok) console.error("User role assignment error:", await userRoleRes.text());
    
    console.log(`Successfully backfilled ${user.email}`);
  }
  
  console.log("Backfill complete!");
}

backfillUsers();
