import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    nomination: {
      taskId: body.taskId,
      userId: body.userId,
      message: body.message,
      status: "PENDING"
    },
    message: "Self-nomination logged successfully."
  });
}
