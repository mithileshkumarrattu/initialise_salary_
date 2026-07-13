import { NextResponse } from "next/server";
import { ethers } from "ethers";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Generate a random wallet keypair
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address;
    const privateKey = wallet.privateKey;

    // Retrieve secret key and derive AES-256 key
    const secret = process.env.WALLET_ENCRYPTION_SECRET || "demo-secret-key-32-characters-long!";
    const key = crypto.createHash("sha256").update(secret).digest();
    
    // Encrypt the private key
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(privateKey, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const encryptedPrivateKey = `${iv.toString("hex")}:${encrypted}`;

    // (Database write to WalletKeys & User.walletAddress would happen here via Prisma/Supabase)

    return NextResponse.json({
      success: true,
      userId,
      walletAddress: address,
      encryptedPrivateKeyHex: encryptedPrivateKey,
      message: "Custodial wallet keys created, encrypted with AES-256, and prepared for DB writing."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
