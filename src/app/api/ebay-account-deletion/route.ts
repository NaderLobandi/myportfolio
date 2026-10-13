import { createHash } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EBAY_ENDPOINT =
  "https://naderlobandi.com/api/ebay-account-deletion";

export async function GET(request: Request) {
  const verificationToken =
    process.env.EBAY_DELETION_VERIFICATION_TOKEN;

  if (!verificationToken) {
    console.error("EBAY_DELETION_VERIFICATION_TOKEN is not configured.");

    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const challengeCode = searchParams.get("challenge_code");

  if (!challengeCode) {
    return NextResponse.json(
      { error: "Missing challenge_code" },
      { status: 400 }
    );
  }

  const challengeResponse = createHash("sha256")
    .update(challengeCode)
    .update(verificationToken)
    .update(EBAY_ENDPOINT)
    .digest("hex");

  return NextResponse.json({
    challengeResponse,
  });
}

export async function POST(request: Request) {
  try {
    await request.json();

    console.log("Received eBay marketplace account deletion notification.");

    // IMPORTANT:
    // Before using this application for production data collection,
    // connect this handler to your research-data deletion process.
    //
    // eBay deletion notifications contain identifiers that can be used
    // to determine whether you have persisted information associated
    // with the affected eBay user.

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Invalid eBay notification payload:", error);

    return new Response(null, { status: 400 });
  }
}