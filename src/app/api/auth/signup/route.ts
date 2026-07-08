import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, orgName, orgType, role } = body;

    const supabase = await createClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    // 2. Create organization (using raw fetch to FORCE return=minimal and bypass SELECT RLS)
    const orgId = crypto.randomUUID();
    const orgRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/organizations`, {
      method: "POST",
      headers: {
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ id: orgId, name: orgName, type: orgType })
    });

    if (!orgRes.ok) {
      const errText = await orgRes.text();
      console.error("Org creation error:", errText);
      return NextResponse.json({ error: `Failed to create organization: ${errText}` }, { status: 500 });
    }

    // 3. Create default department (using raw fetch to FORCE return=minimal)
    const deptId = crypto.randomUUID();
    const deptRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/departments`, {
      method: "POST",
      headers: {
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ id: deptId, organization_id: orgId, name: "Main Department" })
    });

    if (!deptRes.ok) {
      console.error("Dept creation error:", await deptRes.text());
    }
    // 4. Create user profile row (using raw fetch to FORCE return=minimal)
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        id: userId,
        email,
        name,
        role: role || "admin",
        organization_id: orgId,
        department_id: deptId,
        status: "active",
        progress_percentage: 0,
        token_balance: 0,
        loan_balance: 0,
      })
    });

    if (!userRes.ok) {
      console.error("User profile creation error:", await userRes.text());
    }

    return NextResponse.json({ success: true, userId, orgId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
