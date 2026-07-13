import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://twtrcynbwevqlqavaeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MjEyODMsImV4cCI6MjA5ODk5NzI4M30.BpFTV4II4b-29hkTaoVCkgW85zOArTc471GBSXrkLOM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('organizations').insert({ id: '00000000-0000-0000-0000-000000000000', name: 'Test Org', type: 'COLLEGE' });
  console.log('Result UUIDv4:', {data, error});
  
  const { data: data2, error: error2 } = await supabase.from('organizations').insert({ id: '00000000-0000-0000-0000-0000-0000-0000-0000', name: 'Test Org 2', type: 'COLLEGE' });
  console.log('Result 39-chars:', {data: data2, error: error2});
  
  const { data: schema, error: schemaErr } = await supabase.from('organizations').select('*').limit(1);
  console.log('Schema:', schema, schemaErr);
}
run();
