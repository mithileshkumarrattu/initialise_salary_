import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function test() {
  const res = await supabase.from('organizations').insert({ id: '00000000-0000-0000-0000-000000000000', name: 'Test', type: 'COLLEGE' })
  console.log('Insert 1:', res.error)
  const res2 = await supabase.from('organizations').insert({ id: '00000000-0000-0000-0000-0000-0000-0000-0000', name: 'Test2', type: 'COLLEGE' })
  console.log('Insert 2:', res2.error)
}

test()
