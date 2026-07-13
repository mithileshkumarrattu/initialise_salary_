import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const candidateTables = [
  "organizations", 
  "departments", 
  "users", 
  "wallet_keys", 
  "role_permissions", 
  "structured_tasks", 
  "unstructured_tasks", 
  "nominations", 
  "task_proofs", 
  "token_transactions", 
  "loans", 
  "attendance_batches", 
  "rate_cards", 
  "semester_calendars", 
  "integrations", 
  "activity_events", 
  "meeting_action_items", 
  "capacity_snapshots", 
  "audit_logs", 
  "notifications"
];

// GET: Scan which tables exist in the public schema using Service Role
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServiceRoleClient(cookieStore);
    const discovered: string[] = [];

    for (const table of candidateTables) {
      const { error } = await supabase
        .from(table)
        .select("id")
        .limit(1);

      // If the error code isn't relation-not-found (42P01), then table exists!
      // In PostgREST, relation not found is code "42P01" or status 404
      if (!error || (error && error.code !== "42P01")) {
        discovered.push(table);
      }
    }

    return NextResponse.json({
      success: true,
      connected: true,
      tables: discovered,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      connected: false,
      error: error.message,
    }, { status: 500 });
  }
}

// POST: Query specific table using Service Role to inspect content
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { table } = body;

    if (!table) {
      return NextResponse.json({ error: "Missing table parameter" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServiceRoleClient(cookieStore);
    
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .limit(10);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      table,
      count: data ? data.length : 0,
      data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
