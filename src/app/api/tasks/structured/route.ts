import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    tasks: [
      { id: 1, subject: "OOP", timeSlot: "09:00-10:00", status: "COMPLETED" },
      { id: 2, subject: "DBMS", timeSlot: "11:00-12:00", status: "COMPLETED" }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    received: body,
    message: "Structured task timetable logged successfully."
  });
}
