import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    tasks: [
      { id: 1, title: "MVGR placement drive coordination", tokens: 120, status: "OPEN" }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    task: { id: 99, ...body, status: "OPEN" },
    message: "Unstructured ad-hoc task published successfully."
  });
}
