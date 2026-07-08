import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function test() {
  // Query 1 row to see the structure, or intentionally fail to get hints
  const { data, error } = await supabase.from('organizations').select('*').limit(1)
  console.log('Organizations data/error:', JSON.stringify({ data, error }, null, 2))
}

test()
