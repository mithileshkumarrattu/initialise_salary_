import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  // (Normally, query AuditLog table using Prisma, applying filters for action, actor, or range)

  return NextResponse.json({
    success: true,
    logs: [
      { id: "A109", actor: "Dr. R. K. Prasad (HOD)", action: "SALARY_APPROVE", time: "10 mins ago" }
    ]
  });
}
