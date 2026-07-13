const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://twtrcynbwevqlqavaeas.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHJjeW5id2V2cWxxYXZhZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MjEyODMsImV4cCI6MjA5ODk5NzI4M30.BpFTV4II4b-29hkTaoVCkgW85zOArTc471GBSXrkLOM'
);

async function test() {
  const { data, error } = await supabase
    .from('task_nominations')
    .select('*, task:unstructured_tasks(*)');
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
