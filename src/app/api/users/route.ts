import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    users: [
      { id: "1", name: "Dr. Prasad", email: "prasad@mvgr.edu.in", role: "FACULTY" }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  
  // (Normally, create a new user profile in database and trigger custodial wallet generation)
  
  return NextResponse.json({
    success: true,
    user: { id: "99", name: body.name, email: body.email, role: body.role },
    message: "User account created and registered successfully."
  });
}
