import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("organizations").select("*").limit(1);
  const { data: cols, error: colsErr } = await supabase.rpc('get_organizations_schema').single(); // Just in case

  return NextResponse.json({
    data,
    error,
    cols,
    colsErr
  });
}
