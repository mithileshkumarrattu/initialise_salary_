import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || searchParams.get("address");

  if (!userId) {
    return NextResponse.json({ error: "Missing address or userId" }, { status: 400 });
  }

  // (Normally, query ERC-20 contract via RPC provider or cache table)
  
  return NextResponse.json({
    userId,
    tokenBalance: 340.0,
    loanBalance: 50.0,
    progressPercentage: 88.0,
    unit: "WT"
  });
}
