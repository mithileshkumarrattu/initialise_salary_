const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twtrcynbwevqlqavaeas.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MjEyODMsImV4cCI6MjA5ODk5NzI4M30.BpFTV4II4b-29hkTaoVCkgW85zOArTc471GBSXrkLOM';

async function test() {
  const res = await fetch(`${url}/rest/v1/organizations?limit=1`, {
    method: 'OPTIONS',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  const text = await res.text();
  console.log("SCHEMA OPTIONS:", text);
}
test();
