import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { userId, amount, action } = body; // action: ISSUE or REPAY

  if (!userId || !amount || !action) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // (Normally, execute on-chain transfer and write details to DB Loan table)

  return NextResponse.json({
    success: true,
    action,
    userId,
    amount,
    txHash: "0x8fa9627cfd021c3b5ec8e21f1092e071011881ef40810459a22f3e5c9a21d22b",
    status: "CONFIRMED",
    message: `Loan ${action === "ISSUE" ? "issuance" : "repayment"} completed.`
  });
}
